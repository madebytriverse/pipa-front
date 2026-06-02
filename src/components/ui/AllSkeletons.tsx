import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

/* ============================================================
   💎 Skeleton con efecto de desvanecimiento (Fade-out global)
   ============================================================ */
function FadeWrapper({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(show);
  const [opacity, setOpacity] = useState(show ? "opacity-100" : "opacity-0");

  useEffect(() => {
    if (show) {
      setVisible(true);
      setOpacity("opacity-100");
    } else {
      setOpacity("opacity-0");
      const timer = setTimeout(() => setVisible(false), 600); // coincide con duration-700
      return () => clearTimeout(timer);
    }
  }, [show]);

  return visible ? (
    <div className={`transition-opacity duration-700 ease-in-out ${opacity}`}>
      {children}
    </div>
  ) : null;
}
export const SkeletonSellerContact: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <div className="flex flex-col mx-4 md:mx-10 my-5 font-quicksand animate-pulse">
      {/* 🔹 Logo + Descripción */}
      <div className="flex flex-col md:flex-row items-center justify-center">
        {/* Logo */}
        <div className="flex items-center w-full md:w-[40%] justify-center mb-5 md:mb-0">
          <Skeleton className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-xl bg-gray-400/70" />
        </div>

        {/* Descripción */}
        <div className="flex flex-col text-center w-full md:w-[60%] gap-3 md:gap-5">
          <Skeleton className="w-3/4 md:w-1/2 h-[20px] md:h-[28px] mx-auto rounded-md bg-gray-400/70" />
          <Skeleton className="w-5/6 md:w-3/4 h-[14px] md:h-[16px] mx-auto rounded-md bg-gray-400/70" />
          <Skeleton className="w-4/5 md:w-2/3 h-[14px] md:h-[16px] mx-auto rounded-md bg-gray-400/70" />
          <Skeleton className="w-3/4 md:w-1/2 h-[14px] md:h-[16px] mx-auto rounded-md bg-gray-400/70" />
        </div>
      </div>

      {/* 🔹 Contacto / Dirección / Redes */}
      <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center mt-10 md:mt-20 gap-10 md:gap-0">
        {/* Contacto */}
        <div className="flex flex-col gap-3 w-4/5 md:w-2/3 items-start">
          <Skeleton className="w-[100px] h-[20px] md:w-[120px] md:h-[24px] rounded-md bg-gray-400/70" />
          <Skeleton className="w-[140px] h-[12px] md:w-[160px] md:h-[14px] rounded-md bg-gray-400/70" />
          <Skeleton className="w-[180px] h-[12px] md:w-[200px] md:h-[14px] rounded-md bg-gray-400/70" />
        </div>

        {/* Dirección */}
        <div className="flex flex-col gap-3 w-4/5 md:w-2/3 items-start">
          <Skeleton className="w-[100px] h-[20px] md:w-[120px] md:h-[24px] rounded-md bg-gray-400/70" />
          <Skeleton className="w-[200px] h-[12px] md:w-[220px] md:h-[14px] rounded-md bg-gray-400/70" />
          <Skeleton className="w-[160px] h-[12px] md:w-[180px] md:h-[14px] rounded-md bg-gray-400/70" />
        </div>

        {/* Redes sociales */}
        <div className="flex flex-col gap-3 pb-5 md:pb-10 w-4/5 md:w-2/3 items-start">
          <Skeleton className="w-[140px] h-[20px] md:w-[160px] md:h-[24px] rounded-md bg-gray-400/70" />
          <Skeleton className="w-[120px] h-[12px] md:w-[140px] md:h-[14px] rounded-md bg-gray-400/70" />
          <div className="flex gap-4 md:gap-5 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] rounded-full bg-gray-400/70"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </FadeWrapper>
);

