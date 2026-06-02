import { Link } from "react-router-dom";
import ButtonComponent from "../../../components/ui/ButtonComponent";
import StarRatingComponent from "../../../components/ui/StarRatingComponent";

interface StoreProps {
  store: {
    id: number;
    name: string;
    description?: string;
     category?: {
      id: number;
      name: string;
    }
    rating?: number;
    image?: string;
    banner?: string;
  };
}

export default function StoreListCard({ store }: StoreProps) {
  return (
<div className="relative flex flex-col bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden w-full max-w-[30rem] mx-auto font-quicksand transition-all duration-300 sm:w-[35rem] min-h-[25rem] sm:min-h-[26rem] hover:shadow-lg">
      <div className="relative h-30 sm:h-28 md:h-40 ">
        <img
          src={
            store.banner ??
            "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761410400/BannerNoSubido_avlp5v.png"
          }
          alt={`${store.name} banner`}
          className="h-full w-full object-cover p-2 rounded-2xl"
        />
      </div>
      <div className="absolute top-16 left-5 sm:top-25 sm:left-6">
        <img
          src={
            store.image ??
            "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"
          }
          alt={`${store.name} logo`}
          className="w-25 h-25 sm:w-18 sm:h-18 md:w-30 md:h-30 rounded-full border-4 bg-white/70 border-white object-contain shadow-md"
        />
      </div>
      <div className="flex relative flex-col items-center pt-14 sm:pt-5 pb-6 px-4 text-center flex-1">
        <p className="absolute top-2 right-3 bg-main/50 text-xs text-white px-3 py-1 rounded-full">
          {store.category?.name?.trim() || "Sin categoría"}
        </p>

        <h2 className="text-xl text-main-dark sm:text-xl font-semibold mt-4 sm:mt-5">
          {store.name}
        </h2>
        <div className="mt-1 sm:mt-2">
          <StarRatingComponent value={store.rating ?? 0} size={16} />
        </div>
        <p className="mt-3 text-sm text-main-dark leading-snug line-clamp-3">
          {store.description?.trim() ||
            "Esta tienda aún no ha agregado una descripción."}
        </p>
        <div className="mt-auto w-full sm:w-[80%]">
          <Link to={`/store/${store.id}`}>
            <ButtonComponent
              text="Ver tienda"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
style="cursor-pointer relative bg-main text-white font-semibold rounded-full w-full py-2 sm:py-3 text-sm sm:text-base shadow-md shadow-main/30 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-main/50 active:scale-[0.97]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
