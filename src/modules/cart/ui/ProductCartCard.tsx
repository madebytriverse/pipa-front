import { IconTrash, IconMinus, IconPlus } from "@tabler/icons-react";
import StarRatingComponent from "../../../components/ui/StarRatingComponent";
import { useCart } from "../../../hooks/context/CartContext";
import { Link } from "react-router-dom";
import { useAlert } from "../../../hooks/context/AlertContext";
import { useState } from "react";
import HeartButton from "../../../components/data-display/HeartButton";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  item: {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      discount_price?: number | null;
      image_1_url?: string | null;
      stock?: number;
      status?: "ACTIVE" | "DRAFT" | "ARCHIVED";
      rating?: number;
      store?: {
        id: number;
        name: string;
      };
    };
  };
}

export default function ProductCartCard({ item }: Props) {
  const { product } = item;
  const { updateQuantity, removeItem } = useCart();
  const { showAlert } = useAlert();

  const [updating, setUpdating] = useState(false);
  const [localQty, setLocalQty] = useState(item.quantity);

  // 🔹 Formato de moneda CRC
  const formatCRC = (n: number) =>
    n?.toLocaleString("es-CR", { style: "currency", currency: "CRC" });

  // 🔹 Cambiar cantidad con animación
  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1 || updating) return;
    setLocalQty(newQty);
    setUpdating(true);
    try {
      await updateQuantity(item.id, newQty);
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      showAlert({
        title: "Ups ",
        message: "Ocurrió un error al actualizar la cantidad.",
        confirmText: "Ok",
        type: "error",
      });
      setLocalQty(item.quantity);
    } finally {
      setUpdating(false);
    }
  };

  // 🔹 Eliminar producto
  const handleDelete = async () => {
    const confirmed = await showAlert({
      title: "Eliminar producto",
      message: "¿Deseas eliminar este producto del carrito?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "warning",
    });

    if (!confirmed) return;

    try {
      await removeItem(item.id);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      showAlert({
        title: "Error al eliminar",
        message:
          "No se pudo eliminar el producto, inténtalo nuevamente más tarde.",
        confirmText: "Ok",
        type: "error",
      });
    }
  };

  const isArchived = product.status === "ARCHIVED";
  const total = (product.discount_price ?? product.price) * localQty;

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
      className={`w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 mb-4 font-quicksand ${
        isArchived ? "opacity-70 grayscale" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        {/* Imagen */}
        <Link
          to={`/product/${product.id}`}
          className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shadow-inner"
        >
          <motion.img
            key={product.image_1_url}
            src={
              product.image_1_url ||
              "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg"
            }
            alt={product.name}
            className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        {/* Información */}
        <div className="flex-1 w-full">
          {/* Encabezado */}
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold text-gray-800 text-base hover:text-main transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                Tienda:{" "}
                <span className="font-medium">
                  {product.store?.name ?? "Sin tienda"}
                </span>
              </p>
              <div className="mt-1">
                <StarRatingComponent value={product.rating ?? 0} size={12} />
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center gap-2">
              {!isArchived && (
                <HeartButton productId={product.id} variant="filled" />
              )}
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <IconTrash size={16} />
              </button>
            </div>
          </div>

          {/* Cantidad + Precios */}
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            {/* Controles de cantidad */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuantityChange(localQty - 1)}
                disabled={updating || localQty <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-main font-bold hover:bg-main hover:text-white transition-colors disabled:opacity-40"
              >
                <IconMinus size={14} />
              </button>

              {/* Animación en cantidad */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={localQty}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-semibold text-gray-700 select-none"
                >
                  {localQty}
                </motion.span>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => handleQuantityChange(localQty + 1)}
                disabled={updating}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-main font-bold hover:bg-main hover:text-white transition-colors disabled:opacity-40"
              >
                <IconPlus size={14} />
              </button>
            </div>

            {/* Precios */}
            <div className="text-right sm:text-end">
              {product.discount_price && product.discount_price > 0 ? (
                <>
                  <p className="text-sm line-through text-gray-400">
                    {formatCRC(product.price)}
                  </p>
                  <p className="text-base font-bold text-main">
                    {formatCRC(product.discount_price)}
                  </p>
                </>
              ) : (
                <p className="text-base font-bold text-main">
                  {formatCRC(product.price)}
                </p>
              )}

              <p className="text-sm text-gray-600 mt-1">
                Total:{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={total}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.25 }}
                    className="font-semibold text-main"
                  >
                    {formatCRC(total)}
                  </motion.span>
                </AnimatePresence>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
