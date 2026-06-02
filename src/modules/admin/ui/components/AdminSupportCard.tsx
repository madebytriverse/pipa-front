import {
    IconAlertCircle,
    IconSend,
    IconUser,
    IconCheck,
    IconPhoto,
    IconMessageCircle,
    IconEdit,
    IconX,
    IconHash,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import AlertComponent from "../../../../components/data-display/AlertComponent";

interface AdminSupportCardProps {
    id: number;
    report_number: string;
    name: string;
    email: string;
    order_number?: string;
    subject: string;
    description: string;
    images?: string[];
    created_at: string;
    status: "PENDING" | "IN_REVIEW" | "RESOLVED" | "REJECTED";
    admin_notes?: string;
    read?: boolean;
    onUpdateReport: (update: {
        id: number;
        status?: string;
        admin_notes?: string;
        read?: boolean;
    }) => void;
}

export default function AdminSupportCard({
    id,
    report_number,
    name,
    email,
    order_number,
    subject,
    description,
    images = [],
    created_at,
    status,
    admin_notes = "",
    read = false,
    onUpdateReport,
}: AdminSupportCardProps) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [notes, setNotes] = useState(admin_notes);
    const [editingNotes, setEditingNotes] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{ title: string; message: string } | null>(null);

    const isResolved = status === "RESOLVED";

    useEffect(() => {
        if (!read) onUpdateReport({ id, read: true });
    }, []);

    const openAlert = (title: string, message: string) => {
        setAlertConfig({ title, message });
        setAlertVisible(true);
    };
    const closeAlert = () => setAlertVisible(false);

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            openAlert("Mensaje vacío", "Por favor escribe una respuesta antes de enviar.");
            return;
        }
        setSending(true);
        await new Promise((res) => setTimeout(res, 1000));
        openAlert("Respuesta enviada", `Tu mensaje fue enviado a ${email}.`);
        setSending(false);
        setReplyText("");
        setReplyOpen(false);
        onUpdateReport({ id, status: "IN_REVIEW" });
    };

    const handleStatusChange = (newStatus: "PENDING" | "IN_REVIEW" | "RESOLVED" | "REJECTED") =>
        onUpdateReport({ id, status: newStatus });

    const handleSaveNotes = () => {
        onUpdateReport({ id, admin_notes: notes });
        setEditingNotes(false);
    };

    return (
        <>
            <div
                className={`w-full rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 p-5 font-quicksand ${isResolved
                        ? "bg-gray-100 text-gray-500 opacity-85"
                        : "bg-white text-gray-700 hover:shadow-md"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <IconAlertCircle
                            className={`${status === "PENDING"
                                    ? "text-red-500"
                                    : status === "IN_REVIEW"
                                        ? "text-yellow-500"
                                        : status === "RESOLVED"
                                            ? "text-green-500"
                                            : "text-gray-400"
                                }`}
                            size={22}
                        />
                        <div className="flex flex-wrap items-center gap-2">
                            <h3
                                className={`font-semibold ${isResolved ? "text-gray-500 line-through" : "text-main"
                                    }`}
                            >
                                {subject}
                            </h3>
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                <IconHash size={13} /> {report_number}
                            </span>
                        </div>
                    </div>

                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value as any)}
                        className={`text-xs font-semibold rounded-full border px-3 py-1 focus:outline-none transition ${status === "PENDING"
                                ? "border-red-300 bg-red-50 text-red-600"
                                : status === "IN_REVIEW"
                                    ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                                    : status === "RESOLVED"
                                        ? "border-green-300 bg-green-50 text-green-700"
                                        : "border-gray-300 bg-gray-50 text-gray-600"
                            }`}
                    >
                        <option value="PENDING">Pendiente</option>
                        <option value="IN_REVIEW">En revisión</option>
                        <option value="RESOLVED">Resuelto</option>
                        <option value="REJECTED">Rechazado</option>
                    </select>
                </div>

                <p className="text-xs text-gray-500 mb-1">
                    {new Date(created_at).toLocaleString("es-CR")}
                </p>

                {/* Contenido principal */}
                <div className="text-sm leading-relaxed">
                    <div className="flex items-center gap-2 mb-1 font-semibold text-main">
                        <IconUser size={16} /> {name}
                    </div>
                    <p className="text-xs">
                        <strong>Email:</strong> {email}
                    </p>
                    {order_number && (
                        <p className="text-xs">
                            <strong>Orden:</strong> {order_number}
                        </p>
                    )}

                    <p className={`mt-3 ${isResolved ? "text-gray-500" : ""}`}>{description}</p>

                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-3">
                            {images.map((src, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={src}
                                        alt={`Evidencia ${i + 1}`}
                                        className={`w-24 h-24 object-cover rounded-lg border ${isResolved ? "border-gray-300 opacity-70" : "border-gray-300"
                                            }`}
                                    />
                                    {!isResolved && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex justify-center items-center rounded-lg">
                                            <IconPhoto size={18} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 🔹 Notas internas */}
                    <div className="mt-4 border-t border-gray-200 pt-3">
                        <p className="font-semibold text-sm text-main mb-1">Notas internas:</p>
                        {!editingNotes ? (
                            <div
                                className={`flex items-center justify-between ${isResolved ? "bg-gray-100" : "bg-gray-50"
                                    } p-2 rounded-xl`}
                            >
                                <p className="text-xs whitespace-pre-wrap">
                                    {notes || "Sin notas registradas"}
                                </p>
                                {!isResolved && (
                                    <button
                                        onClick={() => setEditingNotes(true)}
                                        className="text-gray-500 hover:text-main transition"
                                    >
                                        <IconEdit size={16} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-main/40"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveNotes}
                                        className="flex items-center gap-1 bg-main text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-contrast-secondary transition"
                                    >
                                        <IconCheck size={14} /> Guardar
                                    </button>
                                    <button
                                        onClick={() => setEditingNotes(false)}
                                        className="flex items-center gap-1 bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-300 transition"
                                    >
                                        <IconX size={14} /> Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    {!replyOpen && !isResolved ? (
                        <div className="flex flex-wrap gap-3 mt-5">
                            <button
                                onClick={() => setReplyOpen(true)}
                                className="flex items-center gap-2 bg-main text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-contrast-secondary transition-all"
                            >
                                <IconMessageCircle size={14} /> Responder
                            </button>
                        </div>
                    ) : (
                        !isResolved && (
                            <div className="mt-4 flex flex-col gap-3">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Escribe tu respuesta aquí..."
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-main/40 resize-none"
                                />
                                <p className="text-[11px] text-gray-500">
                                    ✉️ La respuesta será enviada a <strong>{email}</strong>
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSendReply}
                                        disabled={sending}
                                        className={`flex items-center gap-2 bg-main text-white text-xs font-semibold px-4 py-2 rounded-full transition-all ${sending ? "opacity-70 cursor-not-allowed" : "hover:bg-contrast-secondary"
                                            }`}
                                    >
                                        <IconSend size={14} />
                                        {sending ? "Enviando..." : "Enviar"}
                                    </button>
                                    <button
                                        onClick={() => setReplyOpen(false)}
                                        disabled={sending}
                                        className="flex items-center gap-2 bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-300 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Alerta */}
            <AlertComponent
                show={alertVisible}
                title={alertConfig?.title}
                message={alertConfig?.message}
                confirmText="Aceptar"
                onConfirm={closeAlert}
            />
        </>
    );
}
