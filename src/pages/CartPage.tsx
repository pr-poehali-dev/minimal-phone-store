import { CartItem } from "@/App";
import Icon from "@/components/ui/icon";

interface CartPageProps {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
}

export default function CartPage({ cart, removeFromCart, updateQuantity }: CartPageProps) {
  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 text-center animate-fade-in">
        <Icon name="ShoppingBag" size={48} className="mx-auto mb-5 text-muted-foreground opacity-30" />
        <h1 className="text-2xl font-black tracking-tighter mb-2">Корзина пуста</h1>
        <p className="text-muted-foreground text-sm">Добавьте смартфоны из каталога</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Корзина</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-3">
          {cart.map((item, i) => (
            <div
              key={item.id}
              className="flex gap-4 border border-border rounded-sm p-4 animate-slide-up bg-card"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-20 h-20 rounded-sm overflow-hidden bg-secondary shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.brand}</p>
                <h3 className="font-semibold text-sm mt-0.5 mb-2">{item.name}</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 border border-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Icon name="Minus" size={12} />
                  </button>
                  <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 border border-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Icon name="Plus" size={12} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between shrink-0">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
                <span className="font-black text-sm">
                  {(item.price * item.quantity).toLocaleString("ru")} ₽
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-72 shrink-0">
          <div className="border border-border rounded-sm p-6 sticky top-24">
            <h2 className="font-black tracking-tight mb-5">Итого</h2>
            <div className="space-y-2 mb-5 text-sm">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-muted-foreground">
                  <span className="truncate max-w-[140px]">{item.name} × {item.quantity}</span>
                  <span className="font-mono shrink-0 ml-2">{(item.price * item.quantity).toLocaleString("ru")} ₽</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between font-black text-base">
                <span>Итого</span>
                <span>{total.toLocaleString("ru")} ₽</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground mb-5">
              <div className="flex items-center gap-2">
                <Icon name="Truck" size={12} />
                <span>Бесплатная доставка от 30 000 ₽</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={12} />
                <span>Официальная гарантия</span>
              </div>
            </div>

            <button className="btn-primary w-full py-3 text-sm font-semibold rounded-sm">
              Оформить заказ
            </button>
            <button className="w-full mt-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ввести промокод
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