export const SkeletonRatingSummary: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <div className="p-4 w-full font-quicksand animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4 sm:gap-0">
        {/* 🔹 Promedio y estrellas */}
        <div className="flex flex-col items-center sm:items-start w-full sm:w-1/3">
          <Skeleton className="w-[60px] h-[30px] sm:w-[70px] sm:h-[40px] rounded-md bg-gray-400/70 mb-2" />
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] rounded-full bg-gray-400/70"
              />
            ))}
          </div>
          <Skeleton className="w-[70px] h-[12px] sm:w-[80px] sm:h-[14px] rounded-md bg-gray-400/70" />
        </div>

        {/* 🔹 Barras de distribución */}
        <div className="flex flex-col w-full sm:w-1/2 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-2">
              <Skeleton className="w-[18px] h-[12px] sm:w-[20px] sm:h-[14px] rounded-md bg-gray-400/70" />
              <Skeleton className="flex-grow h-[6px] sm:h-[8px] rounded-full bg-gray-400/70" />
              <Skeleton className="w-[18px] h-[12px] sm:w-[20px] sm:h-[14px] rounded-md bg-gray-400/70" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="w-full h-[36px] sm:h-[42px] rounded-lg bg-gray-400/70" />
    </div>
  </FadeWrapper>
);
export const SkeletonStoreBanner = ({
  count = 6,
  show = true,
}: {
  count?: number;
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mx-4 md:mx-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative flex flex-col bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden w-full max-w-[30rem] mx-auto font-quicksand animate-pulse sm:w-[35rem] min-h-[25rem] sm:min-h-[26rem]"
        >
          {/* Banner superior */}
          <div className="relative h-30 sm:h-28 md:h-40">
            <Skeleton className="h-full w-full rounded-2xl m-2 bg-gray-400/70" />
          </div>

          {/* Logo circular superpuesto */}
          <div className="absolute top-16 left-5 sm:top-25 sm:left-6">
            <Skeleton className="w-25 h-25 sm:w-18 sm:h-18 md:w-30 md:h-30 rounded-full bg-gray-400/70 border-4 border-white" />
          </div>

          {/* Contenido */}
          <div className="flex relative flex-col items-center pt-14 sm:pt-5 pb-6 px-4 text-center flex-1">
            {/* Badge de categoría */}
            <Skeleton className="absolute top-2 right-3 w-[80px] h-[20px] rounded-full bg-gray-400/70" />

            {/* Nombre de la tienda */}
            <Skeleton className="w-[60%] h-[24px] sm:h-[28px] mt-4 sm:mt-5 rounded-md bg-gray-400/70" />

            {/* Estrellas de rating */}
            <div className="flex gap-1 mt-1 sm:mt-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton
                  key={j}
                  className="w-[16px] h-[16px] rounded-full bg-gray-400/70"
                />
              ))}
            </div>

            {/* Descripción */}
            <div className="mt-3 w-full flex flex-col gap-1">
              <Skeleton className="w-full h-[12px] rounded-md bg-gray-400/70" />
              <Skeleton className="w-5/6 h-[12px] mx-auto rounded-md bg-gray-400/70" />
              <Skeleton className="w-4/6 h-[12px] mx-auto rounded-md bg-gray-400/70" />
            </div>

            {/* Botón */}
            <div className="mt-auto w-full sm:w-[80%]">
              <Skeleton className="w-full h-[40px] sm:h-[48px] rounded-full bg-gray-400/70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </FadeWrapper>
);
export const SkeletonSellerReviews: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <section className="mx-4 md:mx-10 my-5 font-quicksand animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3 sm:gap-0">
        <Skeleton className="w-1/2 sm:w-1/3 h-[24px] sm:h-[28px] rounded-md bg-gray-400/70" />
        <Skeleton className="w-[70px] h-[24px] sm:w-[80px] sm:h-[28px] rounded-full bg-gray-400/70" />
      </div>

      <div className="flex flex-col md:flex-row w-full gap-6 md:gap-10">
        {/* 🔸 Columna izquierda: resumen/formulario */}
        <div className="flex flex-col w-full md:w-[35%] border border-main rounded-2xl p-4 bg-white">
          <div className="flex flex-col items-center mb-4">
            <Skeleton className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full mb-3 bg-gray-400/70" />
            <Skeleton className="w-1/3 h-[18px] md:h-[20px] mb-2 rounded-md bg-gray-400/70" />
            <Skeleton className="w-1/2 h-[12px] md:h-[14px] rounded-md bg-gray-400/70" />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-4 h-2 rounded-full bg-gray-400/70" />
                <Skeleton className="w-full h-2 rounded-full bg-gray-400/70" />
              </div>
            ))}
          </div>

          <Skeleton className="w-full h-[36px] md:h-[40px] rounded-lg bg-gray-400/70 mt-4" />
        </div>

        {/* 🔹 Columna derecha: reseñas */}
        <div className="flex flex-col w-full md:w-[65%] md:pl-10">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="w-[80px] h-[18px] md:w-[100px] md:h-[20px] rounded-md bg-gray-400/70" />
            <Skeleton className="w-[30px] h-[18px] md:w-[40px] md:h-[20px] rounded-full bg-gray-400/70" />
          </div>

          <div className="space-y-4 md:space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border border-main/20 rounded-2xl p-4 shadow-sm bg-white"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-full bg-gray-400/70" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-[100px] h-[12px] md:w-[120px] md:h-[14px] rounded-md bg-gray-400/70" />
                    <Skeleton className="w-[70px] h-[10px] md:w-[80px] md:h-[12px] rounded-md bg-gray-400/70" />
                  </div>
                </div>
                <Skeleton className="w-full h-[12px] mb-2 rounded-md bg-gray-400/70" />
                <Skeleton className="w-3/4 h-[12px] mb-2 rounded-md bg-gray-400/70" />
                <Skeleton className="w-2/3 h-[12px] rounded-md bg-gray-400/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </FadeWrapper>
);

