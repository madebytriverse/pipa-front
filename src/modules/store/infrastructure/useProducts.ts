import { useState } from "react";
import axios from "axios";
import { getStoreByUser } from "./storeService";
import { useAuth } from "../../../hooks/context/AuthContext";

// ⚠️ Usamos el proxy de Vite en dev: en producción se debe usar VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// src/infrastructure/useProducts.ts
export type Category = {
  id: number;
  name: string;
};

export type ProductReview = {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    image?: string;
  };
};

export type ProductReviewSummary = {
  average: number;
  total: number;
  distribution: { [key: number]: number };
};

export type Product = {
  store_id?: number;
  id?: number;
  name: string;
  description?: string;
  details?: string;
  price: number;
  discount_price?: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED";
  categories: number[];
  rating?: number;
  image: File | string | null;
  image_1_url?: string;
  image_2_url?: string;
  image_3_url?: string;
  is_featured: boolean;
  store?: {
    id: number;
    name: string;
  };
};

export function useProducts() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const normalizeProduct = (p: any): Product => ({
  ...p,
  id: Number(p.id),
  name: p.name || "",
  description: p.description || "",
  details: p.details || "",
  price: p.price !== undefined && p.price !== null ? Number(p.price) : 0,
  discount_price:
    p.discount_price !== undefined && p.discount_price !== null
      ? Number(p.discount_price)
      : undefined,
  stock: p.stock !== undefined && p.stock !== null ? Number(p.stock) : 0,
  status: (p.status as "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED") || "ACTIVE",
  is_featured: Boolean(p.is_featured),
  store:
    p.store ||
    (p.store_name
      ? { id: p.store_id ?? 0, name: p.store_name }
      : undefined),
  image_1_url: p.image_1_url || null,
  image_2_url: p.image_2_url || null,
  image_3_url: p.image_3_url || null,
});


  // Obtener categorías
  const getCategories = async (): Promise<Category[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/categories`);
      return res.data;
    } catch (e: any) {
      setError("No se pudieron cargar las categorías");
      return [];
    } finally {
      setLoading(false);
    }
  };
  const getFeaturedProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/products/featured`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar los productos destacados");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Subir imagen y obtener URL de cloudinary
  const uploadImage = async (imageFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await axios.post(`${BASE_URL}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url as string;
  };
  // 🔍 Buscar productos dentro de una tienda específica
  const searchProductsByStore = async (
    store_id: number,
    query: string
  ): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/store/${store_id}/search`, {
        params: { q: query },
      });
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron buscar los productos en la tienda");
      return [];
    } finally {
      setLoading(false);
    }
  };
const searchProducts = async (query: string): Promise<Product[]> => {
  setLoading(true);
  setError(null);
  try {
    const res = await axios.get(`${BASE_URL}/products/search`, { params: { q: query } });
    return res.data.map(normalizeProduct);
  } catch (e: any) {
    setError("No se pudieron buscar los productos");
    return [];
  } finally {
    setLoading(false);
  }
};

  // Crear producto
  const createProduct = async (product: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const store = await getStoreByUser(user?.id ?? 0);
      if (!store?.id) throw new Error("No se encontró la tienda asociada al usuario");

      const store_id = store.id;

      // Subir imágenes (solo las que existan)
      const uploadIfFile = async (img: any) =>
        img instanceof File ? await uploadImage(img) : img || null;

      const image1Url = await uploadIfFile(product.image);
      const image2Url = await uploadIfFile(product.image_2);
      const image3Url = await uploadIfFile(product.image_3);

      const payload = {
        store_id,
        sku: `SKU-${Date.now()}`,
        name: product.name,
        description: product.description || "",
        details: product.details || "",
        price: product.price,
        //Si discount_price es 0, null, undefined o cadena vacía, se envía null
        discount_price:
          product.discount_price === undefined ||
            product.discount_price === null ||
            product.discount_price === ""
            ? 0
            : Number(product.discount_price),

        stock: product.stock,
        status: product.status || "ACTIVE", // 🔹 conserva el valor real
        is_featured: product.is_featured,
        image_1_url: image1Url,
        image_2_url: image2Url,
        image_3_url: image3Url,
        category_ids: Array.isArray(product.categories)
          ? product.categories
          : [product.categories],
      };
      console.log("📦 Payload final (antes de POST):", JSON.stringify(payload, null, 2));

      await axios.post(`${BASE_URL}/products`, payload);
      setSuccess("¡Producto creado con éxito!");
    } catch (e: any) {
      setError("Error al crear el producto: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  // 👤 Obtener todos los productos de la tienda (excepto ARCHIVED)
  const getProductsForOwner = async (store_id: number): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`${BASE_URL}/store/${store_id}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      console.error("❌ Error al cargar productos del dueño:", e);
      setError("No se pudieron cargar tus productos");
      return [];
    } finally {
      setLoading(false);
    }
  };
  // 💸 Obtener productos en oferta por tienda (solo activos, tienda verificada)
  const getOffersByStore = async (store_id: number): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/store/${store_id}/offers`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar las ofertas de esta tienda");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/categories/${categoryId}/products`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar los productos de esta categoría");
      return [];
    } finally {
      setLoading(false);
    }
  };
  const getFeaturedProductsByStore = async (store_id: number): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/stores/${store_id}/featured`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar los productos destacados de la tienda");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Editar producto
  const updateProduct = async (id: number, product: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 🔹 Subir imágenes solo si son nuevos archivos
      const uploadIfFile = async (img: any) =>
        img instanceof File ? await uploadImage(img) : img || null;

      const image1Url = await uploadIfFile(product.image_1 ?? product.image);
      const image2Url = await uploadIfFile(product.image_2);
      const image3Url = await uploadIfFile(product.image_3);

      // 🔹 Construimos el payload con todas las propiedades
      const payload: any = {
        name: product.name,
        description: product.description,
        details: product.details,
        price: product.price,
        // Si el descuento es 0, null, undefined o vacío → se envía null
        discount_price:
          product.discount_price === undefined ||
            product.discount_price === null ||
            product.discount_price === ""
            ? 0
            : Number(product.discount_price),

        stock: product.stock,
        status: product.status || "ACTIVE",
        is_featured: product.is_featured ?? false,
        image_1_url: image1Url,
        image_2_url: image2Url,
        image_3_url: image3Url,
      };

      // 🔹 Si las categorías existen, se incluyen también
      if (Array.isArray(product.categories) && product.categories.length > 0) {
        payload.category_ids = product.categories;
      }

      // 🔹 Enviamos el update al backend
      await axios.put(`${BASE_URL}/products/${id}`, payload);

      setSuccess("¡Producto editado con éxito!");
    } catch (e: any) {
      setError(
        "Error al editar el producto: " +
        (e.response?.data?.message || e.message)
      );
    } finally {
      setLoading(false);
    }
  };


  const getProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/products`);
