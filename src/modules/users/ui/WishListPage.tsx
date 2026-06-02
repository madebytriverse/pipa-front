import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import ProductWishlistCard from "../../../components/data-display/ProductWishlistCard";
import ShareComponent from "../../../components/data-display/ShareComponent";
import { useWishlist } from "../infrastructure/useWishList";
import { SkeletonWishlistPage } from "../../../components/ui/AllSkeletons";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useBanner } from "../../admin/infrastructure/useBanner";
import BannerComponent from "../../../components/data-display/BannerComponent";
import BannerSelectModal from "../../home/ui/BannerSelectModal";
import { IconEdit } from "@tabler/icons-react";

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

export default function WishListPage() {
  const { slug } = useParams();
  const {
    wishlist,
    fetchWishlist,
    getPublicWishlist,
    removeFromWishlist,
    toggleVisibility,
    loading,
  } = useWishlist();

  const { user } = useAuth();
  const {
    banners,
    fetchBanners,
    fetchPageBanners,
    savePageBanner,
    loading: loadingBanners,
  } = useBanner();

  const [bannerSlot1, setBannerSlot1] = useState<AnyBanner | null>(null);
  const [bannerSlot2, setBannerSlot2] = useState<AnyBanner | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSide, setEditingSide] = useState<"LEFT" | "RIGHT" | null>(null);

  const isPublicMode = Boolean(slug);

  /** 🔹 Cargar datos base */
  useEffect(() => {
    fetchBanners();

    if (isPublicMode && slug) getPublicWishlist(slug);
    else fetchWishlist();
  }, [slug]);

  /** 🔹 Cargar banners persistentes de esta página */
  useEffect(() => {
    const loadPageBanners = async () => {
      const pageBanners = await fetchPageBanners("wishlistpage");

      if (pageBanners.length > 0) {
        const slot1 = pageBanners.find((pb) => pb.slot_number === 1)?.banner;
        const slot2 = pageBanners.find((pb) => pb.slot_number === 2)?.banner;
        if (slot1) setBannerSlot1(slot1);
        if (slot2) setBannerSlot2(slot2);
      } else {
        const shortActivos = banners.filter(
          (b: AnyBanner) => b.is_active && b.type === "SHORT"
        );
        setBannerSlot1(shortActivos[0] || null);
        setBannerSlot2(shortActivos[1] || null);
      }
    };

    if (banners.length > 0) loadPageBanners();
  }, [banners]);

  // 🔹 Abrir modal
  const handleOpenModal = (side: "LEFT" | "RIGHT") => {
    setEditingSide(side);
    setModalOpen(true);
  };

  // 🔹 Seleccionar banner y guardarlo en la BD
  const handleSelectBanner = async (selectedBanner: AnyBanner) => {
    if (!selectedBanner.id) return;
    try {
      if (editingSide === "LEFT") {
        setBannerSlot1(selectedBanner);
        await savePageBanner("wishlistpage", 1, selectedBanner.id);
      }
      if (editingSide === "RIGHT") {
        setBannerSlot2(selectedBanner);
        await savePageBanner("wishlistpage", 2, selectedBanner.id);
      }
    } catch (err) {
      console.error("Error al guardar banner de wishlist:", err);
    } finally {
      setModalOpen(false);
    }
  };

  // 🔧 Helpers
  const asUrl = (v?: string | File) =>
    v ? (typeof v === "string" ? v : URL.createObjectURL(v)) : undefined;

  const normalizeOrientation = (o?: AnyBanner["orientation"]) =>
    o === "RIGHT" ? "RIGTH" : o;

  if (loading || loadingBanners)
    return (
      <div>
        <NavBar />
        <SkeletonWishlistPage />
        <Footer />
      </div>
    );

  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-[80rem] px-4 sm:px-10">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-10">
          <h1 className="text-xl sm:text-3xl font-quicksand font-bold border-b-4 border-main pb-2 w-fit">
            {isPublicMode
              ? `Lista de deseos de ${wishlist?.user?.username ?? "usuario"}`
              : "Mi lista de deseos"}
          </h1>

          {!isPublicMode && wishlist && (
            <button
              onClick={toggleVisibility}
              className={`text-sm px-4 py-2 rounded-full border font-semibold transition-all duration-300 ${wishlist.is_public
                ? "bg-green-100 border-green-400 text-green-700 hover:bg-green-200"
                : "bg-red-100 border-red-400 text-red-700 hover:bg-red-200"
                }`}
            >
              {wishlist.is_public
                ? "Visible públicamente"
                : "Lista privada"}
            </button>
          )}
        </div>



        {/* Lista de productos */}
        <section className="mt-10 flex flex-col gap-4">
          {wishlist?.items?.length ? (
            wishlist.items.map((item) => (
              <ProductWishlistCard
                key={item.id}
                product={{
                  id: item.product.id,
                  name: item.product.name,
                  price: item.product.price,
                  discount_price: item.product.discount_price,
                  stock: item.product.stock,
                  image_1_url: item.product.image_1_url,
                  store_name: item.product.store?.name,
                }}
                onDelete={
                  isPublicMode ? undefined : () => removeFromWishlist(item.id)
                }
                onAddToCart={
                  isPublicMode
                    ? undefined
                    : (p) => console.log("Agregar al carrito:", p)
                }
                isPublicMode={isPublicMode}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              {isPublicMode
                ? "Esta lista está vacía o es privada"
                : "Tu lista de deseos está vacía"}
            </p>
          )}
        </section>

        {/* Compartir */}
        {!isPublicMode && wishlist && (
          <section className="flex flex-col items-center justify-center text-center py-10 font-quicksand px-4 sm:px-0">
            <h3 className="text-lg sm:text-xl font-semibold text-main-dark mb-3">
              ¡Compartí tu wishlist con tus amigos!
            </h3>
            <p className="text-main-dark/50 text-sm mb-5 max-w-md">
              Envía tu lista de deseos para que otros puedan ver tus productos
              favoritos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto items-center justify-center border-contrast-secondary border-2 py-2 px-10 sm:py-3 rounded-full">
              <ShareComponent
                type="wishlist"
                positionClass="absolute right-3 top-25"
                shareUrl={`${window.location.origin}/wishlist/public/${wishlist.slug}`}
              />
            </div>
          </section>
        )}

        <section className="mt-6 sm:mt-8 pb-10">
          {loadingBanners ? (
            <p className="text-gray-500 text-center">Cargando banners...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 justify-center items-end">
              {/* 🟣 Banner 1 */}
              <div className="flex flex-col items-center">
                {user?.role === "ADMIN" && (
                  <button
                    onClick={() => handleOpenModal("LEFT")}
                    className="cursor-pointer font-quicksand flex items-center gap-1 text-sm border-main border-2 rounded-full px-3 py-1 text-main font-semibold mb-2 hover:bg-main hover:text-white hover:scale-105 transition-all duration-300"
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
                    className="cursor-pointer font-quicksand flex items-center gap-1 text-sm border-main border-2 rounded-full px-3 py-1 text-main font-semibold mb-2 hover:bg-main hover:text-white hover:scale-105 transition-all duration-300"
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
      {/* 🔹 BANNERS DESPUÉS DEL BOTÓN */}


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
