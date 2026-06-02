import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../../../components/data-display/ProductCard";
import { useProducts } from "../infrastructure/useProducts";
import type { Product } from "../infrastructure/useProducts";
import { SkeletonProduct } from "../../../components/ui/AllSkeletons";

export default function StoreSearchComponent() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { searchProductsByStore } = useProducts();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !query) return;
    const fetchResults = async () => {
      try {
        const data = await searchProductsByStore(Number(id), query);
        setProducts(data);
      } catch (err) {
        console.error("Error al buscar productos:", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchResults();
  }, [id, query]);

  return (
    <section className="mx-10 my-10">
      <h2 className="text-2xl font-semibold font-quicksand mb-5">
        Resultados para “{query}”
      </h2>

      {loading ? (
        <SkeletonProduct count={10} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-5 gap-5">
          {products.map((prod) => (
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
        <p className="text-gray-500">No se encontraron productos.</p>
      )}
    </section>
  );
}
