import { useState } from "react";
import { IconX } from "@tabler/icons-react";
import BannerComponent from "../../../components/data-display/BannerComponent";

interface BannerSelectModalProps {
    banners: any[];
    onSelect: (banner: any) => void;
    onClose: () => void;
    loading?: boolean;
}

export default function BannerSelectModal({
    banners,
    onSelect,
    onClose,
    loading,
}: BannerSelectModalProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // ✅ Mostrar solo banners tipo SHORT activos
    const shortBanners = banners.filter((b) => b.type === "SHORT" && b.is_active);

    // 🔹 Cierra el modal si se hace clic fuera del contenido
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="relative bg-white rounded-3xl shadow-2xl w-[90%] sm:w-[75%] md:w-[65%] max-h-[80vh] overflow-y-auto p-8 sm:p-10 font-quicksand">
                {/* ❌ Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-main transition-all duration-200"
                >
                    <IconX size={26} />
                </button>

                {/* 🌟 Título */}
                <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-main mb-8">
                    Elige un <span className="text-contrast-secondary">Banner Short</span>
                </h2>

                {loading ? (
                    <p className="text-gray-500 text-center py-10">
                        Cargando banners...
                    </p>
                ) : shortBanners.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {shortBanners.map((banner) => (
                            <div
                                key={banner.id}
                                onClick={() => {
                                    setSelectedId(banner.id);
                                    onSelect(banner);
                                }}
                                className={`cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${selectedId === banner.id
                                        ? "border-main scale-[1.02] shadow-lg"
                                        : "border-transparent hover:border-main/40 hover:shadow-md"
                                    }`}
                            >
                                <BannerComponent
                                    {...banner}
                                    image={
                                        typeof banner.image === "string"
                                            ? banner.image
                                            : URL.createObjectURL(banner.image)
                                    }
                                    character={
                                        banner.character
                                            ? typeof banner.character === "string"
                                                ? banner.character
                                                : URL.createObjectURL(banner.character)
                                            : undefined
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-10">
                        No hay banners de tipo SHORT disponibles
                    </p>
                )}
            </div>
        </div>
    );
}
