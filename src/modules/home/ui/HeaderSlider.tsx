import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import BannerComponent from "../../../components/data-display/BannerComponent";
import { useBanner } from "../../admin/infrastructure/useBanner";
import { useEffect } from "react";
import { SkeletonHeaderSlider } from "../../../components/ui/AllSkeletons";

export default function HeaderSlider() {
  const { banners, fetchBanners, loading } = useBanner();

  useEffect(() => {
    fetchBanners();
  }, []);

  // Filtrar solo banners tipo SLIDER activos
  const sliderBanners = banners.filter(
    (b) => b.type === "SLIDER" && b.is_active
  );

  return (
    <header className="w-full">
      {loading ? (
        <SkeletonHeaderSlider />
      ) : sliderBanners.length > 0 ? (
        <Carousel className="mx-3 sm:mx-6 md:mx-10">
          <CarouselContent className="h-[12rem] sm:h-[22rem] md:h-[28rem] lg:h-[30rem]">
            {sliderBanners.map((b) => (
              <CarouselItem
                key={b.id}
                className="basis-full flex justify-center items-center"
              >
                <div className="w-full h-full flex justify-center items-center">
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
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Botones del carrusel */}
          <CarouselPrevious className="scale-80 sm:scale-100 sm:flex left-0 sm:left-4" />
          <CarouselNext className="scale-80 sm:scale-100 sm:flex right-0 sm:right-4" />
        </Carousel>
      ) : (
        <p className="text-gray-500 text-center my-10">
          No hay banners de tipo SLIDER activos
        </p>
      )}
    </header>
  );
}
