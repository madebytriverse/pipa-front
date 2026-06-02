import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/context/AuthContext";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export interface WishlistItem {
  id: number;
  wishlist_id: number;
  product: {
    id: number;
    name: string;
    price: number;
    discount_price?: number | null;
    stock: number;
    image_1_url?: string | null;
    store?: {
      id: number;
      name: string;
    };
  };
}

export interface Wishlist {
  id: number;
  user_id: number;
  user?: {
    username: string;
  };
  slug: string;
  is_public: boolean;
  items: WishlistItem[];
}


export function useWishlist() {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Obtener wishlist del usuario autenticado
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/wishlist/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(data);
    } catch (err) {
      console.error("❌ Error al obtener wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Agregar producto
  const addToWishlist = async (productId: number) => {
    try {
      setLoading(true);
      await axios.post(
        "/wishlist/add",
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchWishlist();
    } catch (err) {
      console.error("❌ Error al agregar producto a wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar producto
  const removeFromWishlist = async (itemId: number) => {
    try {
      setLoading(true);
      await axios.delete(`/wishlist/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchWishlist();
    } catch (err) {
      console.error("❌ Error al eliminar producto de wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 🔹 Obtener wishlist pública por slug (RUTA CORRECTA)
  const getPublicWishlist = async (slug: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/wishlist/public/${slug}`);
      setWishlist(data);
    } catch (err) {
      console.error("❌ Error al cargar wishlist pública:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cambiar visibilidad pública/privada
  const toggleVisibility = async () => {
    try {
      const { data } = await axios.post(
        "/wishlist/toggle-visibility",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist((prev) =>
        prev ? { ...prev, is_public: data.is_public } : prev
      );
    } catch (err) {
      console.error("❌ Error al cambiar visibilidad:", err);
    }
  };

  return {
    wishlist,
    loading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    getPublicWishlist,
    toggleVisibility,
  };
}
