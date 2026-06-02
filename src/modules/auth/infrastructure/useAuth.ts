import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`${BASE_URL}/forgot-password`, { email });
      setSuccess(res.data.message || "Correo enviado");
    } catch (e: any) {
      setError(
        e.response?.data?.message ||
        "No se pudo enviar el correo de recuperación."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`${BASE_URL}/reset-password`, data);
      setSuccess(res.data.message || "Contraseña actualizada correctamente");
      if (res.data.redirect) {
        window.location.href = res.data.redirect;
      }
    } catch (e: any) {
      console.error("Error completo AXIOS:", e);
      if (e.response) {
        // Axios recibió respuesta del server, incluso si es 500
        setError(JSON.stringify(e.response.data)); // mostrar todo el JSON
      } else {
        setError("Error inesperado: " + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, resetPassword, loading, error, success };
}