/* ============================================================
   💎 Skeleton para productos normales (tarjetas verticales)
   ============================================================ */
export const SkeletonProduct = ({
  count = 5,
  show = true,
}: {
  count?: number;
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 my-10 gap-4 md:gap-5 px-4 md:px-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-[280px] sm:h-[340px] w-full p-3 bg-light-gray rounded-2xl shadow-md"
        >
          <Skeleton className="w-full h-[140px] sm:h-[180px] rounded-2xl mb-3 sm:mb-4 bg-gray-400/70" />
          <Skeleton className="w-4/5 h-[14px] sm:h-[16px] mx-auto mb-1 sm:mb-2 rounded-md bg-gray-400/70" />
          <Skeleton className="w-1/2 h-[10px] sm:h-[12px] mx-auto mb-2 sm:mb-3 rounded-md bg-gray-400/70" />
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="w-1/2 h-[12px] sm:h-[14px] rounded-md bg-gray-400/70" />
            <Skeleton className="w-2/3 h-[12px] sm:h-[14px] rounded-md bg-gray-400/70" />
          </div>
        </div>
      ))}
    </div>
  </FadeWrapper>
);

/* ============================================================
   ⭐ Skeleton para productos destacados (tarjetas horizontales)
   ============================================================ */
export const SkeletonFeatured = ({
  count = 2,
  show = true,
}: {
  count?: number;
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="flex flex-col lg:flex-row gap-4 md:gap-8 overflow-hidden mt-6 justify-center px-4 md:px-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative w-full lg:w-[600px] p-4 md:p-5 bg-light-gray rounded-2xl shadow-md overflow-hidden flex flex-col sm:flex-row font-quicksand"
        >
          <div className="w-full sm:w-1/2 flex items-center justify-center mb-4 sm:mb-0">
            <Skeleton className="w-full h-[150px] sm:w-[90%] sm:h-[230px] rounded-2xl bg-gray-400/70" />
          </div>
          <div className="flex flex-col justify-between w-full sm:w-1/2 sm:pl-6 py-1">
            <Skeleton className="w-2/3 h-[12px] md:h-[14px] mb-2 rounded-md bg-gray-400/70" />
            <Skeleton className="w-4/5 h-[16px] md:h-[20px] mb-4 rounded-md bg-gray-400/70" />
            <div className="flex gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton
                  key={j}
                  className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full bg-gray-400/70"
                />
              ))}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Skeleton className="w-1/2 h-[12px] md:h-[14px] rounded-md bg-gray-400/70" />
              <Skeleton className="w-2/3 h-[12px] md:h-[14px] rounded-md bg-gray-400/70" />
            </div>
            <div className="flex gap-2 w-full">
              <Skeleton className="w-full h-[32px] md:h-[38px] rounded-full bg-gray-400/70" />
              <Skeleton className="w-[40px] h-[32px] md:w-[45px] md:h-[38px] rounded-full bg-gray-400/70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </FadeWrapper>
);

