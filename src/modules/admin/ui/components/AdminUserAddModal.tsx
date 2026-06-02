import { useState, useEffect } from "react";
import { IconArrowLeft, IconEye, IconEyeClosed } from "@tabler/icons-react";
import ButtonComponent from "../../../../components/ui/ButtonComponent";

interface AdminUserAddModalProps {
    onClose: () => void;
    onSave: (userData: any) => void;
}

export default function AdminUserAddModal({ onClose, onSave }: AdminUserAddModalProps) {
    const [role, setRole] = useState<"CUSTOMER" | "SELLER" | "ADMIN">("CUSTOMER");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone_number: "",
        role: "CUSTOMER",
    });

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        setForm((prev) => ({ ...prev, role }));
    }, [role]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (!form.username || !form.email || !form.password) {
            alert("Por favor completa los campos obligatorios");
            return;
        }
        if (form.password !== form.password_confirmation) {
            alert("Las contraseñas no coinciden");
            return;
        }
        onSave(form);
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn font-quicksand px-3"
            onClick={onClose}
        >
            <div
                className="bg-white w-full sm:w-[650px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 border border-main/10 animate-slideUp scrollbar-thin scrollbar-thumb-main/40 scrollbar-track-transparent"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1 text-gray-main hover:text-main transition-all"
                    >
                        <IconArrowLeft size={18} />
                        <span className="text-sm font-medium">Volver</span>
                    </button>
                    <h2 className="text-xl sm:text-2xl font-semibold text-main">
                        Agregar usuario
                    </h2>
                </div>

                {/* Selector de rol */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <p className="font-semibold text-sm text-gray-700">Tipo de usuario:</p>
                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value as "CUSTOMER" | "SELLER" | "ADMIN")
                        }
                        className="border-2 border-main text-main rounded-full px-4 py-2 font-quicksand focus:ring-2 focus:ring-main/20 outline-none transition w-full sm:w-auto"
                    >
                        <option value="CUSTOMER">Customer</option>
                        <option value="SELLER">Seller</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                {/* FORM VISUAL */}
                <div className="flex flex-col items-center w-full space-y-5">
                    {role === "CUSTOMER" || role === "ADMIN" ? (
                        <>
                            {/* Nombre y Apellido */}
                            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-[80%]">
                                <input
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    className="border-2 border-main text-main rounded-full px-4 py-3 sm:w-[45%] font-quicksand"
                                    placeholder="Nombre"
                                />
                                <input
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    className="border-2 border-main text-main rounded-full px-4 py-3 sm:w-[45%] font-quicksand"
                                    placeholder="Apellido"
                                />
                            </div>

                            {/* Correo y Username */}
                            <div className="flex flex-col space-y-5 w-full sm:w-[75%]">
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="border-2 border-main text-main rounded-full px-4 py-3 w-full font-quicksand"
                                    placeholder="Correo electrónico"
                                />
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="border-2 border-main text-main rounded-full px-4 py-3 w-full font-quicksand"
                                    placeholder="Nombre de usuario"
                                />
                            </div>

                            {/* Contraseña */}
                            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-[80%]">
                                <div className="relative w-full sm:w-[45%]">
                                    <input
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="border-2 border-main text-main rounded-full px-4 py-3 w-full pr-10 font-quicksand"
                                        placeholder="Contraseña"
                                        type={showPassword ? "text" : "password"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-4 text-main"
                                    >
                                        {showPassword ? <IconEye size={20} /> : <IconEyeClosed size={20} />}
                                    </button>
                                </div>

                                <div className="relative w-full sm:w-[45%]">
                                    <input
                                        name="password_confirmation"
                                        value={form.password_confirmation}
                                        onChange={handleChange}
                                        className="border-2 border-main text-main rounded-full px-4 py-3 w-full pr-10 font-quicksand"
                                        placeholder="Confirmar contraseña"
                                        type={showConfirmPassword ? "text" : "password"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-4 text-main"
                                    >
                                        {showConfirmPassword ? (
                                            <IconEye size={20} />
                                        ) : (
                                            <IconEyeClosed size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* SELLER */}
                            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-[93%]">
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="border-2 border-main text-main rounded-full px-4 py-3 w-full sm:w-[50%] font-quicksand"
                                    placeholder="Nombre de usuario o tienda"
                                />
                                <input
                                    name="phone_number"
                                    value={form.phone_number}
                                    onChange={handleChange}
                                    className="border-2 border-main text-main rounded-full px-4 py-3 w-full sm:w-[50%] font-quicksand"
                                    placeholder="Teléfono"
                                    type="tel"
                                />
                            </div>

                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="border-2 border-main text-main rounded-full px-4 py-3 w-full sm:w-[93%] font-quicksand"
                                placeholder="Correo electrónico"
                            />

                            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-[93%]">
                                <div className="relative w-full sm:w-[50%]">
                                    <input
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="border-2 border-main text-main rounded-full px-4 py-3 w-full pr-10 font-quicksand"
                                        placeholder="Contraseña"
                                        type={showPassword ? "text" : "password"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-4 text-main"
                                    >
                                        {showPassword ? <IconEye size={20} /> : <IconEyeClosed size={20} />}
                                    </button>
                                </div>

                                <div className="relative w-full sm:w-[50%]">
                                    <input
                                        name="password_confirmation"
                                        value={form.password_confirmation}
                                        onChange={handleChange}
                                        className="border-2 border-main text-main rounded-full px-4 py-3 w-full pr-10 font-quicksand"
                                        placeholder="Confirmar contraseña"
                                        type={showConfirmPassword ? "text" : "password"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-4 text-main"
                                    >
                                        {showConfirmPassword ? (
                                            <IconEye size={20} />
                                        ) : (
                                            <IconEyeClosed size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                        <ButtonComponent
                            text="Cancelar"
                            onClick={onClose}
                            style="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition text-sm"
                        />
                        <ButtonComponent
                            text="Guardar usuario"
                            onClick={handleSubmit}
                            style="bg-gradient-to-br from-main via-contrast-secondary to-contrast-main text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
