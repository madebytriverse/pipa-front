import { motion } from "framer-motion";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import ButtonComponent from "../../components/ui/ButtonComponent";
import useContactForm from "../../hooks/useContactForm";
import { useState } from "react";

export default function ContactPage() {
    const { fields, handleChange, handleSubmit, loading, sent, error } = useContactForm();
    const [charCount, setCharCount] = useState(0);
    const maxChars = 500; // 🔹 límite de caracteres del mensaje

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= maxChars) {
            handleChange(e);
            setCharCount(value.length);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-crema">
            <NavBar />

            {/* Hero */}
            <section className="text-center py-16 sm:py-20 bg-chocolate text-white font-quicksand">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Contáctanos
                </motion.h1>
                <p className="max-w-2xl mx-auto text-lg text-white/90 px-4">
                    ¿Tenés alguna consulta, sugerencia o querés colaborar con nosotros?
                    Completá el formulario y te responderemos lo antes posible.
                </p>
            </section>

            {/* Formulario */}
            <section className="flex justify-center w-full px-6 py-10 sm:py-16 font-quicksand">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-10 shadow-xl w-full max-w-[40rem]"
                >
                    <label className="flex flex-col gap-1">
                        <p className="font-semibold text-main">Nombre completo</p>
                        <input
                            type="text"
                            name="name"
                            value={fields.name}
                            onChange={handleChange}
                            placeholder="Ingresa tu nombre"
                            className="rounded-xl p-2 border border-main/30 bg-transparent text-gray-800"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <p className="font-semibold text-main">Correo electrónico</p>
                        <input
                            type="email"
                            name="email"
                            value={fields.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            className="rounded-xl p-2 border border-main/30 bg-transparent text-gray-800"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <p className="font-semibold text-main">Asunto</p>
                        <input
                            type="text"
                            name="subject"
                            value={fields.subject}
                            onChange={handleChange}
                            placeholder="Ej. Colaboración con Pipa"
                            className="rounded-xl p-2 border border-main/30 bg-transparent text-gray-800"
                            required
                        />
                    </label>

                    {/* Campo de mensaje con contador */}
                    <label className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-main">Mensaje</p>
                            <span
                                className={`text-sm ${charCount >= maxChars * 0.9
                                    ? "text-red-500"
                                    : "text-gray-500"
                                    }`}
                            >
                                {charCount}/{maxChars}
                            </span>
                        </div>
                        <textarea
                            name="message"
                            value={fields.message}
                            onChange={handleMessageChange}
                            maxLength={maxChars}
                            placeholder="Escribí tu mensaje aquí..."
                            className="rounded-2xl p-3 border border-main/30 bg-transparent text-gray-800 h-32 resize-none focus:ring-2 focus:ring-main"
                            required
                        />
                    </label>

                    {sent && (
                        <p className="text-green-600 font-medium text-center">
                            ¡Mensaje enviado correctamente!
                        </p>
                    )}
                    {error && (
                        <p className="text-red-500 font-medium text-center">{error}</p>
                    )}

                    <ButtonComponent
                        type="submit"
                        text={loading ? "Enviando..." : "Enviar mensaje"}
                        style={`text-white text-lg py-2 rounded-full w-full sm:w-1/2 mx-auto ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-contrast-main hover:bg-contrast-secondary transition-all duration-300"
                            }`}
                    />
                </form>
            </section>
            <section className="pb-16 px-5 flex justify-center items-center">
                <div className="w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-xl border border-white/10 bg-main/10">
                    <video autoPlay loop muted playsInline className="w-full h-full aspect-[16/9] object-cover">
                        <source src="https://res.cloudinary.com/dpbghs8ep/video/upload/v1764549134/TukiVideoAbout_vrw0gr.webm" type="video/webm" />
                    </video>
                </div>
            </section>

            <Footer />
        </div>
    );
}
