import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/context/AuthContext";

// 🧾 Interfaz del cupón
export interface Coupon {
  id?: number;
  code: string;
  description?: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  min_purchase?: number | string | null;
  max_discount?: number | string | null;
  store_id?: number | string | null;
  category_id?: number | string | null;
  product_id?: number | string | null;
  user_id?: number | string | null;
  usage_limit: number;
  usage_per_user: number;
  expires_at?: string | null;
  active: boolean;
}

// 🧩 Resultado de validación del cupón
export interface CouponValidationResult {
  valid: boolean;
  discount: number;
  coupon?: Coupon;
  applied_to: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  context?: {
    applies_to: "product" | "category" | "store" | "global";
    scope_id: number | null;
  } | null;
  message?: string;
}

export function useCoupons() {
  const { token, user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Limpieza del endpoint: evita duplicar `/api`
  const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");
  const API_URL = `${BASE_URL}/coupons`;

  // Config base para axios
  const axiosConfig = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  // 🔍 Obtener cupones (solo admin / seller)
  const fetchCoupons = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL, axiosConfig);
      setCoupons(data);
      setError(null);
    } catch (err) {
      console.error("❌ [useCoupons] Error al obtener cupones:", err);
      setError("Error al obtener los cupones.");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Crear cupón
  const createCoupon = async (coupon: Coupon) => {
    try {
      setLoading(true);
      const { data } = await axios.post(API_URL, coupon, axiosConfig);
      setCoupons((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error("❌ Error al crear cupón:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Actualizar cupón
  const updateCoupon = async (id: number, coupon: Coupon) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`${API_URL}/${id}`, coupon, axiosConfig);
      setCoupons((prev) => prev.map((c) => (c.id === id ? data : c)));
      return data;
    } catch (err: any) {
      console.error("❌ Error al actualizar cupón:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Eliminar cupón
  const deleteCoupon = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`, axiosConfig);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error("❌ Error al eliminar cupón:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🎟️ Validar cupón público
  const validateCoupon = async (
    code: string,
    total: number,
    userId?: number,
    storeId?: number
  ): Promise<CouponValidationResult> => {
    try {
      // ✅ incluir token si existe
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const { data } = await axios.post(
        `${BASE_URL}/coupons/validate`,
        { code, total, user_id: userId, store_id: storeId },
        { headers }
      );

      return {
        valid: data.valid ?? true,
        discount: data.discount ?? 0,
        coupon: data.coupon,
        applied_to: Array.isArray(data.applied_to) ? data.applied_to : [],
        context: data.context ?? null,
        message: data.message,
      };
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      console.error("❌ Error al validar cupón:", backendMessage || err.message);

      return {
        valid: false,
        discount: 0,
        applied_to: [],
        message: backendMessage || "Cupón inválido o expirado.",
      };
    }
  };

  // 🧠 Cargar cupones si el usuario es admin o vendedor
  useEffect(() => {
    if (token && (user?.role === "ADMIN" || user?.role === "SELLER")) {
      fetchCoupons();
    }
  }, [token, user]);

  return {
    coupons,
    loading,
    error,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
  };
}
