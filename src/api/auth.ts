const BASE = "https://functions.poehali.dev/f823f716-4238-4975-a4b9-941a69596f06";

function getSessionId(): string {
  return localStorage.getItem("session_id") || "";
}

function saveSession(sessionId: string) {
  localStorage.setItem("session_id", sessionId);
}

function clearSession() {
  localStorage.removeItem("session_id");
}

async function request(action: string, method: string, body?: object) {
  const res = await fetch(`${BASE}?action=${action}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": getSessionId(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data: unknown;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export async function register(name: string, email: string, password: string, phone: string) {
  const r = await request("register", "POST", { name, email, password, phone });
  if (r.ok && typeof r.data === "object" && r.data !== null && "session_id" in r.data) {
    saveSession((r.data as { session_id: string }).session_id);
  }
  return r;
}

export async function login(email: string, password: string) {
  const r = await request("login", "POST", { email, password });
  if (r.ok && typeof r.data === "object" && r.data !== null && "session_id" in r.data) {
    saveSession((r.data as { session_id: string }).session_id);
  }
  return r;
}

export async function getMe() {
  if (!getSessionId()) return null;
  const r = await request("me", "GET");
  if (!r.ok) { clearSession(); return null; }
  return (r.data as { user: User }).user;
}

export async function updateProfile(name: string, phone: string, new_password?: string) {
  return request("update", "PUT", { name, phone, new_password: new_password || "" });
}

export async function logout() {
  await request("logout", "POST");
  clearSession();
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image?: string;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  items: OrderItem[];
  created_at: string;
}

export async function getOrders(): Promise<Order[]> {
  if (!getSessionId()) return [];
  const r = await request("orders", "GET");
  if (!r.ok || typeof r.data !== "object" || r.data === null || !("orders" in r.data)) return [];
  return (r.data as { orders: Order[] }).orders;
}