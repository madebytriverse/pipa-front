import HeaderSlider from "./HeaderSlider";
import NavBar from "../../../components/layout/NavBar";
import {
  SkeletonProduct,
  SkeletonFeatured,
  SkeletonCategory,
  SkeletonShortBanner,
} from "../../../components/ui/AllSkeletons";
import FeaturedProductsSlider from "../../../components/data-display/FeaturedProductsSlider";
import { useEffect, useState, useRef } from "react";
import { useProducts } from "../../store/infrastructure/useProducts";
import type { Product } from "../../store/infrastructure/useProducts";
import CategorySlider from "../../../components/data-display/CategorySlider";
import ProductCard from "../../../components/data-display/ProductCard";
import { IconChevronRight, IconEdit } from "@tabler/icons-react";
import Footer from "../../../components/layout/Footer";
import BannerComponent from "../../../components/data-display/BannerComponent";
import { useBanner } from "../../admin/infrastructure/useBanner";
import BannerSelectModal from "./BannerSelectModal";
import { useAuth } from "../../../hooks/context/AuthContext";
import Snowfall from "react-snowfall";
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

export default function HomePage() {
  const { getProducts, getFeaturedProducts, getOffers } = useProducts();
  const {
    banners,
    fetchBanners,
    fetchPageBanners,
    savePageBanner,
    loading: loadingBanners,
  } = useBanner();
  const { user } = useAuth(); // ✅ obtener usuario actual

  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingExplore, setLoadingExplore] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // 🔹 Slots de banners
  const [bannerSlot1, setBannerSlot1] = useState<AnyBanner | null>(null);
  const [bannerSlot2, setBannerSlot2] = useState<AnyBanner | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSide, setEditingSide] = useState<"LEFT" | "RIGHT" | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        const prods = await getProducts();

        // 🔹 Filtrar y limitar directamente en el componente
        const validos = prods
          .filter(
            (p) =>
              p &&
              p.status === "ACTIVE" &&     // solo activos
              p.price > 0 &&               // con precio válido
              (p.image_1_url || p.image)   // con alguna imagen
          )
          .slice(0, 10); // máximo 10 productos

        setExploreProducts(validos);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoadingExplore(false);
      }
    })();
  }, []);


  /** 🔹 Cargar productos destacados */
  useEffect(() => {
    (async () => {
      const prods = await getFeaturedProducts();
      setFeaturedProducts(prods);
      setLoadingFeatured(false);
    })();
  }, []);

  /** 🔹 Cargar banners globales */
  useEffect(() => {
    fetchBanners();
  }, []);

  /** 🔹 Cargar banners específicos asignados a la página (desde page_banners) */
  useEffect(() => {
    const loadPageBanners = async () => {
      const pageBanners = await fetchPageBanners("homepage");

      if (pageBanners.length > 0) {
        const slot1 = pageBanners.find((pb) => pb.slot_number === 1)?.banner;
        const slot2 = pageBanners.find((pb) => pb.slot_number === 2)?.banner;
        if (slot1) setBannerSlot1(slot1);
        if (slot2) setBannerSlot2(slot2);
      } else {
        // fallback si aún no hay registros en page_banners
        const shortActivos = banners.filter(
          (b: AnyBanner) => b.is_active && b.type === "SHORT"
        );
        setBannerSlot1(shortActivos[0] || null);
        setBannerSlot2(shortActivos[1] || null);
      }
    };

    if (banners.length > 0) loadPageBanners();
  }, [banners]);
  /** 🔹 Cargar productos en oferta */
  useEffect(() => {
    (async () => {
      try {
        const prods = await getOffers(); // ✅ llamada al nuevo método global
        setOfferProducts(prods.slice(0, 10)); // puedes ajustar el límite
      } catch (error) {
        console.error("Error al cargar ofertas:", error);
      } finally {
        setLoadingOffers(false);
      }
    })();
  }, []);

  // 🔹 Abrir modal
  const handleOpenModal = (side: "LEFT" | "RIGHT") => {
    setEditingSide(side);
    setModalOpen(true);
  };

  // 🔹 Asignar banner seleccionado y guardarlo en la BD
  const handleSelectBanner = async (selectedBanner: AnyBanner) => {
    if (!selectedBanner.id) return;

    try {
      if (editingSide === "LEFT") {
        setBannerSlot1(selectedBanner);
        await savePageBanner("homepage", 1, selectedBanner.id);
      }
      if (editingSide === "RIGHT") {
        setBannerSlot2(selectedBanner);
        await savePageBanner("homepage", 2, selectedBanner.id);
      }
    } catch (err) {
      console.error("Error al guardar page banner:", err);
    } finally {
      setModalOpen(false);
    }
  };

  // 🔧 Helpers
  const normalizeOrientation = (o?: AnyBanner["orientation"]) =>
    o === "RIGHT" ? "RIGTH" : o;

  const asUrl = (v?: string | File) =>
    v ? (typeof v === "string" ? v : URL.createObjectURL(v)) : undefined;

  return (
    <div>
      <Snowfall color="#82c3d9" />
      <NavBar />
      <div className="mx-auto max-w-[80rem]">
        {/* 🔹 HEADER PRINCIPAL */}
        <header>
          <HeaderSlider />
        </header>

        {/* 🔹 PRODUCTOS DESTACADOS */}
        <section className="mx-5 sm:mx-10">
          <h2 className="text-xl sm:text-2xl font-semibold font-quicksand">
            Productos destacados
          </h2>
          <div>
            {loadingFeatured ? (
              <SkeletonFeatured count={2} />
            ) : (
              <FeaturedProductsSlider
                products={featuredProducts.map((prod) => ({
                  id: prod.id!,
                  shop: prod.store?.name || "Sin tienda",
                  title: prod.name,
                  price: prod.price,
                  discountPrice: prod.discount_price,
                  rating: 0,
                  img: prod.image_1_url || "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png",
                }))}
              />

            )}
          </div>
        </section>

        {/* 🔹 CATEGORÍAS */}
        <section className="mx-5 sm:mx-10 sm:my-10">
          <h2 className="text-xl sm:text-2xl font-semibold font-quicksand">
            Categorías
          </h2>
          {loadingCategories && <SkeletonCategory count={4} />}
          <div
            className={`${loadingCategories ? "opacity-0" : "opacity-100"
              } transition-opacity duration-500`}
          >
            <CategorySlider onLoaded={() => setLoadingCategories(false)} />
          </div>
        </section>

        {/* 🔹 OFERTAS */}
        <section className="mx-4 sm:mx-10 my-6 sm:my-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-semibold font-quicksand">
              Ofertas
            </h2>
            <div className="flex items-center gap-1 text-sm sm:text-base">
              <a
                href="search?mode=offers"
                className="font-quicksand font-semibold cursor-pointer"
              >
                Ver todo
              </a>
              <IconChevronRight className="inline w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {loadingOffers ? (
            <SkeletonProduct count={5} />
          ) : offerProducts.length === 0 ? (
            <p className="text-center text-gray-500 my-8">
              No hay productos en oferta actualmente 🛍️
            </p>
          ) : (
            <>
              {/* 🔹 Vista móvil */}
              <div className="grid grid-cols-2 gap-4 my-6 sm:hidden">
                {offerProducts.slice(0, 6).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    id={prod.id!}
                    shop={prod.store?.name || "No hay tienda"}
                    title={prod.name}
                    price={prod.price}
                    discountPrice={
                      prod.discount_price && prod.discount_price !== 0
                        ? prod.discount_price
                        : undefined
                    }
                    img={prod.image_1_url || "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"}
                    edit="NONE"
                  />
                ))}
              </div>

              {/* 🔹 Vista escritorio */}
              <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 my-10 gap-5">
                {offerProducts.slice(0, 10).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    id={prod.id!}
                    shop={prod.store?.name || "No hay tienda"}
                    title={prod.name}
                    price={prod.price}
                    discountPrice={
                      prod.discount_price && prod.discount_price !== 0
                        ? prod.discount_price
                        : undefined
                    }
                    img={prod.image_1_url || "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"}
                    edit="NONE"
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* 🔹 BANNERS GUARDADOS EN BD */}
        <section className="mx-4 sm:mx-10 sm:my-10 my-6">
          {loadingBanners ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 justify-center items-end">
              {/* Skeletons del banner corto (SHORT) */}
              <div className="flex flex-col items-center">
                <div className="mb-2 w-full">
                  <SkeletonShortBanner />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="mb-2 w-full">
                  <SkeletonShortBanner />
                </div>
              </div>
            </div>
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

        {/* 🔹 EXPLORAR */}
        {/* 🔹 EXPLORAR */}
        <section className="mx-5 sm:mx-10 my-6 sm:my-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-semibold font-quicksand">
              Explorar
            </h2>
            <div className="flex items-center gap-1 text-sm sm:text-base">
              <a
                href="/search?mode=explore"
                className="font-quicksand font-semibold cursor-pointer"
              >
                Ver todo
              </a>
              <IconChevronRight className="inline w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {loadingExplore ? (
            <SkeletonProduct count={10} />
          ) : exploreProducts.length === 0 ? (
            <p className="text-center text-gray-500 my-8">
              No hay productos para explorar 🛍️
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 my-6 sm:my-10 gap-4 sm:gap-5">
              {exploreProducts.slice(0, 10).map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id!}
                  shop={prod.store?.name || "No hay tienda"}
                  title={prod.name}
                  price={prod.price}
                  discountPrice={
                    prod.discount_price && prod.discount_price !== 0
                      ? prod.discount_price
                      : undefined
                  }
                  img={prod.image_1_url || "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"}
                  edit={"NONE"}
                />
              ))}
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
