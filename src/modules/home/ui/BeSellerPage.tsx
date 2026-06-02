import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import character from "../../../img/resources/caja.png";
import { useNavigate } from "react-router-dom";
import BannerComponent from "../../../components/data-display/BannerComponent";
import {
  IconBuildingBank,
  IconFileText,
  IconId,
  IconPackage,
} from "@tabler/icons-react";

export default function BeSellerPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white font-quicksand">
      <NavBar />

      <main className="mx-auto w-full max-w-[80rem] flex flex-col items-center justify-center px-4 sm:px-8">
        {/* 🟣 Hero principal */}
        <BannerComponent
          type="LARGE"
          image="https://res.cloudinary.com/dpbghs8ep/image/upload/v1761936416/fondoNegro_pxlaji.png"
          title="Crea una cuenta de vendedor en TukiShop"
          btn_color="GRADIENTE"
          btn_text="Registrarse"
          character={character}
          link="/registerSeller"
        />

        {/* 🟣 Intro */}
        <section className="flex flex-col justify-center items-center text-center w-full sm:w-3/4 mx-auto py-20 px-3 text-gray-800 leading-relaxed">
          <p className="text-sm sm:text-2xl md:text-3xl">
            ¿Qué esperas para tener tu propia tienda virtual y llegar a más de{" "}
            <span className="font-semibold text-main">5.000.000 de ticos</span>?
            Ofrece tus productos, expande tu alcance y comienza a vender en todo
            el territorio costarricense. ¡Únete a{" "}
            <span className="text-contrast-secondary font-semibold">
              TukiShop
            </span>{" "}
            hoy mismo!
          </p>
        </section>

        {/* 🟣 Requisitos */}
        <section className="w-full py-20 px-6 bg-gray-50 rounded-3xl shadow-inner relative overflow-hidden my-10">
          <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-main via-contrast-secondary to-contrast-main"></div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold text-purple-main mb-6">
              Requisitos para vender en TukiShop
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-14 leading-relaxed">
              Antes de comenzar a vender en nuestra plataforma, asegúrate de
              cumplir con los siguientes requisitos. Esto garantiza una
              experiencia segura y confiable para vos y tus clientes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
              {[
                {
                  num: "01",
                  color: "text-purple-main",
                  title: "Cédula vigente",
                  desc: "Tener cédula jurídica o física costarricense vigente.",
                  icon: <IconId size={42} stroke={1.5} />,
                },
                {
                  num: "02",
                  color: "text-contrast-secondary",
                  title: "Cuenta bancaria",
                  desc: "Contar con una cuenta bancaria nacional para recibir pagos.",
                  icon: <IconBuildingBank size={42} stroke={1.5} />,
                },
                {
                  num: "03",
                  color: "text-purple-main",
                  title: "Información verídica",
                  desc: "Proveer información real sobre tu negocio y productos.",
                  icon: <IconPackage size={42} stroke={1.5} />,
                },
                {
                  num: "04",
                  color: "text-contrast-secondary",
                  title: "Términos y condiciones",
                  desc: "Aceptar los términos y condiciones de venta en línea.",
                  icon: <IconFileText size={42} stroke={1.5} />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between items-center bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 border border-gray-100"
                >
                  <h3
                    className={`text-6xl font-bold ${item.color} mb-4 leading-none opacity-90`}
                  >
                    {item.num}
                  </h3>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-base mb-6 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className={`opacity-80 ${item.color}`}>{item.icon}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🟣 Cómo empezar */}
        {/* 🟣 Cómo empezar */}
<section className="w-full py-20 bg-white my-10 relative">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-16 text-purple-main">
      ¿Cómo empezar a vender?
    </h2>

    {/* 🔹 Timeline desktop */}
    <div className="hidden sm:block relative mb-20">
      {/* Línea principal */}
      <div className="absolute top-[45px] left-[10%] w-[80%] h-[3px] bg-purple-main/10 z-0"></div>

      {/* Círculos numerados */}
      <div className="grid grid-cols-4 relative z-10">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center bg-purple-main text-white font-bold text-2xl rounded-full shadow-md">
              {num}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 🔹 Timeline mobile */}
    <div className="sm:hidden flex flex-col items-center relative mb-12">
      <div className="absolute left-[50%] top-[2rem] bottom-0 w-[3px] bg-purple-main/10 -translate-x-1/2 z-0"></div>
    </div>

    {/* 🔹 Cards con pasos (ambos modos) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
      {[
        {
          num: 1,
          icon: <IconId size={38} stroke={1.5} />,
          title: "Regístrate",
          desc: "Crea tu cuenta de vendedor en TukiShop con tus datos y negocio.",
        },
        {
          num: 2,
          icon: <IconFileText size={38} stroke={1.5} />,
          title: "Verificación",
          desc: "Nuestro equipo revisará tu información para validar y activar tu cuenta.",
        },
        {
          num: 3,
          icon: <IconPackage size={38} stroke={1.5} />,
          title: "Publica tus productos",
          desc: "Agrega tus artículos con fotos, precios y descripciones claras.",
        },
        {
          num: 4,
          icon: <IconBuildingBank size={38} stroke={1.5} />,
          title: "Comienza a vender",
          desc: "Recibe pedidos y haz crecer tu negocio con TukiShop.",
        },
      ].map((step, i) => (
        <div key={i} className="relative flex flex-col items-center text-center">
          {/* Número (mobile) */}
          <div className="sm:hidden w-12 h-12 flex items-center justify-center bg-purple-main text-white font-bold text-lg rounded-full shadow-md absolute -top-8 z-10">
            {step.num}
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all p-8 w-full h-full flex flex-col justify-between">
            <div className="text-purple-main mb-4 mx-auto">{step.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


        {/* 🟣 Beneficios */}
        <section className="w-full py-20 bg-gray-50 rounded-3xl relative overflow-hidden my-10">
          <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-main via-contrast-secondary to-contrast-main"></div>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-purple-main mb-6">
              Beneficios de vender con nosotros
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
              En TukiShop te ofrecemos herramientas, soporte y visibilidad para
              hacer crecer tu negocio digital en todo el territorio
              costarricense.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {[
                {
                  icon: <IconBuildingBank size={48} stroke={1.5} />,
                  title: "Mayor visibilidad",
                  desc: "Llega a miles de clientes en todo Costa Rica y aumenta tus ventas en línea.",
                },
                {
                  icon: <IconPackage size={48} stroke={1.5} />,
                  title: "Personalización avanzada",
                  desc: "Crea tu tienda con tu marca, tus colores, tu estilo y tus propios productos.",
                },
                {
                  icon: <IconFileText size={48} stroke={1.5} />,
                  title: "Soporte dedicado",
                  desc: "Nuestro equipo te acompaña en cada paso del proceso de venta y crecimiento.",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all p-10 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2"
                >
                  <div className="text-purple-main mb-5 group-hover:text-contrast-secondary transition">
                    {b.icon}
                  </div>
                  <h3 className="font-semibold text-xl text-purple-main mb-3">
                    {b.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🟣 CTA final */}
        <section className="py-20 bg-gradient-to-br from-main via-contrast-secondary to-contrast-main text-white text-center w-full rounded-3xl shadow-lg relative overflow-hidden my-10">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-lg">
              ¿Listo para empezar?
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto font-light opacity-90 leading-relaxed">
              Crea tu cuenta hoy mismo y comienza a vender con la plataforma que
              impulsa el comercio digital en Costa Rica.
            </p>
            <button
              onClick={() => navigate("/registerSeller")}
              className="cursor-pointer bg-white text-purple-main font-semibold py-4 px-10 rounded-full shadow-md hover:shadow-xl transition transform hover:scale-105"
            >
              Registrarse como vendedor
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