/* ============================================================
   🧭 Skeleton para categorías (CategoryCard)
   ============================================================ */
export const SkeletonCategory = ({
  count = 4,
  show = true,
}: {
  count?: number;
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 my-6 md:my-10 justify-items-center px-4 md:px-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative w-full h-[120px] sm:w-55 sm:h-22 flex flex-col items-center justify-center rounded-2xl overflow-hidden shadow-md bg-light-gray"
        >
          <Skeleton className="absolute inset-0 w-full h-full rounded-2xl bg-gray-400/70" />
          <Skeleton className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full bg-gray-400/70 z-10 mb-2" />
          <Skeleton className="w-[70px] h-[12px] md:w-[80px] md:h-[14px] rounded-md bg-gray-400/70 z-10" />
        </div>
      ))}
    </div>
  </FadeWrapper>
);
/* ============================================================
   🧩 Skeleton de página de producto completo
   ============================================================ */
export const SkeletonProductPageMain = ({
  show = true,
}: {
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="flex flex-col lg:flex-row px-4 md:px-10 pt-5 md:pt-10 font-quicksand animate-pulse gap-6 lg:gap-10">
      {/* 🔹 Imagen principal + botones de acción (columna izquierda) */}
      <div className="w-full lg:w-3/12 flex flex-col gap-4 md:gap-6">
        <Skeleton className="w-full h-[250px] md:h-[350px] rounded-2xl bg-gray-400/70" />
        <div className="border-t-2 border-main pt-4 md:pt-6">
          <div className="flex justify-between gap-2">
            <Skeleton className="w-1/2 h-[36px] md:h-[40px] rounded-full bg-gray-400/70" />
            <Skeleton className="w-1/2 h-[36px] md:h-[40px] rounded-full bg-gray-400/70" />
          </div>
        </div>
      </div>

      {/* 🔹 Columna central (nombre, precio, tabs, descripción) */}
      <div className="w-full lg:w-6/12 lg:px-10 lg:border-r-2 border-main lg:mr-5">
        <div className="flex flex-col gap-3 md:gap-4">
          <Skeleton className="w-full sm:w-3/4 h-[24px] md:h-[28px] rounded-md bg-gray-400/70" />
          <Skeleton className="w-1/2 sm:w-1/3 h-[16px] md:h-[18px] rounded-md bg-gray-400/70" />
          <Skeleton className="w-1/3 sm:w-1/4 h-[14px] md:h-[16px] rounded-md bg-gray-400/70" />
          <Skeleton className="w-3/4 sm:w-1/2 h-[28px] md:h-[32px] rounded-md bg-gray-400/70" />
        </div>

        {/* Tabs */}
        <div className="flex justify-between my-6 md:my-10 gap-2">
          <Skeleton className="w-1/3 h-[36px] md:w-[120px] md:h-[40px] rounded-full bg-gray-400/70" />
          <Skeleton className="w-1/3 h-[36px] md:w-[120px] md:h-[40px] rounded-full bg-gray-400/70" />
          <Skeleton className="w-1/3 h-[36px] md:w-[120px] md:h-[40px] rounded-full bg-gray-400/70" />
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full h-[12px] md:h-[14px] rounded-md bg-gray-400/70"
            />
          ))}
        </div>
      </div>

      {/* 🔹 Columna de compra (ShoppingForm) - columna derecha */}
      <div className="w-full lg:w-3/12 flex flex-col gap-4">
        <Skeleton className="w-full h-[200px] md:h-[260px] rounded-2xl bg-gray-400/70" />
        <Skeleton className="w-full h-[40px] md:h-[50px] rounded-full bg-gray-400/70" />
        <Skeleton className="w-full h-[40px] md:h-[50px] rounded-full bg-gray-400/70" />
      </div>
    </div>
  </FadeWrapper>
);

