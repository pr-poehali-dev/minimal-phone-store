import { useState, useMemo, useCallback } from "react";
import { CartItem } from "@/App";
import { products, brands, categories, storages } from "@/data/products";
import Icon from "@/components/ui/icon";

interface CatalogPageProps {
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  openProduct: (id: number) => void;
}

type SortOption = "default" | "price_asc" | "price_desc" | "rating";

const PRICE_MIN = 0;
const PRICE_MAX = 150000;

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) { next.delete(value); } else { next.add(value); }
  return next;
}

function FilterGroup({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: { id: string; label: string }[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => {
          const active = selected.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-colors ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PriceRange({
  min, max, valueMin, valueMax,
  onChange,
}: {
  min: number; max: number;
  valueMin: number; valueMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div>
      <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Цена, ₽</h3>

      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label className="text-[10px] text-muted-foreground mb-1 block">От</label>
          <input
            type="number"
            value={valueMin}
            min={min}
            max={valueMax - 1000}
            step={1000}
            onChange={e => {
              const v = Math.min(Number(e.target.value), valueMax - 1000);
              onChange(Math.max(v, min), valueMax);
            }}
            className="w-full border border-border rounded-sm px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-muted-foreground mb-1 block">До</label>
          <input
            type="number"
            value={valueMax}
            min={valueMin + 1000}
            max={max}
            step={1000}
            onChange={e => {
              const v = Math.max(Number(e.target.value), valueMin + 1000);
              onChange(valueMin, Math.min(v, max));
            }}
            className="w-full border border-border rounded-sm px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      {/* Двойной слайдер */}
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-1 bg-border rounded-full" />
        <div
          className="absolute h-1 bg-foreground rounded-full"
          style={{ left: `${pct(valueMin)}%`, right: `${100 - pct(valueMax)}%` }}
        />
        <input
          type="range" min={min} max={max} step={1000} value={valueMin}
          onChange={e => {
            const v = Math.min(Number(e.target.value), valueMax - 1000);
            onChange(v, valueMax);
          }}
          className="absolute inset-x-0 w-full h-1 appearance-none bg-transparent cursor-pointer range-thumb"
          style={{ zIndex: valueMin > max - 1000 ? 5 : 3 }}
        />
        <input
          type="range" min={min} max={max} step={1000} value={valueMax}
          onChange={e => {
            const v = Math.max(Number(e.target.value), valueMin + 1000);
            onChange(valueMin, v);
          }}
          className="absolute inset-x-0 w-full h-1 appearance-none bg-transparent cursor-pointer range-thumb"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>{min.toLocaleString("ru-RU")} ₽</span>
        <span>{max.toLocaleString("ru-RU")} ₽</span>
      </div>
    </div>
  );
}

export default function CatalogPage({ addToCart, openProduct }: CatalogPageProps) {
  const [selBrands, setSelBrands] = useState<Set<string>>(new Set());
  const [selCategories, setSelCategories] = useState<Set<string>>(new Set());
  const [selStorages, setSelStorages] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [sort, setSort] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);

  const handlePrice = useCallback((min: number, max: number) => {
    setPriceMin(min); setPriceMax(max);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selBrands.size) list = list.filter(p => selBrands.has(p.brand));
    if (selCategories.size) list = list.filter(p => selCategories.has(p.category));
    if (selStorages.size) list = list.filter(p => selStorages.has(p.storage));
    list = list.filter(p => p.price >= priceMin && p.price <= priceMax);
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [selBrands, selCategories, selStorages, priceMin, priceMax, sort]);

  const activeCount = selBrands.size + selCategories.size + selStorages.size
    + (priceMin > PRICE_MIN || priceMax < PRICE_MAX ? 1 : 0);

  const reset = () => {
    setSelBrands(new Set());
    setSelCategories(new Set());
    setSelStorages(new Set());
    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
    setSort("default");
  };

  const handleAdd = (p: typeof products[0]) => {
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, brand: p.brand });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const brandItems = brands.filter(b => b !== "Все").map(b => ({ id: b, label: b }));
  const categoryItems = categories.filter(c => c.id !== "all");
  const storageItems = storages.filter(s => s !== "Все").map(s => ({ id: s, label: s }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Каталог</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} товаров</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 text-sm border px-4 py-2 rounded-sm transition-colors ${
            showFilters ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"
          }`}
        >
          <Icon name="SlidersHorizontal" size={14} />
          Фильтры
          {activeCount > 0 && (
            <span className={`text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center ${
              showFilters ? "bg-background text-foreground" : "bg-foreground text-background"
            }`}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-8">
        {showFilters && (
          <aside className="w-60 shrink-0 space-y-7 animate-slide-up">
            <FilterGroup
              title="Категория"
              items={categoryItems}
              selected={selCategories}
              onToggle={id => setSelCategories(toggle(selCategories, id))}
            />
            <FilterGroup
              title="Бренд"
              items={brandItems}
              selected={selBrands}
              onToggle={id => setSelBrands(toggle(selBrands, id))}
            />
            <FilterGroup
              title="Память"
              items={storageItems}
              selected={selStorages}
              onToggle={id => setSelStorages(toggle(selStorages, id))}
            />
            <PriceRange
              min={PRICE_MIN} max={PRICE_MAX}
              valueMin={priceMin} valueMax={priceMax}
              onChange={handlePrice}
            />
            {activeCount > 0 && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={12} />
                Сбросить фильтры ({activeCount})
              </button>
            )}
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

          {/* Активные теги */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {[...selCategories].map(id => {
                const label = categoryItems.find(c => c.id === id)?.label ?? id;
                return (
                  <span key={id} className="flex items-center gap-1 text-xs bg-secondary border border-border px-2.5 py-1 rounded-sm">
                    {label}
                    <button onClick={() => setSelCategories(toggle(selCategories, id))}>
                      <Icon name="X" size={10} className="text-muted-foreground hover:text-foreground" />
                    </button>
                  </span>
                );
              })}
              {[...selBrands].map(id => (
                <span key={id} className="flex items-center gap-1 text-xs bg-secondary border border-border px-2.5 py-1 rounded-sm">
                  {id}
                  <button onClick={() => setSelBrands(toggle(selBrands, id))}>
                    <Icon name="X" size={10} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </span>
              ))}
              {[...selStorages].map(id => (
                <span key={id} className="flex items-center gap-1 text-xs bg-secondary border border-border px-2.5 py-1 rounded-sm">
                  {id}
                  <button onClick={() => setSelStorages(toggle(selStorages, id))}>
                    <Icon name="X" size={10} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </span>
              ))}
              {(priceMin > PRICE_MIN || priceMax < PRICE_MAX) && (
                <span className="flex items-center gap-1 text-xs bg-secondary border border-border px-2.5 py-1 rounded-sm">
                  {priceMin.toLocaleString("ru-RU")} – {priceMax.toLocaleString("ru-RU")} ₽
                  <button onClick={() => { setPriceMin(PRICE_MIN); setPriceMax(PRICE_MAX); }}>
                    <Icon name="X" size={10} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </span>
              )}
            </div>
          )}

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
                          addedId === p.id ? "bg-green-600 text-white" : "btn-primary"
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