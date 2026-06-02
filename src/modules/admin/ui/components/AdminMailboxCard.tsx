import {
  IconMail,
  IconAlertCircle,
  IconUser,
  IconChevronRight,
  IconSend,
  IconMessageCircle,
  IconCheck,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNotificationContext } from "../../../../hooks/context/NotificationContext";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../../../components/data-display/AlertComponent";
import { useNotifications } from "../../../../hooks/useNotifications";
import axios from "axios";

interface AdminMailboxCardProps {
  id: number;
  type: "STORE_PENDING_VERIFICATION" | "CONTACT_MESSAGE";
  title: string;
  message: string;
  created_at: string;
  data?: {
    store_id?: number | null;
    name?: string;
    subject?: string;
    email?: string;
    message?: string;
    contact_id?: number;
  };
  is_read?: boolean;
  onViewStore?: () => void;
}

export default function AdminMailboxCard({
  id,
  type,
  title,
  message,
  created_at,
  data,
  is_read = false,
  onViewStore,
}: AdminMailboxCardProps) {
  const { setStoreToOpen } = useNotificationContext();
  const navigate = useNavigate();
  const { markAsRead } = useNotifications();

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [reviewed, setReviewed] = useState(is_read);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const openAlert = (title: string, message: string, onConfirm: () => void) => {
    setAlertConfig({ title, message, onConfirm });
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
    setAlertConfig(null);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      openAlert(
        "Mensaje vacío",
        "Por favor escribe una respuesta antes de enviar.",
        closeAlert
      );
      return;
    }

    const token = localStorage.getItem("access_token");
    const contactId = data?.contact_id; // <-- Debe ser el ID del mensaje de contacto, NO el ID de la notificación

    if (!contactId) {
      openAlert(
        "Falta el ID del contacto",
        "No se encontró el identificador del mensaje de contacto para responder.",
        closeAlert
      );
      return;
    }

    setSending(true);
    try {
      // 1) Enviar respuesta
      await axios.post(
        `${import.meta.env.VITE_API_URL}/contact-messages/${contactId}/reply`,
        { reply_message: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2) Marcar notificación como leída en el BACKEND
      await markAsRead(id);

      openAlert(
        "Respuesta enviada",
        `La respuesta fue enviada correctamente a ${
          data?.email || "el remitente"
        }.`,
        () => {
          closeAlert();
          setReplyText("");
          setReplyOpen(false);
          setReviewed(true); // feedback inmediato en UI
        }
      );
    } catch (err) {
      console.error("Error al enviar respuesta:", err);
      openAlert("Error", "No se pudo enviar la respuesta.", closeAlert);
    } finally {
      setSending(false);
    }
  };

  const handleMarkReviewed = () => {
    openAlert(
      "Confirmar acción",
      "¿Marcar esta notificación como revisada?",
      async () => {
        try {
          await markAsRead(id);
          setReviewed(true);
        } catch (err) {
          console.error("Error al marcar notificación como leída:", err);
        } finally {
          closeAlert();
        }
      }
    );
  };

  return (
    <>
      <div
        key={id}
        className={`w-full bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 p-5 font-quicksand ${
          reviewed ? "opacity-80" : "hover:shadow-md"
        }`}
      >
        {/* 🔹 Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {type === "STORE_PENDING_VERIFICATION" ? (
              <IconAlertCircle className="text-red-500" size={24} />
            ) : (
              <IconMail className="text-main" size={22} />
            )}
            <h3
              className={`font-semibold ${
                reviewed ? "text-gray-500 line-through" : "text-main"
              }`}
            >
              {title}
            </h3>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(created_at).toLocaleString("es-CR")}
          </span>
        </div>

        {/* 🔹 Contenido principal */}
        <div className="mt-3 text-gray-700 text-sm leading-relaxed">
          {/* 🏪 Solicitud de verificación de tienda */}
          {type === "STORE_PENDING_VERIFICATION" && (
            <>
              <p>{message}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => {
                    if (onViewStore) return onViewStore();
                    if (data?.store_id) {
                      setStoreToOpen(data.store_id);
                      navigate("/profile");
                      window.scrollTo(0, 0);
                    }
                  }}
                  disabled={reviewed}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                    reviewed
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-main text-white hover:bg-contrast-secondary"
                  }`}
                >
                  Ver tienda <IconChevronRight size={14} />
                </button>

                {!reviewed && (
                  <button
                    onClick={handleMarkReviewed}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-300 transition-all"
                  >
                    <IconCheck size={14} /> Marcar revisado
                  </button>
                )}

                {reviewed && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                    <IconCheck size={14} /> Revisado
                  </span>
                )}
              </div>
            </>
          )}

          {/* ✉️ Mensajes de contacto */}
          {type === "CONTACT_MESSAGE" && (
            <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-main font-semibold text-sm">
                <IconUser size={16} /> {data?.name ?? "Anónimo"}
              </div>

              <p className="text-xs text-gray-500">
                <strong>Asunto:</strong> {data?.subject ?? "Sin asunto"}
              </p>
              <p className="text-xs text-gray-500">
                <strong>Email:</strong> {data?.email ?? "No disponible"}
              </p>
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                {data?.message ?? "Mensaje vacío"}
              </p>

              {!replyOpen ? (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {!reviewed && (
                    <>
                      <button
                        onClick={() => setReplyOpen(true)}
                        className="flex items-center gap-2 bg-main text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-contrast-secondary transition-all"
                      >
                        <IconMessageCircle size={14} />
                        Responder
                      </button>
                      <button
                        onClick={handleMarkReviewed}
                        className="flex items-center gap-2 bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-300 transition-all"
                      >
                        <IconCheck size={14} /> Marcar revisado
                      </button>
                    </>
                  )}

                  {reviewed && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <IconCheck size={14} /> Revisado
                    </span>
                  )}
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-main/40 resize-none"
                  />
                  <p className="text-[11px] text-gray-500">
                    ✉️ La respuesta será enviada a{" "}
                    <strong>{data?.email ?? "el remitente"}</strong>
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSendReply}
                      disabled={sending}
                      className={`flex items-center gap-2 bg-main text-white text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                        sending
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:bg-contrast-secondary"
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Alerta general */}
      <AlertComponent
        show={alertVisible}
        title={alertConfig?.title}
        message={alertConfig?.message}
        confirmText="Aceptar"
        onConfirm={() => {
          alertConfig?.onConfirm?.();
          closeAlert();
        }}
        onCancel={closeAlert}
      />
    </>
  );
}
