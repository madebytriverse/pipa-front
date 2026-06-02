import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://tukishop-api.onrender.com/api";

interface VisaRate {
  destinationCurrencyCode: string;
  sourceCurrencyCode: string;
  rate: string;
  timestamp: string;
  mock?: boolean;
}

export function useVisa() {
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState<VisaRate | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Función para obtener tipo de cambio (mock o real)
  const getForexRate = async (from: string, to: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE}/visa/test`, {
        params: {
          sourceCurrencyCode: from,
          destinationCurrencyCode: to,
        },
      });
      setRate(res.data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al obtener tipo de cambio");
    } finally {
      setLoading(false);
    }
  };

  return { getForexRate, rate, loading, error };
}
