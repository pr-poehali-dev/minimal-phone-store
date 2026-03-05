import { useState } from "react";
import { CartItem } from "@/App";
import { products, Product } from "@/data/products";
import Icon from "@/components/ui/icon";

interface ProductPageProps {
  productId: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  onBack: () => void;
  openProduct: (id: number) => void;
}

const specs: Record<number, { label: string; value: string }[]> = {
  1: [
    { label: "Дисплей", value: "6.1\" Super Retina XDR, 2556×1179, 460 ppi" },
    { label: "Процессор", value: "Apple A17 Pro, 6 ядер" },
    { label: "Камера", value: "48 МП + 12 МП + 12 МП (телефото)" },
    { label: "Аккумулятор", value: "3274 мАч, до 23 ч видео" },
    { label: "Память", value: "256 ГБ NVMe" },
    { label: "ОС", value: "iOS 17" },
    { label: "Защита", value: "IP68 (6 м, 30 мин)" },
    { label: "Цвет", value: "Натуральный титан" },
  ],
  2: [
    { label: "Дисплей", value: "6.1\" Super Retina XDR, 2532×1170, 460 ppi" },
    { label: "Процессор", value: "Apple A15 Bionic, 6 ядер" },
    { label: "Камера", value: "12 МП + 12 МП (сверхширокий)" },
    { label: "Аккумулятор", value: "3279 мАч, до 20 ч видео" },
    { label: "Память", value: "128 ГБ NVMe" },
    { label: "ОС", value: "iOS 17" },
    { label: "Защита", value: "IP68 (6 м, 30 мин)" },
    { label: "Цвет", value: "Полуночный" },
  ],
  3: [
    { label: "Дисплей", value: "6.8\" Dynamic AMOLED 2X, 3088×1440, 505 ppi" },
    { label: "Процессор", value: "Snapdragon 8 Gen 3, 8 ядер" },
    { label: "Камера", value: "200 МП + 12 МП + 50 МП + 10 МП" },
    { label: "Аккумулятор", value: "5000 мАч, 45W зарядка" },
    { label: "Память", value: "512 ГБ UFS 4.0" },
    { label: "ОС", value: "Android 14, One UI 6.1" },
    { label: "Защита", value: "IP68" },
    { label: "Цвет", value: "Титановый чёрный" },
  ],
  4: [
    { label: "Дисплей", value: "6.6\" Super AMOLED, 2340×1080, 390 ppi" },
    { label: "Процессор", value: "Exynos 1480, 8 ядер" },
    { label: "Камера", value: "50 МП + 12 МП + 5 МП" },
    { label: "Аккумулятор", value: "5000 мАч, 25W зарядка" },
    { label: "Память", value: "256 ГБ UFS 2.2" },
    { label: "ОС", value: "Android 14, One UI 6.1" },
    { label: "Защита", value: "IP67" },
    { label: "Цвет", value: "Голубой" },
  ],
  5: [
    { label: "Дисплей", value: "6.2\" OLED, 2400×1080, 428 ppi" },
    { label: "Процессор", value: "Google Tensor G3, 9 ядер" },
    { label: "Камера", value: "50 МП + 12 МП (сверхширокий)" },
    { label: "Аккумулятор", value: "4575 мАч, 27W зарядка" },
    { label: "Память", value: "128 ГБ UFS 3.1" },
    { label: "ОС", value: "Android 14" },
    { label: "Защита", value: "IP68" },
    { label: "Цвет", value: "Хейзл" },
  ],
  6: [
    { label: "Дисплей", value: "6.36\" AMOLED, 2670×1200, 460 ppi" },
    { label: "Процессор", value: "Snapdragon 8 Gen 3, 8 ядер" },
    { label: "Камера", value: "50 МП Leica + 50 МП + 50 МП" },
    { label: "Аккумулятор", value: "4610 мАч, 90W зарядка" },
    { label: "Память", value: "256 ГБ UFS 4.0" },
    { label: "ОС", value: "Android 14, HyperOS" },
    { label: "Защита", value: "IP68" },
    { label: "Цвет", value: "Белый" },
  ],
  7: [
    { label: "Дисплей", value: "6.7\" AMOLED, 2664×1200, 436 ppi" },
    { label: "Процессор", value: "Snapdragon 7 Gen 1, 8 ядер" },
    { label: "Камера", value: "200 МП + 12 МП + 2 МП" },
    { label: "Аккумулятор", value: "5000 мАч, 35W зарядка" },
    { label: "Память", value: "256 ГБ" },
    { label: "ОС", value: "Android 13, MagicOS 7.2" },
    { label: "Защита", value: "IP54" },
    { label: "Цвет", value: "Изумрудный" },
  ],
  8: [
    { label: "Дисплей", value: "6.82\" LTPO AMOLED, 3168×1440, 510 ppi" },
    { label: "Процессор", value: "Snapdragon 8 Gen 3, 8 ядер" },
    { label: "Камера", value: "50 МП + 48 МП + 64 МП" },
    { label: "Аккумулятор", value: "5400 мАч, 100W зарядка" },
    { label: "Память", value: "256 ГБ UFS 4.0" },
    { label: "ОС", value: "Android 14, OxygenOS 14" },
    { label: "Защита", value: "IP65" },
    { label: "Цвет", value: "Чёрный" },
  ],
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Icon
          key={i}
          name="Star"
          size={14}
          className={i <= Math.round(rating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}
        />
      ))}
    </div>
  );
}

