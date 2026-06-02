import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export async function getStoreByUser(userId: number): Promise<any | null> {
  try {
    const token = localStorage.getItem("access_token");
    const { data } = await axios.get(`/users/${userId}/store`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data?.store ?? null; // <-- devuelve SOLO la tienda
  } catch (error) {
    console.error("Error al obtener tienda:", error);
    return null;
  }
}

export async function getStore(storeId: number): Promise<any | null> {
  try {
    const { data } = await axios.get(`/stores/${storeId}`);
    return data; // Tienda obtenida
  } catch (error) {
    console.error("Error al obtener tienda:", error);
    return null;
  }
}

export async function updateStore(storeId: number, payload: Record<string, any>): Promise<any> {
  const token = localStorage.getItem("access_token");
  const { data } = await axios.put(`/stores/${storeId}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; // Tienda actualizada
}
