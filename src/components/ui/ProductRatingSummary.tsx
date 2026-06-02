import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/context/AuthContext";
import { SkeletonRatingSummary } from "./AllSkeletons";
import { useAlert } from "../../hooks/context/AlertContext";
import { useNavigate } from "react-router-dom";
import { useProducts, type ProductReviewSummary } from "../../modules/store/infrastructure/useProducts";

interface ProductRatingSummaryProps {
    productId: number;
    barColor?: string;
}

export default function ProductRatingSummary({
    productId,
    barColor = "#ff7e47",
}: ProductRatingSummaryProps) {
    const { user, token } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const { getProductReviewSummary, createProductReview } = useProducts();

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<ProductReviewSummary>({
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    });

    const [mode, setMode] = useState<"view" | "write">("view");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");

    // 🔹 Cargar resumen de calificaciones
    const loadSummary = async () => {
        setLoading(true);
        const summaryData = await getProductReviewSummary(productId);
        setSummary(summaryData);
        setLoading(false);
    };

    useEffect(() => {
        loadSummary();
    }, [productId]);

    // 🔹 Guardar reseña real en el backend
    const handleSave = async () => {
        if (!user || !token) {
            showAlert({
                title: "Inicia sesión",
                message: "Debes iniciar sesión para dejar una reseña",
                confirmText: "Ir al login",
                cancelText: "Cancelar",
                onConfirm: () => {
                    navigate("/loginRegister");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                },
            });
            return;
        }

        if (rating === 0 || !comment.trim()) {
            showAlert({
                title: "Campos incompletos",
                message: "Por favor selecciona una calificación y escribe un comentario.",
                confirmText: "Ok",
                type: "warning",
            });
            return;
        }

        const success = await createProductReview(productId, { rating, comment });

        if (success) {
            showAlert({
                title: "Reseña enviada",
                message: "Tu calificación ha sido registrada correctamente.",
                type: "success",
            });

            // 🔹 Dispara evento global para actualizar lista de reseñas
            window.dispatchEvent(new CustomEvent("reviewAdded", { detail: { productId } }));

            // Reiniciar campos y refrescar resumen
            setRating(0);
            setHover(0);
            setComment("");
            setMode("view");
            await loadSummary();
        }
    };

    const displayRating = hover > 0 ? hover : rating;

    // 🔹 Subcomponente de estrellas reutilizable
    const StarGroup = ({
        interactive = false,
        size = 20,
        value,
    }: {
        interactive?: boolean;
        size?: number;
        value?: number;
    }) => {
        const activeValue = value ?? displayRating;
        return (
            <div className="flex gap-1 justify-center">
                {Array.from({ length: 5 }).map((_, i) => {
                    const index = i + 1;
                    const fillPercent = Math.max(0, Math.min(1, activeValue - (index - 1)));
                    const widthPct = `${fillPercent * 100}%`;

                    return (
                        <div
                            key={i}
                            className={`relative ${interactive ? "cursor-pointer" : "cursor-default"}`}
                            onClick={() => interactive && setRating(index)}
                            onMouseEnter={() => interactive && setHover(index)}
                            onMouseLeave={() => interactive && setHover(0)}
                        >
                            <IconStar size={size} className="text-gray-300" />
                            <div
                                className="absolute left-0 top-0 overflow-hidden"
                                style={{ width: widthPct, height: size }}
                            >
                                <IconStarFilled size={size} className="text-orange-400" />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) return <SkeletonRatingSummary show />;

    return (
        <div className="p-4 w-full font-quicksand transition-all duration-300 flex flex-col items-center">
            {mode === "view" ? (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col items-center w-full">
                            <h2 className="text-5xl font-bold mb-1">
                                {summary.average.toFixed(1)}
                            </h2>
                            <StarGroup size={20} value={summary.average} />
                            <p className="text-sm text-gray-500 mt-1 w-full text-center">
                                {summary.total} opiniones
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setMode("write")}
                        className="w-full py-3 text-white font-semibold rounded-full transition duration-200"
                        style={{ backgroundColor: barColor }}
                    >
                        Escribir opinión
                    </button>
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center transition-all duration-300">
                        <h2 className="text-5xl font-bold mb-3">{displayRating.toFixed(1)}</h2>
                        <StarGroup interactive size={24} />
                        <p className="text-sm text-gray-500 mt-1">Tu calificación</p>
                    </div>

                    <div className="mt-4 border border-main/40 rounded-lg p-3 bg-white shadow-sm w-full">
                        <label className="block mb-2 text-sm font-semibold">Comentario</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border rounded p-2 h-20 text-base resize-none"
                            placeholder="Escribe tu opinión sobre el producto aquí..."
                        />

                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => setMode("view")}
                                className="px-4 py-2 rounded-full bg-gray-200 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-full text-white text-sm"
                                style={{ backgroundColor: barColor }}
                            >
                                Guardar Reseña
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
