import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
} from "@tabler/icons-react";
import logo from "../../img/TukiLogo.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="h-auto py-10 bg-main text-white flex flex-col items-center font-quicksand px-6 sm:px-10 space-y-10">
      {/* Contenedor principal */}
      <div className="flex flex-col sm:flex-row w-full sm:w-[90%] justify-between items-center sm:items-start gap-15 sm:gap-0">
        {/*Columna izquierda: enlaces + redes */}
        <div className="space-y-10 w-full sm:w-[33%] flex flex-col items-center order-2 sm:order-1">
          <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-x-16 sm:gap-y-0 justify-center sm:justify-center
            mx-0 sm:mx-10 pt-0 sm:pt-10 text-sm font-light text-center sm:text-left"
          >
            <ul className="space-y-3 min-w-[7rem]">
              <li><a href="/search?mode=offers">Ofertas</a></li>
              <li><a href="/search/stores">Tiendas</a></li>
              <li><a href="/search?mode=explore">Explorar</a></li>
            </ul>

            <ul className="space-y-3 min-w-[8rem]">
              <li><a href="/about">Conócenos</a></li>
              <li><a href="/beSellerPage">Vender</a></li>
              <li><a href="/help">Ayuda</a></li>
            </ul>

            <ul className="space-y-3 min-w-[9rem]">
              <li><a href="/search?mode=best-sellers">Lo más vendido</a></li>
              <li><a href="/reportProblem">Reportar un problema</a></li>
            </ul>
          </div>

          {/* Sigue dentro de la misma columna */}
          <div className="flex flex-col gap-3 items-center mt-6 sm:mt-0">
            <p className="font-semibold text-xl">Síguenos en</p>
            <div className="flex gap-5">
              <a
                href="https://www.facebook.com/share/17QLNhZePP/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                <IconBrandFacebook />
              </a>
              <a
                href="https://www.instagram.com/tukishop_cr?igsh=MTYyeHNjcHRsbGo0ZQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition-colors"
              >
                <IconBrandInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@tukishopcr?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors"
              >
                <IconBrandTiktok />
              </a>
              <a
                href="https://x.com/TukiShopCR?s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                <IconBrandX />
              </a>
            </div>
          </div>
        </div>

        {/* 🔹 Columna central: logo */}
        <div className="flex flex-col items-center gap-2 w-full sm:w-[33%] order-1 sm:order-2">
          <Link to="/" className="flex flex-col justify-center items-center">
          <img src={logo} alt="TukiShop" className="h-15 w-15" />
          <p className="text-3xl font-fugaz">
            TukiShop
          </p>
          </Link>
        </div>

        {/* 🔹 Columna derecha: llamada a la acción */}
        <div className="flex flex-col gap-8 text-center w-full sm:w-[33%] items-center pt-4 sm:pt-8 order-3 sm:order-3">
          <p className="font-semibold text-xl">¿Tienes dudas o consultas?</p>
          <p className="text-sm text-white/80 max-w-[25rem]">
            Estamos aquí para ayudarte. Si necesitas asistencia o deseas
            comunicarte con nuestro equipo, visita nuestra página de contacto.
          </p>
          <a
            href="/contact"
            className="bg-contrast-secondary hover:bg-contrast-main hover:scale-105 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
          >
            Contáctanos
          </a>
        </div>
      </div>

      {/* Derechos reservados */}
      <p className="text-xs text-center px-4">
        © 2025 Ecom. Todos los derechos reservados. Todas las marcas son
        propiedad de sus respectivos dueños.
      </p>
    </footer>
  );
}
