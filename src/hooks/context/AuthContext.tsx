import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// ============================
// 🧩 Tipos de datos
// ============================

type StoreType = {
  id: number;
  user_id?: number;
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  banner?: string | null;
  category_id?: number | null;
  business_name?: string | null;
  tax_id?: string | null;
  legal_type?: string | null;
  registered_address?: string | null;
  support_email?: string | null;
  support_phone?: string | null;
  is_verified?: boolean | string | null;
  verification_date?: string | null;
  status?: "ACTIVE" | "SUSPENDED" | "CLOSED" | null | string;
  storeSocials?: {
    id: number;
    store_id: number;
    platform: "instagram" | "facebook" | "x" | "link" | string;
    url: string;
  }[];
};

type AddressType = {
  id: number;
  street: string;
  city: string;
  state?: string | null;
  zip_code?: string | null;
  country: string;
  phone_number?: string;
  is_default?: boolean;
};

type UserType = {
  name: string;
  image: string;
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
  store?: StoreType | null;
  addresses?: AddressType[];
};

type AuthContextType = {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  login: (loginInput: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

// ============================
// ⚙️ Creación del contexto
// ============================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [loading, setLoading] = useState<boolean>(true); // ✅ empieza en true

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await loadUser();
      } else {
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  // 🔹 Carga del usuario actual
  const loadUser = async () => {
    try {
      const { data } = await axios.get("/me");
      const userData = data.user ?? data;
      setUser(userData);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("⚠️ Sesión expirada. Cerrando sesión automáticamente.");
      } else {
        console.error("❌ Error al cargar el usuario:", error);
      }

      setUser(null);
      localStorage.removeItem("access_token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false); // ✅ termina de cargar
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await loadUser();
  };

  const login = async (loginInput: string, password: string) => {
    const { data } = await axios.post("/login", {
      login: loginInput,
      password,
    });

    const token = data.token;
    localStorage.setItem("access_token", token);
    setToken(token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await loadUser();
    return true;
  };

  const logout = async () => {
    try {
      await axios.post("/logout");
    } catch {
      // no pasa nada si falla
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
