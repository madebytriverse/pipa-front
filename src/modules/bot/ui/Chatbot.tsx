import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "../../../hooks/context/ChatbotContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconBubbleTextFilled } from "@tabler/icons-react";
import TypingBubbles from "./TypingBubbles";

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

  const navigate = useNavigate();
  const chatRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toggleVisible();
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (visible && chatRef.current && !chatRef.current.contains(e.target as Node)) {
        toggleVisible();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, toggleVisible]);

  useEffect(() => {
    if (visible && messages.length === 0) {
      setTimeout(() => {
        const welcome = {
          role: "bot" as const,
          content:
            "¡Hola! Soy Pipo, tu asistente de bienestar y nutrición. Puedo ayudarte con hábitos alimenticios saludables y recomendarte los snacks y bebidas Pipa que mejor se adaptan a lo que necesitás. ¿En qué te puedo ayudar hoy?",
        };
        const event = new Event("addWelcomeMessage");
        (event as any).data = welcome;
        window.dispatchEvent(event);
      }, 500);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [visible]);

  const formatPrice = (price: number) => "₡" + price.toLocaleString("es-CR");

  return (
    <>
      {/* Botón flotante */}
      <motion.div className="relative group">
        <motion.button
          onClick={toggleVisible}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: visible ? 0 : 1, opacity: visible ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="cursor-pointer fixed flex items-center bg-naranja text-white p-5 rounded-full shadow-2xl
            transition-all duration-300 z-50 overflow-hidden
            bottom-6 right-4 sm:bottom-8 sm:right-8 md:bottom-8 md:right-10 group-hover:bg-chocolate"
          title="Abrir chat"
        >
          <IconBubbleTextFilled className="group-hover:rotate-360 transition-all duration-300" />
          <span className="whitespace-nowrap overflow-hidden w-0 opacity-0 transition-all duration-500 ease-in-out group-hover:w-[6rem] group-hover:opacity-100 font-quicksand text-sm ml-0 group-hover:ml-2">
            Pipo
          </span>
        </motion.button>
      </motion.div>

      {/* Ventana del chat */}
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={chatRef}
            key="chat"
            initial={{
              scale: 0.2, opacity: 0, borderRadius: "50%",
              width: 64, height: 64, bottom: 24, right: 24,
              position: "fixed", transformOrigin: "bottom right",
            }}
            animate={{
              scale: 1, opacity: 1, borderRadius: "20px",
              width: isMobile ? 350 : 420,
              height: isMobile ? 500 : 600,
              bottom: isMobile ? 80 : 96,
              right: isMobile ? 20 : 40,
              transition: { borderRadius: { duration: 0.25, ease: "easeOut" } },
            }}
            exit={{
              scale: 0.2, opacity: 0, borderRadius: "50%",
              width: 64, height: 64, bottom: 24, right: 24,
              transition: { duration: 0.35, ease: "easeInOut" },
            }}
            transition={{ type: "spring", stiffness: 120, damping: 18, duration: 0.45 }}
            className="fixed bg-white shadow-2xl border border-gray-200 flex flex-col p-5 z-50 origin-bottom-right rounded-2xl max-w-[420px] max-h-[600px]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div>
                  <h2 className="font-bold text-base font-fugaz text-chocolate">Asistente Pipo</h2>
                  <p className="text-xs text-gris-calido">Nutrición y bienestar</p>
                </div>
              </div>
              <button
                onClick={toggleVisible}
                className="text-gray-400 hover:text-red-400 text-xl font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-200">
              {messages.map((m, i) => (
                <div key={i}>
                  <div
                    className={`p-3 rounded-2xl shadow-sm ${
                      m.role === "user"
                        ? "bg-chocolate text-white ml-auto max-w-[85%]"
                        : "bg-beige text-carbon mr-auto max-w-[90%]"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                  </div>

                  {/* Cards de productos — clickeables, navegan al producto */}
                  {m.role === "bot" && m.products && m.products.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2 max-w-[95%]">
                      {m.products.map((p, pi) => (
                        <div
                          key={pi}
                          onClick={() => handleProductClick(p.id)}
                          className="cursor-pointer border border-taupe/40 rounded-xl bg-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200"
                        >
                          <img
                            src={p.image_1_url}
                            alt={p.name}
                            className="w-full h-24 object-cover rounded-t-xl"
                          />
                          <div className="p-2">
                            <p className="font-semibold text-carbon text-[11px] leading-snug line-clamp-2 mb-1">
                              {p.name}
                            </p>
                            <div className="flex items-center gap-1 flex-wrap mb-1">
                              <span className="font-bold text-naranja text-xs">
                                {p.discount_price && p.discount_price > 0
                                  ? formatPrice(p.discount_price)
                                  : formatPrice(p.price)}
                              </span>
                              {p.discount_price && p.discount_price > 0 && (
                                <span className="line-through text-gris-calido text-[10px]">
                                  {formatPrice(p.price)}
                                </span>
                              )}
                            </div>
                            <p className="text-gris-oscuro text-[10px] leading-tight line-clamp-2">
                              💡 {p.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {streamingMessage && (
                <div className="p-3 bg-beige rounded-2xl text-carbon max-w-[90%] mr-auto">
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
            <form onSubmit={sendMessage} className="flex gap-2 mt-auto items-center">
              <input
                type="text"
                className="flex-1 border border-taupe/60 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-naranja/40 outline-none bg-white"
                placeholder="¿En qué te ayudo con tu alimentación?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-naranja text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-chocolate transition-all disabled:opacity-50 whitespace-nowrap"
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
