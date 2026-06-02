import { useEffect, useState } from "react";
import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import StoreProductsList from "../../store/ui/components/StoreProductsList";
import SideBar from "../../../components/layout/SideBar";
import TransactionHistory from "./TransactionHistory";
import AccountInformation from "./AccountInformation";
import { useAuth } from "../../../hooks/context/AuthContext";
import OrderStatusList from "./OrderStatusList";
import { AnimatePresence, motion } from "framer-motion";
import AdminUsersList from "../../admin/ui/components/AdminUsersList";
import AdminBannerList from "../../admin/ui/components/AdminBannerList";
import AdminCouponsList from "../../admin/ui/components/AdminCouponsList";
import OrdersList from "./OrdersList";
import { useNotificationContext } from "../../../hooks/context/NotificationContext";
import { IconMenu2, IconX } from "@tabler/icons-react";
import AdminMailboxList from "../../admin/ui/components/AdminMailboxList";
import StoreOrderList from "../../store/ui/components/StoreOrderList";
import { SkeletonUserPage } from "../../../components/ui/AllSkeletons";
import AdminSupportList from "../../admin/ui/AdminSupportList";
import { Navigate } from "react-router-dom";
import SellerCouponsList from "./components/SellerCouponsList";

export default function UserPage() {
  const [selected, setSelected] = useState("profile");
  const { user, loading } = useAuth();
  const { storeToOpen } = useNotificationContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      setSelected("users");
    } else {
      setSelected("profile");
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "ADMIN" && storeToOpen) {
      setSelected("users");
    }
  }, [storeToOpen, user]);

  // 🌀 Mientras carga la sesión
  if (loading) {
    return (
      <div>
        <NavBar />
        <SkeletonUserPage />
        <Footer />
      </div>
    );
  }

  // 🚀 Si no hay usuario después de cargar
  if (!loading && !user) {
    return <Navigate to="/loginRegister" replace />;
  }

  const currentUser = user!; // 🔒 Garantizado no nulo en este punto

  // 🧩 Si el usuario existe pero tiene rol no permitido
  if (
    currentUser.role !== "SELLER" &&
    currentUser.role !== "CUSTOMER" &&
    currentUser.role !== "ADMIN"
  ) {
    return <Navigate to="/notAuthorized" replace />;
  }

  return (
    <div className="relative">
      <NavBar />

      {/* Mobile header con botón hamburguesa */}
      <div className="sm:hidden flex items-center justify-between px-6 py-4 border-b border-main/10">
        <h2 className="text-lg font-semibold font-quicksand text-main">
          {currentUser.role === "ADMIN" ? "Panel de Administración" : "Mi Cuenta"}
        </h2>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-main"
          aria-label="Abrir menú"
        >
          <IconMenu2 size={26} />
        </button>
      </div>

      <section className="flex flex-col sm:flex-row px-4 sm:px-10 py-6 sm:py-10 mx-auto max-w-[80rem] relative">
        {/* Sidebar fijo en escritorio */}
        <div className="hidden sm:block w-[25%]">
          <SideBar type={currentUser.role} onSelect={setSelected} selected={selected} />
        </div>

        {/* Sidebar móvil animado */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Fondo oscuro clicable */}
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />

              {/* Sidebar deslizante */}
              <motion.aside
                className="fixed top-0 left-0 z-50 h-full w-[80%] max-w-[18rem] bg-white shadow-lg rounded-r-2xl overflow-y-auto"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold font-quicksand text-main">
                    {currentUser.role === "ADMIN"
                      ? "Panel de Administración"
                      : "Mi Cuenta"}
                  </h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-main"
                    aria-label="Cerrar menú"
                  >
                    <IconX size={22} />
                  </button>
                </div>

                <SideBar
                  type={currentUser.role}
                  onSelect={(section) => {
                    setSelected(section);
                    setSidebarOpen(false);
                  }}
                  selected={selected}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Contenido dinámico */}
        <div className="w-full sm:w-[75%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {selected === "profile" && <AccountInformation type={currentUser.role} />}
              {selected === "transactions" && <TransactionHistory />}

              {/* pedidos según rol */}
              {selected === "orders" &&
                (currentUser.role === "SELLER" ? (
                  <StoreOrderList />
                ) : (
                  <OrdersList />
                ))}

              {selected === "products" && currentUser.role === "SELLER" && (
                <StoreProductsList />
              )}
              {selected === "orderStatus" && currentUser.role === "SELLER" && (
                <OrderStatusList />
              )}
              {selected === "coupons" && currentUser.role === "SELLER" && (
                <SellerCouponsList />
              )}
              {selected === "users" && currentUser.role === "ADMIN" && (
                <AdminUsersList />
              )}
              {selected === "coupons" && currentUser.role === "ADMIN" && (
                <AdminCouponsList />
              )}
              {selected === "mailbox" && currentUser.role === "ADMIN" && (
                <AdminMailboxList />
              )}
              {selected === "banners" && currentUser.role === "ADMIN" && (
                <AdminBannerList />
              )}
              {selected === "support" && currentUser.role === "ADMIN" && (
                <AdminSupportList />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
