import { useState } from "react";
import Icon from "@/components/ui/icon";

const STATS = [
  { value: "6", unit: "лет", label: "на рынке" },
  { value: "15K+", unit: "", label: "довольных клиентов" },
  { value: "500+", unit: "", label: "моделей смартфонов" },
  { value: "1–2", unit: "дня", label: "доставка по России" },
];

const BENEFITS = [
  { icon: "ShieldCheck", title: "Официальная гарантия", desc: "Все устройства с гарантией производителя от 1 года. Никаких серых схем." },
  { icon: "Zap", title: "Быстрая доставка", desc: "Курьером или в пункт выдачи за 1–2 рабочих дня по всей России." },
  { icon: "Tag", title: "Честные цены", desc: "Цена на сайте — финальная. Никаких скрытых платежей и комиссий." },
  { icon: "RotateCcw", title: "Возврат 14 дней", desc: "Не подошло — вернём деньги без лишних вопросов и бюрократии." },
  { icon: "Headphones", title: "Поддержка 24/7", desc: "Всегда на связи: поможем выбрать и решим любой вопрос." },
  { icon: "RefreshCw", title: "Trade-in", desc: "Сдайте старый смартфон и получите скидку на новый при оформлении." },
];

const TIMELINE = [
  { year: "2018", title: "Открытие", desc: "Начали с небольшого шоурума в центре Москвы и 50 моделей в каталоге." },
  { year: "2020", title: "Онлайн-магазин", desc: "Запустили сайт — первый месяц принёс 300 заказов. Стало ясно: это работает." },
  { year: "2022", title: "Масштабирование", desc: "Подключили доставку по всей России, открыли склад и расширили каталог до 300+ моделей." },
  { year: "2024", title: "Сегодня", desc: "15 000 довольных клиентов, 500+ моделей и новый сайт, который вы сейчас читаете." },
];

const FAQ = [
  { q: "Как убедиться, что телефон оригинальный?", a: "Все устройства поставляются напрямую от официальных дистрибьюторов. К каждому товару прилагается чек и гарантийный талон производителя." },
  { q: "Можно ли вернуть телефон, если не понравился?", a: "Да, в течение 14 дней с момента покупки без объяснения причин. Устройство должно быть в исходном состоянии с комплектом." },
  { q: "Как работает Trade-in?", a: "Оцениваем вашу старую модель онлайн, вычитаем стоимость из цены нового телефона. Старое устройство забирает курьер при доставке." },
  { q: "Есть ли рассрочка?", a: "Да, оформляем рассрочку 0% на 6 и 12 месяцев через партнёрские банки прямо на сайте без визита в отделение." },
  { q: "Как быстро отвечает поддержка?", a: "В рабочее время (9:00–21:00 МСК) — в течение 15 минут. В остальное время — до 2 часов." },
];

const BRANDS = ["Apple", "Samsung", "Google", "Xiaomi", "OnePlus", "OPPO", "realme", "Nothing"];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">О магазине</span>
            <h1 className="text-6xl font-black tracking-tighter mt-3 mb-6 leading-none">
              Phone<br />
              <span className="text-muted-foreground font-light italic">Store</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              С 2018 года помогаем найти идеальный смартфон. Без воды, накруток и лишней суеты — только честные цены и официальная гарантия.
            </p>
            <div className="flex gap-3">
              <a href="https://t.me/" className="btn-primary px-6 py-2.5 text-sm font-semibold rounded-sm flex items-center gap-2">
                <Icon name="Send" size={14} />
                Написать нам
              </a>
              <a href="tel:+78001234567" className="border border-border px-6 py-2.5 text-sm font-semibold rounded-sm hover:bg-secondary transition-colors flex items-center gap-2">
                <Icon name="Phone" size={14} />
                Позвонить
              </a>
            </div>
          </div>

          {/* Визуальный блок */}
          <div className="relative hidden md:block">
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(s => (
                <div key={s.label} className="border border-border rounded-sm p-6 bg-background">
                  <div className="text-4xl font-black tracking-tighter leading-none">
                    {s.value}<span className="text-xl text-muted-foreground font-light ml-1">{s.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Мобильная статистика */}
      <section className="md:hidden border-t border-b border-border mb-0">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 gap-6">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black tracking-tighter">
                {s.value}<span className="text-lg text-muted-foreground font-light ml-1">{s.unit}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Бренды */}
      <section className="border-t border-b border-border py-5 overflow-hidden">
        <div className="flex gap-10 animate-marquee whitespace-nowrap px-6">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="text-sm font-bold text-muted-foreground/50 tracking-widest uppercase shrink-0">{b}</span>
          ))}
        </div>
      </section>

      {/* История */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">История</span>
        <h2 className="text-4xl font-black tracking-tighter mt-3 mb-12">Как мы росли</h2>

        <div className="relative">
          <div className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-border hidden md:block" />
          <div className="space-y-8">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-8 items-start group">
                <div className="shrink-0 w-24 text-right">
                  <span className="text-2xl font-black tracking-tighter">{item.year}</span>
                </div>
                <div className="relative hidden md:flex items-center justify-center w-7 shrink-0 pt-1.5">
                  <div className="w-3 h-3 rounded-full bg-foreground border-2 border-background ring-1 ring-foreground" />
                </div>
                <div className="flex-1 pb-8 border-b border-border last:border-0 md:border-0">
                  <h3 className="font-bold text-base mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Почему мы</span>
          <h2 className="text-4xl font-black tracking-tighter mt-3 mb-12">Наши преимущества</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-border">
            {BENEFITS.map(item => (
              <div key={item.title} className="bg-background p-8 group hover:bg-secondary transition-colors">
                <div className="w-10 h-10 border border-border rounded-sm flex items-center justify-center mb-5 group-hover:border-foreground transition-colors">
                  <Icon name={item.icon} size={18} />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Частые вопросы</span>
          <h2 className="text-4xl font-black tracking-tighter mt-3 mb-10">FAQ</h2>
          <div className="max-w-2xl divide-y divide-border border-t border-border">
            {FAQ.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 group"
                >
                  <span className="font-semibold text-sm group-hover:text-muted-foreground transition-colors">{item.q}</span>
                  <Icon
                    name="ChevronDown"
                    size={16}
                    className={`shrink-0 text-muted-foreground transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="pb-5 text-sm text-muted-foreground leading-relaxed animate-slide-up">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="bg-foreground text-background rounded-sm p-10 md:p-16 flex flex-col md:flex-row md:items-center gap-8 justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-3">Остались вопросы?</h2>
              <p className="text-sm opacity-60 max-w-sm">
                Ответим в течение 15 минут в рабочее время. Поможем выбрать, оформить и доставить.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap shrink-0">
              <a href="https://t.me/" className="bg-background text-foreground px-6 py-3 text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                <Icon name="Send" size={14} />
                Telegram
              </a>
              <a href="tel:+78001234567" className="border border-background/30 text-background px-6 py-3 text-sm font-semibold rounded-sm hover:bg-background/10 transition-colors flex items-center gap-2">
                <Icon name="Phone" size={14} />
                8 800 123-45-67
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
