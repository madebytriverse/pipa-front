import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import logo from "../../../../img/TukiLogo.png";
import { useAuth } from "../../../../hooks/context/AuthContext";
import ButtonComponent from "../../../../components/ui/ButtonComponent";

export default function LoginForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginInput = loginField.trim().toLowerCase();

    try {
      const success = await login(loginInput, password);

      if (!success) {
        setError("Usuario, correo o contraseña incorrectos.");
        return;
      }

      // Delay opcional para suavizar la UX
      setTimeout(() => navigate("/"), 150);
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);

      if (error.response?.status === 401) {
        setError("Usuario, correo o contraseña incorrectos.");
      } else {
        setError("No se pudo conectar con el servidor. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full justify-center">
      <img className="h-20" src={logo} alt="Logo TukiShop" />
      <p className="font-fugaz text-2xl">TukiShop</p>

      <div className="flex flex-col w-full items-center space-y-5 mt-10">
        <form
          className="flex flex-col items-center w-full space-y-5"
          onSubmit={handleSubmit}
        >
          {/* ✉️ Campo genérico: puede ser correo o usuario */}
          <input
            className="border-2 border-contrast-secondary text-contrast-secondary rounded-full px-4 py-3 w-full sm:w-[65%] font-quicksand"
            placeholder="Correo o nombre de usuario"
            type="text"
            value={loginField}
            onChange={(e) => setLoginField(e.target.value)}
            required
          />

          {/* 🔒 Campo de contraseña compatible con iPhone */}
          <div className="relative w-full sm:w-[65%]">
            <input
              className="border-2 border-contrast-secondary text-contrast-secondary rounded-full px-4 py-3 w-full font-quicksand pr-10 
             h-[48px] leading-[1.2] focus:outline-none focus:ring-0 bg-transparent"
              placeholder="Contraseña"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              style={{
                WebkitTextSecurity: showPassword ? "none" : "disc",
                WebkitAppearance: "none",
              } as React.CSSProperties}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-contrast-secondary"
            >
              {showPassword ? <IconEye size={20} /> : <IconEyeClosed size={20} />}
            </button>
          </div>
          <ButtonComponent
            style={`relative overflow-hidden bg-contrast-secondary text-white rounded-full py-3 px-4 
    w-full sm:w-[30%] font-quicksand cursor-pointer
    transition-all duration-300 ease-in-out transform
    ${loading
                ? "scale-95 animate-pulse opacity-90 cursor-not-allowed"
                : "hover:scale-105 hover:shadow-lg"
              }
    before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r 
    before:from-[var(--color-contrast-main)] before:to-[var(--color-contrast-secondary)] 
    before:opacity-0 hover:before:translate-x-0 hover:before:opacity-100 before:transition-all before:duration-500`}

            type="submit"
            disabled={loading}
            text={
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                )}
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </span>
            }
          />

        </form>

        {error && <div className="text-red-500">{error}</div>}

        <Link to="/forgotPassword">
          <span className="text-main font-quicksand">
            ¿Olvidaste tu contraseña?
          </span>
        </Link>
      </div>
    </div>
  );
}
