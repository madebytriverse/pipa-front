import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";
import ProductCard from "../../../components/data-display/ProductCard";
import { useProducts } from "../../store/infrastructure/useProducts";
import type { Product } from "../../store/infrastructure/useProducts";
import { SkeletonProduct } from "../../../components/ui/AllSkeletons";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";

export default function SearchedProductPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const location = useLocation();
  const { getProductsByCategory, getOffers, searchProducts } =
    useProducts(); // ✅ agregado getOffers
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 30;

  const categories: Record<number | string, string> = {
    1: "Arte",
    2: "Automotriz",
    3: "Belleza",
    4: "Comida",
    5: "Decoración",
    6: "Deportes",
    7: "Gaming",
    8: "Herramientas",
    9: "Hogar",
    10: "Jardinería",
    11: "Juegos",
    12: "Juguetes",
    13: "Libros",
    14: "Limpieza",
    15: "Mascotas",
    16: "Música",
    17: "Oficina",
    18: "Ropa",
    19: "Salud",
    20: "Tecnología",
    21: "Otros",
  };

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");
  const mode = searchParams.get("mode");
  const { getPaginatedProducts } = useProducts();
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 🔸 1. Si hay búsqueda o filtros especiales, no usar paginación
        if (categoryId) {
          const res = await getProductsByCategory(Number(categoryId));
          setProducts(res);
          setTotalPages(1);
        } else if (mode === "offers") {
          const res = await getOffers();
          setProducts(res);
          setTotalPages(1);
        } else if (query) {
          // ✅ Buscar directamente desde el backend (usa tu endpoint /products/search)
          const res = await searchProducts(query);
          setProducts(res);
          setTotalPages(1);
        } else {
          // 🔸 Modo explorar o sin filtros → usa paginación
          const res = await getPaginatedProducts(page, limit);
          setProducts(res.data);
          setTotalPages(res.last_page);
        }
      } catch (e) {
        console.error("❌ Error al cargar productos:", e);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, categoryId, query, mode]);

  const paginated = products;

  const getTitle = () => {
    if (loading) return "Cargando productos...";
    if (categoryId) return `Resultados de "${categories[categoryId]}"`;
    if (mode === "explore") return "Explorar productos";
    if (mode === "offers") return "Productos en oferta";
    if (mode === "best-sellers") return "Lo más vendido";
    if (query) return `Resultados para: "${query}"`;
    return "Productos";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 w-full">
        {/* Título */}
        <h1 className="text-xl sm:text-3xl font-bold font-quicksand mb-6 sm:mb-8 text-left">
          {getTitle()}
        </h1>

        {/* Estado de carga */}
        {loading ? (
          <SkeletonProduct count={30} />
        ) : products.length > 0 ? (
          <>
            {/* Grilla de productos */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {paginated.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id!}
                  shop={prod.store?.name || "Sin tienda"}
                  title={prod.name}
                  price={prod.price}
                  discountPrice={
                    prod.discount_price ? prod.discount_price : undefined
                  }
                  img={prod.image_1_url || "https://via.placeholder.com/200"}
                  edit={"NONE"}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <Pagination className="mt-10">
                <PaginationContent className="flex flex-wrap items-center justify-center gap-2 sm:gap-1 font-quicksand">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
                      className={`${
                        page === 1
                          ? "opacity-50 pointer-events-none bg-gray-200 text-gray-500"
                          : "hover:bg-main-dark/10 hover:text-main-dark cursor-pointer"
                      } rounded-full px-3 py-2 transition-all duration-300 text-sm sm:text-base`}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const current = i + 1;
                    const isActive = current === page;
                    return (
                      <PaginationItem key={current}>
                        <PaginationLink
                          onClick={() => setPage(current)}
                          isActive={isActive}
                          className={`rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                            isActive
                              ? "bg-contrast-secondary text-white shadow-md scale-105 cursor-pointer"
                              : "bg-main-dark/10 text-main-dark hover:bg-main-dark/20 cursor-pointer"
                          }`}
                        >
                          {current}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < totalPages && setPage(page + 1)}
                      className={`${
                        page >= totalPages
                          ? "opacity-50 pointer-events-none bg-gray-200 text-gray-500"
                          : "hover:bg-main-dark/10 hover:text-main-dark cursor-pointer"
                      } rounded-full px-3 py-2 transition-all duration-300 text-sm sm:text-base`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 text-sm sm:text-base mt-10">
            No hay productos disponibles.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}
