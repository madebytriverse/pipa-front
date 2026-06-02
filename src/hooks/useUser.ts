import { useState, useEffect } from "react";
import axios from "axios";

export type UserRole = "SELLER" | "CUSTOMER" | "ADMIN";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export interface UserData {
  id: number;
  email: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  username?: string;
  // ... agrega los campos que tenga tu User
}

export default function useUser() {
  const [user, setUser] = useState<UserData | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/me")
      .then(res => {
        setUser(res.data);
        setRole(res.data.role); // role ya viene del backend
      })
      .catch(() => {
        setUser(null);
        setRole(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, role, loading };
}