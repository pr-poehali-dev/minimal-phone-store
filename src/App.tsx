import { useState } from "react";
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import AboutPage from "@/pages/AboutPage";
import ReviewsPage from "@/pages/ReviewsPage";
import CartPage from "@/pages/CartPage";
import ProfilePage from "@/pages/ProfilePage";
import ProductPage from "@/pages/ProductPage";
import Navbar from "@/components/Navbar";

export type Page = "home" | "catalog" | "about" | "reviews" | "cart" | "profile" | "product";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  quantity: number;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [prevPage, setPrevPage] = useState<Page>("catalog");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const navigate = (p: Page) => {
    setPrevPage(page);
    setPage(p);
  };

  const openProduct = (id: number) => {
    setPrevPage(page);
    setSelectedProductId(id);
    setPage("product");
  };

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(c => c.id === id ? { ...c, quantity } : c));
  };

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  return (
    <div className="min-h-screen bg-background font-golos">
      <Navbar page={page} setPage={navigate} cartCount={cartCount} />
      <main>
        {page === "home" && <HomePage setPage={navigate} openProduct={openProduct} addToCart={addToCart} />}
        {page === "catalog" && <CatalogPage addToCart={addToCart} openProduct={openProduct} />}
        {page === "about" && <AboutPage />}
        {page === "reviews" && <ReviewsPage />}
        {page === "cart" && <CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />}
        {page === "profile" && <ProfilePage />}
        {page === "product" && selectedProductId !== null && (
          <ProductPage
            productId={selectedProductId}
            addToCart={addToCart}
            onBack={() => navigate(prevPage)}
            openProduct={openProduct}
          />
        )}
      </main>
    </div>
  );
}
