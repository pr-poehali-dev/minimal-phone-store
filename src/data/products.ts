export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  storage: string;
  color: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    brand: "Apple",
    price: 109990,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
    category: "flagship",
    storage: "256GB",
    color: "Титан",
    rating: 4.9,
    reviewCount: 214,
    isNew: true,
  },
  {
    id: 2,
    name: "iPhone 14",
    brand: "Apple",
    price: 79990,
    oldPrice: 89990,
    image: "https://images.unsplash.com/photo-1664478546384-d57bbe74a6dd?w=400&q=80",
    category: "mid",
    storage: "128GB",
    color: "Полуночный",
    rating: 4.7,
    reviewCount: 389,
    isSale: true,
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 119990,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
    category: "flagship",
    storage: "512GB",
    color: "Чёрный",
    rating: 4.8,
    reviewCount: 176,
    isNew: true,
  },
  {
    id: 4,
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    price: 44990,
    oldPrice: 49990,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    category: "budget",
    storage: "256GB",
    color: "Голубой",
    rating: 4.5,
    reviewCount: 98,
    isSale: true,
  },
  {
    id: 5,
    name: "Google Pixel 8",
    brand: "Google",
    price: 74990,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80",
    category: "mid",
    storage: "128GB",
    color: "Хейзл",
    rating: 4.6,
    reviewCount: 112,
  },
  {
    id: 6,
    name: "Xiaomi 14",
    brand: "Xiaomi",
    price: 69990,
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80",
    category: "flagship",
    storage: "256GB",
    color: "Белый",
    rating: 4.7,
    reviewCount: 143,
    isNew: true,
  },
  {
    id: 7,
    name: "HONOR 90",
    brand: "Honor",
    price: 39990,
    oldPrice: 44990,
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&q=80",
    category: "budget",
    storage: "256GB",
    color: "Изумрудный",
    rating: 4.4,
    reviewCount: 67,
    isSale: true,
  },
  {
    id: 8,
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 84990,
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&q=80",
    category: "flagship",
    storage: "256GB",
    color: "Чёрный",
    rating: 4.8,
    reviewCount: 89,
  },
];

export const brands = ["Все", "Apple", "Samsung", "Google", "Xiaomi", "Honor", "OnePlus"];
export const categories = [
  { id: "all", label: "Все" },
  { id: "flagship", label: "Флагманы" },
  { id: "mid", label: "Средний класс" },
  { id: "budget", label: "Бюджетные" },
];
export const storages = ["Все", "128GB", "256GB", "512GB"];
