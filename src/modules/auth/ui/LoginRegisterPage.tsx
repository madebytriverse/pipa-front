import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function LoginRegisterPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Determinar modo inicial según la URL
    const initialMode =
        searchParams.get("mode") === "register" ? "register" : "login";
    const [mode, setMode] = useState<"login" | "register">(initialMode);

    // Escuchar cambios en la URL
    useEffect(() => {
        const m = searchParams.get("mode");
        setMode(m === "register" ? "register" : "login");
    }, [searchParams]);

    // Cambiar modo desde los botones del panel izquierdo
    const goMode = (next: "login" | "register") => {
        setMode(next);
        const qs = new URLSearchParams(searchParams);
        qs.set("mode", next);
        navigate(`/loginRegister?${qs.toString()}`, { replace: true });
    };

    return (
        <div>
            <NavBar />

            <section className="flex flex-col lg:flex-row flex-grow justify-center items-center font-quicksand">
                {/* Panel izquierdo (solo visible en desktop) */}
                <div className="hidden lg:flex justify-end items-center bg-gradient-to-br from-contrast-main via-contrast-secondary to-main h-[90vh] w-[35%] relative">
                    <ul className="flex flex-col items-end pr-10 gap-20 relative">
                        <div
                            className={`bg-white absolute right-0 z-0 h-30 w-55 rounded-l-full transform transition-all duration-300 ${mode === "login" ? "-top-6" : "translate-y-30"
                                }`}
                        >
                            <div className="-rotate-90 absolute w-10 h-10 -top-6 -right-4 bg-transparent flex items-center justify-center rounded-2xl">
                                <div className="absolute w-full h-full border-l-[1rem] border-b-[1rem] border-white rounded-bl-[6rem]"></div>
                            </div>
                            <div className="-rotate-180 absolute w-10 h-10 -bottom-6 -right-4 bg-transparent flex items-center justify-center rounded-2xl">
                                <div className="absolute w-full h-full border-l-[1rem] border-b-[1rem] border-white rounded-bl-[6rem]"></div>
                            </div>
                        </div>

                        {/* Botones del panel */}
                        <li className="relative flex items-center">
                            <button
                                className={`z-10 text-xl font-semibold py-5 rounded-full transition cursor-pointer ${mode === "login" ? "text-contrast-secondary" : "text-white"
                                    }`}
                                onClick={() => goMode("login")}
                            >
                                Iniciar sesión
                            </button>
                        </li>

                        <li className="relative flex items-center font-quicksand">
                            <button
                                className={`z-10 text-xl font-semibold py-5 rounded-full cursor-pointer transition ${mode === "register" ? "text-contrast-secondary" : "text-white"
                                    }`}
                                onClick={() => goMode("register")}
                            >
                                Registrarse
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Panel derecho (formulario principal) */}
                <div className="flex flex-col items-center justify-center h-auto lg:h-[90vh] w-full lg:w-[65%] px-6 sm:px-10 lg:px-40 bg-white py-10">
                    {mode === "login" ? (
                        <LoginForm />
                    ) : (
                        <RegisterForm onRegisterSuccess={() => setMode("login")} />
                    )}

                    {/* Switch entre login/register en mobile */}
                    <div className="lg:hidden mt-10 text-center">
                        {mode === "login" ? (
                            <p className="text-sm text-gray-600">
                                ¿No tienes una cuenta?{" "}
                                <button
                                    className="text-main font-semibold hover:underline"
                                    onClick={() => goMode("register")}
                                >
                                    Regístrate
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600">
                                ¿Ya tienes una cuenta?{" "}
                                <button
                                    className="text-main font-semibold hover:underline"
                                    onClick={() => goMode("login")}
                                >
                                    Inicia sesión
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </section>


            <Footer />
        </div>
    );
}
