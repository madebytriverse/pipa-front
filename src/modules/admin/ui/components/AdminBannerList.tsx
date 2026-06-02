import { useState, useEffect } from "react";
import BannerComponent from "../../../../components/data-display/BannerComponent";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import AdminBannerCRUDModal from "./AdminBannerCRUDModal";
import { useBanner } from "../../infrastructure/useBanner";

type Banner = {
  id?: number;
  title?: string;
  subtitle?: string;
  image: string | File;
  character?: string | File;
  link?: string;
  type: "LARGE" | "SHORT" | "SLIDER";
  orientation?: "LEFT" | "RIGTH";
  btn_text?: string;
  btn_color?: "MORADO" | "AMARILLO" | "NARANJA" | "GRADIENTE";
  position?: number;
  is_active?: boolean;
};

export default function AdminBannerList() {
  const { banners, fetchBanners, loading } = useBanner();
  const [showModal, setShowModal] = useState(false);
  const [, setSelectedBanner] = useState<Banner | null>(null);
  const [newBanner, setNewBanner] = useState<Banner>({
    title: "",
    subtitle: "",
    image: "",
    character: "",
    type: "SHORT",
    orientation: "LEFT",
    btn_text: "",
    btn_color: "NARANJA",
    link: "",
    is_active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEditBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setNewBanner(banner);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedBanner(null);
    setNewBanner({
      title: "",
      subtitle: "",
      image: "",
      character: "",
      type: "SHORT",
      orientation: "LEFT",
      btn_text: "",
      btn_color: "NARANJA",
      link: "",
      is_active: true,
    });
    setShowModal(true);
  };

  const largeBanners = banners.filter(
    (b) => b.type === "LARGE" || b.type === "SLIDER"
  );
  const shortBanners = banners.filter((b) => b.type === "SHORT");

  return (
    <section className="pl-2 sm:pl-4 font-quicksand">
      <div className="pl-0 sm:pl-5">
        {/* Header */}
        <div className="pb-6 sm:pb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h1 className="text-lg sm:text-2xl border-b-3 border-main">
            Administración de banners
          </h1>
          <ButtonComponent
            text="Agregar banner"
            style="bg-main-dark text-white rounded-full py-2 px-4 font-quicksand hover:bg-main transition-all duration-400 w-full sm:w-auto"
            onClick={handleAddNew}
          />
        </div>

        {/* Modal */}
        {showModal && (
          <AdminBannerCRUDModal
            newBanner={newBanner}
            setNewBanner={setNewBanner}
            onClose={() => {
              setShowModal(false);
              setSelectedBanner(null);
            }}
            onSaveSuccess={async () => {
              await fetchBanners();
            }}
          />
        )}

        {/* Estado de carga */}
        {loading && (
          <p className="text-center text-gray-500">Cargando banners...</p>
        )}

        {/* Banners */}
        <div className="space-y-8 sm:space-y-10">
          {/* Large / Slider */}
          <div>
            <h2 className="text-base sm:text-xl font-quicksand mb-3 sm:mb-4">
              Large / Slider Banners
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-[10rem] place-items-center gap-5 sm:gap-0">
              {largeBanners.map((b) => (
                <div
                  key={b.id}
                  className="w-full h-full cursor-pointer hover:scale-[1.02] transition-all duration-200"
                  onClick={() => handleEditBanner(b)}
                >
                  <BannerComponent
                    {...b}
                    image={
                      typeof b.image === "string"
                        ? b.image
                        : URL.createObjectURL(b.image)
                    }
                    character={
                      b.character
                        ? typeof b.character === "string"
                          ? b.character
                          : URL.createObjectURL(b.character)
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Short */}
          <div>
            <h2 className="text-base sm:text-xl font-quicksand mb-3 sm:mb-4">
              Short Banners
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-[12rem] place-items-center gap-5 sm:gap-6">
              {shortBanners.map((b) => (
                <div
                  key={b.id}
                  className="scale-[0.9] sm:scale-[0.7] origin-center w-full sm:w-fit cursor-pointer hover:scale-[0.93] sm:hover:scale-[0.73] transition-all duration-200"
                  onClick={() => handleEditBanner(b)}
                >
                  <BannerComponent
                    {...b}
                    image={
                      typeof b.image === "string"
                        ? b.image
                        : URL.createObjectURL(b.image)
                    }
                    character={
                      b.character
                        ? typeof b.character === "string"
                          ? b.character
                          : URL.createObjectURL(b.character)
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
