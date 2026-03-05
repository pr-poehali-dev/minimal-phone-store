import { Page, CartItem } from "@/App";
import { products } from "@/data/products";
import Icon from "@/components/ui/icon";

interface HomePageProps {
  setPage: (p: Page) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
}

export default function HomePage({ setPage, addToCart }: HomePageProps) {
  const featured = products.slice(0, 3);

  return (
    <div className="animate-fade-in">
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="flex flex-col items-start gap-6 max-w-2xl">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Новая коллекция 2024
          </span>
          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter text-foreground">
            Смарт&shy;фоны<br />
            <span className="text-muted-foreground font-light">нового<br />поколения</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
            Минимум лишнего, максимум технологий.
            Официальная гарантия, быстрая доставка.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setPage("catalog")}
              className="btn-primary px-8 py-3 text-sm font-semibold rounded-sm"
            >
              Перейти в каталог
            </button>
            <button
              onClick={() => setPage("about")}
              className="px-8 py-3 text-sm font-semibold border border-border rounded-sm hover:bg-secondary transition-colors"
            >
              О магазине
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8">
          {[
            { icon: "Shield", label: "Гарантия", value: "Официальная" },
            { icon: "Truck", label: "Доставка", value: "1–2 дня" },
            { icon: "RotateCcw", label: "Возврат", value: "14 дней" },
          ].map(item => (
            <div key={item.label} className="flex flex-col gap-1">
              <Icon name={item.icon} size={18} className="text-muted-foreground mb-1" />
              <span className="font-semibold text-sm">{item.value}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-black tracking-tighter">Хиты продаж</h2>
            <button
              onClick={() => setPage("catalog")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Все товары <Icon name="ArrowRight" size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((p, i) => (
              <div
                key={p.id}
                className="product-card bg-card border border-border rounded-sm overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-square bg-secondary overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {p.isNew && (
                    <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] font-mono px-2 py-0.5 rounded-sm">
                      НОВИНКА
                    </span>
                  )}
                  {p.isSale && (
                    <span className="absolute top-3 left-3 bg-destructive text-white text-[10px] font-mono px-2 py-0.5 rounded-sm">
                      СКИДКА
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{p.brand}</p>
                  <h3 className="font-semibold text-sm mb-3">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-black text-lg">{p.price.toLocaleString("ru")} ₽</span>
                      {p.oldPrice && (
                        <span className="ml-2 text-xs text-muted-foreground line-through">
                          {p.oldPrice.toLocaleString("ru")} ₽
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, brand: p.brand })}
                      className="btn-primary w-8 h-8 rounded-sm flex items-center justify-center"
                    >
                      <Icon name="Plus" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Наши бренды</span>
            <h2 className="text-4xl font-black tracking-tighter mt-3 mb-6">Только<br />топовые марки</h2>
            <p className="text-muted-foreground leading-relaxed">
              Apple, Samsung, Google, Xiaomi, Honor, OnePlus —
              весь выбор лучших производителей в одном месте.
            </p>
            <button
              onClick={() => setPage("catalog")}
              className="mt-6 btn-primary px-6 py-2.5 text-sm font-semibold rounded-sm"
            >
              Смотреть каталог
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Apple", "Samsung", "Google", "Xiaomi", "Honor", "OnePlus"].map(b => (
              <div
                key={b}
                className="border border-border rounded-sm p-4 text-center text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer"
                onClick={() => setPage("catalog")}
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-black text-foreground tracking-tighter">PHONE<span className="font-light">store</span></span>
          <span>© 2024 Phone Store. Все права защищены.</span>
          <span>ИНН 0000000000</span>
        </div>
      </footer>
    </div>
  );
}