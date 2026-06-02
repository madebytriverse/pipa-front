import { useState } from "react";
import axios from "axios";
import { uploadImage } from "../../users/infrastructure/imageService";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

interface Banner {
  id?: number;
  title?: string;
  subtitle?: string;
  character?: string | File;
  image: string | File;
  link?: string;
  btn_text?: string;
  btn_color?: "MORADO" | "AMARILLO" | "NARANJA" | "GRADIENTE";
  type: "LARGE" | "SHORT" | "SLIDER";
  orientation?: "LEFT" | "RIGTH";
  position?: number;
  is_active?: boolean;
}

interface BannerImage {
  id?: number;
  link: string | File;
  type: "CHARACTER" | "BACKGROUND";
  alt_text?: string;
}

interface PageBanner {
  id?: number;
  page_name: string;
  slot_number: number;
  banner_id: number;
  banner?: Banner;
}

export function useBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ======================================================
  // 🧩 BANNERS PRINCIPALES (ya existente)
  // ======================================================

  // 🔹 Obtener todos los banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/banners");
      setBanners(data);
    } catch (err) {
      console.error("Error al obtener los banners", err);
      setError("Error al obtener los banners");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear o actualizar banner principal
  const saveBanner = async (banner: Banner) => {
    try {
      setLoading(true);
      setError(null);

      let uploadedImage = banner.image;
      let uploadedCharacter = banner.character;

      // 📤 Subir imagen de fondo
      if (banner.image && banner.image instanceof File) {
        uploadedImage = await uploadImage(banner.image);
      }

      // 📤 Subir personaje si existe
      if (banner.character && banner.character instanceof File) {
        uploadedCharacter = await uploadImage(banner.character);
      }

      const payload = {
        ...banner,
        image: uploadedImage,
        character: uploadedCharacter,
      };

      // ✅ Crear o actualizar según corresponda
      const token = localStorage.getItem("access_token");
      if (banner.id) {
        const { data } = await axios.put(`/banners/${banner.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return data;
      } else {
        const { data } = await axios.post(`/banners`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return data;
      }
    } catch (err: any) {
      console.error("Error al guardar el banner:", err);
      setError("Error al guardar el banner");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar banner principal
  const deleteBanner = async (id: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      await axios.delete(`/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error al eliminar banner:", err);
      setError("Error al eliminar el banner");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // 🖼️ BANNER IMAGES (CHARACTER / BACKGROUND)
  // ======================================================

  // 🔹 Obtener imágenes de banner
  const fetchBannerImages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/banner-images");
      setBannerImages(data);
    } catch (err) {
      console.error("Error al obtener las imágenes de banner", err);
      setError("Error al obtener las imágenes de banner");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear nueva imagen de banner (CHARACTER / BACKGROUND)
  const saveBannerImage = async (imageData: BannerImage) => {
    try {
      setLoading(true);
      setError(null);

      let uploadedLink = imageData.link;

      // 📤 Si el link es un archivo, súbelo
      if (imageData.link && imageData.link instanceof File) {
        uploadedLink = await uploadImage(imageData.link);
      }

      const payload = {
        link: uploadedLink,
        type: imageData.type,
        alt_text: imageData.alt_text ?? "",
      };

      const token = localStorage.getItem("access_token");
      const { data } = await axios.post(`/banner-images`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBannerImages((prev) => [...prev, data.banner]);
      return data.banner;
    } catch (err) {
      console.error("Error al guardar la imagen de banner", err);
      setError("Error al guardar la imagen de banner");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar imagen de banner
  const deleteBannerImage = async (id: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      await axios.delete(`/banner-images/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBannerImages((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error al eliminar imagen de banner", err);
      setError("Error al eliminar imagen de banner");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // 📄 PAGE BANNERS (por página y slot)
  // ======================================================

  // 🔹 Obtener banners asignados a una página
  const fetchPageBanners = async (pageName: string): Promise<PageBanner[]> => {
    try {
      setLoading(true);
      const { data } = await axios.get("/page-banners");
      return data.filter((pb: PageBanner) => pb.page_name === pageName);
    } catch (err) {
      console.error("Error al obtener page banners:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Guardar o actualizar un banner en un slot específico
  const savePageBanner = async (
    pageName: string,
    slotNumber: number,
    bannerId: number
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const { data } = await axios.post(
        `/page-banners`,
        {
          page_name: pageName,
          slot_number: slotNumber,
          banner_id: bannerId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data;
    } catch (err: any) {
      // Si ya existe, actualiza el registro existente
      if (err.response?.status === 422) {
        try {
          const existing = await axios.get(`/page-banners`);
          const record = existing.data.find(
            (pb: PageBanner) =>
              pb.page_name === pageName && pb.slot_number === slotNumber
          );

          if (record) {
            const { data } = await axios.put(
              `/page-banners/${record.id}`,
              { banner_id: bannerId },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
              }
            );
            return data;
          }
        } catch (updateErr) {
          console.error("Error al actualizar page banner existente:", updateErr);
        }
      }

      console.error("Error al guardar el page banner:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // 🔁 Retorno
  // ======================================================

  return {
    // banners principales
    banners,
    loading,
    error,
    fetchBanners,
    saveBanner,
    deleteBanner,

    // imágenes de banner
    bannerImages,
    fetchBannerImages,
    saveBannerImage,
    deleteBannerImage,

    // page banners
    fetchPageBanners,
    savePageBanner,

    // utilidades
    getBannerById: (id: number) => banners.find((b) => b.id === id) || null,
    refreshBanners: async () => await fetchBanners(),
  };
}
