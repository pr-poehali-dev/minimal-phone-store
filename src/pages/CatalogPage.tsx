import { useState, useMemo } from "react";
import { CartItem } from "@/App";
import { products, brands, categories, storages } from "@/data/products";
import Icon from "@/components/ui/icon";

interface CatalogPageProps {
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  openProduct: (id: number) => void;
}

type SortOption = "default" | "price_asc" | "price_desc" | "rating";

export default function CatalogPage({ addToCart, openProduct }: CatalogPageProps) {
  const [selectedBrand, setSelectedBrand] = useState("Все");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStorage, setSelectedStorage] = useState("Все");
  const [priceMax, setPriceMax] = useState(150000);
  const [sort, setSort] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedBrand !== "Все") list = list.filter(p => p.brand === selectedBrand);
    if (selectedCategory !== "all") list = list.filter(p => p.category === selectedCategory);
    if (selectedStorage !== "Все") list = list.filter(p => p.storage === selectedStorage);
    list = list.filter(p => p.price <= priceMax);

    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [selectedBrand, selectedCategory, selectedStorage, priceMax, sort]);

  const handleAdd = (p: typeof products[0]) => {
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, brand: p.brand });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Каталог</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} товаров</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm border border-border px-4 py-2 rounded-sm hover:bg-secondary transition-colors"
        >
          <Icon name="SlidersHorizontal" size={14} />
          Фильтры
        </button>
      </div>

      <div className="flex gap-8">
        {showFilters && (
          <aside className="w-56 shrink-0 space-y-7 animate-slide-up">
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Категория</h3>
              <div className="space-y-1">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                      selectedCategory === c.id
                        ? "bg-foreground text-background"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Бренд</h3>
              <div className="space-y-1">
                {brands.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                      selectedBrand === b
                        ? "bg-foreground text-background"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Память</h3>
              <div className="space-y-1">
                {storages.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStorage(s)}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                      selectedStorage === s
                        ? "bg-foreground text-background"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                Цена до {priceMax.toLocaleString("ru")} ₽
              </h3>
              <input
                type="range"
                min={20000}
                max={150000}
                step={5000}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full accent-foreground"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>20 000 ₽</span>
                <span>150 000 ₽</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedBrand("Все");
                setSelectedCategory("all");
                setSelectedStorage("Все");
                setPriceMax(150000);
                setSort("default");
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Сбросить фильтры
            </button>
          </aside>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-end mb-5">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="text-sm border border-border rounded-sm px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            >
              <option value="default">По умолчанию</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Icon name="SearchX" size={40} className="mx-auto mb-4 opacity-30" />
              <p>Ничего не найдено</p>
              <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => openProduct(p.id)}
                  className="product-card bg-card border border-border rounded-sm overflow-hidden animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="relative aspect-square bg-secondary overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    {p.isNew && (
                      <span className="absolute top-2 left-2 bg-foreground text-background text-[9px] font-mono px-1.5 py-0.5 rounded-sm">
                        НОВИНКА
                      </span>
                    )}
                    {p.isSale && (
                      <span className="absolute top-2 left-2 bg-destructive text-white text-[9px] font-mono px-1.5 py-0.5 rounded-sm">
                        СКИДКА
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-muted-foreground mb-0.5">{p.brand} · {p.storage}</p>
                    <h3 className="font-semibold text-sm mb-1 leading-tight">{p.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Icon name="Star" size={10} className="text-amber-500 fill-amber-500" />
                      <span className="text-[10px] text-muted-foreground">{p.rating} ({p.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-sm">{p.price.toLocaleString("ru")} ₽</div>
                        {p.oldPrice && (
                          <div className="text-[10px] text-muted-foreground line-through">
                            {p.oldPrice.toLocaleString("ru")} ₽
                          </div>
                        )}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleAdd(p); }}
                        className={`w-7 h-7 rounded-sm flex items-center justify-center transition-all text-xs ${
                          addedId === p.id
                            ? "bg-green-600 text-white"
                            : "btn-primary"
                        }`}
                      >
                        {addedId === p.id
                          ? <Icon name="Check" size={13} />
                          : <Icon name="Plus" size={13} />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}