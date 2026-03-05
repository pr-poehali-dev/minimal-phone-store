import { useState } from "react";
import Icon from "@/components/ui/icon";

const orders = [
  { id: "PS-10421", date: "12 фев 2024", product: "iPhone 15 Pro 256GB", price: 109990, status: "Доставлен" },
  { id: "PS-09876", date: "3 янв 2024", product: "AirPods Pro 2", price: 22990, status: "Доставлен" },
  { id: "PS-08234", date: "5 дек 2023", product: "Samsung Galaxy A55", price: 44990, status: "Доставлен" },
];

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<"orders" | "settings">("orders");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 animate-fade-in">
        <div className="max-w-sm mx-auto">
          <h1 className="text-3xl font-black tracking-tighter mb-2">Войти</h1>
          <p className="text-muted-foreground text-sm mb-8">Войдите, чтобы отслеживать заказы и управлять профилем</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase block mb-1.5">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
            <button
              onClick={() => setIsLoggedIn(true)}
              className="btn-primary w-full py-3 text-sm font-semibold rounded-sm"
            >
              Войти
            </button>
            <button className="w-full border border-border rounded-sm py-3 text-sm font-semibold hover:bg-secondary transition-colors">
              Зарегистрироваться
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Нажимая «Войти», вы соглашаетесь с условиями использования
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center text-lg font-black">
            АИ
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Алексей Иванов</h1>
            <p className="text-sm text-muted-foreground">alexey@example.com</p>
          </div>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <Icon name="LogOut" size={14} />
          Выйти
        </button>
      </div>

      <div className="flex gap-6 border-b border-border mb-8">
        {[
          { id: "orders" as const, label: "Мои заказы" },
          { id: "settings" as const, label: "Настройки" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.map((o, i) => (
            <div
              key={o.id}
              className="border border-border rounded-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                  <span className="text-xs text-muted-foreground">{o.date}</span>
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-sm text-green-700 font-medium">
                    {o.status}
                  </span>
                </div>
                <p className="font-semibold text-sm">{o.product}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black">{o.price.toLocaleString("ru")} ₽</span>
                <button className="text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-secondary transition-colors">
                  Повторить заказ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "settings" && (
        <div className="max-w-sm space-y-4 animate-slide-up">
          {[
            { label: "Имя", value: "Алексей Иванов" },
            { label: "Email", value: "alexey@example.com" },
            { label: "Телефон", value: "+7 (900) 000-00-00" },
          ].map(field => (
            <div key={field.label}>
              <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase block mb-1.5">
                {field.label}
              </label>
              <input
                type="text"
                defaultValue={field.value}
                className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          ))}
          <button className="btn-primary px-6 py-2.5 text-sm font-semibold rounded-sm">
            Сохранить изменения
          </button>
        </div>
      )}
    </div>
  );
}
