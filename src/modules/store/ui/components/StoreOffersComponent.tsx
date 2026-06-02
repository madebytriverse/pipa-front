import ProductCard from "../../../../components/data-display/ProductCard";
import { useProducts } from "../../infrastructure/useProducts";
import type { Product } from "../../infrastructure/useProducts";
import { SkeletonProduct } from "../../../../components/ui/AllSkeletons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function StoreOffersComponent() {
  const { id } = useParams();
  const { getOffersByStore } = useProducts();

  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const storeId = Number(id);
        const allProducts = await getOffersByStore(storeId);
        setOffers(
          allProducts.filter(
            (p) => p.discount_price && Number(p.discount_price) > 0
          )
        );
      } catch (err) {
        console.error("Error al cargar productos del vendedor:", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchData();
  }, [id]);

  return (
    <section className="mx-0 sm:mx-10 my-6 sm:my-5">
      <h2 className="text-lg sm:text-2xl font-semibold font-quicksand">
        Ofertas
      </h2>

      {loading ? (
        <div className="transition-opacity duration-500 opacity-100">
          <SkeletonProduct count={5} />
        </div>
      ) : offers.length > 0 ? (
        <div
          className={`grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 my-6 sm:my-10 gap-3 sm:gap-5 transition-opacity duration-500 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        >
          {offers.map((prod) => (
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
      ) : (
        <p className="text-gray-500 my-5 text-center sm:text-left">
          No hay productos en oferta.
        </p>
      )}
    </section>
  );
}
