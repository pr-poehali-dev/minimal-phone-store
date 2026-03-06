import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { register, login, getMe, updateProfile, logout, getOrders, User, Order } from "@/api/auth";

type AuthMode = "login" | "register";

const INPUT_CLS =
  "w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow";
const LABEL_CLS =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase block mb-1.5";

function Field({
  label, type = "text", value, onChange, placeholder, error,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string;
}) {
  return (
    <div>
      <label className={LABEL_CLS}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_CLS} ${error ? "border-destructive" : ""}`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AuthMode>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regLoading, setRegLoading] = useState(false);

  const [tab, setTab] = useState<"settings" | "security" | "orders">("settings");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    getMe().then(u => { setUser(u); setLoading(false); });
  }, []);

  useEffect(() => {
    if (user) { setEditName(user.name); setEditPhone(user.phone); }
  }, [user]);

  const handleLogin = async () => {
    setLoginError("");
    if (!loginEmail || !loginPassword) { setLoginError("Заполните все поля"); return; }
    setLoginLoading(true);
    const r = await login(loginEmail, loginPassword);
    setLoginLoading(false);
    if (r.ok && typeof r.data === "object" && r.data !== null && "user" in r.data) {
      setUser((r.data as { user: User }).user);
    } else {
      setLoginError(
        typeof r.data === "object" && r.data !== null && "error" in r.data
          ? String((r.data as { error: string }).error)
          : "Ошибка входа"
      );
    }
  };

  const handleRegister = async () => {
    const errors: Record<string, string> = {};
    if (!regName.trim()) errors.name = "Введите имя";
    if (!regEmail.trim()) errors.email = "Введите email";
    if (!regPassword) errors.password = "Введите пароль";
    else if (regPassword.length < 6) errors.password = "Минимум 6 символов";
    if (regPassword !== regPassword2) errors.password2 = "Пароли не совпадают";
    setRegErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setRegLoading(true);
    const r = await register(regName, regEmail, regPassword, regPhone);
    setRegLoading(false);
    if (r.ok && typeof r.data === "object" && r.data !== null && "user" in r.data) {
      setUser((r.data as { user: User }).user);
    } else {
      setRegErrors({
        general:
          typeof r.data === "object" && r.data !== null && "error" in r.data
            ? String((r.data as { error: string }).error)
            : "Ошибка регистрации",
      });
    }
  };

  const handleSave = async () => {
    setSaveError(""); setSaveSuccess(false);
    if (!editName.trim()) { setSaveError("Имя не может быть пустым"); return; }
    if (newPassword && newPassword.length < 6) { setSaveError("Пароль минимум 6 символов"); return; }
    if (newPassword && newPassword !== newPassword2) { setSaveError("Пароли не совпадают"); return; }
    setSaveLoading(true);
    const r = await updateProfile(editName, editPhone, newPassword || undefined);
    setSaveLoading(false);
    if (r.ok && typeof r.data === "object" && r.data !== null && "user" in r.data) {
      setUser((r.data as { user: User }).user);
      setSaveSuccess(true);
      setNewPassword(""); setNewPassword2("");
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(
        typeof r.data === "object" && r.data !== null && "error" in r.data
          ? String((r.data as { error: string }).error)
          : "Ошибка сохранения"
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setOrders([]);
    setLoginEmail(""); setLoginPassword(""); setLoginError("");
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    const data = await getOrders();
    setOrders(data);
    setOrdersLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 text-center">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 animate-fade-in">
        <div className="max-w-sm mx-auto">
          <div className="flex gap-1 mb-8 p-1 bg-secondary rounded-sm">
            {(["login", "register"] as AuthMode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setLoginError(""); setRegErrors({}); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-sm transition-colors ${
                  mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Войти" : "Регистрация"}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <div className="space-y-4 animate-slide-up">
              <div>
                <h1 className="text-3xl font-black tracking-tighter">Добро пожаловать</h1>
                <p className="text-muted-foreground text-sm mt-1">Войдите в аккаунт Phone Store</p>
              </div>
              <Field label="Email" type="email" value={loginEmail} onChange={setLoginEmail} placeholder="your@email.com" />
              <Field label="Пароль" type="password" value={loginPassword} onChange={setLoginPassword} placeholder="••••••••" />
              {loginError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 px-3 py-2.5 rounded-sm">
                  <Icon name="AlertCircle" size={14} />
                  {loginError}
                </div>
              )}
              <button
                onClick={handleLogin}
                disabled={loginLoading}
                className="btn-primary w-full py-3 text-sm font-semibold rounded-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loginLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                Войти
              </button>
              <button onClick={() => setMode("register")} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Нет аккаунта? <span className="underline">Зарегистрироваться</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-up">
              <div>
                <h1 className="text-3xl font-black tracking-tighter">Создать аккаунт</h1>
                <p className="text-muted-foreground text-sm mt-1">Зарегистрируйтесь в Phone Store</p>
              </div>
              <Field label="Имя *" value={regName} onChange={setRegName} placeholder="Ваше имя" error={regErrors.name} />
              <Field label="Email *" type="email" value={regEmail} onChange={setRegEmail} placeholder="your@email.com" error={regErrors.email} />
              <Field label="Телефон" value={regPhone} onChange={setRegPhone} placeholder="+7 900 000 00 00" />
              <Field label="Пароль *" type="password" value={regPassword} onChange={setRegPassword} placeholder="Минимум 6 символов" error={regErrors.password} />
              <Field label="Повторите пароль *" type="password" value={regPassword2} onChange={setRegPassword2} placeholder="••••••••" error={regErrors.password2} />
              {regErrors.general && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 px-3 py-2.5 rounded-sm">
                  <Icon name="AlertCircle" size={14} />
                  {regErrors.general}
                </div>
              )}
              <button
                onClick={handleRegister}
                disabled={regLoading}
                className="btn-primary w-full py-3 text-sm font-semibold rounded-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {regLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                Зарегистрироваться
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Регистрируясь, вы соглашаетесь с условиями использования
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const initials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      {/* Шапка профиля */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center text-xl font-black shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-2 rounded-sm hover:bg-secondary"
        >
          <Icon name="LogOut" size={14} />
          Выйти
        </button>
      </div>

      {/* Вкладки */}
      <div className="flex gap-6 border-b border-border mb-8">
        {[
          { id: "settings" as const, label: "Данные профиля", icon: "User" },
          { id: "security" as const, label: "Безопасность", icon: "Lock" },
          { id: "orders" as const, label: "Мои заказы", icon: "ShoppingBag" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id); setSaveError(""); setSaveSuccess(false);
              if (t.id === "orders") loadOrders();
            }}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === t.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "settings" && (
        <div className="max-w-md space-y-5 animate-slide-up">
          <Field label="Имя" value={editName} onChange={setEditName} placeholder="Ваше имя" />
          <div>
            <label className={LABEL_CLS}>Email</label>
            <div className={`${INPUT_CLS} text-muted-foreground bg-secondary cursor-not-allowed`}>{user.email}</div>
            <p className="text-xs text-muted-foreground mt-1">Email нельзя изменить</p>
          </div>
          <Field label="Телефон" value={editPhone} onChange={setEditPhone} placeholder="+7 900 000 00 00" />

          {saveError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 px-3 py-2.5 rounded-sm">
              <Icon name="AlertCircle" size={14} />
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2.5 rounded-sm">
              <Icon name="CheckCircle" size={14} />
              Данные успешно сохранены
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="btn-primary px-8 py-2.5 text-sm font-semibold rounded-sm flex items-center gap-2 disabled:opacity-60"
          >
            {saveLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            Сохранить изменения
          </button>
        </div>
      )}

      {tab === "security" && (
        <div className="max-w-md space-y-5 animate-slide-up">
          <div className="border border-border rounded-sm p-4 bg-secondary/50 text-sm text-muted-foreground flex gap-2">
            <Icon name="Info" size={14} className="shrink-0 mt-0.5" />
            <span>Оставьте поля пустыми, если не хотите менять пароль</span>
          </div>
          <Field label="Новый пароль" type="password" value={newPassword} onChange={setNewPassword} placeholder="Минимум 6 символов" />
          <Field label="Повторите новый пароль" type="password" value={newPassword2} onChange={setNewPassword2} placeholder="••••••••" />

          {saveError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 px-3 py-2.5 rounded-sm">
              <Icon name="AlertCircle" size={14} />
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2.5 rounded-sm">
              <Icon name="CheckCircle" size={14} />
              Пароль успешно изменён
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saveLoading || (!newPassword && !newPassword2)}
            className="btn-primary px-8 py-2.5 text-sm font-semibold rounded-sm flex items-center gap-2 disabled:opacity-60"
          >
            {saveLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            Изменить пароль
          </button>
        </div>
      )}

      {tab === "orders" && (
        <div className="animate-slide-up">
          {ordersLoading ? (
            <div className="py-16 text-center">
              <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <Icon name="ShoppingBag" size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">У вас пока нет заказов</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {orders.map(order => (
                <div key={order.id} className="border border-border rounded-sm p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Заказ #{order.id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("ru-RU", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <OrderStatus status={order.status} />
                      <p className="text-base font-black mt-1">{order.total.toLocaleString("ru-RU")} ₽</p>
                    </div>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-border pt-4 space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-sm bg-secondary shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.qty} шт.</p>
                          </div>
                          <p className="text-sm font-semibold shrink-0">{(item.price * item.qty).toLocaleString("ru-RU")} ₽</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:    { label: "Новый",      cls: "bg-blue-50 text-blue-700 border-blue-200" },
  processing: { label: "В обработке", cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  shipped:    { label: "Отправлен",  cls: "bg-purple-50 text-purple-700 border-purple-200" },
  delivered:  { label: "Доставлен", cls: "bg-green-50 text-green-700 border-green-200" },
  cancelled:  { label: "Отменён",   cls: "bg-red-50 text-red-700 border-red-200" },
};

function OrderStatus({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, cls: "bg-secondary text-muted-foreground border-border" };
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-sm border ${s.cls}`}>
      {s.label}
    </span>
  );
}