/* ============================================================
   🎠 Skeleton del slider de productos destacados
   ============================================================ */
export const SkeletonFeaturedSlider = ({ show = true }: { show?: boolean }) => (
  <FadeWrapper show={show}>
    <div className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 mt-6 justify-start md:justify-center animate-pulse px-4 md:px-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="relative flex-shrink-0 w-[240px] md:w-[300px] p-3 bg-light-gray rounded-2xl shadow-md overflow-hidden flex flex-col snap-start"
        >
          <Skeleton className="w-full h-[140px] md:h-[160px] rounded-2xl mb-3 md:mb-4 bg-gray-400/70" />
          <Skeleton className="w-4/5 h-[14px] md:h-[16px] mb-1 md:mb-2 rounded-md bg-gray-400/70 mx-auto" />
          <Skeleton className="w-1/2 h-[12px] md:h-[14px] mb-1 md:mb-2 rounded-md bg-gray-400/70 mx-auto" />
          <Skeleton className="w-2/3 h-[12px] md:h-[14px] mb-1 md:mb-2 rounded-md bg-gray-400/70 mx-auto" />
        </div>
      ))}
    </div>
  </FadeWrapper>
);

/* ============================================================
   🛒 Skeleton de productos similares
   ============================================================ */
export const SkeletonSimilarProducts = ({
  show = true,
}: {
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 my-6 md:my-10 animate-pulse px-4 md:px-0">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-[280px] md:h-[320px] w-full p-3 bg-light-gray rounded-2xl shadow-md"
        >
          <Skeleton className="w-full h-[140px] md:h-[180px] rounded-2xl mb-3 md:mb-4 bg-gray-400/70" />
          <Skeleton className="w-4/5 h-[14px] md:h-[16px] mx-auto mb-1 md:mb-2 rounded-md bg-gray-400/70" />
          <Skeleton className="w-1/2 h-[10px] md:h-[12px] mx-auto mb-2 md:mb-3 rounded-md bg-gray-400/70" />
          <Skeleton className="w-1/2 h-[12px] md:h-[14px] rounded-md mx-auto bg-gray-400/70" />
        </div>
      ))}
    </div>
  </FadeWrapper>


);
export const SkeletonHeaderSlider: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <div className="relative mx-4 md:mx-10 h-[20rem] md:h-[30rem] flex items-center justify-center animate-pulse">
      {/* 🔹 Rectángulo principal simulando el banner */}
      <Skeleton className="w-[95%] md:w-[90%] h-[70%] md:h-[80%] rounded-2xl md:rounded-3xl bg-gray-400/70 shadow-md" />

      {/* 🔹 Botón izquierdo (simulación de CarouselPrevious) */}
      <div className="absolute left-2 md:left-6 flex items-center justify-center">
        <Skeleton className="w-[36px] h-[36px] md:w-[44px] md:h-[44px] rounded-full bg-gray-400/70 shadow" />
      </div>

      {/* 🔹 Botón derecho (simulación de CarouselNext) */}
      <div className="absolute right-2 md:right-6 flex items-center justify-center">
        <Skeleton className="w-[36px] h-[36px] md:w-[44px] md:h-[44px] rounded-full bg-gray-400/70 shadow" />
      </div>
    </div>
  </FadeWrapper>
);

export const SkeletonShortBanner: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] rounded-2xl overflow-hidden bg-gray-300/60 shadow-md animate-pulse font-quicksand">
      {/* Fondo simulado */}
      <Skeleton className="absolute inset-0 w-full h-full bg-gray-400/70" />

      {/* Contenido "glass" central */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between h-full px-6 sm:px-10 py-5 sm:py-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl">
        {/* Texto */}
        <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-2/3 text-center sm:text-left">
          <Skeleton className="w-3/4 h-[20px] sm:h-[24px] rounded-md bg-gray-400/70 mx-auto sm:mx-0" />
          <Skeleton className="w-1/2 h-[16px] sm:h-[18px] rounded-md bg-gray-400/70 mx-auto sm:mx-0" />
          <Skeleton className="w-[120px] h-[36px] sm:h-[40px] rounded-full bg-gray-400/70 mx-auto sm:mx-0 mt-2" />
        </div>

        {/* Imagen/personaje simulado */}
        <div className="flex items-end justify-center w-1/2 sm:w-1/3 mt-5 sm:mt-0">
          <Skeleton className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] rounded-xl bg-gray-400/70" />
        </div>
      </div>
    </div>
  </FadeWrapper>
);

