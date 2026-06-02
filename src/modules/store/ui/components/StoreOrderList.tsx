import { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/context/AuthContext";
import { useOrder } from "../../../users/infrastructure/useOrder";
import OrderCard from "../../../../components/data-display/OrderCard";
import OrderModal from "../../../users/ui/components/OrderModal";

export default function StoreOrderList() {
  const { user } = useAuth();
  const { orders, loading, fetchOrdersByStore } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (user?.store?.id) {
      fetchOrdersByStore(user.store.id); 
    }
  }, [user]);

  return (
    <div className="mx-10 border-l-2 border-main-dark/20 pl-6 font-quicksand">
      <section className="flex flex-col mb-6">
        <h1 className="text-2xl font-semibold text-main-dark mb-1">
          Lista de pedidos
        </h1>
        <p className="text-sm text-gray-500">
          Visualiza todos los pedidos recibidos en tu tienda.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">
            No hay pedidos registrados en tu tienda 🛍️
          </p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewOrder={(order) => setSelectedOrder(order)}
            />
          ))
        )}
      </section>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
