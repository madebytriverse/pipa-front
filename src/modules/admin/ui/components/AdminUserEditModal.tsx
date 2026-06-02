import { useEffect, useState } from "react";
import { IconArrowLeft, IconCamera, IconTrash } from "@tabler/icons-react";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import { Switch } from "../../../../components/ui/switch";
import { uploadImage } from "../../../users/infrastructure/imageService";

interface Store {
  id: number;
  image?: string | null;
}

interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
  status: boolean;
  image?: string | null;
  store?: Store | null;
  last_connection?: string;
  total_spent?: number;
  total_items?: number;
}

interface AdminUserEditModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => Promise<void>;
  onEditStore?: (updatedStore: Store) => Promise<void>;
}

export default function AdminUserEditModal({
  user,
  onClose,
  onSave,
  onEditStore,
}: AdminUserEditModalProps) {
  const [formData, setFormData] = useState<User>({ ...user, password: "" });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value;

    setFormData((prev: User) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    const previewURL = URL.createObjectURL(file);

    setFormData((prev) =>
      prev.store
        ? { ...prev, store: { ...prev.store, image: previewURL } }
        : { ...prev, image: previewURL }
    );
  };

  const handleRemoveImage = () => {
    setFormData((prev) =>
      prev.store
        ? { ...prev, store: { ...prev.store, image: null } }
        : { ...prev, image: null }
    );
    setProfileFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      const updatedData = { ...formData, id: user.id }; // ✅ asegurar ID

      if (profileFile && updatedData.store) {
        const uploadedImage = await uploadImage(profileFile);
        updatedData.store.image = uploadedImage;
        await onEditStore?.(updatedData.store);
      } else if (profileFile && !updatedData.store) {
        const uploadedImage = await uploadImage(profileFile);
        updatedData.image = uploadedImage;
      }

      await onSave(updatedData);
      console.log("🟢 Enviando datos a onSave:", updatedData);
      onClose();
    } catch (err) {
      console.error("❌ Error al guardar usuario:", err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflowY = "scroll";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflowY = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const profileImage = formData.store?.image || formData.image;
  const userInitial =
    formData.first_name?.charAt(0)?.toUpperCase() ||
    formData.username?.charAt(0)?.toUpperCase() ||
    "?";

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 animate-fadeIn font-quicksand px-2 sm:px-0"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:w-[920px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-10 relative border border-main/10 animate-slideUp flex flex-col gap-6 sm:gap-8 scrollbar-thin scrollbar-thumb-main/40 scrollbar-track-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col justify-between items-center border-b border-gray-200 pb-4">
          <div className="flex w-full items-center pb-6 sm:pb-10">
            <button
              onClick={onClose}
              className="flex justify-start items-center gap-1 text-gray-main hover:text-main transition-all"
            >
              <IconArrowLeft size={18} />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex justify-center w-full">
              <h2 className="text-lg sm:text-2xl font-semibold text-main text-center">
                Modificar Usuario
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-10 text-xs sm:text-sm text-gray-600">
            <div>
              <strong>UUID:</strong> {user.id}
            </div>
            <div>
              <strong>Tipo:</strong>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="ml-1 sm:ml-2 border border-gray-300 rounded-lg px-1 sm:px-2 py-1 outline-none focus:border-main focus:ring-1 focus:ring-main/20 transition"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <strong>Última conexión:</strong> {user.last_connection ?? "—"}
            </div>
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <Switch
                checked={formData.status}
                onCheckedChange={(checked) =>
                  setFormData((prev: User) => ({ ...prev, status: checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* Cuerpo principal */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Columna izquierda */}
            <div className="bg-beige rounded-2xl p-5 sm:p-6 shadow-inner flex flex-col items-center">
              {/* Imagen */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-lg mb-3">
                {formData.store?.image ? (
                  <img
                    src={formData.store.image}
                    alt="Store Logo"
                    className="w-full h-full object-contain"
                  />
                ) : profileImage ? (
                  <img
                    src={profileImage}
                    alt="User"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-main/20 text-main text-3xl sm:text-4xl font-semibold">
                    {userInitial}
                  </div>
                )}
              </div>

              {/* Botones imagen */}
              {(formData.role === "CUSTOMER" || !formData.store) && (
                <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <label className="bg-main text-white rounded-full px-2 sm:px-3 py-1 cursor-pointer shadow-md hover:bg-main/80 transition text-xs sm:text-sm flex items-center gap-1">
                    <IconCamera size={14} /> Cambiar
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg .webp"
                      onChange={handleProfileChange}
                      className="hidden"
                    />
                  </label>
                  {profileImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-red-500 text-white rounded-full px-2 sm:px-3 py-1 shadow-md hover:bg-red-600 transition text-xs sm:text-sm flex items-center gap-1"
                    >
                      <IconTrash size={14} /> Quitar
                    </button>
                  )}
                </div>
              )}

              {/* Inputs */}
              <div className="w-full space-y-3">
                {formData.role !== "SELLER" && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name || ""}
                        onChange={handleChange}
                        className="w-full mt-1 border border-gray-300 rounded-lg p-2 outline-none focus:border-main focus:ring-2 focus:ring-main/20 transition text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name || ""}
                        onChange={handleChange}
                        className="w-full mt-1 border border-gray-300 rounded-lg p-2 outline-none focus:border-main focus:ring-2 focus:ring-main/20 transition text-base"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Usuario
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded-lg p-2 outline-none focus:border-main focus:ring-2 focus:ring-main/20 transition text-base"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Correo
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded-lg p-2 outline-none focus:border-main focus:ring-2 focus:ring-main/20 transition text-base"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number || ""}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded-lg p-2 outline-none focus:border-main focus:ring-2 focus:ring-main/20 transition text-base"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full mt-1 border border-gray-300 rounded-lg p-2 outline-none focus:border-main focus:ring-2 focus:ring-main/20 transition text-base"
                  />
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            {formData.role === "CUSTOMER" && (
              <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 shadow-inner flex flex-col justify-between text-sm sm:text-base">
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                    Actividad del usuario
                  </h3>
                  <p className="text-gray-700">
                    <strong>Artículos comprados:</strong>{" "}
                    {formData.total_items ?? 0}
                  </p>
                  <p className="text-gray-700">
                    <strong>Total gastado:</strong> ₡
                    {formData.total_spent?.toLocaleString("es-CR") ?? "0"}
                  </p>

                  <ButtonComponent
                    text="Ver historial de compras"
                    style="bg-contrast-secondary text-white rounded-full px-4 sm:px-6 py-2 mt-4 text-sm sm:text-base"
                  />
                </div>
              </div>
            )}

            {formData.role === "SELLER" && (
              <div className="bg-gray-50 rounded-2xl items-center justify-center flex p-5 sm:p-6 shadow-inner text-center">
                <div className="flex flex-col gap-4">
                  <h2 className="text-base sm:text-lg">
                    Tienda de{" "}
                    <span className="font-semibold">{formData.username}</span>
                  </h2>
                  <ButtonComponent
                    text="Modificar tienda"
                    onClick={() => onEditStore?.(user)}
                    style="bg-naranja text-white px-4 sm:px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition text-sm sm:text-base"
                  />

                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col justify-center items-center border-t border-gray-200 pt-4">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-3 text-center px-2">
              Every change will be notified to the account owner.
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
                style="bg-naranja text-white px-4 sm:px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition text-sm"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
