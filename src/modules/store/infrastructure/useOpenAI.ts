import { useState } from "react";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export function useOpenAI() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getDescription = async (productName: string): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${BASE_URL}/openai/description`, {name: productName,});
            return res.data.description;
        } catch (e: any) {
            setError("No se pudo generar la descripción");
            return "";
        } finally {
            setLoading(false);
        }
    };

    return { getDescription, loading, error };
}