import { useEffect, useRef, useState } from "react";
import {
  IconX,
  IconBell,
} from "@tabler/icons-react";
import { useNotifications } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "../../hooks/context/NotificationContext";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  // 👇 agrega estos 3 estados dentro de NotificationDropdown()
  const [marking, setMarking] = useState<Set<number>>(new Set()); // ids en proceso
  const [locallyRead, setLocallyRead] = useState<Set<number>>(new Set()); // ids marcadas OK
  const [markError, setMarkError] = useState<number | null>(null); // id con error último

  const { notifications, loading } = useNotifications();
  const { setStoreToOpen, markNotificationAsRead } = useNotificationContext();
  const handleMarkRead = async (id: number) => {
    setMarkError(null);
    setMarking((prev) => new Set(prev).add(id)); // loading ON
    try {
      await markNotificationAsRead(id); // PATCH backend
      setLocallyRead((prev) => new Set(prev).add(id)); // UI optimista definitiva
    } catch (e) {
      setMarkError(id); // muestra error en ese item
    } finally {
      setMarking((prev) => {
        const next = new Set(prev);
        next.delete(id); // loading OFF
        return next;
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setExpandedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detectar si es móvil
  const isMobile = window.innerWidth < 768;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón campana */}
      <button
        onClick={() => setOpen(!open)}
        className="relative py-2 sm:p-2 rounded-full transition cursor-pointer"
      >
        <IconBell size={22} className="text-white" />
        {notifications.filter((n) => !n.is_read && !locallyRead.has(n.id))
          .length > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-contrast-secondary text-white text-[10px] font-semibold rounded-full shadow-sm flex items-center justify-center h-4 min-w-[1rem] px-1">
            {(() => {
              const count = notifications.filter(
                (n) => !n.is_read && !locallyRead.has(n.id)
              ).length;
              return count > 9 ? "9+" : count;
            })()}
          </span>
        )}
      </button>

      {/* Desktop dropdown */}
      {!isMobile && open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-main/10 shadow-2xl rounded-2xl overflow-hidden z-50 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <h3 className="text-main font-semibold">Notificaciones</h3>
            <button onClick={() => setOpen(false)}>
              <IconX
                size={18}
                className="text-gray-500 hover:text-main transition"
              />
            </button>
          </div>

          {/* Lista */}
          <ul className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-main/40 scrollbar-track-transparent">
            {loading ? (
              <p className="text-center text-gray-400 py-6 text-sm">
                Cargando...
              </p>
            ) : notifications.length > 0 ? (
              [...notifications]
                .sort((a, b) => {
                  const aRead = a.is_read || locallyRead.has(a.id);
                  const bRead = b.is_read || locallyRead.has(b.id);
                  return Number(aRead) - Number(bRead); // no leídas primero
                })
                .map((n) => {
                  const isExpanded = expandedId === n.id;
                  const isRead = n.is_read || locallyRead.has(n.id);
                  const isMarking = marking.has(n.id);

                  return (
                    <li
                      key={n.id}
                      className={`px-4 py-3 border-b border-gray-100 transition-all duration-300 flex flex-col gap-1 ${
                        isExpanded ? "bg-main/5" : "hover:bg-main/5"
                      } ${isRead ? "bg-gray-50 opacity-70" : "bg-white"}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div
                          onClick={() =>
                            setExpandedId(isExpanded ? null : n.id)
                          }
                          className="flex-1 cursor-pointer"
                        >
                          <p
                            className={`text-sm font-medium ${
                              isRead ? "text-gray-500" : "text-gray-800"
                            }`}
                          >
                            {n.title}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(n.created_at).toLocaleString("es-CR")}
                          </span>
                        </div>

                        {/* ✅ Botón marcar como leída (con feedback) */}
                        {!isRead && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            disabled={isMarking}
                            className={`ml-1 px-2 h-7 rounded-full border border-gray-200 flex items-center gap-1 ${
                              isMarking
                                ? "bg-gray-100 cursor-wait"
                                : "hover:bg-gray-100"
                            }`}
                            title="Marcar como leída"
                          >
                            {isMarking ? (
                              // mini spinner
                              <svg
                                className="animate-spin h-4 w-4 text-main"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                              </svg>
                            ) : (
                              // check
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 text-main"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                            <span className="text-xs text-main font-semibold">
                              {isMarking ? "Marcando..." : "Visto"}
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Error inline si falla marcar */}
                      {markError === n.id && (
                        <span className="text-[11px] text-red-600 mt-1">
                          No se pudo marcar como leída. Intenta de nuevo.
                        </span>
                      )}

                      {/* Contenido expandido */}
                      {isExpanded && (
                        <div className="mt-1 p-2 rounded-md bg-gray-50 border border-gray-100 animate-fadeIn">
                          <p className="text-xs text-gray-700">{n.message}</p>

                          {n.priority && (
                            <span
                              className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                n.priority === "HIGH"
                                  ? "bg-red-100 text-red-600"
                                  : n.priority === "NORMAL"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              Prioridad: {n.priority}
                            </span>
                          )}

                          {n.related_type === "store" &&
                            n.data &&
                            n.data.store_id && (
                              <button
                                onClick={async () => {
                                  await handleMarkRead(n.id); // marca leída con feedback
                                  const storeId = n.data!.store_id;
                                  setStoreToOpen(storeId ?? null);
                                  navigate("/profile");
                                  setOpen(false);
                                }}
                                className="mt-3 text-xs text-white bg-main px-3 py-1.5 rounded-full hover:bg-contrast-secondary transition-all duration-200"
                              >
                                Ver tienda
                              </button>
                            )}
                        </div>
                      )}
                    </li>
                  );
                })
            ) : (
              <p className="text-center text-gray-500 py-6 text-sm">
                No hay notificaciones
              </p>
            )}
          </ul>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 animate-fadeIn"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute top-[4.5rem] left-0 right-0 mx-auto w-[92%] bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
              <h3 className="text-main font-semibold">Notificaciones</h3>
              <button onClick={() => setOpen(false)}>
                <IconX
                  size={20}
                  className="text-gray-500 hover:text-main transition"
                />
              </button>
            </div>

            <ul className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-main/40 scrollbar-track-transparent">
              {loading ? (
                <p className="text-center text-gray-400 py-6 text-sm">
                  Cargando...
                </p>
              ) : notifications.length > 0 ? (
                [...notifications]
                  .sort((a, b) => {
                    const aRead = a.is_read || locallyRead.has(a.id);
                    const bRead = b.is_read || locallyRead.has(b.id);
                    return Number(aRead) - Number(bRead);
                  })
                  .map((n) => {
                    const isRead = n.is_read || locallyRead.has(n.id);
                    const isMarking = marking.has(n.id);

                    return (
                      <li
                        key={n.id}
                        className={`px-4 py-3 flex justify-between items-start border-b border-gray-100 transition ${
                          isRead
                            ? "bg-gray-50 opacity-70 text-gray-500"
                            : "hover:bg-main/5 text-gray-800"
                        }`}
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={async () => {
                            if (
                              n.related_type === "store" &&
                              n.data?.store_id
                            ) {
                              await handleMarkRead(n.id);
                              setStoreToOpen(n.data.store_id);
                              navigate("/profile");
                              setOpen(false);
                            }
                          }}
                        >
                          <p className="text-sm font-medium">{n.title}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(n.created_at).toLocaleString("es-CR")}
                          </span>
                        </div>

                        {!isRead && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            disabled={isMarking}
                            className={`ml-2 px-2 h-7 rounded-full border border-gray-200 flex items-center gap-1 ${
                              isMarking
                                ? "bg-gray-100 cursor-wait"
                                : "hover:bg-gray-100"
                            }`}
                            title="Marcar como leída"
                          >
                            {isMarking ? (
                              <svg
                                className="animate-spin h-4 w-4 text-main"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 text-main"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                            <span className="text-xs text-main font-semibold">
                              {isMarking ? "Marcando..." : "Visto"}
                            </span>
                          </button>
                        )}
                      </li>
                    );
                  })
              ) : (
                <p className="text-center text-gray-500 py-6 text-sm">
                  No hay notificaciones
                </p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
