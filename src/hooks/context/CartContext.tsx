import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    discount_price?: number | null;
    image_1_url?: string | null;
    stock?: number;
    status?: "ACTIVE" | "DRAFT" | "ARCHIVED";
    store?: { id: number; name: string };
  };
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

// Datos del producto necesarios para el carrito guest
export interface GuestProductData {
  name: string;
  price: number;
  discount_price?: number | null;
  image_1_url?: string | null;
  stock?: number;
}

// Lo que se guarda en localStorage por item
interface GuestEntry {
  product_id: number;
  quantity: number;
  product: GuestProductData & { id: number };
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  isGuestCart: boolean;
  addToCart: (productId: number, quantity?: number, productData?: GuestProductData) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Helpers de guest cart (localStorage)
// ─────────────────────────────────────────────

const GUEST_CART_KEY = "pipa_guest_cart";

const loadGuest = (): GuestEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const saveGuest = (entries: GuestEntry[]) =>
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(entries));

const buildCartFromGuest = (entries: GuestEntry[]): Cart => {
  const items: CartItem[] = entries.map((e) => ({
    id: e.product_id,          // id sintético = product_id para operaciones locales
    product_id: e.product_id,
    quantity: e.quantity,
    product: {
      id: e.product_id,
      name: e.product.name,
      price: e.product.price,
      discount_price: e.product.discount_price ?? null,
      image_1_url: e.product.image_1_url ?? null,
      stock: e.product.stock,
      status: "ACTIVE",
    },
  }));

  const total = items.reduce((sum, item) => {
    const price =
      item.product.discount_price && item.product.discount_price > 0
        ? item.product.discount_price
        : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return { id: 0, items, total };
};

// ─────────────────────────────────────────────
// Contexto
// ─────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  // Guarda el token anterior para detectar la transición guest → login
  const prevToken = useRef<string | null | undefined>(token ?? null);

  // ─── Cargar carrito desde backend ─────────────────────
  const refreshCart = async () => {
    if (!token) {
      // Sin token → cargar carrito guest desde localStorage
      const entries = loadGuest();
      setCart(entries.length ? buildCartFromGuest(entries) : null);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get("/cart/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.cart ?? data);
    } catch {
      setCart({ id: 0, items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  // ─── Reaccionar al cambio de token ────────────────────
  useEffect(() => {
    const prev = prevToken.current;
    prevToken.current = token ?? null;

    if (token) {
      // Detectar transición guest → login
      if (!prev) {
        const guestEntries = loadGuest();
        if (guestEntries.length > 0) {
          // Fusionar carrito guest con el carrito del servidor
          (async () => {
            for (const entry of guestEntries) {
              try {
                await axios.post(
                  "/cart/add",
                  { product_id: entry.product_id, quantity: entry.quantity },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              } catch {
                // Ignorar items que fallen (stock insuficiente, etc.)
              }
            }
            localStorage.removeItem(GUEST_CART_KEY);
            await refreshCart();
          })();
          return;
        }
      }
      refreshCart();
    } else {
      // Sin token → cargar carrito guest
      const entries = loadGuest();
      setCart(entries.length ? buildCartFromGuest(entries) : null);
    }
  }, [token]);

  // ─── Agregar producto ─────────────────────────────────
  const addToCart = async (
    productId: number,
    quantity: number = 1,
    productData?: GuestProductData
  ) => {
    if (token) {
      // Carrito servidor
      try {
        const { data } = await axios.post(
          "/cart/add",
          { product_id: productId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(data.cart ?? data);
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error("Error al añadir al carrito:", err);
        throw err;
      }
    } else {
      // Carrito guest
      if (!productData) {
        console.warn("addToCart: se requiere productData para el carrito guest");
        return;
      }
      const entries = loadGuest();
      const idx = entries.findIndex((e) => e.product_id === productId);
      if (idx >= 0) {
        entries[idx].quantity += quantity;
      } else {
        entries.push({
          product_id: productId,
          quantity,
          product: { id: productId, ...productData },
        });
      }
      saveGuest(entries);
      setCart(buildCartFromGuest(entries));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // ─── Actualizar cantidad ──────────────────────────────
  const updateQuantity = async (itemId: number, quantity: number) => {
    if (token) {
      try {
        const { data } = await axios.patch(
          `/cart/item/${itemId}`,
          { quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map((i) =>
              i.id === itemId ? { ...i, ...data.item } : i
            ),
          };
        });
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error("Error al actualizar cantidad:", err);
      }
    } else {
      // Guest: itemId == product_id (por el id sintético)
      const entries = loadGuest();
      const idx = entries.findIndex((e) => e.product_id === itemId);
      if (idx >= 0) {
        if (quantity <= 0) {
          entries.splice(idx, 1);
        } else {
          entries[idx].quantity = quantity;
        }
        saveGuest(entries);
        setCart(entries.length ? buildCartFromGuest(entries) : null);
        window.dispatchEvent(new Event("cartUpdated"));
      }
    }
  };

  // ─── Eliminar item ────────────────────────────────────
  const removeItem = async (itemId: number) => {
    if (token) {
      try {
        await axios.delete(`/cart/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart((prev) => {
          if (!prev) return prev;
          return { ...prev, items: prev.items.filter((i) => i.id !== itemId) };
        });
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error("Error al eliminar item:", err);
      }
    } else {
      const entries = loadGuest().filter((e) => e.product_id !== itemId);
      saveGuest(entries);
      setCart(entries.length ? buildCartFromGuest(entries) : null);
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // ─── Vaciar carrito ───────────────────────────────────
  const clearCart = async () => {
    if (token) {
      try {
        await axios.post("/cart/clear", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart({ id: 0, items: [], total: 0 });
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error("Error al vaciar carrito:", err);
      }
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
      setCart(null);
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const isGuestCart = !token;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        isGuestCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
}
