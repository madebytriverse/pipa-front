import { useState, useEffect } from "react";
import OrderCard from "../../../components/data-display/OrderCard";
import OrderModal from "./components/OrderModal";
import { useOrder } from "../infrastructure/useOrder";

export default function OrdersList() {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const { orders, loading, fetchOrders } = useOrder();

  // 🔹 Cargar pedidos al montar el componente
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="px-5 py-8 max-w-[80rem] mx-auto font-quicksand">
      {/* 🔹 Header */}
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold border-b-4 border-main pb-2 w-fit">
          Mis pedidos
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Aquí puedes revisar el estado y los detalles de tus compras recientes.
        </p>
      </div>

      {/* Lista de pedidos */}
      <div className="flex flex-col">
        {loading ? (
          <p className="text-gray-500 text-sm">Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">
            No tienes pedidos registrados 🛍️
          </p>
        ) : (
          orders.map((order, index) => (
            <OrderCard
              key={`${order.id}-${index}`}
              order={order}
              onViewOrder={(order) => setSelectedOrder(order)} 
            />
          ))
        )}
      </div>

      {/* Modal: se muestra cuando hay una orden seleccionada */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
