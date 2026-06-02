import { useEffect, useState } from "react";
import {
  IconBrandWhatsapp,
  IconExclamationCircle,
  IconSearch,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import ProductCard from "../../../../components/data-display/ProductCard";
import { SkeletonPersonalProduct } from "../../../../components/ui/AllSkeletons";
import { useProducts, type Product } from "../../infrastructure/useProducts";
import { useAuth } from "../../../../hooks/context/AuthContext";
import { getStoreByUser } from "../../infrastructure/storeService";
import FeaturedProductCard from "../../../../components/data-display/FeaturedProductCard";

interface Store {
  id: number;
  user_id?: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  banner?: string | null;
  category_id?: number | null;
  business_name?: string | null;
  tax_id?: string | null;
  legal_type?: string | null;
  registered_address?: string | null;
  support_email?: string | null;
  support_phone?: string | null;
  is_verified?: boolean | string | null;
  verification_date?: string | null;
  status?: "ACTIVE" | "SUSPENDED" | "CLOSED" | null | string;
}

export default function StoreProductsList() {
  const { user } = useAuth();
  const { getProductsByStore, loading, error } = useProducts();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (user?.id) {
          const store = await getStoreByUser(user.id);
          setStore(store);
          if (store?.id) {
            const data = await getProductsByStore(store.id);
            setProducts(data);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProducts();
  }, [user]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pl-4">
      {/* ⚠️ Estado: tienda en verificación */}
      {store?.is_verified === false && (
        <div className="flex flex-col gap-6 justify-center items-center bg-white rounded-2xl py-10 px-6 sm:px-12 mx-4 sm:ml-10 shadow-lg border border-main/20 text-center">
          <div className="flex items-center justify-center w-14 h-14 bg-contrast-secondary/20 rounded-full">
            <IconExclamationCircle
              size={30}
              className="text-contrast-secondary"
            />
          </div>

          <p className="text-xl font-semibold text-main">
            Tu tienda está en verificación
          </p>
          <p className="text-main-dark/70 max-w-md">
            El equipo de TukiShop se pondrá en contacto contigo para verificar tu tienda.
            Si tienes dudas, contacta con soporte.
          </p>
          <a
            href="https://wa.me/50687355629"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2 bg-contrast-secondary text-white rounded-full hover:scale-105 transition-all duration-300 shadow-sm"
          >
            <IconBrandWhatsapp size={20} />
            Contactar soporte
          </a>
        </div>
      )}

      {/* ✅ Contenido si la tienda está verificada */}
      {store?.is_verified === true && (
        <>
          {/* 🔹 Header superior */}
          <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center font-quicksand gap-4 sm:gap-0 px-0 sm:px-10 mt-6">
            <h1 className="text-xl sm:text-2xl font-semibold border-b-2 border-main w-fit">
              Lista de productos
            </h1>

            {/* 🔎 Buscador */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center bg-main-dark/10 gap-2 px-3 py-1.5 rounded-full w-full sm:w-auto">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="bg-transparent outline-none px-2 w-full sm:w-40"
                />
                <ButtonComponent
                  icon={<IconSearch />}
                  iconStyle="text-white cursor-pointer"
                  style="bg-naranja rounded-full w-10 h-8 flex items-center justify-center hover:bg-chocolate transition-colors"
                />
              </div>

              {/* 🟧 Botón registrar */}
              <Link to="/crudProduct" className="w-full sm:w-auto">
                <ButtonComponent
                  text="Registrar producto"
                  style="bg-naranja cursor-pointer rounded-full px-4 py-2 w-full text-white font-semibold hover:bg-chocolate transition-all duration-300"
                />
              </Link>
            </div>
          </section>

          {/* 🔹 Lista de productos */}
          <section className="py-8 sm:py-10 border-b-2 border-main space-y-3">
            {loading && (
              <div className="px-4 sm:px-10">
                <SkeletonPersonalProduct count={9} />
              </div>
            )}

            {error && <p className="text-red-500 px-4 sm:px-10">{error}</p>}

            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 px-0 sm:px-10">
                {filteredProducts
                  .filter((p) => !p.is_featured)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      shop={store?.name || product.store?.name || "Sin vendedor"}
                      title={product.name}
                      price={product.price}
                      discountPrice={product.discount_price || undefined}
                      img={product.image_1_url ? product.image_1_url : "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"}
                      edit="EDIT"
                      id={product.id ?? 0}
                    />
                  ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <p className="text-gray-500 text-center px-4 sm:px-10">
                No hay productos
              </p>
            )}
          </section>

          {/* ⭐ Productos destacados */}
          <section className="my-10 px-4 sm:px-10">
            <h2 className="text-xl sm:text-2xl font-semibold font-quicksand mb-6 text-center sm:text-left">
              Productos destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
              {filteredProducts
                .filter((p) => p.is_featured)
                .map((product) => (
                  <FeaturedProductCard
                    key={product.id}
                    shop={store?.name || product.store?.name || "Sin vendedor"}
                    img={
                      product.image_1_url
                        ? product.image_1_url
                        : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                    }
                    title={product.name}
                    price={product.price}
                    discountPrice={product.discount_price}
                    rating={4.5}
                    edit = "EDIT"
                    id={product.id ?? 0}
                  />
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