export const SkeletonPersonalProduct = ({
  count = 5,
  show = true,
}: {
  count?: number;
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 my-6 md:my-10 gap-4 md:gap-6 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-[280px] md:h-[340px] w-full p-3 bg-light-gray rounded-2xl shadow-md animate-pulse"
        >
          <Skeleton className="w-full h-[140px] md:h-[180px] rounded-2xl mb-3 md:mb-4 bg-gray-400/70" />
          <Skeleton className="w-4/5 h-[14px] md:h-[16px] mx-auto mb-1 md:mb-2 rounded-md bg-gray-400/70" />
          <Skeleton className="w-1/2 h-[10px] md:h-[12px] mx-auto mb-2 md:mb-3 rounded-md bg-gray-400/70" />
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="w-1/2 h-[12px] md:h-[14px] rounded-md bg-gray-400/70" />
            <Skeleton className="w-2/3 h-[12px] md:h-[14px] rounded-md bg-gray-400/70" />
          </div>
        </div>
      ))}
    </div>
  </FadeWrapper>
);


export const SkeletonCartPage = () => (
  <div className="animate-pulse">
    <div className="mx-auto max-w-[80rem] px-4 sm:px-10">

      <div className="flex pt-10 pb-4">
        <Skeleton className="w-[150px] sm:w-[200px] h-[30px] rounded-md bg-gray-400/70" />
      </div>


      <section className="mx-4 sm:mx-10 flex flex-col sm:flex-row gap-6">
        <div className="my-5 w-full sm:w-2/3 sm:border-r-2 sm:pr-5 border-gray-200 flex flex-col gap-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center p-3 sm:p-5 rounded-xl border border-gray-200">
              <Skeleton className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-lg bg-gray-400/70 shrink-0" />

              <div className="flex flex-col ml-4 sm:ml-6 w-full gap-2">
                <Skeleton className="w-full sm:w-3/4 h-[16px] rounded-md bg-gray-400/70" />
                <Skeleton className="w-1/2 sm:w-1/4 h-[12px] rounded-md bg-gray-400/70" />
                <div className="flex justify-between items-center mt-1">
                  <Skeleton className="w-[40px] h-[40px] rounded-full bg-gray-400/70" />
                </div>
              </div>
            </div>
          ))}


          <section className="flex flex-col items-center justify-center text-center py-10">
            <Skeleton className="w-[150px] h-[20px] mb-2 rounded-md bg-gray-400/70" />
            <Skeleton className="w-2/3 h-[12px] mb-1 rounded-md bg-gray-400/70" />
            <Skeleton className="w-[120px] h-[36px] rounded-full bg-gray-400/70 mt-3" />
          </section>
        </div>


        <div className="my-5 sm:my-10 sm:pl-10 w-full sm:w-1/3">
          <div className="p-4 border rounded-xl shadow-lg flex flex-col gap-4">
            <Skeleton className="w-3/4 h-[24px] rounded-md bg-gray-400/70" />
            <Skeleton className="w-full h-[40px] rounded-lg bg-gray-400/70" />
            <div className="flex flex-col gap-2 border-t pt-4">
              <Skeleton className="w-1/2 h-[16px] rounded-md bg-gray-400/70 self-end" />
              <Skeleton className="w-1/2 h-[16px] rounded-md bg-gray-400/70 self-end" />
            </div>
            <Skeleton className="w-full h-[48px] rounded-full mt-2 bg-gray-400/70" />
          </div>
        </div>
      </section>


      <section className="mx-4 sm:mx-10 my-6 sm:my-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 justify-center items-end">
          <Skeleton className="w-full h-[150px] sm:h-[200px] rounded-xl bg-gray-400/70" />
          <Skeleton className="w-full h-[150px] sm:h-[200px] rounded-xl bg-gray-400/70 hidden sm:block" />
        </div>
      </section>
    </div>
  </div>
);


