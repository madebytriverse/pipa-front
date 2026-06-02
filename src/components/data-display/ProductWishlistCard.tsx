import { IconTrash, IconShoppingBag } from "@tabler/icons-react";
import StarRatingComponent from "../ui/StarRatingComponent";
import { Link } from "react-router-dom";

interface ProductWishlistCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    discount_price?: number | null;
    stock: number;
    image_1_url?: string | null;
    store_name?: string;
    rating?: number;
  };
  onDelete?: (id: number) => void;
  onAddToCart?: (product: any) => void;
  isPublicMode?: boolean;
}

export default function ProductWishlistCard({
  product,
  onDelete,
  onAddToCart,
  isPublicMode = false,
}: ProductWishlistCardProps) {
  const formatCRC = (n: number) =>
    n?.toLocaleString("es-CR", { style: "currency", currency: "CRC" });

  return (
    <>
      {/* 🌟 Desktop version */}
      <figure
        className="hidden sm:flex relative items-center justify-between w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 shadow-md border border-gray-100 
        hover:border-contrast-secondary/40 transition-all duration-500 overflow-hidden mb-5 font-quicksand"
      >
        {/* Imagen */}
        <div className="flex-shrink-0 flex items-center justify-center w-32 h-32 rounded-2xl overflow-hidden bg-white shadow-inner">
          <Link to={`/product/${product.id}`}>
            <img
              src={
                product.image_1_url ||
                "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg"
              }
              alt={product.name}
              className="object-contain w-full h-full transition-transform duration-500 cursor-pointer hover:scale-105"
            />
          </Link>
        </div>

        {/* Información principal */}
        <div className="flex flex-col justify-between flex-grow px-6 py-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-bold text-lg text-gray-800 cursor-pointer hover:text-main transition-colors">
                  {product.name}
                </h3>
              </Link>
              <span
                className={`text-xs ${
                  product.stock > 0
                    ? "text-green-600"
                    : "text-red-500 font-semibold"
                }`}
              >
                {product.stock > 0 ? "Disponible" : "Agotado"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Tienda:{" "}
              <span className="font-medium">
                {product.store_name ?? "Desconocida"}
              </span>
            </p>
            <StarRatingComponent value={product.rating ?? 4} size={12} />
          </div>
        </div>

        {/* Precio y acciones */}
        <div className="flex flex-col items-end justify-between h-full gap-3 pr-2">
          <div className="text-right">
            {product.discount_price && product.discount_price > 0 ? (
              <>
                <p className="text-xs line-through text-gray-400">
                  ₡{formatCRC(product.price)}
                </p>
                <p className="text-xl font-bold text-main bg-clip-text">
                  ₡{formatCRC(product.discount_price)}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-main">
                 ₡{formatCRC(product.price)}
              </p>
            )}
          </div>

          {/* ✅ Ocultar botones si es público */}
          {!isPublicMode && (
            <div className="flex gap-3 text-main">
            {/*  Añadir al carrito 
              <button
                onClick={() => onAddToCart?.(product)}
                disabled={product.stock <= 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-full font-semibold text-sm shadow-md transition-all duration-300 hover:scale-105 ${
                  product.stock > 0
                    ? "bg-main text-white hover:bg-contrast-secondary"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <IconShoppingBag size={16} />
                Añadir
              </button>*/}

              {/* Eliminar */}
              <button
                onClick={() => onDelete?.(product.id)}
                className="p-2 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                title="Eliminar de la lista"
              >
                <IconTrash size={18} />
              </button>
            </div>
          )}
        </div>
      </figure>

      {/* 📱 Mobile version */}
      <figure
        className="sm:hidden relative w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md border border-gray-100 
        hover:border-contrast-secondary/40 transition-all duration-500 overflow-hidden mb-5 font-quicksand p-4 h-[14rem] flex flex-col justify-between"
      >
        {/* Parte superior */}
        <div className="flex w-full">
          <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-inner mr-3">
            <Link to={`/product/${product.id}`}>
              <img
                src={
                  product.image_1_url ||
                  "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg"
                }
                alt={product.name}
                className="object-contain w-full h-full transition-transform duration-500 cursor-pointer hover:scale-105"
              />
            </Link>
          </div>

          <div className="flex flex-col justify-between flex-grow">
            <div>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-bold text-sm text-gray-800 cursor-pointer hover:text-main transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                Tienda:{" "}
                <span className="font-medium">
                  {product.store_name ?? "Desconocida"}
                </span>
              </p>
              <div className="flex justify-start mt-1">
                <StarRatingComponent value={product.rating ?? 4} size={10} />
              </div>
              <span
                className={`text-xs ${
                  product.stock > 0
                    ? "text-green-600"
                    : "text-red-500 font-semibold"
                }`}
              >
                {product.stock > 0 ? "Disponible" : "Agotado"}
              </span>
            </div>
          </div>
        </div>

        {/* Parte inferior */}
        <div className="flex justify-between items-end w-full mt-3">
          <div className="flex flex-col items-start">
            {product.discount_price && product.discount_price > 0 ? (
              <>
                <p className="text-xs line-through text-gray-400">
                  {formatCRC(product.price)}
                </p>
                <p className="text-xl font-bold text-main">
                  {formatCRC(product.discount_price)}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-main">
                {formatCRC(product.price)}
              </p>
            )}
          </div>

          {/* ✅ Ocultar botones en modo público */}
          {!isPublicMode && (
            <div className="flex gap-3 text-main">
              <button
                onClick={() => onAddToCart?.(product)}
                disabled={product.stock <= 0}
                className={`p-2 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110 ${
                  product.stock > 0
                    ? "bg-gradient-to-br from-contrast-main to-contrast-secondary text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <IconShoppingBag size={16} />
              </button>

              <button
                onClick={() => onDelete?.(product.id)}
                className="p-2 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
              >
                <IconTrash size={16} />
              </button>
            </div>
          )}
        </div>
      </figure>
    </>
  );
}
