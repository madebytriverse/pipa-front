import { useEffect, useState } from "react";
import { IconStarFilled } from "@tabler/icons-react";
import { useProducts, type ProductReview } from "../../infrastructure/useProducts";

interface StoreProductReviewListProps {
    productId: number;
}

export default function StoreProductReviewList({ productId }: StoreProductReviewListProps) {
    const { getProductReviews } = useProducts();
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Cargar reseñas
    const load = async () => {
        setLoading(true);
        const data = await getProductReviews(productId);
        setReviews(data);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, [productId]);

    // 🔹 Recargar cuando se emita el evento "reviewAdded"
    useEffect(() => {
        const reload = () => load();
        window.addEventListener("reviewAdded", reload);
        return () => window.removeEventListener("reviewAdded", reload);
    }, []);

    if (loading) {
        return <p className="text-center text-sm text-gray-500">Cargando reseñas...</p>;
    }

    if (reviews.length === 0) {
        return (
            <p className="text-center text-sm text-gray-500 mt-4">
                Aún no hay reseñas para este producto.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4 mt-6">
            {reviews.map((r) => {
                const name =
                    r.user?.first_name
                        ? `${r.user.first_name} ${r.user.last_name ?? ""}`
                        : r.user?.username || "Usuario";

                const firstLetter = name.charAt(0).toUpperCase();

                return (
                    <div key={r.id} className="border-b border-main pb-3">
                        <div className="flex items-center gap-3">
                            {r.user?.image ? (
                                <img
                                    src={r.user.image}
                                    alt={name}
                                    className="w-10 h-10 rounded-full object-contain"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                    {firstLetter}
                                </div>
                            )}

                            <div>
                                <p className="font-semibold text-sm">{name}</p>
                                <div className="flex gap-1">
                                    {Array.from({ length: r.rating }).map((_, i) => (
                                        <IconStarFilled key={i} size={14} className="text-orange-400" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-sm mt-2 text-gray-700">{r.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(r.created_at).toLocaleDateString("es-CR")}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
