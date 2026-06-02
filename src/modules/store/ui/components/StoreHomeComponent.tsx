import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import ProductCard from "../../../../components/data-display/ProductCard";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import FeaturedProductsSlider from "../../../../components/data-display/FeaturedProductsSlider";
import { useProducts } from "../../infrastructure/useProducts";
import type { Product } from "../../infrastructure/useProducts";
import {
  SkeletonProduct,
  SkeletonFeatured,
} from "../../../../components/ui/AllSkeletons";

export default function StoreHomeComponent() {
  const { id } = useParams();
  const { getProductsByStore, getFeaturedProductsByStore, getOffersByStore } =
    useProducts();
  const [visibleCount, setVisibleCount] = useState(10);

  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const storeId = Number(id);
        const allProducts = await getProductsByStore(storeId);
        const featured = await getFeaturedProductsByStore(storeId);
        const offersData = await getOffersByStore(storeId);

        setProducts(allProducts);
        setFeaturedProducts(featured);
        setOffers(offersData);
      } catch (err) {
        console.error("Error al cargar productos del vendedor:", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      {/* 🔹 Ofertas */}
      <section className="mx-0 sm:mx-10 my-6 sm:my-10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-semibold font-quicksand">
            Ofertas
          </h2>
          <div className="flex items-center gap-1 text-sm sm:text-base">
            <a href="#" className="font-quicksand font-semibold">
              Ver todo
            </a>
            <IconChevronRight className="inline w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {loading ? (
          <SkeletonProduct count={5} />
        ) : (
          <>
            {/* Mobile: muestra solo 6 productos */}
            <div className="grid grid-cols-2 gap-4 my-6 sm:hidden">
              {offers.slice(0, 6).map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id!}
                  shop={prod.store?.name || "No hay tienda"}
                  title={prod.name}
                  price={prod.price}
                  discountPrice={
                    prod.discount_price != null && prod.discount_price !== 0
                      ? prod.discount_price
                      : undefined
                  }
                  img={prod.image_1_url ? prod.image_1_url : "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"}
                  edit={"NONE"}
                />
              ))}
            </div>

            {/* Escritorio: diseño original */}
            <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 my-10 gap-5">
              {offers.slice(0, 5).map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id!}
                  shop={prod.store?.name || "No hay tienda"}
                  title={prod.name}
                  price={prod.price}
                  discountPrice={
                    prod.discount_price != null && prod.discount_price !== 0
                      ? prod.discount_price
                      : undefined
                  }
                  img={prod.image_1_url ? prod.image_1_url : "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"}
                  edit={"NONE"}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 🔹 Productos destacados */}
      <section className="mx-4 sm:mx-4 my-6 sm:my-10">
        {!loading && featuredProducts.length > 0 && (
          <>
            <h2 className="text-lg sm:text-2xl font-semibold font-quicksand mb-3 sm:mb-5 pl-6">
              Productos destacados
            </h2>

            {loading ? (
              <div className="transition-opacity duration-500 opacity-100">
                <SkeletonFeatured count={2} />
              </div>
            ) : featuredProducts.length > 0 ? (
              <div
                className={`transition-opacity duration-500 ${
                  loading ? "opacity-0" : "opacity-100"
                }`}
              >
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
              </div>
            ) : (
              <p className="text-gray-500 my-5">No hay productos destacados.</p>
            )}
          </>
        )}
      </section>

      {/* 🔹 Todos los productos */}
      <section className="mx-0 sm:mx-10 my-6 sm:my-10">
        <h2 className="text-lg sm:text-2xl font-semibold font-quicksand">
          Todos los productos
        </h2>

        {loading ? (
          <div className="transition-opacity duration-500 opacity-100">
            <SkeletonProduct count={10} />
          </div>
        ) : products.length > 0 ? (
          <>
            <div
              className={`grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 my-6 gap-3 sm:gap-5 transition-opacity duration-500 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
            >
              {products.slice(0, visibleCount).map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id!}
                  shop={prod.store?.name || "Tienda"}
                  title={prod.name}
                  price={prod.price}
                  discountPrice={prod.discount_price}
                  img={prod.image_1_url || "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"}
                  edit={"NONE"}
                />
              ))}
            </div>

            {visibleCount < products.length && (
              <div className="flex flex-col justify-center items-center w-full">
                <ButtonComponent
                  text="Ver más"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  style="bg-contrast-secondary text-white px-5 py-2 rounded-full hover:bg-contrast-main transition-all duration-300 ease-in-out cursor-pointer w-[60%] sm:w-[30%]"
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No hay productos disponibles.</p>
        )}
      </section>
    </div>
  );
}
