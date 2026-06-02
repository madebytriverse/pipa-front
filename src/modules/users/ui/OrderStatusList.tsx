export default function OrderStatusList() {
  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-white pt-20">
      {/* Texto arriba */}
      <h1 className="text-6xl font-bold text-main-dark text-center mb-10">
        Algo salió mal :(
      </h1>

      {/* Imagen centrada horizontalmente */}
      <img
        src="https://res.cloudinary.com/dpbghs8ep/image/upload/v1760934636/BCO.2b76e8fe-7bd8-4e03-9032-7ffca2e5958d_lujw2e.png"
        alt="Página en desarrollo"
        className="w-[600px] max-w-[80%] h-auto object-contain"
      />
    </div>
  );
}
