import Footer from "../layout/Footer";
import NavBar from "../layout/NavBar";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />

      {/* Contenido principal */}
      <main className="flex flex-col items-center justify-start flex-grow w-full pt-20 pb-10">
        <h1 className="text-6xl font-bold text-main-dark text-center mb-10">
          Se te perdió algo?
        </h1>

        {/* Contenedor de las tres imágenes */}
        <div className="flex items-center justify-center gap-10 flex-wrap">
          <img
            src="https://res.cloudinary.com/dpbghs8ep/image/upload/v1760935791/BCO.d7a21873-90b9-4e80-b8b6-d7133c2bcc46_odqzz0.png"
            alt="Decoración izquierda"
            className="w-[250px] max-w-[30%] h-auto object-contain"
          />

          <img
            src="https://res.cloudinary.com/dpbghs8ep/image/upload/v1761953341/Copilot_20251031_172751_aaqf8v.png"
            alt="Página en desarrollo"
            className="w-[400px] max-w-[50%] h-auto object-contain"
          />

          <img
            src="https://res.cloudinary.com/dpbghs8ep/image/upload/v1760935791/BCO.b981ed62-b13e-4c25-b825-e88e71175083_uhach7.png"
            alt="Decoración derecha"
            className="w-[250px] max-w-[30%] h-auto object-contain"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
