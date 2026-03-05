export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 animate-fade-in">
      <div className="max-w-2xl">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">О нас</span>
        <h1 className="text-5xl font-black tracking-tighter mt-3 mb-8">
          Phone Store —<br />
          <span className="text-muted-foreground font-light">просто лучший<br />выбор</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Мы работаем с 2018 года и за это время помогли тысячам клиентов
          выбрать идеальный смартфон. Никакой воды — только честные цены,
          официальные гарантии и быстрая доставка.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-12">
          Наш принцип: минимализм в интерфейсе и максимум заботы о покупателе.
          Мы сотрудничаем напрямую с официальными дистрибьюторами Apple, Samsung,
          Google, Xiaomi и других топовых производителей.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-t border-b border-border mb-16">
        {[
          { value: "6 лет", label: "на рынке" },
          { value: "15 000+", label: "довольных клиентов" },
          { value: "500+", label: "моделей смартфонов" },
          { value: "1–2 дня", label: "доставка по России" },
        ].map(item => (
          <div key={item.label}>
            <div className="text-3xl font-black tracking-tighter mb-1">{item.value}</div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Официальная гарантия",
            desc: "Все устройства продаются с официальной гарантией производителя от 1 года.",
          },
          {
            title: "Быстрая доставка",
            desc: "Доставляем по всей России курьером или до пункта выдачи за 1–2 рабочих дня.",
          },
          {
            title: "Честные цены",
            desc: "Работаем без накруток. Цена на сайте — финальная, без скрытых платежей.",
          },
          {
            title: "Возврат 14 дней",
            desc: "Если устройство не подошло — вернём деньги без лишних вопросов.",
          },
          {
            title: "Поддержка 24/7",
            desc: "Наши специалисты всегда на связи: помогут с выбором и решат любой вопрос.",
          },
          {
            title: "Trade-in",
            desc: "Сдайте старый смартфон и получите скидку на новый прямо при оформлении.",
          },
        ].map(item => (
          <div key={item.title} className="border border-border rounded-sm p-6">
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-foreground text-background rounded-sm p-10">
        <div className="max-w-lg">
          <h2 className="text-2xl font-black tracking-tighter mb-3">Остались вопросы?</h2>
          <p className="text-sm opacity-70 mb-6">
            Напишите нам — ответим в течение 15 минут в рабочее время.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button className="bg-background text-foreground px-6 py-2.5 text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity">
              Написать в Telegram
            </button>
            <button className="border border-background/30 text-background px-6 py-2.5 text-sm font-semibold rounded-sm hover:bg-background/10 transition-colors">
              Позвонить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
