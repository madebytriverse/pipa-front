import { useEffect, useState } from "react";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import { Switch } from "../../../../components/ui/switch";
import { uploadImage } from "../../../users/infrastructure/imageService";
import axios from "axios";

interface Store {
  id: number;
  name: string;
  description?: string | null;
  business_name?: string | null;
  tax_id?: string | null;
  support_email?: string | null;
  support_phone?: string | null;
  registered_address?: string | null;
  address?: string | null;
  image?: string | null;
  banner?: string | null;
  status?: string;
  is_verified?: boolean;
  category_id?: number | null;
  user?: { username?: string };
}

interface StoreCategory {
  id: number;
  name: string;
}

interface AdminStoreEditModalProps {
  store: Store;
  onClose: () => void;
  onSave: (updatedStore: Store) => Promise<void>;
  onViewProducts: (storeId: number) => void;
}

export default function AdminStoreEditModal({
  store,
  onClose,
  onSave,
  onViewProducts,
}: AdminStoreEditModalProps) {
  const [formData, setFormData] = useState<Store>({ ...store });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<StoreCategory[]>([]);

  // 🔹 Cargar categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/store-categories`;
        console.log("📡 Cargando categorías desde:", url);
        const res = await axios.get(url);
        console.log("✅ Categorías obtenidas:", res.data);
        setCategories(res.data);
      } catch (error) {
        console.error("❌ Error al cargar categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Store) => ({
      ...prev,
      [name]: name === "category_id" ? Number(value) || null : value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const previewURL = URL.createObjectURL(file);
    setFormData((prev: Store) => ({ ...prev, image: previewURL }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    const previewURL = URL.createObjectURL(file);
    setFormData((prev: Store) => ({ ...prev, banner: previewURL }));
  };

  const handleRemoveLogo = () => {
    setFormData((prev: Store) => ({ ...prev, image: null }));
    setLogoFile(null);
  };

  const handleRemoveBanner = () => {
    setFormData((prev: Store) => ({ ...prev, banner: null }));
    setBannerFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      const updatedData: Store = {
        ...formData,
        is_verified: !!formData.is_verified,
      };

      if (logoFile) {
        const uploadedLogo = await uploadImage(logoFile);
        updatedData.image = uploadedLogo;
      }

      if (bannerFile) {
        const uploadedBanner = await uploadImage(bannerFile);
        updatedData.banner = uploadedBanner;
      }

      console.log("📤 Datos enviados:", updatedData);
      await onSave(updatedData);
      onClose();
    } catch (error) {
      console.error("❌ Error al subir imágenes o guardar tienda:", error);
    } finally {
      setUploading(false);
    }
  };

  // Evitar scroll de fondo
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const originalStyle = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.paddingRight = originalStyle.paddingRight;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 animate-fadeIn font-quicksand px-2 sm:px-0"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:w-[1280px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-10 relative border border-main/10 animate-slideUp flex flex-col gap-6 sm:gap-8 scrollbar-thin scrollbar-thumb-main/40 scrollbar-track-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col justify-between items-center border-b border-gray-200 pb-4">
          <div className="flex w-full items-center pb-6 sm:pb-10">
            <button
              onClick={onClose}
              className="flex justify-start items-center gap-1 text-gray-main hover:text-main transition-all text-sm sm:text-base"
            >
              <IconArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex justify-center w-full">
              <h2 className="text-lg sm:text-2xl font-semibold text-main text-center">
                Modificar Tienda
              </h2>
            </div>
          </div>

          {/* Info + Selectores */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-8 text-xs sm:text-sm text-gray-600">
            <div>
              <strong>ID:</strong> {store.id}
            </div>
            <div>
              <strong>Tienda:</strong> {store.user?.username ?? "—"}
            </div>

            <div className="flex items-center gap-2">
              <strong>Verificada:</strong>
              <Switch
                checked={!!formData.is_verified}
                onCheckedChange={(checked) =>
                  setFormData((p: Store) => ({ ...p, is_verified: checked }))
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <select
                name="status"
                value={formData.status || "ACTIVE"}
                onChange={(e) =>
                  setFormData((p: Store) => ({
                    ...p,
                    status: e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm outline-none focus:border-main focus:ring-1 focus:ring-main/20 transition"
              >
                <option value="ACTIVE">Activa</option>
                <option value="SUSPENDED">Suspendida</option>
                <option value="CLOSED">Cerrada</option>
              </select>
            </div>

            {/* 🆕 Categoría visible en header */}
            <div className="flex items-center gap-2">
              <strong>Categoría:</strong>
              <select
                name="category_id"
                value={formData.category_id ?? ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm outline-none focus:border-main focus:ring-1 focus:ring-main/20 transition"
              >
                <option value="">Sin categoría</option>
                {categories.length === 0 && (
                  <option disabled>Cargando...</option>
                )}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Formulario principal */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Columna izquierda */}
            <div className="bg-gradient-to-br from-main/10 to-contrast-secondary/10 rounded-2xl p-5 sm:p-6 shadow-inner flex flex-col items-center">
              {/* Logo */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-lg mb-3">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Store"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-main/20 text-main text-3xl sm:text-4xl font-semibold">
                    {formData.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>

              <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                <label className="bg-main text-white rounded-full px-2 sm:px-3 py-1 cursor-pointer shadow-md hover:bg-main/80 transition text-xs sm:text-sm flex items-center gap-1">
                  <IconEdit size={14} />
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg .webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
                {formData.image && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="bg-red-500 text-white rounded-full px-2 sm:px-3 py-1 shadow-md hover:bg-red-600 transition text-xs sm:text-sm flex items-center gap-1"
                  >
                    <IconTrash size={14} />
                  </button>
                )}
              </div>

              {/* Banner */}
              <div className="w-full h-20 sm:h-24 rounded-xl overflow-hidden shadow-md mb-3">
                {formData.banner ? (
                  <img
                    src={formData.banner}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs sm:text-sm">
                    Sin banner
                  </div>
                )}
              </div>

              <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                <label className="bg-main text-white rounded-full px-2 sm:px-3 py-1 cursor-pointer shadow-md hover:bg-main/80 transition text-xs sm:text-sm flex items-center gap-1">
                  <IconEdit size={14} />
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg .webp"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                </label>
                {formData.banner && (
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="bg-red-500 text-white rounded-full px-2 sm:px-3 py-1 shadow-md hover:bg-red-600 transition text-xs sm:text-sm flex items-center gap-1"
                  >
                    <IconTrash size={14} />
                  </button>
                )}
              </div>

              <ButtonComponent
                text="Ver productos de la tienda"
                onClick={() => onViewProducts(formData.id)}
                style="bg-contrast-secondary text-white rounded-full px-4 sm:px-6 py-2 mt-2 text-xs sm:text-base"
              />
            </div>

            {/* Columna derecha */}
            <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 shadow-inner space-y-3">
              {/* 🆕 Selector de categoría visible en la parte superior de la columna derecha */}
              <div>
                <label className="text-base font-semibold text-gray-600">
                  Categoría
                </label>
                <select
                  name="category_id"
                  value={formData.category_id ?? ""}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-base outline-none focus:border-main focus:ring-2 focus:ring-main/20 transition"
                >
                  <option value="">Sin categoría</option>
                  {categories.length === 0 && (
                    <option disabled>Cargando...</option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🔹 Resto de campos existentes */}
              {[
                ["Nombre", "name"],
                ["Descripción", "description"],
                ["Nombre comercial", "business_name"],
                ["Cédula", "tax_id"],
                ["Correo de soporte", "support_email"],
                ["Teléfono de soporte", "support_phone"],
                ["Dirección registrada", "registered_address"],
                ["Dirección física", "address"],
              ].map(([label, name]) => (
                <div key={name}>
                  <label className="text-base font-semibold text-gray-600">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={(formData as any)[name] || ""}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-base outline-none focus:border-main focus:ring-2 focus:ring-main/20 transition"
                  />
                </div>
              ))}
            </div>

          </div>

          {/* Footer */}
          <div className="flex flex-col justify-center items-center border-t border-gray-200 pt-4 text-center">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-3 px-2">
              Los cambios se aplicarán inmediatamente y serán notificados al vendedor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center">
              <ButtonComponent
                text="Cancelar"
                onClick={onClose}
                style="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition text-sm"
              />
              <ButtonComponent
                text={uploading ? "Guardando..." : "Guardar"}
                type="submit"
                style="bg-gradient-to-br from-main via-contrast-secondary to-contrast-main text-white px-4 sm:px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition text-sm"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
