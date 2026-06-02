import { IconX, IconPackage } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import { useEffect, useMemo } from "react";
import OrderModalProductCard from "../../../../components/data-display/OrderModalProductCard";
import { useAuth } from "../../../../hooks/context/AuthContext";

interface OrderModalProps {
  order: {
    id: number;
    status: string;
    created_at?: string;
    items?: {
      id: number;
      quantity: number;
      unit_price: number;
      store_id?: number;
      product: {
        id: number;
        name: string;
        image_1_url?: string | null;
        price?: number;
        discount_price?: number | null;
        store_id?: number;
      };
    }[];
  } | null;
  onClose: () => void;
}

export default function OrderModal({ order, onClose }: OrderModalProps) {
  const { user } = useAuth();
  if (!order) return null;

  // Bloquear scroll del fondo mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Productos filtrados según el rol
  const products = useMemo(() => {
    if (!order.items) return [];

    // Si es un vendedor, filtrar solo productos de su tienda
    if (user?.role === "SELLER" && user?.store && user.store.id) {
      return order.items
        .filter((item) => item.store_id === user.store!.id)
        .map((item) => ({
          id: item.product.id,
          name: item.product.name,
          image_url:
            item.product.image_1_url ||
            "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg",
          price: item.product.discount_price ?? item.unit_price ?? 0,
          quantity: item.quantity,
        }));
    }

    // Si es cliente, mostrar todos los productos
    return order.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      image_url:
        item.product.image_1_url ||
        "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg",
      price: item.product.discount_price ?? item.unit_price ?? 0,
      quantity: item.quantity,
    }));
  }, [order, user]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center sm:p-5 p-0 font-quicksand"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-t-3xl sm:rounded-3xl shadow-xl w-full sm:max-w-[45rem] sm:max-h-[90vh] sm:overflow-y-auto relative flex flex-col"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer click dentro
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-base sm:text-lg font-bold text-main flex items-center gap-2">
              <IconPackage className="text-main" />
              Pedido #{order.id}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-all"
            >
              <IconX className="text-gray-600" />
            </button>
          </div>

          {/* Lista de productos */}
          <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
            {products.length > 0 ? (
              products.map((item) => (
                <OrderModalProductCard key={item.id} item={item} />
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-10">
                Este pedido no contiene productos de tu tienda
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-gray-200 flex justify-end bg-white sticky bottom-0">
            <ButtonComponent
              text="Cerrar"
              style="bg-main text-white rounded-full px-6 py-2 w-full sm:w-auto hover:bg-contrast-main transition-all"
              onClick={onClose}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
