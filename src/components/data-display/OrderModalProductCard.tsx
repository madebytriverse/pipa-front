import { IconShoppingBag } from "@tabler/icons-react";
import { Link } from "react-router-dom";

interface OrderModalProductCardProps {
    item: {
        id: number;
        name: string;
        image_url?: string | null;
        price: number;
        quantity: number;
        subtotal?: number;
    };
}

export default function OrderModalProductCard({ item }: OrderModalProductCardProps) {
    const formatCurrency = (num: number) =>
        num.toLocaleString("es-CR", { style: "currency", currency: "CRC" });

    return (
        <div className="flex items-center justify-between w-full bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 font-quicksand">
            {/* Imagen del producto (linkeada) */}
            <Link
                to={`/product/${item.id}`}
                className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center hover:scale-[1.03] transition-transform duration-300"
            >
                <img
                    src={
                        item.image_url ||
                        "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg"
                    }
                    alt={item.name}
                    className="object-contain w-full h-full"
                />
            </Link>

            {/* Información del producto */}
            <div className="flex flex-col flex-grow px-5 text-gray-800">
                <Link
                    to={`/product/${item.id}`}
                    className="font-semibold text-base line-clamp-2 hover:text-main transition-colors duration-200"
                >
                    {item.name}
                </Link>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <IconShoppingBag size={14} className="text-main" />
                    <span>Cantidad: {item.quantity}</span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                    Precio unitario:{" "}
                    <span className="font-semibold text-main">
                        {formatCurrency(item.price)}
                    </span>
                </p>
            </div>

            {/* Subtotal */}
            <div className="text-right">
                <p className="text-xs text-gray-400">Subtotal</p>
                <p className="text-lg font-bold text-main">
                    {formatCurrency(item.subtotal ?? item.price * item.quantity)}
                </p>
            </div>
        </div>
    );
}
