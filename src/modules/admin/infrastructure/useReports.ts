import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function useReports() {
    const token = localStorage.getItem("access_token");

    const headers = {
        Authorization: `Bearer ${token}`,
    };

     const createReport = async (payload: {
    name: string;
    email: string;
    order_number?: string;
    subject: string;
    description: string;
    images?: string[];
  }) => {
    const { data } = await axios.post(`${API_URL}/reports`, payload);
    return data;
  };

    // 🧾 Obtener todos los reportes
    const getReports = async () => {
        const { data } = await axios.get(`${API_URL}/reports`, { headers });
        return data;
    };

    // ✏️ Actualizar reporte (estado, notas, leído)
    const updateReport = async (
        id: number,
        payload: { status?: string; admin_notes?: string; read?: boolean }
    ) => {
        const { data } = await axios.put(`${API_URL}/reports/${id}`, payload, {
            headers,
        });
        return data.report;
    };

    // ❌ Eliminar reporte
    const deleteReport = async (id: number) => {
        await axios.delete(`${API_URL}/reports/${id}`, { headers });
    };

    return {
        createReport,
        getReports,
        updateReport,
        deleteReport,
    };
}
