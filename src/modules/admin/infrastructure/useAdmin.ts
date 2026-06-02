import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface Store {
    id: number;
    user_id?: number;
    name: string;
    slug: string;
    description?: string;
    image: string;
    banner: string;
    category_id?: number | null;
    business_name?: string | null;
    tax_id?: string | null;
    legal_type?: string | null;
    registered_address?: string | null;
    address?: string | null;
    support_email?: string | null;
    support_phone?: string | null;
    is_verified?: boolean;
    verification_date?: string | null;
    status?: string;
    store_socials?: any;
    user?: any;
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    image: string;
    status: boolean;
    phone_number: string;
    role: "ADMIN" | "SELLER" | "CUSTOMER";
    store?: Store | null;
}

export default function useAdmin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const getUsers = async (): Promise<User[]> => {
        setLoading(true);
        setError(null);

        if (!token) {
            console.warn("⚠️ No hay token disponible (usuario no logueado)");
            setLoading(false);
            return [];
        }

        try {
            const res = await axios.get(`${BASE_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (e: any) {
            setError("No se pudieron cargar los usuarios");
            console.error("❌ Error al obtener usuarios:", e);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const updateUserStatus = async (userId: number, newStatus: boolean) => {
        if (!token) {
            console.error("❌ No hay token disponible para actualizar estado");
            return false;
        }

        try {
            await axios.patch(
                `${BASE_URL}/users/${userId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(`✅ Estado del usuario ${userId} actualizado a ${newStatus}`);
            return true;
        } catch (e) {
            console.error("❌ Error al actualizar estado del usuario:", e);
            return false;
        }
    };

    const createUser = async (newUserData: Partial<User>) => {
        if (!token) {
            console.error("❌ No hay token disponible para crear usuario");
            return null;
        }

        try {
            const res = await axios.post(`${BASE_URL}/users`, newUserData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Usuario creado correctamente:", res.data);
            return res.data.user || res.data;
        } catch (e) {
            console.error("❌ Error al crear usuario:", e);
            return null;
        }
    };
    const updateUserData = async (userId: number, updatedData: Partial<User>) => {
        if (!token) {
            console.error("❌ No hay token disponible para actualizar datos");
            return null;
        }

        try {
            const res = await axios.patch(`${BASE_URL}/admin/users/${userId}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(`✅ Usuario ${userId} actualizado correctamente`);
            return res.data.user || res.data;
        } catch (e) {
            console.error("❌ Error al actualizar datos del usuario:", e);
            return null;
        }
    };

    const getStoreByUserId = async (userId: number): Promise<Store | null> => {
    if (!token) {
        console.error("❌ No hay token disponible para obtener tienda");
        return null;
    }

    try {
        const res = await axios.get(`${BASE_URL}/stores/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(`🏪 Tienda del usuario ${userId} cargada correctamente`);

        // 🧠 El backend devuelve directamente la tienda (no dentro de { store: ... })
        // Pero si algún día cambia, esto la toma igual
        const storeData = res.data.store ?? res.data;

        // Validamos que tenga ID real antes de devolverla
        return storeData?.id ? storeData : null;

    } catch (e: any) {
        if (e.response?.status === 404) {
            console.warn(`⚠️ No se encontró tienda para el usuario ${userId}`);
        } else {
            console.error("❌ Error al obtener tienda del usuario:", e);
        }
        return null;
    }
};



    const updateStoreData = async (storeId: number, updatedData: Partial<Store>) => {
        if (!token) {
            console.error("❌ No hay token disponible para actualizar tienda");
            return null;
        }

        try {
            const res = await axios.patch(`${BASE_URL}/admin/stores/${storeId}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(`✅ Tienda ${storeId} actualizada correctamente`);
            return res.data.store;
        } catch (e) {
            console.error("❌ Error al actualizar datos de la tienda:", e);
            return null;
        }
    };

    return {
        getUsers,
        createUser,
        updateUserStatus,
        updateUserData,
        getStoreByUserId,
        updateStoreData,
        loading,
        error,
    };
}
