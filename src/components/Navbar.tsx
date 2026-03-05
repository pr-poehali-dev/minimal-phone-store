import { Page } from "@/App";
import Icon from "@/components/ui/icon";

interface NavbarProps {
  page: Page;
  setPage: (p: Page) => void;
  cartCount: number;
}

const links: { id: Page; label: string }[] = [
  { id: "home", label: "Главная" },
  { id: "catalog", label: "Каталог" },
  { id: "about", label: "О магазине" },
  { id: "reviews", label: "Отзывы" },
];

export default function Navbar({ page, setPage, cartCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => setPage("home")}
          className="text-xl font-black tracking-tighter text-foreground"
        >
          PHONE<span className="text-muted-foreground font-light">store</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              className={`nav-link text-sm font-medium transition-colors ${
                page === l.id ? "text-foreground active" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage("cart")}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ShoppingBag" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[10px] font-mono rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setPage("profile")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="User" size={20} />
          </button>
        </div>
      </div>

      <div className="md:hidden border-t border-border">
        <div className="flex overflow-x-auto gap-1 px-4 py-2">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              className={`flex-none px-3 py-1.5 text-sm rounded-sm transition-colors ${
                page === l.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