export default function ProductPage({ productId, addToCart, onBack, openProduct }: ProductPageProps) {
  const product = products.find(p => p.id === productId);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const related = products.filter(p => p.id !== product.id && (p.brand === product.brand || p.category === product.category)).slice(0, 3);
  const productSpecs = specs[product.id] ?? [];

  const handleAdd = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, brand: product.brand });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      {/* Назад */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <Icon name="ArrowLeft" size={16} />
        Назад
      </button>

      {/* Основная секция */}
      <div className="grid md:grid-cols-2 gap-12 mb-20">
        {/* Фото */}
        <div className="relative aspect-square bg-secondary rounded-sm overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-foreground text-background text-[10px] font-mono px-2 py-1 rounded-sm">
              НОВИНКА
            </span>
          )}
          {product.isSale && (
            <span className="absolute top-4 left-4 bg-destructive text-white text-[10px] font-mono px-2 py-1 rounded-sm">
              СКИДКА
            </span>
          )}
        </div>

        {/* Инфо */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-2">{product.brand}</p>
            <h1 className="text-4xl font-black tracking-tighter mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <Stars rating={product.rating} />
              <span className="text-sm font-semibold">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} отзывов)</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { icon: "HardDrive", label: product.storage },
                { icon: "Palette", label: product.color },
                { icon: "Tag", label: product.category === "flagship" ? "Флагман" : product.category === "mid" ? "Средний класс" : "Бюджетный" },
              ].map(tag => (
                <span key={tag.label} className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-sm text-muted-foreground">
                  <Icon name={tag.icon} size={12} />
                  {tag.label}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black tracking-tighter">{product.price.toLocaleString("ru")} ₽</span>
                {product.oldPrice && (
                  <span className="text-lg text-muted-foreground line-through">{product.oldPrice.toLocaleString("ru")} ₽</span>
                )}
              </div>
              {product.oldPrice && (
                <p className="text-sm text-green-600 font-semibold mt-1">
                  Вы экономите {(product.oldPrice - product.price).toLocaleString("ru")} ₽
                </p>
              )}
            </div>

            <div className="space-y-3 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={14} className="text-foreground" />
                <span>Официальная гарантия 1 год</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Truck" size={14} className="text-foreground" />
                <span>Доставка 1–2 дня по всей России</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="RotateCcw" size={14} className="text-foreground" />
                <span>Возврат в течение 14 дней</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className={`flex-1 py-3.5 text-sm font-semibold rounded-sm transition-all flex items-center justify-center gap-2 ${
                added
                  ? "bg-green-600 text-white"
                  : "btn-primary"
              }`}
            >
              <Icon name={added ? "Check" : "ShoppingBag"} size={16} />
              {added ? "Добавлено в корзину!" : "В корзину"}
            </button>
            <button className="px-4 py-3.5 border border-border rounded-sm hover:bg-secondary transition-colors">
              <Icon name="Heart" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Характеристики */}
      {productSpecs.length > 0 && (
        <div className="mb-20">
          <h2 className="text-2xl font-black tracking-tighter mb-6">Характеристики</h2>
          <div className="border border-border rounded-sm overflow-hidden">
            {productSpecs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex gap-4 px-6 py-4 text-sm ${i % 2 === 0 ? "bg-secondary/50" : "bg-background"}`}
              >
                <span className="w-40 shrink-0 text-muted-foreground">{spec.label}</span>
                <span className="font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Похожие товары */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-black tracking-tighter mb-6">Похожие товары</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((p: Product) => (
              <div
                key={p.id}
                onClick={() => openProduct(p.id)}
                className="product-card bg-card border border-border rounded-sm overflow-hidden cursor-pointer"
              >
                <div className="aspect-square bg-secondary overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-0.5">{p.brand}</p>
                  <h3 className="font-semibold text-sm mb-2">{p.name}</h3>
                  <span className="font-black">{p.price.toLocaleString("ru")} ₽</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
