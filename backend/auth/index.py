"""
Авторизация пользователей: регистрация, вход, профиль, обновление, выход.
Все операции через сессионные токены в куках.
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p32380461_minimal_phone_store")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_session_id() -> str:
    return secrets.token_hex(32)

def get_user_by_session(conn, session_id: str):
    with conn.cursor() as cur:
        cur.execute(
            f"SELECT u.id, u.name, u.email, u.phone FROM {SCHEMA}.sessions s "
            f"JOIN {SCHEMA}.users u ON u.id = s.user_id "
            f"WHERE s.id = %s AND s.expires_at > NOW()",
            (session_id,)
        )
        row = cur.fetchone()
    if not row:
        return None
    return {"id": row[0], "name": row[1], "email": row[2], "phone": row[3] or ""}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    session_id = event.get("headers", {}).get("X-Session-Id", "").strip()
    conn = get_conn()

    try:
        # POST /auth/register
        if action == "register" and method == "POST":
            name = (body.get("name") or "").strip()
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""
            phone = (body.get("phone") or "").strip()

            if not name or not email or not password:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все поля"})}
            if len(password) < 6:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

            with conn.cursor() as cur:
                cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
                if cur.fetchone():
                    return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Email уже зарегистрирован"})}

                cur.execute(
                    f"INSERT INTO {SCHEMA}.users (name, email, phone, password_hash) VALUES (%s, %s, %s, %s) RETURNING id",
                    (name, email, phone, hash_password(password))
                )
                user_id = cur.fetchone()[0]

                sid = make_session_id()
                cur.execute(
                    f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)",
                    (sid, user_id)
                )
                conn.commit()

            return {
                "statusCode": 200,
                "headers": {**CORS, "X-Set-Cookie": f"session={sid}; Path=/; Max-Age=2592000; SameSite=Lax"},
                "body": json.dumps({"ok": True, "session_id": sid, "user": {"id": user_id, "name": name, "email": email, "phone": phone}})
            }

        # POST /auth/login
        if action == "login" and method == "POST":
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""

            if not email or not password:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Введите email и пароль"})}

            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT id, name, email, phone FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
                    (email, hash_password(password))
                )
                row = cur.fetchone()
                if not row:
                    return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

                user = {"id": row[0], "name": row[1], "email": row[2], "phone": row[3] or ""}
                sid = make_session_id()
                cur.execute(
                    f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)",
                    (sid, user["id"])
                )
                conn.commit()

            return {
                "statusCode": 200,
                "headers": {**CORS, "X-Set-Cookie": f"session={sid}; Path=/; Max-Age=2592000; SameSite=Lax"},
                "body": json.dumps({"ok": True, "session_id": sid, "user": user})
            }

        # GET /auth/me
        if action == "me" and method == "GET":
            if not session_id:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_session(conn, session_id)
            if not user:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"user": user})}

        # PUT /auth/update
        if action == "update" and method == "PUT":
            if not session_id:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_session(conn, session_id)
            if not user:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

            name = (body.get("name") or "").strip()
            phone = (body.get("phone") or "").strip()
            new_password = (body.get("new_password") or "").strip()

            if not name:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Имя не может быть пустым"})}

            with conn.cursor() as cur:
                if new_password:
                    if len(new_password) < 6:
                        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Пароль минимум 6 символов"})}
                    cur.execute(
                        f"UPDATE {SCHEMA}.users SET name=%s, phone=%s, password_hash=%s, updated_at=NOW() WHERE id=%s",
                        (name, phone, hash_password(new_password), user["id"])
                    )
                else:
                    cur.execute(
                        f"UPDATE {SCHEMA}.users SET name=%s, phone=%s, updated_at=NOW() WHERE id=%s",
                        (name, phone, user["id"])
                    )
                conn.commit()

            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "user": {**user, "name": name, "phone": phone}})}

        # GET /auth/orders
        if action == "orders" and method == "GET":
            if not session_id:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_session(conn, session_id)
            if not user:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}
            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT id, status, total, items, created_at FROM {SCHEMA}.orders "
                    f"WHERE user_id = %s ORDER BY created_at DESC",
                    (user["id"],)
                )
                rows = cur.fetchall()
            orders = [
                {"id": r[0], "status": r[1], "total": float(r[2]), "items": r[3], "created_at": r[4].isoformat()}
                for r in rows
            ]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"orders": orders})}

        # POST /auth/logout
        if action == "logout" and method == "POST":
            if session_id:
                with conn.cursor() as cur:
                    cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at=NOW() WHERE id=%s", (session_id,))
                    conn.commit()
            return {
                "statusCode": 200,
                "headers": {**CORS, "X-Set-Cookie": "session=; Path=/; Max-Age=0"},
                "body": json.dumps({"ok": True})
            }

        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Не найдено"})}

    finally:
        conn.close()