import Icon from "@/components/ui/icon";

const reviews = [
  {
    id: 1,
    name: "Алексей К.",
    avatar: "АК",
    rating: 5,
    date: "12 фев 2024",
    product: "iPhone 15 Pro",
    text: "Заказал iPhone 15 Pro, пришёл за 2 дня. Упаковка идеальная, всё оригинальное. Консультант помог выбрать нужный цвет и объём памяти. Буду рекомендовать всем друзьям!",
  },
  {
    id: 2,
    name: "Марина Соколова",
    avatar: "МС",
    rating: 5,
    date: "3 янв 2024",
    product: "Samsung Galaxy S24 Ultra",
    text: "Отличный магазин! Цены ниже, чем в официальных салонах. Телефон пришёл в полной комплектации с гарантийным талоном. Оформление заняло 5 минут.",
  },
  {
    id: 3,
    name: "Дмитрий П.",
    avatar: "ДП",
    rating: 4,
    date: "28 дек 2023",
    product: "Google Pixel 8",
    text: "Pixel 8 взял для жены. Телефон отличный, доставка быстрая. Единственный минус — не было подарочной коробки, но это мелочь. В целом очень доволен.",
  },
  {
    id: 4,
    name: "Светлана Ворон.",
    avatar: "СВ",
    rating: 5,
    date: "15 дек 2023",
    product: "Xiaomi 14",
    text: "Покупала Xiaomi 14 в подарок мужу. Сначала сомневалась — заказывать онлайн или идти в магазин. Решила попробовать. Не пожалела! Всё пришло быстро и в отличном состоянии.",
  },
  {
    id: 5,
    name: "Игорь Максимов",
    avatar: "ИМ",
    rating: 5,
    date: "5 дек 2023",
    product: "OnePlus 12",
    text: "Trade-in сдал старый Samsung — получил хорошую скидку на OnePlus. Процедура простая, оценка честная. Новый телефон летает! Очень доволен сервисом.",
  },
  {
    id: 6,
    name: "Ольга Тарасова",
    avatar: "ОТ",
    rating: 4,
    date: "21 ноя 2023",
    product: "HONOR 90",
    text: "Хороший магазин с адекватными ценами. HONOR 90 взяла для сына. Доставили вовремя, телефон рабочий, гарантия официальная. Рекомендую!",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Icon
          key={i}
          name="Star"
          size={12}
          className={i <= rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Отзывы</span>
          <h1 className="text-5xl font-black tracking-tighter mt-2">Что говорят<br />покупатели</h1>
        </div>
        <div className="mt-6 md:mt-0 flex items-end gap-4">
          <div>
            <div className="text-6xl font-black tracking-tighter">{avg}</div>
            <Stars rating={5} />
            <p className="text-xs text-muted-foreground mt-1">{reviews.length} отзывов</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <div
            key={r.id}
            className="border border-border rounded-sm p-5 animate-slide-up bg-card"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
                  {r.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground">{r.date}</div>
                </div>
              </div>
              <Stars rating={r.rating} />
            </div>
            <p className="text-xs font-mono text-muted-foreground mb-2">{r.product}</p>
            <p className="text-sm text-foreground leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 border border-border rounded-sm p-8 max-w-lg">
        <h2 className="text-xl font-black tracking-tighter mb-5">Оставить отзыв</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Ваше имя"
            className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <input
            type="text"
            placeholder="Какой товар купили?"
            className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <textarea
            placeholder="Ваш отзыв..."
            rows={4}
            className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
          />
          <button className="btn-primary w-full py-2.5 text-sm font-semibold rounded-sm">
            Отправить отзыв
          </button>
        </div>
      </div>
    </div>
  );
}
