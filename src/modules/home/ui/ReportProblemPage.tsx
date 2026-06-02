import { useState, useEffect } from "react";
import { IconUpload, IconX } from "@tabler/icons-react";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";
import ButtonComponent from "../../../components/ui/ButtonComponent";
import { motion } from "framer-motion";
import { useAlert } from "../../../hooks/context/AlertContext";
import useUser from "../../../hooks/useUser";
import axios from "axios";
import { useReports } from "../../admin/infrastructure/useReports";


export default function ReportProblemPage() {
    const { user, loading } = useUser();
    const { showAlert } = useAlert();
    const { createReport } = useReports();

    const [form, setForm] = useState({
        name: "",
        email: "",
        order_number: "",
        subject: "",
        description: "",
    });

    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [sending, setSending] = useState(false);

    // 🔹 Autocompletar si el usuario está logueado
    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                ...prev,
                name:
                    user.first_name || user.last_name
                        ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                        : user.username ?? prev.name,
                email: user.email ?? prev.email,
            }));
        }
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const newPreviews = selectedFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setFiles((prev) => [...prev, ...selectedFiles]);
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // 🔹 Subir imágenes a tu endpoint /upload-image
    const uploadImages = async (): Promise<string[]> => {
        if (files.length === 0) return [];
        try {
            const uploads = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append("image", file);
                    const { data } = await axios.post(
                        `${import.meta.env.VITE_API_URL}/upload-image`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                    return data.url; // el backend debe devolver { url: "https://..." }
                })
            );
            return uploads;
        } catch (err) {
            console.error("Error al subir imágenes:", err);
            return [];
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.subject || !form.description) {
            showAlert({
                title: "Campos incompletos",
                message: "Por favor, completá todos los campos obligatorios.",
                type: "warning",
            });
            return;
        }

        setSending(true);
        try {
            const imageUrls = await uploadImages();

            const payload = {
                name: form.name,
                email: form.email,
                subject: form.subject,
                description: form.description,
                order_id: null,
                images: imageUrls,
            };


            await createReport(payload);

            showAlert({
                title: "Reporte enviado",
                message:
                    "Tu reporte fue recibido. Nuestro equipo de soporte lo revisará pronto.",
                type: "success",
            });

            // Reset del formulario
            setForm({
                name:
                    user?.first_name || user?.last_name
                        ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
                        : user?.username ?? "",
                email: user?.email ?? "",
                order_number: "",
                subject: "",
                description: "",
            });
            setFiles([]);
            setPreviews([]);
        } catch (err) {
            console.error("Error al enviar reporte:", err);
            showAlert({
                title: "Error al enviar",
                message:
                    "Ocurrió un problema al enviar tu reporte. Intentalo de nuevo más tarde.",
                type: "error",
            });
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-light-gray to-white text-main font-quicksand">
                <p className="text-lg animate-pulse">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-light-gray to-white font-quicksand">
            <NavBar />
            <section className="text-center py-16 sm:py-20 bg-gradient-to-br from-contrast-main via-contrast-secondary to-main text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Reportar un problema
                </motion.h1>
                <p className="max-w-2xl mx-auto text-lg text-white/90 px-4">
                    Si tuviste un inconveniente con tu pedido, pago o algún vendedor,
                    completá este formulario y nuestro equipo de soporte se pondrá en
                    contacto contigo.
                </p>
            </section>

            {/* 🔹 Contenido dinámico */}
            <section className="flex justify-center w-full px-6 py-10 sm:py-16">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-10 shadow-xl w-full max-w-[40rem]"
                    >
                        {/* Campos del formulario */}
                        <label className="flex flex-col gap-1">
                            <p className="font-semibold text-main">Nombre completo</p>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
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
                                value={form.email}
                                onChange={handleChange}
                                placeholder="ejemplo@correo.com"
                                className="rounded-xl p-2 border border-main/30 bg-transparent text-gray-800"
                                required
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <p className="font-semibold text-main">
                                Número de orden{" "}
                                <span className="text-gray-500 text-sm">(opcional)</span>
                            </p>
                            <input
                                type="text"
                                name="order_number"
                                value={form.order_number}
                                onChange={handleChange}
                                placeholder="Ej. #ORD-45678"
                                className="rounded-xl p-2 border border-main/30 bg-transparent text-gray-800"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <p className="font-semibold text-main">Asunto</p>
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="Ej. Problema con mi pedido"
                                className="rounded-xl p-2 border border-main/30 bg-transparent text-gray-800"
                                required
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <p className="font-semibold text-main">Descripción del problema</p>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Contanos qué sucedió..."
                                className="rounded-2xl p-3 border border-main/30 bg-transparent text-gray-800 h-32 resize-none"
                                required
                            />
                        </label>

                        {/* Subir imágenes */}
                        <div className="flex flex-col gap-3">
                            <p className="font-semibold text-main">
                                Adjuntar evidencia (opcional)
                            </p>
                            <label className="flex items-center gap-3 cursor-pointer text-main font-medium w-fit">
                                <IconUpload />
                                <span>Subir imágenes</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFiles}
                                    className="hidden"
                                />
                            </label>

                            {previews.length > 0 && (
                                <div className="flex flex-wrap gap-4 mt-2 overflow-x-auto pb-2">
                                    {previews.map((src, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative group"
                                        >
                                            <img
                                                src={src}
                                                alt={`Evidencia ${index + 1}`}
                                                className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <IconX size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <ButtonComponent
                            type="submit"
                            text={sending ? "Enviando..." : "Enviar reporte"}
                            style={`text-white text-lg py-2 rounded-full w-full sm:w-1/2 mx-auto ${sending
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
