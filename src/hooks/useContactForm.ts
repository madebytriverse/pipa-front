import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

interface ContactFields {
  name: string;
  subject: string;
  email: string;
  message: string;
}
//Hola ale
//como estas

interface UseContactFormReturn {
  fields: ContactFields;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  sent: boolean;
  error: string;
}

export default function useContactForm(): UseContactFormReturn {
  const [fields, setFields] = useState<ContactFields>({
    name: "",
    subject: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSent(false);
    setError("");

    try {
      await axios.post("/contact-messages", fields);
      setSent(true);
      setFields({ name: "", email: "", message: "", subject: "" });
    } catch (err) {
      setError("Ocurrió un error al enviar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return {
    fields,
    handleChange,
    handleSubmit,
    loading,
    sent,
    error,
  };
}