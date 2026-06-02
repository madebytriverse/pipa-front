import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";
import StoreListCard from "./StoreListCard";
import { SkeletonStoreBanner } from "../../../components/ui/AllSkeletons";

export default function SearchedStores() {
  const [stores, setStores] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await axios.get("/stores");

        const verifiedStores = data.filter(
          (store: any) => store.is_verified === true
        );

        setStores(verifiedStores);
      } catch (error) {
        console.error("Error al obtener tiendas:", error);
        setStores([]);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchStores();
  }, []);

  // Si todavía no se cargó nada (stores === null), mostramos skeleton fijo
  if (stores === null || loading) {
    return (
      <div>
        <NavBar />
        <div className="max-w-6xl mx-auto my-10 flex flex-col gap-8 px-6">
          <SkeletonStoreBanner count={6} />
        </div>
        <Footer />
      </div>
    );
  }

  //Si ya cargó pero no hay tiendas
  if (stores.length === 0) {
    return (
      <div>
        <NavBar />
        <div className="max-w-6xl mx-auto my-10 px-6">
          <p className="text-center text-gray-500">
            No hay tiendas disponibles
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  //Si hay tiendas, renderízalas directamente
  return (
    <div>
      <NavBar />
      <div className="text-center my-10">
  <h1 className="text-3xl sm:text-4xl font-quicksand bg-main bg-clip-text text-transparent">
    Tiendas en TukiShop
  </h1>
  <p className="text-base sm:text-lg text-main-dark/70 mt-2 font-quicksand">
    Descubre negocios locales y productos únicos en TukiShop 
  </p>
</div>

      <div className="max-w-6xl mx-auto my-10 px-5 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:space-y-10">
  {stores.map((store, index) => (
    <div key={store.id}>
      <StoreListCard store={store} />
      {index < stores.length - 1 && (
        <div className="w-full my-10 h-[2px] bg-gradient-to-r from-main via-contrast-secondary to-contrast-main sm:hidden"></div>
      )}
    </div>
  ))}
</div>

      <Footer />
    </div>
  );
}
