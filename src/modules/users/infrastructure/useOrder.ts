import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/context/AuthContext";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export function useOrder() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  //todas las órdenes del comprador
  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = response.data.map((order: any) => ({
        ...order,
        products:
          order.items?.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            image_url:
              item.product.image_1_url ||
              "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg",
            store_id: item.product.store_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })) || [],
      }));

      setOrders(formatted);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  //filtrar órdenes por tienda (solo productos de esa tienda)
  const fetchOrdersByStore = async (storeId: number) => {
    if (!token || !storeId) return;
    setLoading(true);
    try {
      const response = await axios.get(`/stores/${storeId}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = response.data.map((order: any) => {
        // Filtramos solo los productos de esta tienda
        const filteredItems = order.items?.filter(
          (item: any) => item.store_id === storeId
        );

        return {
          ...order,
          products:
            filteredItems?.map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              image_url:
                item.product.image_1_url ||
                "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg",
              store_id: item.product.store_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
            })) || [],
        };
      });

      setOrders(formatted);
    } catch (error) {
      console.error("Error al obtener órdenes de la tienda:", error);
    } finally {
      setLoading(false);
    }
  };

  //obtener orden por id
  const getOrderById = async (orderId: number) => {
    try {
      const response = await axios.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener orden:", error);
      return null;
    }
  };

  //fetch orders automáticamente para compradores
  useEffect(() => {
    if (user?.role === "CUSTOMER") fetchOrders();
  }, [token]);

  return {
    orders,
    loading,
    fetchOrders,
    fetchOrdersByStore, 
    getOrderById,
  };
}
