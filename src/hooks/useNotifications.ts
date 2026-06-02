import { useEffect, useState } from "react";
import axios from "axios";

export type Notification = {
  id: number;
  user_id: number;
  role?: "CUSTOMER" | "SELLER" | "ADMIN";
  type: string;
  title: string;
  message: string;
  related_id?: number | null;
  related_type?: string | null; // 🔹 ahora sí existe
  priority?: "LOW" | "NORMAL" | "HIGH";
  is_read: boolean;
  is_archived?: boolean;
  data?: {
    store_id?: number;
    store_name?: string;
    user_id?: number;
    [key: string]: any; // permite más datos
  };
  created_at: string;
  updated_at?: string;
};

// useNotifications.ts
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "/api";

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await axios.get(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(data);
    } catch (err: any) {
      console.error("Error cargando notificaciones:", err);
      setError("No se pudieron cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Marcar notificación como leída
  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(`${BASE_URL}/notifications/${id}/read`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔄 Actualiza el estado local
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Error marcando como leída:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return { notifications, loading, error, fetchNotifications, markAsRead };
}

