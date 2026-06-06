import Footer from "../../../components/layout/Footer";
import ShoppingForm from "../../../components/forms/ShoppingForm";
import NavBar from "../../../components/layout/NavBar";
import ProductCartCard from "../../cart/ui/ProductCartCard";
import { IconBrandWhatsapp, IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import BannerComponent from "../../../components/data-display/BannerComponent";
import { useBanner } from "../../admin/infrastructure/useBanner";
import { useCart } from "../../../hooks/context/CartContext";
import { SkeletonCartPage } from "../../../components/ui/AllSkeletons";
import { useAuth } from "../../../hooks/context/AuthContext";
import BannerSelectModal from "../../home/ui/BannerSelectModal";
import { useAlert } from "../../../hooks/context/AlertContext";

type AnyBanner = {
  id?: number;
  title?: string;
  subtitle?: string;
  character?: string | File;
  image: string | File;
  link?: string;
  btn_text?: string;
  btn_color?: "MORADO" | "AMARILLO" | "NARANJA" | "GRADIENTE";
  type: "LARGE" | "SHORT" | "SLIDER";
  orientation?: "LEFT" | "RIGHT" | "RIGTH";
  position?: number;
  is_active?: boolean;
};

export default function CartPage() {
  const { cart,  refreshCart, clearCart } = useCart();
  const {
    banners,
    fetchBanners,
    fetchPageBanners,
    savePageBanner,
    loading: loadingBanners,
  } = useBanner();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [clearing, setClearing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // 👈 Nuevo estado

  // 🔹 Banners seleccionados (solo 2)
  const [bannerSlot1, setBannerSlot1] = useState<AnyBanner | null>(null);
  const [bannerSlot2, setBannerSlot2] = useState<AnyBanner | null>(null);

  // 🔹 Modal de selección
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSide, setEditingSide] = useState<"LEFT" | "RIGHT" | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      await refreshCart();
      setIsInitialLoading(false); // ✅ Solo al terminar la primera carga
    };
    loadCart();
  }, []);

  /** 🔹 Cargar banners asignados a esta página (desde page_banners) */
  useEffect(() => {
    const loadPageBanners = async () => {
      const pageBanners = await fetchPageBanners("cartpage");

      if (pageBanners.length > 0) {
        const slot1 = pageBanners.find((pb) => pb.slot_number === 1)?.banner;
        const slot2 = pageBanners.find((pb) => pb.slot_number === 2)?.banner;
        if (slot1) setBannerSlot1(slot1);
        if (slot2) setBannerSlot2(slot2);
      } else {
        // fallback si no hay registros aún
        const shortActivos = banners.filter(
          (b: AnyBanner) => b.is_active && b.type === "SHORT"
        );
        setBannerSlot1(shortActivos[0] || null);
        setBannerSlot2(shortActivos[1] || null);
      }
    };

    if (banners.length > 0) loadPageBanners();
  }, [banners]);

  // 🔹 Abrir modal de selección
  const handleOpenModal = (side: "LEFT" | "RIGHT") => {
    setEditingSide(side);
    setModalOpen(true);
  };

  // 🔹 Asignar y guardar banner seleccionado
  const handleSelectBanner = async (selectedBanner: AnyBanner) => {
    if (!selectedBanner.id) return;

    try {
      if (editingSide === "LEFT") {
        setBannerSlot1(selectedBanner);
        await savePageBanner("cartpage", 1, selectedBanner.id);
      }
      if (editingSide === "RIGHT") {
        setBannerSlot2(selectedBanner);
        await savePageBanner("cartpage", 2, selectedBanner.id);
      }
    } catch (err) {
      console.error("Error al guardar page banner:", err);
    } finally {
      setModalOpen(false);
    }
  };

  const handleClearCart = async () => {
    const confirmed = await showAlert({
      type: "warning",
      title: "Vaciar carrito",
      message:
        "¿Estás seguro de que deseas vaciar tu carrito? Esta acción no se puede deshacer.",
      confirmText: "Vaciar",
      cancelText: "Cancelar",
    });

    if (!confirmed) return;

    try {
      setClearing(true);
      await clearCart();
      await refreshCart();

      await showAlert({
        type: "success",
        title: "Carrito vaciado",
        message: "Tu carrito se ha vaciado correctamente.",
        confirmText: "Aceptar",
      });
    } catch (err) {
      console.error("Error al vaciar el carrito:", err);
      await showAlert({
        type: "error",
        title: "Error",
        message: "Ocurrió un problema al vaciar el carrito. Inténtalo nuevamente.",
        confirmText: "Aceptar",
      });
    } finally {
      setClearing(false);
    }
  };

  // 🔧 Helper: convertir File|string → URL
  const asUrl = (v?: string | File) =>
    v ? (typeof v === "string" ? v : URL.createObjectURL(v)) : undefined;

  // 🔧 Normalizar orientación (RIGHT → RIGTH)
  const normalizeOrientation = (o?: AnyBanner["orientation"]) =>
    o === "RIGHT" ? "RIGTH" : o;

  // ✅ Mostrar skeleton solo en la primera carga
  if (isInitialLoading || loadingBanners)
    return (
      <div>
        <NavBar />
        <SkeletonCartPage />
        <Footer />
      </div>
    );

  const hasItems = cart && cart.items && cart.items.length > 0;

  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-[80rem] px-4 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-10">
          <h1 className="text-xl sm:text-3xl font-quicksand font-bold border-b-4 border-main pb-2 w-fit">
            Mi Carrito
          </h1>
        </div>

        {/* 🛍️ Contenido principal */}
        <section className="mx-4 sm:mx-10 flex flex-col sm:flex-row">
          {/* Lista de productos */}
          <div className="my-5 w-full sm:w-2/3 sm:border-r-2 sm:pr-5 border-main flex flex-col">
            {hasItems && (
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleClearCart}
                  disabled={clearing}
                  className={`mb-4 px-6 py-2 rounded-full border-2 border-[#ff7e47] text-[#ff7e47] font-medium flex items-center justify-center gap-2 transition-all duration-200
      ${
        clearing
          ? "opacity-60 cursor-not-allowed"
          : "hover:bg-[#ff7e47] hover:text-white"
      }`}
                >
                  {clearing ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-[#ff7e47]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <span>Vaciando...</span>
                    </>
                  ) : (
                    "Vaciar"
                  )}
                </button>
              </div>
            )}

            {hasItems ? (
              cart.items.map((item) => <ProductCartCard key={item.id} item={item} />)
            ) : (
              <p className="text-center font-semibold text-main text-lg py-10">
                Tu carrito está vacío
              </p>
            )}

            <section className="flex flex-col items-center justify-center text-center py-10 font-quicksand">
              <h2 className="text-base sm:text-lg font-semibold mb-2">
                ¿Necesitas ayuda?
              </h2>
              <p className="text-sm text-gray-700 px-3 sm:px-0">
                Contáctanos de Lunes a Viernes de 8am a 6pm.
                <br />
                Sábado de 8am a 3pm.
              </p>
              <div className="flex gap-4 mt-6">
                <a
                  href="https://wa.me/50687355629"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2 border border-[#ff7e47] rounded-full text-[#ff7e47] hover:bg-[#ff7e47] hover:text-white transition-all duration-300"
                >
                  <IconBrandWhatsapp size={20} />
                  WhatsApp
                </a>
              </div>
            </section>
          </div>

          {/* 🧾 Formulario de compra (autenticado o invitado) */}
          <div className="my-5 sm:my-10 sm:pl-10 w-full sm:w-1/3">
            <ShoppingForm />
          </div>
        </section>

        {/* 🔹 BANNERS DESDE BD (persistentes) */}
        <section className="mx-4 sm:mx-10 sm:my-10 my-6">
          {loadingBanners ? (
            <p className="text-gray-500 text-center">Cargando banners...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 justify-center items-end">
              {/* 🟣 Banner 1 */}
              <div className="flex flex-col items-center">
                {user?.role === "ADMIN" && (
                  <button
                    onClick={() => handleOpenModal("LEFT")}
                    className="cursor-pointer font-quicksand flex items-center gap-1 text-sm border-contrast-secondary border-2 rounded-full px-3 py-1 text-contrast-secondary font-semibold mb-2 hover:bg-contrast-secondary hover:text-white hover:scale-105 transition-all duration-300"
                  >
                    <IconEdit size={16} /> Editar banner
                  </button>
                )}
                {bannerSlot1 ? (
                  <BannerComponent
                    {...bannerSlot1}
                    orientation={normalizeOrientation(bannerSlot1.orientation)}
                    image={asUrl(bannerSlot1.image)!}
                    character={asUrl(bannerSlot1.character)}
                  />
                ) : (
                  <div className="text-gray-500 text-sm">
                    Sin banner seleccionado
                  </div>
                )}
              </div>

              {/* 🟣 Banner 2 */}
              <div className="flex flex-col items-center">
                {user?.role === "ADMIN" && (
                  <button
                    onClick={() => handleOpenModal("RIGHT")}
                    className="cursor-pointer font-quicksand flex items-center gap-1 text-sm border-contrast-secondary border-2 rounded-full px-3 py-1 text-contrast-secondary font-semibold mb-2 hover:bg-contrast-secondary hover:text-white hover:scale-105 transition-all duration-300"
                  >
                    <IconEdit size={16} /> Editar banner
                  </button>
                )}
                {bannerSlot2 ? (
                  <BannerComponent
                    {...bannerSlot2}
                    orientation={normalizeOrientation(bannerSlot2.orientation)}
                    image={asUrl(bannerSlot2.image)!}
                    character={asUrl(bannerSlot2.character)}
                  />
                ) : (
                  <div className="text-gray-500 text-sm">
                    Sin banner seleccionado
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* 🔹 Modal solo visible para ADMIN */}
      {modalOpen && user?.role === "ADMIN" && (
        <BannerSelectModal
          banners={banners}
          onSelect={handleSelectBanner}
          onClose={() => setModalOpen(false)}
          loading={loadingBanners}
        />
      )}

      <Footer />
    </div>
  );
}
