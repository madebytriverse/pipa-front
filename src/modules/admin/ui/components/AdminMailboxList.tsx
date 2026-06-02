import MailboxCard from "./AdminMailboxCard";
import { useNotifications } from "../../../../hooks/useNotifications";
import { useNotificationContext } from "../../../../hooks/context/NotificationContext";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../components/ui/pagination";
import { useEffect, useState, useMemo } from "react";

export default function AdminMailboxList() {
  const { notifications, loading } = useNotifications();
  const { setStoreToOpen } = useNotificationContext();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 🔹 Formateo de notificaciones
  const formattedNotifications = useMemo(
    () =>
      notifications.map((n) => {
        const type: "STORE_PENDING_VERIFICATION" | "CONTACT_MESSAGE" =
          n.type === "STORE_PENDING_VERIFICATION" || n.related_type === "store"
            ? "STORE_PENDING_VERIFICATION"
            : "CONTACT_MESSAGE";

        return {
          id: n.id,
          type,
          title: n.title,
          message: n.message,
          created_at: n.created_at,
          is_read: n.is_read,
          data: {
            store_id: n.data?.store_id ?? n.related_id ?? null,
            name: n.data?.name,
            subject: n.data?.subject,
            email: n.data?.email,
            message: n.data?.message,
            contact_id:
              n?.data?.contact_id ??
              (n.related_type === "contact_message" ? n.related_id : null),
          },
        };
      }),
    [notifications]
  );

  // 🔹 Paginación
  const totalPages = Math.ceil(formattedNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = formattedNotifications
    .sort((a, b) => Number(a.is_read) - Number(b.is_read)) // No leídas primero
    .slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 🔹 Reiniciar página al recargar datos
  useEffect(() => {
    setCurrentPage(1);
  }, [notifications]);

  return (
    <section className="pl-2 sm:pl-4 font-quicksand">
      {/* 🔹 Encabezado */}
      <div className="pl-0 sm:pl-5">
        <div className="pb-6 sm:pb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h1 className="text-lg sm:text-2xl border-b-3 border-main w-fit">
            Buzón de administración
          </h1>

          <p className="text-sm text-gray-600">
            {formattedNotifications.filter((n) => !n.is_read).length} sin leer
          </p>
        </div>
      </div>

      {/* 🔹 Lista de notificaciones */}
      <div className="flex flex-col gap-4 sm:gap-6">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-6">Cargando...</p>
        ) : formattedNotifications.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">
            No hay notificaciones por el momento.
          </p>
        ) : (
          paginatedNotifications.map((n) => (
            <MailboxCard
              key={n.id}
              {...n}
              onViewStore={() => {
                if (n.data?.store_id) {
                  setStoreToOpen(n.data.store_id);
                  navigate("/profile");
                  window.scrollTo(0, 0);
                }
              }}
            />
          ))
        )}
      </div>

      {/* 📄 Paginación */}
      {!loading && totalPages > 1 && (
        <Pagination className="mt-8 sm:mt-10">
          <PaginationContent className="flex items-center justify-center gap-1 font-quicksand">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={`${
                  currentPage === 1
                    ? "opacity-50 pointer-events-none bg-gray-200 text-gray-500"
                    : "hover:bg-main-dark/10 hover:text-main-dark"
                } rounded-full px-3 py-2 transition-all duration-300`}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={isActive}
                    className={`rounded-full w-9 h-9 flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-contrast-secondary text-white shadow-md scale-105"
                        : "bg-main-dark/10 text-main-dark hover:bg-main-dark/20"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={`${
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none bg-gray-200 text-gray-500"
                    : "hover:bg-main-dark/10 hover:text-main-dark"
                } rounded-full px-3 py-2 transition-all duration-300`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}
