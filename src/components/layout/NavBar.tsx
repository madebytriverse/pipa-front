import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IconBuildingStore,
  IconHeart,
  IconLogout2,
  IconSearch,
  IconShoppingBag,
  IconUser,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import logo from "../../img/logopipa.png";
import ButtonComponent from "../ui/ButtonComponent";
import { useAuth } from "../../hooks/context/AuthContext";
import { useWishlist } from "../../modules/users/infrastructure/useWishList";
import NotificationDropdown from "../data-display/NotificationDropDown";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../hooks/context/CartContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const { itemCount, refreshCart } = useCart();
  const { wishlist, fetchWishlist } = useWishlist();
  const [suggestions, setSuggestions] = useState<
    { id: number; name: string; image_1_url: string; store_name: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchQuery(q);
  }, [location.search]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActiveLink = (path: string, searchParams?: string): boolean => {
    if (location.pathname === path && !searchParams) {
      return true;
    }
    if (location.pathname === path && searchParams) {
      return location.search.includes(searchParams);
    }
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return false;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `/products/search?q=${encodeURIComponent(value)}`
        );
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error cargando sugerencias", err);
      }
    }, 300); // ⏳ debounce 300ms
  };

  const handleSelectSuggestion = (productId: number) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    setSearchQuery("");
  };
  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  useEffect(() => {
    const handleCartUpdate = () => refreshCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const displayName =
    user?.role === "SELLER" && user?.store?.name
      ? user.store.name
      : user?.username || "";

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/loginRegister", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-dropdown")) setShowUserMenu(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navLinkClass = (isActive: boolean) =>
    `transition-all duration-200 cursor-pointer relative ${
      isActive
        ? "font-semibold before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-naranja"
        : ""
    } hover:translate-y-[-2px] `;

  const mobileLinkClass = (isActive: boolean) =>
    `${isActive ? "font-semibold text-main-dark" : "text-main-dark"}`;

  return (
    <nav className="bg-beige border-b border-gris-calido/40 px-4 sm:px-30 pt-4 pb-4 sm:pb-0 font-quicksand relative z-50">
      {/* Barra superior */}
      <div className="flex w-full justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="w-1/3 flex items-center p-1"
        >
          <img src={logo} alt="Pipa" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center bg-white border border-taupe/60 rounded-full px-0.5 w-1/3 relative">
  {/* Campo de búsqueda con sugerencias */}
  <input
    type="text"
    className="w-full h-10 p-3 rounded-full focus:outline-none"
    placeholder="Buscar productos..."
    value={searchQuery}
    onChange={handleInputChange}
    onFocus={() => setShowSuggestions(true)}
    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  />

  {/* 🔍 Botón de búsqueda */}
  <div className="absolute right-1 top-1/2 -translate-y-1/2">
    <ButtonComponent
      style="bg-naranja cursor-pointer rounded-full w-10 h-9 flex items-center justify-center hover:bg-chocolate transition-colors"
      icon={<IconSearch className="text-white h-5 w-5 stroke-3" />}
      onClick={handleSearch}
    />
  </div>

  {/* 📋 Sugerencias desplegables */}
  {showSuggestions && suggestions.length > 0 && (
    <ul className="absolute top-11 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
      {suggestions.map((p) => (
        <li
          key={p.id}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-all"
          onMouseDown={() => handleSelectSuggestion(p.id)}
        >
          <img
            src={p.image_1_url}
            alt={p.name}
            className="w-8 h-8 object-cover rounded-md"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">{p.name}</span>
            <span className="text-xs text-gray-500">{p.store_name}</span>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>


        {/* Íconos desktop */}
        <div className="hidden md:flex text-carbon items-center w-1/3 justify-end">
          {/* Usuario */}
          <div className="relative user-dropdown">
            {user ? (
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setShowUserMenu((prev) => !prev)}
              >
                {/* Imagen de perfil */}
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Perfil"
                    className="w-8 h-8 rounded-full object-contain border border-taupe shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-chocolate flex items-center justify-center">
                    <p className="uppercase text-white font-semibold relative -top-0.25">
                      {user.username[0]}
                    </p>
                  </div>
                )}
                {/* Nombre del usuario */}
                <span className="text-sm sm:text-base">{displayName}</span>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -right-4 top-8 bg-white text-main-dark rounded-lg shadow-lg w-44 overflow-hidden"
                    >
                      <ul className="flex flex-col text-sm">
                        <li
                          onClick={() => {
                            navigate("/profile");
                            setShowUserMenu(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        >
                          <IconUser className="h-5 w-5 mr-2" /> Ver perfil
                        </li>
                        {user.role === "SELLER" && (
                          <li
                            onClick={() => {
                              navigate("/store/" + user.store?.id);
                              setShowUserMenu(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          >
                            <IconBuildingStore className="h-5 w-5 mr-2" /> Mi
                            tienda
                          </li>
                        )}
                        <li
                          onClick={() => {
                            handleLogout();
                            setShowUserMenu(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-contrast-secondary"
                        >
                          <IconLogout2 className="h-5 w-5 mr-2" /> Cerrar sesión
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 pr-5">
                <Link
                  to="/loginRegister?mode=login"
                  className="flex items-center gap-1 hover:font-semibold transition-all duration-200"
                >
                  <IconUser className="h-5 w-5" />
                  Iniciar sesión
                </Link>
                <span>|</span>
                <Link
                  to="/loginRegister?mode=register"
                  className="hover:font-semibold transition-all duration-200"
                >
                  Regístrate
                </Link>
              </div>
            )}
          </div>

          {/* Notificaciones */}
          {user && <NotificationDropdown />}

          {/* Lista de deseos */}
          <Link to="/wishlist" className="relative pr-2">
            <IconHeart className="h-6 w-6" />
            {(wishlist?.items?.length ?? 0) > 0 && (
              <span className="absolute -top-1 right-0.5 bg-contrast-secondary text-white text-[10px] font-semibold rounded-full shadow-sm flex items-center justify-center h-4 min-w-[1rem] px-1">
                {wishlist!.items.length > 9 ? "9+" : wishlist!.items.length}
              </span>
            )}
          </Link>

          {/* Carrito */}
          <Link to="/shoppingCart" className="relative">
            <IconShoppingBag className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-contrast-secondary text-white text-[10px] font-bold rounded-full px-1.5">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Íconos móviles y botón menú */}
        <div className="flex md:hidden items-center gap-3 text-carbon">
          {user && <NotificationDropdown />} {/* Notificaciones móviles */}
          {/* Lista de deseos */}
          <Link to="/wishlist" className="relative">
            <IconHeart className="h-6 w-6" />
          </Link>
          {/* Carrito con contador móvil */}
          <Link to="/shoppingCart" className="relative">
            <IconShoppingBag className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 rounded-full shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
          {/* Menú hamburguesa */}
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? <IconX size={26} /> : <IconMenu2 size={26} />}
          </button>
        </div>
      </div>

      <div className="hidden md:block">
        <ul className="flex justify-center gap-10 p-4 text-gris-oscuro text-sm">
          <li
            onClick={() => navigate("/")}
            className={navLinkClass(isActiveLink("/"))}
          >
            Inicio
          </li>
          <li
            onClick={() => navigate("/search?mode=explore")}
            className={navLinkClass(isActiveLink("/search", "mode=explore"))}
          >
            Explorar
          </li>
          <li
            onClick={() => navigate("/search?mode=offers")}
            className={navLinkClass(isActiveLink("/search", "mode=offers"))}
          >
            Ofertas
          </li>
          <li
            onClick={() => navigate("/about")}
            className={navLinkClass(isActiveLink("/about"))}
          >
            Conócenos
          </li>
        </ul>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white text-main-dark rounded-2xl shadow-xl mt-3 p-4 space-y-3 font-medium"
          >
            {/* Buscador */}
            <div className="flex bg-gray-100 rounded-full px-2 py-1">
              <input
                type="text"
                className="flex-grow bg-transparent px-2 focus:outline-none text-sm"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <IconSearch
                onClick={handleSearch}
                className="h-5 w-5 cursor-pointer text-contrast-main"
              />
            </div>

            {/* Enlaces */}
            <div className="flex flex-col gap-2 text-sm">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass(isActiveLink("/"))}
              >
                Inicio
              </Link>
              <Link
                to="/search?mode=explore"
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass(
                  isActiveLink("/search", "mode=explore")
                )}
              >
                Explorar
              </Link>
              <Link
                to="/search?mode=offers"
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass(
                  isActiveLink("/search", "mode=offers")
                )}
              >
                Ofertas
              </Link>
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass(isActiveLink("/about"))}
              >
                Conócenos
              </Link>
            </div>

            {/* Usuario */}
            <div className="border-t pt-2 mt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-sm">
                    {displayName || "Usuario"}
                  </p>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass(isActiveLink("/profile"))}
                  >
                    Ver perfil
                  </Link>
                  {user.role === "SELLER" && (
                    <Link
                      to={`/store/${user.store?.id}`}
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass(
                        isActiveLink(`/store/${user.store?.id}`)
                      )}
                    >
                      Mi tienda
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-contrast-secondary font-semibold text-left"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-1 text-sm">
                  <Link
                    to="/loginRegister?mode=login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/loginRegister?mode=register"
                    onClick={() => setMenuOpen(false)}
                  >
                    Regístrate
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
