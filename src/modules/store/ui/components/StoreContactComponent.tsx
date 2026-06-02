import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
} from "@tabler/icons-react";
import { getStore } from "../../infrastructure/storeService";
import type { Store } from "../../../users/infrastructure/useUser";
import logoFallback from "../../../../img/resources/Group 50.png";
import { SkeletonSellerContact } from "../../../../components/ui/AllSkeletons";

export default function StoreContactComponent() {
  const { id } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchStore = async () => {
      const data = await getStore(Number(id));
      setStore(data);
      setLoading(false);
    };
    fetchStore();
  }, [id]);

  if (loading) return <SkeletonSellerContact show />;
  if (!store)
    return (
      <div className="flex justify-center items-center py-20 text-gray-400 font-quicksand text-center px-4">
        No se encontró la tienda.
      </div>
    );

  return (
    <div className="flex flex-col mx-4 sm:mx-10 my-6 sm:my-5 font-quicksand">
      {/* 🔹 Logo + Descripción */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-0">
        {/* Logo */}
        <div className="flex items-center justify-center w-full sm:w-[40%]">
          <img
            src={store.image || logoFallback}
            alt={store.name}
            className="max-h-[160px] sm:max-h-[180px] object-contain rounded-xl"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col text-center pt-10 sm:pt-0 w-full sm:w-[60%] gap-4 sm:gap-5">
          <h2 className="text-xl sm:text-3xl font-bold">{store.name}</h2>
          <p className="text-main-dark leading-relaxed whitespace-pre-line pt-2 text-sm sm:text-base px-2 sm:px-0">
            {store.description ||
              "Esta tienda aún no ha agregado una descripción."}
          </p>
        </div>
      </div>

      {/* 🔹 Contacto / Dirección / Redes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 justify-items-center mt-10 sm:mt-20 gap-10 sm:gap-0 text-center sm:text-left">
        {/* Contacto */}
        <div className="flex flex-col gap-2 w-[80%] sm:w-2/3">
          <h3 className="text-lg sm:text-2xl font-bold">Contacto:</h3>
          <p className="text-sm sm:text-base">{store.support_phone || ""}</p>
          <p className="text-sm sm:text-base">{store.support_email || ""}</p>
        </div>

        {/* Dirección */}
        <div className="flex flex-col gap-2 w-[80%] sm:w-2/3">
          <h3 className="text-lg sm:text-2xl font-bold">Dirección:</h3>
          <p className="text-sm sm:text-base">
            {store.address ||
              store.registered_address ||
              "Calle Principal, Ciudad, País"}
          </p>
        </div>

        {/* Páginas y redes */}
        <div className="flex flex-col gap-3 w-[80%] sm:w-2/3 items-center sm:items-start pb-10">
          <h3 className="text-lg sm:text-2xl font-bold">Páginas y Redes:</h3>
          <p className="text-sm sm:text-base">
            {store.business_name || "unstable.com"}
          </p>

          <ul className="flex gap-6 justify-center sm:justify-start text-main-dark">
            {/* Instagram */}
            {store.store_socials?.some(
              (s: { platform: string }) => s.platform === "instagram"
            ) ? (
              <li>
                <a
                  href={
                    store.store_socials.find(
                      (s: { platform: string }) => s.platform === "instagram"
                    )?.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandInstagram className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
              </li>
            ) : (
              <li className="opacity-50">
                <IconBrandInstagram className="w-6 h-6 sm:w-7 sm:h-7" />
              </li>
            )}

            {/* Facebook */}
            {store.store_socials?.some(
              (s: { platform: string }) => s.platform === "facebook"
            ) ? (
              <li>
                <a
                  href={
                    store.store_socials.find(
                      (s: { platform: string }) => s.platform === "facebook"
                    )?.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandFacebook className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
              </li>
            ) : (
              <li className="opacity-50">
                <IconBrandFacebook className="w-6 h-6 sm:w-7 sm:h-7" />
              </li>
            )}

            {/* X / Twitter */}
            {store.store_socials?.some(
              (s: { platform: string }) => s.platform === "x"
            ) ? (
              <li>
                <a
                  href={
                    store.store_socials.find(
                      (s: { platform: string }) => s.platform === "x"
                    )?.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandX className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
              </li>
            ) : (
              <li className="opacity-50">
                <IconBrandX className="w-6 h-6 sm:w-7 sm:h-7" />
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