export const SkeletonWishlistPage = () => (
  <div className="animate-pulse">
    <div className="mx-auto max-w-[80rem] px-4 sm:px-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-10 pb-6">
        <Skeleton className="w-[180px] sm:w-[250px] h-[30px] rounded-md bg-gray-400/70" />
        <Skeleton className="w-[160px] h-[36px] rounded-full bg-gray-400/70 hidden sm:block" />
      </div>


      <section className="mt-6 flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-start sm:items-center p-4 border rounded-xl shadow-sm"
          >

            <Skeleton className="w-[100px] h-[100px] rounded-lg bg-gray-400/70 shrink-0 mb-3 sm:mb-0" />


            <div className="flex flex-grow justify-between w-full sm:ml-6 flex-col sm:flex-row">

              <div className="flex flex-col gap-2">
                <Skeleton className="w-[80%] h-[20px] rounded-md bg-gray-400/70" />
                <Skeleton className="w-[50%] h-[14px] rounded-md bg-gray-400/70" />
                <Skeleton className="w-[30%] h-[18px] mt-2 rounded-md bg-gray-400/70" />
              </div>


              <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0">
                <Skeleton className="w-[120px] h-[40px] rounded-full bg-gray-400/70" />
                <Skeleton className="w-[80px] h-[30px] rounded-full bg-gray-400/70" />
              </div>
            </div>
          </div>
        ))}
      </section>


      <section className="flex flex-col items-center justify-center text-center py-10 px-4 sm:px-0">
        <Skeleton className="w-[200px] h-[24px] mb-3 rounded-md bg-gray-400/70" />
        <Skeleton className="w-full sm:w-[400px] h-[48px] rounded-full mt-2 bg-gray-400/70" />
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 justify-center items-end">
        {/* Skeletons del banner corto (SHORT) */}
        <div className="flex flex-col items-center">
          <div className="mb-2 w-full">
            <SkeletonShortBanner />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-2 w-full">
            <SkeletonShortBanner />
          </div>
        </div>
      </div>
    </div>
  </div>
);


export const SkeletonUserPage = () => (
  <div className="animate-pulse">

    <div className="sm:hidden flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <Skeleton className="w-[120px] h-[24px] rounded-md bg-gray-400/70" />
      <Skeleton className="w-[26px] h-[26px] rounded-full bg-gray-400/70" />
    </div>

    <section className="flex flex-col sm:flex-row px-4 sm:px-10 py-6 sm:py-10 mx-auto max-w-[80rem] relative gap-6">

      <div className="hidden sm:block w-[25%] shrink-0">
        <div className="flex flex-col gap-3 p-4 border rounded-xl bg-white shadow-sm">
          <Skeleton className="w-3/4 h-[20px] rounded-md bg-gray-400/70 mb-3" />

          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[40px] rounded-lg bg-gray-400/70" />
          ))}
        </div>
      </div>


      <div className="w-full sm:w-[75%]">
        <div className="p-4 sm:p-6 border rounded-xl bg-white shadow-sm">

          <Skeleton className="w-[200px] h-[30px] rounded-md bg-gray-400/70 mb-6" />


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex flex-col gap-2">
              <Skeleton className="w-1/4 h-[14px] rounded-md bg-gray-400/70" />
              <Skeleton className="w-full h-[40px] rounded-lg bg-gray-400/70" />
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="w-1/4 h-[14px] rounded-md bg-gray-400/70" />
              <Skeleton className="w-full h-[40px] rounded-lg bg-gray-400/70" />
            </div>

            <Skeleton className="w-[150px] h-[45px] rounded-full mt-8 ml-auto bg-gray-400/70 md:col-span-2" />
          </div>
        </div>
      </div>
    </section>
  </div>
);
export const SkeletonStoreHeader: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <div className="w-full h-[10rem] md:h-[15rem] px-4 md:px-5 animate-pulse">
      <Skeleton className="w-full h-full rounded-2xl bg-gray-400/70" />
    </div>
  </FadeWrapper>
);