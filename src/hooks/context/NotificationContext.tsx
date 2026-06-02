import { createContext, useContext, useState } from "react";
import axios from "axios";

interface NotificationContextType {
  storeToOpen: number | null;
  setStoreToOpen: (id: number | null) => void;
  clearStoreToOpen: () => void;
  markNotificationAsRead: (id: number) => Promise<void>; // ✅ nueva función
}

const NotificationContext = createContext<NotificationContextType>({
  storeToOpen: null,
  setStoreToOpen: () => {},
  clearStoreToOpen: () => {},
  markNotificationAsRead: async () => {}, // por defecto
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [storeToOpen, setStoreToOpen] = useState<number | null>(null);

  // ✅ limpiar tienda activa
  const clearStoreToOpen = () => setStoreToOpen(null);

  // ✅ marcar notificación como leída
  const markNotificationAsRead = async (id: number) => {
    try {
      await axios.patch(`/notifications/${id}/read`);
      console.log(`📩 Notificación ${id} marcada como leída`);
    } catch (error) {
      console.error("❌ Error al marcar notificación como leída:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        storeToOpen,
        setStoreToOpen,
        clearStoreToOpen,
        markNotificationAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
