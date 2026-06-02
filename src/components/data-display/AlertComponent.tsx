import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "@tabler/icons-react";

interface AlertComponentProps {
    show: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    type?: "info" | "success" | "warning" | "error";
}

export default function AlertComponent({
    show,
    title = "¿Estás seguro?",
    message = "Esta acción no se puede deshacer.",
    confirmText = "Aceptar",
    cancelText, // ← ya no tiene valor por defecto
    onConfirm,
    onCancel,
}: AlertComponentProps) {
    if (!show) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/10 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <motion.div
                        className="w-[90%] max-w-md rounded-2xl border border-taupe/30 bg-chocolate/90 backdrop-blur-lg shadow-2xl p-6 text-white font-quicksand relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {/* Botón cerrar solo si hay cancelText */}
                        {cancelText && (
                            <button
                                onClick={onCancel}
                                className="absolute top-3 right-3 text-white/70 hover:text-white transition"
                            >
                                <IconX />
                            </button>
                        )}

                        {/* Encabezado */}
                        <div className="flex items-center gap-3 mb-3">
                            <h2 className="text-lg font-semibold">{title}</h2>
                        </div>

                        {/* Mensaje */}
                        <p className="text-sm text-white/80 mb-6">{message}</p>

                        {/* Botones */}
                        <div className="flex justify-end gap-3">
                            {cancelText && (
                                <button
                                    onClick={onCancel}
                                    className="px-4 py-2 rounded-lg bg-white/20 text-white/90 hover:bg-white/30 transition backdrop-blur-md"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 rounded-lg bg-contrast-secondary text-white hover:bg-contrast-secondary/80 transition backdrop-blur-md"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