const data = Array.isArray(res.data) ? res.data : res.data.data; // ✅ soporta paginación
return (data || []).map(normalizeProduct);

    } catch (e: any) {
      setError("No se pudieron cargar los productos");
      return [];
    } finally {
      setLoading(false);
    }
  };
  // 🔹 Obtener productos paginados (para exploración general)
  const getPaginatedProducts = async (page: number = 1, limit: number = 30) => {
  try {
    const res = await axios.get(`${BASE_URL}/products`, {
      params: { page, per_page: limit }, // ✅ nombre correcto
    });

    // ✅ Asegurar estructura limpia
    return {
      data: res.data.data?.map(normalizeProduct) ?? [],
      last_page: res.data.last_page,
      total: res.data.total,
      current_page: res.data.current_page,
    };
  } catch (e: any) {
    console.error("Error al obtener productos paginados:", e);
    return { data: [], last_page: 1, total: 0, current_page: 1 };
  }
};



  const getProductById = async (id: number): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/products/${id}`);
      return normalizeProduct(res.data);
    } catch (e: any) {
      setError("No se pudo cargar el producto");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getProductReviews = async (productId: number): Promise<ProductReview[]> => {
    try {
      const { data } = await axios.get(`${BASE_URL}/products/${productId}/reviews`);
      return data;
    } catch (e: any) {
      console.error("Error al obtener reseñas:", e);
      setError("No se pudieron cargar las reseñas del producto");
      return [];
    }
  };

  const getProductReviewSummary = async (
    productId: number
  ): Promise<ProductReviewSummary> => {
    try {
      const { data } = await axios.get(`${BASE_URL}/products/${productId}/reviews/summary`);
      return data;
    } catch (e: any) {
      console.error("Error al obtener resumen de reseñas:", e);
      return { average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
  };

  const createProductReview = async (
    productId: number,
    review: { rating: number; comment: string }
  ): Promise<boolean> => {
    if (!token) {
      setError("Debes iniciar sesión para dejar una reseña.");
      return false;
    }

    try {
      await axios.post(
        `${BASE_URL}/products/${productId}/reviews`,
        review,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      setSuccess("Reseña creada correctamente");
      return true;
    } catch (e: any) {
      console.error("Error al crear reseña:", e);
      setError("No se pudo enviar la reseña.");
      return false;
    }
  };


  const getProductsByStore = async (store_id: number): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/stores/${store_id}/products`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar los productos");
      return [];
    } finally {
      setLoading(false);
    }
  };
  const getOffers = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/products/offers`);
      return res.data.map(normalizeProduct);
    } catch {
      setError("No se pudieron cargar los productos en oferta");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    // 🔹 Productos
    getProductById,
    getProductsByStore,
    getFeaturedProductsByStore,
    getProducts,
    getFeaturedProducts,
    getCategories,
    getProductsByCategory,
    createProduct,
    updateProduct,
    getProductsForOwner,
    getOffersByStore,
    getOffers,
    getPaginatedProducts,
    searchProductsByStore,
    searchProducts,
    // 🟣 Reseñas
    getProductReviews,
    getProductReviewSummary,
    createProductReview,

    // 🔹 Estado
    loading,
    error,
    success,
  };

}