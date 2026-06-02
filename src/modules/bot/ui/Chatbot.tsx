import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "../../../hooks/context/ChatbotContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
  IconBubbleTextFilled,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import TypingBubbles from "./TypingBubbles";
import { useAuth } from "../../../hooks/context/AuthContext";

export function Chatbot() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    streamingMessage,
    messagesEndRef,
    visible,
    toggleVisible,
  } = useChatbot();
  const { user } = useAuth();
  const navigate = useNavigate();
  const chatRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const lastNavigatedLink = useRef<{ link: string; timestamp: number } | null>(
    null
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toggleVisible();
  };

  // 👂 Cerrar si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        visible &&
        chatRef.current &&
        !chatRef.current.contains(e.target as Node)
      ) {
        toggleVisible();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, toggleVisible]);
  useEffect(() => {
    lastNavigatedLink.current = null;
  }, [location.pathname]);

  // Guardar los mensajes ya redirigidos
  const navigatedMessages = useRef<Set<number>>(new Set());

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    const link = lastMsg?.link;
    const shouldNavigate = lastMsg?.navigate;

    const lastMessageIndex = messages.length - 1;

    // 🚫 No hacer nada si no hay mensaje válido
    if (
      !lastMsg ||
      lastMsg.role !== "bot" ||
      typeof link !== "string" ||
      !link.trim() ||
      !shouldNavigate
    ) {
      return;
    }

    // 🚫 Evitar redirigir si ya estamos en esa ruta
    if (location.pathname === link) return;

    // 🚫 Evitar redirigir si este mensaje ya fue procesado
    if (navigatedMessages.current.has(lastMessageIndex)) return;

    // ✅ Marcar este mensaje como procesado
    navigatedMessages.current.add(lastMessageIndex);

    // ✅ Navegar después de un pequeño delay
    const timer = setTimeout(() => {
      navigate(link);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages, navigate, location.pathname]);

  // 🔹 Resetear cuando se cierra el chat
  useEffect(() => {
    if (!visible) {
      lastNavigatedLink.current = null;
    }
  }, [visible]);

  useEffect(() => {
    if (visible && messages.length === 0) {
      setTimeout(() => {
        setInput(""); // limpia input por si acaso
        // Agrega mensaje del bot
        const welcomeMessage = {
          role: "bot" as const,
          content:
            "¡Hola! 👋 Soy TukiBot, tu asistente virtual. ¿En qué puedo ayudarte hoy?",
        };
        // Añadirlo manualmente a la lista de mensajes
        // (usando el contexto actual del chatbot)
        const event = new Event("addWelcomeMessage");
        (event as any).data = welcomeMessage;
        window.dispatchEvent(event);
      }, 500);
    }
  }, [visible]);
  // 🔹 Auto-scroll al último mensaje cuando se abre el chat
  useEffect(() => {
    if (visible && messagesEndRef.current) {
      // Espera un poco a que renderice el DOM
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [visible]);

  if (!user) return null;

  return (
    <>
      {/* 💬 Botón flotante */}
      <motion.div className="relative group">
        <motion.button
          onClick={toggleVisible}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: visible ? 0 : 1,
            opacity: visible ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="cursor-pointer
 fixed flex items-center bg-naranja text-white p-5 rounded-full shadow-2xl
          transition-all duration-300 z-50 overflow-hidden
          bottom-6 right-4 sm:bottom-8 sm:right-8 md:bottom-8 md:right-10 group-hover:bg-chocolate"
          title="Abrir chat"
        >
          <IconBubbleTextFilled className="group-hover:rotate-360 transition-all duration-300" />
          <span
            className="whitespace-nowrap overflow-hidden w-0 opacity-0 transition-all duration-500 ease-in-out 
            group-hover:w-[9rem] group-hover:opacity-100 font-quicksand"
          >
            Chatear con Tuki
          </span>
        </motion.button>
      </motion.div>

      {/* 🧠 Chat animado */}
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={chatRef}
            key="chat"
            // 🔹 Animación original intacta
            initial={{
              scale: 0.2,
              opacity: 0,
              borderRadius: "50%",
              width: 64,
              height: 64,
              bottom: 24,
              right: 24,
              position: "fixed",
              transformOrigin: "bottom right",
            }}
            animate={{
              scale: 1,
              opacity: 1,
              borderRadius: "20px",
              width: isMobile ? 350 : 420,
              height: isMobile ? 500 : 600,
              bottom: isMobile ? 80 : 96,
              right: isMobile ? 20 : 40,
              transition: {
                borderRadius: { duration: 0.25, ease: "easeOut" },
              },
            }}
            exit={{
              scale: 0.2,
              opacity: 0,
              borderRadius: "50%",
              width: 64,
              height: 64,
              bottom: 24,
              right: 24,
              transition: { duration: 0.35, ease: "easeInOut" },
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              duration: 0.45,
            }}
            className="fixed bg-white shadow-2xl border border-gray-300 flex flex-col p-5 z-50 
            origin-bottom-right rounded-2xl
            max-w-[420px] max-h-[600px]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2
                className="font-bold text-lg font-fugaz 
    bg-chocolate
    bg-clip-text text-transparent"
              >
                {" "}
                TukiBot
              </h2>
              <button
                onClick={toggleVisible}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 text-base leading-relaxed scrollbar-thin scrollbar-thumb-gray-300">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl shadow-sm ${
                    m.role === "user"
                      ? "bg-main text-white self-end ml-auto max-w-[85%]"
                      : "bg-gray-100 text-main self-start mr-auto max-w-[85%]"
                  }`}
                >
                  <p>{m.content}</p>
                  {m.products && m.products.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {m.products.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleProductClick(p.id)}
                          className="cursor-pointer border border-gray-200 rounded-lg p-2 text-sm bg-white hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
                        >
                          <img
                            src={p.image_1_url}
                            alt={p.name}
                            className="w-full h-24 sm:h-28 object-cover rounded-md mb-1"
                          />
                          <p className="font-semibold truncate text-xs sm:text-sm">
                            {p.name}
                          </p>
                          <p className="text-gray-500 text-[11px] sm:text-xs truncate">
                            {p.store_name}
                          </p>
                          {p.discount_price && p.discount_price > 0 ? (
                            <p className="text-main-600 font-bold text-xs sm:text-sm">
                              ₡{p.discount_price}
                              <span className="line-through text-gray-400 text-[11px] ml-1">
                                ₡{p.price}
                              </span>
                            </p>
                          ) : (
                            <p className="text-main-600 font-bold text-xs sm:text-sm">
                              ₡{p.price}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {m.stores && m.stores.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {m.stores.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            navigate(`/store/${s.id}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            toggleVisible();
                          }}
                          className="cursor-pointer border border-gray-200 rounded-lg p-2 bg-white text-center hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
                        >
                          <img
                            src={
                              s.image ||
                              "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"
                            }
                            alt={s.name}
                            className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                          />
                          <p className="font-semibold text-sm truncate">
                            {s.name}
                          </p>
                          {typeof s.rating === "number" && !isNaN(s.rating) && (
                            <p className="text-yellow-500 text-xs mt-1">
                              ⭐ {Number(s.rating).toFixed(1)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {m.role === "bot" && m.link && m.navigate === false && (
                    <div className="mt-3 flex justify-center ">
                      <button
                        onClick={() => {
                          navigate(m.link as string);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          toggleVisible();
                        }}
                        className="bg-main hover:bg-contrast-secondary text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md transition-all"
                      >
                        Ir a esta sección
                      </button>
                    </div>
                  )}
                  {m.role === "bot" && m.social && m.link && (
                    <div className="mt-3 flex justify-center">
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold shadow-md text-white transition-all duration-300 hover:scale-105 active:scale-95
        ${
          m.social === "facebook"
            ? "bg-gradient-to-br from-[#1877F2] to-[#42A5F5]"
            : m.social === "instagram"
            ? "bg-gradient-to-br from-[#F58529] to-[#DD2A7B]"
            : m.social === "tiktok"
            ? "bg-gradient-to-br from-[#000000] to-[#EE1D52]"
            : m.social === "x"
            ? "bg-gradient-to-br from-[#000000] to-[#1DA1F2]"
            : m.social === "whatsapp"
            ? "bg-gradient-to-br from-[#075E54] to-[#25D366]"
            : "bg-naranja"
        }`}
                      >
                        {m.social === "facebook" && (
                          <IconBrandFacebook size={20} />
                        )}
                        {m.social === "instagram" && (
                          <IconBrandInstagram size={20} />
                        )}
                        {m.social === "tiktok" && <IconBrandTiktok size={20} />}
                        {m.social === "x" && <IconBrandX size={20} />}
                        {m.social === "whatsapp" && (
                          <IconBrandWhatsapp size={20} />
                        )}
                        <span>
                          {m.social === "whatsapp"
                            ? "WhatsApp"
                            : `Ir a ${
                                m.social.charAt(0).toUpperCase() +
                                m.social.slice(1)
                              }`}
                        </span>
                      </a>
                    </div>
                  )}

                  {m.socials && m.socials.length > 0 && (
                    <div className="mt-3 flex justify-center gap-3">
                      {m.socials.map((s) => (
                        <a
                          key={s.social}
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center p-3 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all
          ${
            s.social === "facebook"
              ? "bg-gradient-to-br from-[#1877F2] to-[#42A5F5]"
              : s.social === "instagram"
              ? "bg-gradient-to-br from-[#F58529] to-[#DD2A7B]"
              : s.social === "tiktok"
              ? "bg-gradient-to-br from-[#000000] to-[#EE1D52]"
              : s.social === "x"
              ? "bg-gradient-to-br from-[#000000] to-[#1DA1F2]"
              : s.social === "whatsapp"
              ? "bg-gradient-to-br from-[#075E54] to-[#25D366]"
              : "bg-naranja"
          } text-white`}
                        >
                          {s.social === "facebook" && (
                            <IconBrandFacebook className="w-5 h-5" />
                          )}
                          {s.social === "instagram" && (
                            <IconBrandInstagram className="w-5 h-5" />
                          )}
                          {s.social === "tiktok" && (
                            <IconBrandTiktok className="w-5 h-5" />
                          )}
                          {s.social === "x" && (
                            <IconBrandX className="w-5 h-5" />
                          )}
                          {s.social === "whatsapp" && (
                            <IconBrandWhatsapp className="w-5 h-5" />
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {streamingMessage && (
                <div className="p-3 bg-gray-100 rounded-2xl text-gray-800">
                  {streamingMessage}
                </div>
              )}
              {isLoading && !streamingMessage && (
                <div className="p-3">
                  <TypingBubbles />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="flex gap-2 sm:gap-3 mt-auto items-center"
            >
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-contrast-secondary outline-none"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-morado text-white px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-chocolate transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "..." : "Enviar"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
