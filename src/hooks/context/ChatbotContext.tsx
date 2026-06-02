import { createContext, useContext, useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// 🛍️ Tipos de datos
interface Product {
  id: number;
  name: string;
  price: number;
  discount_price?: number;
  image_1_url: string;
  store_name: string;
}

interface Store {
  id: number;
  name: string;
  image?: string;
  banner?: string;
  rating?: number;
  category_name?: string;
}

export interface Message {
  role: "user" | "bot";
  content: string;
  products?: Product[];
  stores?: Store[];
  link?: string;
  navigate?: boolean;
  social?: "facebook" | "instagram" | "tiktok" | "x" | "whatsapp";
  socials?: {
    social: "facebook" | "instagram" | "tiktok" | "x" | "whatsapp";
    link: string;
  }[];
  showButton?: boolean;
}

interface ChatbotContextType {
  messages: Message[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  sendMessage: (e: React.FormEvent) => void;
  streamingMessage: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  toggleVisible: () => void;
  visible: boolean;
}

// 🎯 Contexto
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔹 Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // 🚀 Enviar mensaje al backend
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await axios.post("/chatbot", { message: userMessage });
      const data = res.data;
      const botReply = data.message || "No tengo respuesta en este momento.";

      gradualDisplay(
        botReply,
        data.results,
        data.link,
        data.stores,
        data.navigate,
        data.social,
        data.socials,
        data.showButton
      );
    } catch (err) {
      console.error("❌ Error en chatbot:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Hubo un error al procesar tu mensaje." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 💬 Mostrar texto del bot con efecto gradual + adjuntar resultados
  const gradualDisplay = (
    text: string,
    products?: Product[],
    link?: string,
    stores?: Store[],
    navigate?: boolean,
    social?: "facebook" | "instagram" | "tiktok" | "x",
    socials?: {
      social: "facebook" | "instagram" | "tiktok" | "x";
      link: string;
    }[],
    showButton?: boolean // ✅
  ) => {
    let index = 0;
    setStreamingMessage("");
    const words = text.split(" ");
    const interval = setInterval(() => {
      if (index < words.length) {
        setStreamingMessage(
          (prev) => prev + (index > 0 ? " " : "") + words[index]
        );
        index++;
      } else {
        clearInterval(interval);
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: text,
            products,
            stores,
            link,
            navigate,
            social,
            socials,
            showButton,
          },
        ]);
        setStreamingMessage("");
      }
    }, 50);
  };

  // 🎛️ Alternar visibilidad
  const toggleVisible = () => setVisible((v) => !v);
  useEffect(() => {
    const handleAddWelcome = (event: any) => {
      const message = event.data;
      setMessages((prev) => [...prev, message]);
    };

    window.addEventListener("addWelcomeMessage", handleAddWelcome);
    return () =>
      window.removeEventListener("addWelcomeMessage", handleAddWelcome);
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        input,
        setInput,
        isLoading,
        sendMessage,
        streamingMessage,
        messagesEndRef,
        visible,
        toggleVisible,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

// 🧠 Hook para usar el contexto fácilmente
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context)
    throw new Error("useChatbot debe usarse dentro de un ChatbotProvider");
  return context;
};
