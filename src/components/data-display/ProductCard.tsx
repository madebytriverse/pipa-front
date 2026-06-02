import { Link, useNavigate } from "react-router-dom";
import { IconEdit, IconShoppingBag, IconCheck } from "@tabler/icons-react";
import ButtonComponent from "../ui/ButtonComponent";
import { useAuth } from "../../hooks/context/AuthContext";
import { useAlert } from "../../hooks/context/AlertContext";
import HeartButton from "./HeartButton";
import { useCart } from "../../hooks/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  shop: string;
  title: string;
  price: number;
  discountPrice?: number;
  img?: string;
  edit: "EDIT" | "EDITING" | "NONE";
  onEditClick?: (id: number) => void; // 👈 nueva prop
}


export default function ProductCard(props: ProductCardProps) {
  const { token } = useAuth();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const formatPrice = (value?: number) => {
    const num = Number(value) || 0;
    return num.toLocaleString("es-CR").replace(/\s/g, ".");
  };

  const handleAnimatedAdd = async () => {
    await handleAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAddToCart = async () => {
    if (!token) {
      showAlert({
        title: "Inicia sesión",
        message: "Debes iniciar sesión para agregar productos al carrito",
        confirmText: "Ir al login",
        cancelText: "Cancelar",
        onConfirm: () => {
          navigate("/loginRegister");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      });
      return;
    }

    try {
      await addToCart(props.id, 1);
    } catch (error) {
      console.error(error);
      showAlert({
        title: "Error al añadir",
        message: "Hubo un problema al añadir el producto al carrito",
        type: "error",
      });
    }
  };

  return (
    <figure className="relative flex flex-col w-44 sm:w-55 h-70 sm:h-90 p-3 bg-beige rounded-2xl shadow-md font-quicksand group transition-all duration-300">
      {/* Edit Button */}
      {props.edit === "EDIT" && (
        <>
          {props.onEditClick ? (
            <button
              onClick={() => props.onEditClick?.(props.id)}
              className="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 bg-chocolate text-white rounded-xl flex items-center justify-center hover:bg-naranja transition-all duration-300"
            >
              <IconEdit />
            </button>
          ) : (
            <Link
              to={`/editProduct/${props.id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ButtonComponent
                style="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 bg-chocolate text-white rounded-xl flex items-center justify-center hover:bg-naranja transition-all duration-300"
                icon={<IconEdit />}
              />
            </Link>
          )}
        </>
      )}


      {/* Favorite Button */}
      {props.edit === "NONE" && (
        <>
          {/* Desktop */}
          <div className="hidden sm:block group-hover:opacity-100 opacity-0 transition-all duration-300 ease-in-out">
            <div className="absolute top-3 right-3">
              <HeartButton productId={props.id} variant="filled" />
            </div>
          </div>

          {/* Mobile */}
          <div className="hidden sm:hidden absolute top-10 right-3">
            <HeartButton productId={props.id} variant="filled" />
          </div>
        </>
      )}

      {/* Cart Button */}
      {props.edit === "NONE" && (
        <button onClick={handleAddToCart}
          className="sm:hidden absolute top-3 right-3 bg-chocolate text-white p-2 rounded-xl hover:bg-naranja transition-all duration-300" >
          <IconShoppingBag size={20} className="stroke-[2.5]" />
        </button>
      )}

      {/* Product Image */}
      {(props.edit === "NONE" || props.edit === "EDIT") && (
        <Link
          to={`/product/${props.id}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-full h-[55%] mb-2"
        >
          <img
            className="w-full h-full object-cover rounded-2xl"
            src={
              props.img ||
              "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg"
            }
            alt={props.title}
          />
        </Link>
      )}
      {props.edit === "EDITING" && (
        <div
          className="w-full h-[55%] mb-2"
        >
          <img
            className="w-full h-full object-cover rounded-2xl"
            src={
              props.img ||
              "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg"
            }
            alt={props.title}
          />
        </div>
      )}

      {/* Product Details */}
      <div className="flex flex-col gap-2 sm:gap-3 h-[45%]">
        {(props.edit === "NONE" || props.edit === "EDIT") && (
          <Link
            to={`/product/${props.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="h-[33%]"
          >
            <p className="font-semibold text-center text-xs sm:text-sm line-clamp-2">
              {props.title}
            </p>
          </Link>
        )}
        {props.edit === "EDITING" && (
          <div className="h-[33%]">
            <p className="font-semibold text-center text-xs sm:text-sm line-clamp-2">
              {props.title}
            </p>
          </div>
        )}

        {props.edit === "NONE" && (
          <div className="relative w-full flex pt-2 h-[66%]">
            <div className="text-center flex flex-col relative w-full gap-2 sm:gap-3 sm:group-hover:-translate-x-14 transition-all duration-300 ease-in-out">
              <p className="font-poiret text-xs sm:text-sm">{props.shop}</p>
              <div className="flex flex-col">
                {Number(props.discountPrice) > 0 ? (
                  <>
                    <p className="line-through font-comme text-[10px] sm:text-xs text-black/30">
                      ₡ {formatPrice(props.price)}
                    </p>
                    <p className="font-comme text-sm sm:text-base">
                      ₡ {formatPrice(props.discountPrice)}
                    </p>
                  </>
                ) : (
                  <p className="font-comme pt-2 text-sm sm:text-base">
                    ₡ {formatPrice(props.price)}
                  </p>
                )}
              </div>
            </div>

            {/* Add to Cart Button Hover for Desktop */}
            <div
              className={`hidden sm:flex absolute flex-col h-17 justify-between transform translate-x-23 opacity-0 group-hover:opacity-100 text-white font-semibold p-2 rounded-xl items-center transition-all duration-300 cursor-pointer ${added ? "bg-naranja" : "bg-chocolate"}`}
              onClick={handleAnimatedAdd}
            >
              <div className="relative flex flex-col items-center justify-center w-full h-full">
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.div
                      key="added"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex flex-col items-center w-[6rem]"
                    >
                      <motion.div
                        initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
                        animate={{
                          rotate: 0,
                          scale: 1,
                          opacity: 1,
                          transition: { type: "spring", stiffness: 500, damping: 18 },
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <IconCheck className="w-5 h-5 text-white mb-1" />
                      </motion.div>

                      <span className="text-xs text-center whitespace-nowrap">
                        Añadido
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex flex-col items-center w-[6rem]"
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                          scale: [1.2, 1],
                          opacity: 1,
                          transition: { type: "spring", stiffness: 400, damping: 16 },
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <IconShoppingBag className="w-5 h-5 text-white mb-1" />
                      </motion.div>

                      <span className="text-xs text-center whitespace-nowrap">
                        Añadir al carrito
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>



          </div>
        )}
        {/* Edit View */}
        {(props.edit === "EDIT" || props.edit === "EDITING") && (
          <div className="text-center flex flex-col relative w-full gap-2 sm:gap-3">
            <p className="font-poiret text-xs sm:text-sm">{props.shop}</p>
            <div className="flex flex-col ">
              {Number(props.discountPrice) > 0 ? (
                <>
                  <p className="line-through font-comme text-[10px] sm:text-xs text-black/30">
                    ₡ {formatPrice(props.price)}
                  </p>
                  <p className="font-comme text-sm sm:text-base">
                    ₡ {formatPrice(props.discountPrice)}
                  </p>
                </>
              ) : (
                <p className="font-comme pt-2 text-sm sm:text-base ">
                  ₡ {formatPrice(props.price)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </figure >
  );
}
