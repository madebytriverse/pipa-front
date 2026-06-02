import { useState, useEffect } from "react";
import axios from "axios";

interface TotalsType {
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
  currency: string;
  items_count?: number;
}

export function useCartTotals() {
  const [totals, setTotals] = useState<TotalsType>({
    subtotal: 0,
    taxes: 0,
    shipping: 0,
    total: 0,
    currency: "CRC",
    items_count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");

  // =========================
  // 🔹 Totales del carrito (requiere token)
  // =========================
  const getTotals = async (): Promise<TotalsType | null> => {
    if (!token) return null;
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart/totals`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data as TotalsType;
      setTotals(data);
      return data;
    } catch (err) {
      console.error("❌ Error al obtener totales del carrito:", err);
      setError("Error al obtener totales del carrito");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔹 Totales de un producto (público)
  // =========================
  const getProductTotal = async (
    productId: number,
    quantity: number = 1
  ): Promise<TotalsType | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/calculateProductTotal`,
        { product_id: productId, quantity }
      );

      const data = res.data?.totals || res.data;
      return data as TotalsType;
    } catch (err) {
      console.error("❌ Error al calcular total del producto:", err);
      setError("Error al calcular total del producto");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔹 Limpiar carrito
  // =========================
  const clearCart = async () => {
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/cart/clear`, {}, config);
      } catch (err: any) {
        if (err.response?.status === 405) {
          await axios.delete(`${import.meta.env.VITE_API_URL}/cart/clear`, config);
        } else {
          throw err;
        }
      }

      setTotals({
        subtotal: 0,
        taxes: 0,
        shipping: 0,
        total: 0,
        currency: "CRC",
        items_count: 0,
      });

      window.dispatchEvent(new Event("cartUpdated"));
      console.log("🧹 Carrito limpiado correctamente");
    } catch (err) {
      console.error("❌ Error al limpiar carrito:", err);
    }
  };

  // =========================
  // 🔹 Listener reactivo (sin fetch inicial)
  // =========================
  useEffect(() => {
    if (!token) return;
    const reload = () => getTotals();
    window.addEventListener("cartUpdated", reload);
    return () => window.removeEventListener("cartUpdated", reload);
  }, [token]);

  return { totals, getTotals, getProductTotal, clearCart, loading, error };
}
