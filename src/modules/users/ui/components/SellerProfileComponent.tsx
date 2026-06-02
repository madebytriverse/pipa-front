import { useState, useEffect } from "react";
import axios from "axios";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import {
  IconEdit,
  IconPhone,
  IconSquareRoundedPlus,
  IconX,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX as IconTwitter,
  IconLink,
  IconBrandWhatsapp,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { uploadImage } from "../../infrastructure/imageService";
import { updateStore } from "../../../store/infrastructure/storeService";
import { useAuth } from "../../../../hooks/context/AuthContext";
import { Skeleton } from "../../../../components/ui/skeleton";
import { useAlert } from "../../../../hooks/context/AlertContext";

interface Store {
  id: number;
  name: string;
  description?: string | null;
  banner?: string | null;
  image?: string | null;
  support_phone?: string | null;
  support_email?: string | null;
  registered_address?: string | null;
  is_verified?: boolean | string | null;
  storeSocials?: {
    id: number;
    platform: "instagram" | "facebook" | "x" | "link" | string;
    url: string;
  }[];
}

interface SocialLink {
  type: "instagram" | "x" | "facebook" | "link";
  text: string;
}

const iconMap = {
  instagram: <IconBrandInstagram />,
  x: <IconTwitter />,
  facebook: <IconBrandFacebook />,
  link: <IconLink />,
};

export default function SellerProfileComponent() {
  const { user, token, refreshUser } = useAuth();
  const {showAlert} = useAlert();

  const [savingUser, setSavingUser] = useState(false);
  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "Costa Rica",
    phone_number: "",
  });

  const [editableStore, setEditableStore] = useState<Store | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [addingSocial, setAddingSocial] = useState(false);
  const [newType, setNewType] = useState<SocialLink["type"]>("instagram");
  const [newText, setNewText] = useState("");
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
  const [savingStore, setSavingStore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editableUser, setEditableUser] = useState({
    first_name: user?.first_name || "",
    username: user?.username || "",
    phone_number: user?.phone_number || "",
  });

  useEffect(() => {
    if (user) {
      setEditableUser({
        first_name: user.first_name || "",
        username: user.username || "",
        phone_number: user.phone_number || "",
      });
    }
  }, [user]);


  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/user/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(data.addresses || []);
      } catch (error) {
        console.error("❌ Error al obtener direcciones:", error);
      }
    };
    if (user) fetchAddresses();
  }, [user, token]);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (!user?.store?.id) return;
      try {
        const { data } = await axios.get(`/stores/${user.store.id}`);
        setEditableStore({
          ...data,
          is_verified: data.is_verified === true || data.is_verified === "true",
        });
        const socials =
          data.storeSocials?.map((s: any) => ({
            type: s.platform,
            text: s.url,
          })) ||
          data.store_socials?.map((s: any) => ({
            type: s.platform,
            text: s.url,
          })) ||
          [];
        setSocialLinks(socials);
      } catch (err) {
        console.error("Error cargando detalles de la tienda:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreDetails();
  }, [user?.store?.id]);

  const handleAddAddress = async () => {
    try {
      await axios.post("/addresses", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get("/user/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses || []);
      showAlert({
        title: "Dirección agregada",
        message: "Tu nueva dirección se guardó correctamente.",
        type: "success",
        confirmText: "Aceptar",
      });
      setForm({
        street: "",
        city: "",
        state: "",
        zip_code: "",
        country: "Costa Rica",
        phone_number: "",
      });
      setAdding(false);
    } catch (error) {
      console.error("❌ Error al agregar dirección:", error);
      showAlert({
        title: "Error al agregar",
        message: "No se pudo agregar la dirección. Intentalo más tarde.",
        type: "error",
        confirmText: "Aceptar",
      });
    }
  };

  const handleCancelStore = async () => {
    if (!user?.store?.id) return;
    try {
      const { data } = await axios.get(`/stores/${user.store.id}`);
      setEditableStore({
        ...data,
        is_verified: data.is_verified === true || data.is_verified === "true",
      });
      const socials =
        data.storeSocials?.map((s: any) => ({
          type: s.platform,
          text: s.url,
        })) ||
        data.store_socials?.map((s: any) => ({
          type: s.platform,
          text: s.url,
        })) ||
        [];
      setSocialLinks(socials);
      setNewBannerFile(null);
      setNewLogoFile(null);
      showAlert({
        title: "Cambios descartados",
        message: "Se restauró la información original de la tienda.",
        type: "info",
        confirmText: "Aceptar",
      });
    } catch (err) {
      console.error("Error al restaurar datos de la tienda:", err);
    }
  };


  const handleCancel = () => {
    setCambiarPassword(false);
    setAdding(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveUser = async () => {
    setSavingUser(true);
    try {
      if (user) {
        const body: Record<string, any> = {};
        if (editableUser.first_name) body.first_name = editableUser.first_name;
        if (editableUser.username) body.username = editableUser.username;
        if (editableUser.phone_number) body.phone_number = editableUser.phone_number;

        // 🔹 Solo actualiza si hay cambios
        if (Object.keys(body).length > 0) {
          await axios.patch(`/users/${user.id}`, body, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await refreshUser?.();
        }

        // 🔐 Cambio de contraseña (opcional)
        if (cambiarPassword) {
          if (!currentPassword || !newPassword || !confirmPassword) {
            showAlert({
              title: "Campos incompletos",
              message: "Debes llenar todos los campos de contraseña.",
              type: "warning",
              confirmText: "Aceptar",
            });
            setSavingUser(false);
            return;
          }

          if (newPassword !== confirmPassword) {
            showAlert({
              title: "Error de confirmación",
              message: "Las contraseñas no coinciden.",
              type: "error",
              confirmText: "Aceptar",
            });
            setSavingUser(false);
            return;
          }

          await axios.put(
            "/change-password",
            {
              current_password: currentPassword,
              new_password: newPassword,
              new_password_confirmation: confirmPassword,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // ✅ Mensaje de éxito
        showAlert({
          title: "Cambios guardados",
          message: cambiarPassword
            ? "Tu contraseña y perfil se actualizaron correctamente."
            : "Tu perfil se actualizó correctamente.",
          type: "success",
          confirmText: "Aceptar",
        });

        // 🔹 Limpieza de estado
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setCambiarPassword(false);
      }
    } catch (err: any) {
      showAlert({
        title: "Error al guardar",
        message:
          err.response?.data?.error ||
          "Ocurrió un problema al actualizar el perfil.",
        type: "error",
        confirmText: "Aceptar",
      });
    } finally {
      setSavingUser(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewLogoFile(file);
    const previewURL = URL.createObjectURL(file);
    setEditableStore((prev) => (prev ? { ...prev, image: previewURL } : prev));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewBannerFile(file);
    const previewURL = URL.createObjectURL(file);
    setEditableStore((prev) => (prev ? { ...prev, banner: previewURL } : prev));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditableStore((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const addSocialLink = () => {
    if (newText.trim() === "") return;
    setSocialLinks((prev) => [...prev, { type: newType, text: newText }]);
    setNewText("");
    setAddingSocial(false);
  };

  const handleSaveStore = async () => {
    if (!editableStore) return;
    setSavingStore(true);
    try {
      const updatedFields: Record<string, any> = {
        name: editableStore.name ?? "",
        description: editableStore.description ?? "",
        registered_address: editableStore.registered_address ?? "",
        support_phone: editableStore.support_phone ?? "",
        support_email: editableStore.support_email ?? "",
        social_links: socialLinks,
      };

      if (newLogoFile) {
        const logoUrl = await uploadImage(newLogoFile);
        updatedFields.image = logoUrl;
      }

      if (newBannerFile) {
        const bannerUrl = await uploadImage(newBannerFile);
        updatedFields.banner = bannerUrl;
      }

      await updateStore(editableStore.id, updatedFields);
      await refreshUser?.();

      showAlert({
        title: "Cambios guardados",
        message: "La tienda se actualizó correctamente.",
        type: "success",
        confirmText: "Aceptar",
      });
    } catch (err: any) {
      showAlert({
        title: "Error al guardar",
        message:
          err.response?.data?.error ||
          "Ocurrió un problema al actualizar los datos.",
        type: "error",
        confirmText: "Aceptar",
      });
    } finally {
      setSavingStore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    );
  }

  if (!editableStore) return null;

  return (
    <div className="flex flex-col gap-10 py-10 ">
      {/* 🧍 PERFIL DEL USUARIO */}
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSaveUser();
      }} className="">
        <h2 className="text-2xl font-semibold font-quicksand text-main mb-6">Información de usuario</h2>

        {/* Nombre, correo, username y teléfono */}
        <div className="flex flex-col gap-5 mb-6 px-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <label className="flex flex-col w-full">
              Nombre
              <input
                type="text"
                value={editableUser.first_name}
                placeholder="Nombre"
                onChange={(e) =>
                  setEditableUser((prev) => ({ ...prev, first_name: e.target.value }))}
                className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
              />
            </label>
            <label className="flex flex-col w-full">
              Correo electrónico
              <input
                type="text"
                placeholder={user?.email || "Correo electrónico"}
                className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
                disabled
              />
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <label className="flex flex-col w-full">
              Nombre de usuario
              <input
                type="text"
                value={editableUser.username}
                placeholder="Nombre de usuario"
                onChange={(e) =>
                  setEditableUser((prev) => ({ ...prev, username: e.target.value }))}
                className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
              />
            </label>
            <label className="flex flex-col w-full">
              Teléfono personal
              <div className="bg-main-dark/20 rounded-xl px-3 flex items-center gap-2 w-full">
                <input
                  type="tel"
                  placeholder="Ej. 8888 8888"
                  value={editableUser.phone_number}
                  onChange={(e) => {
                    let digits = e.target.value.replace(/\D/g, "");
                    if (digits.length > 8) digits = digits.slice(0, 8);
                    const formatted =
                      digits.length > 4
                        ? `${digits.slice(0, 4)} ${digits.slice(4)}`
                        : digits;
                    setEditableUser((prev) => ({
                      ...prev,
                      phone_number: formatted,
                    }));
                  }}
                  maxLength={9}
                  inputMode="numeric"
                  pattern="^\\d{4}\\s\\d{4}$"
                  title="Debe tener el formato 8888 8888"
                  className="w-full py-2 bg-transparent focus:outline-none text-sm sm:text-base"
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">
                Este número es personal y no será visible para otros usuarios.
              </span>
            </label>

          </div>
        </div>

        {/* 🏠 Direcciones */}
        <div className="w-full sm:w-[70%] mt-4 px-6">
          <h2 className="text-lg font-semibold mb-3 text-main-dark">Direcciones</h2>
          {addresses.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {addresses.map((addr) => (
                <li
                  key={addr.id}
                  className="bg-main-dark/10 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-sm">
                      {addr.street}, {addr.city}
                    </p>
                    <p className="text-xs text-gray-600">
                      {addr.state && `${addr.state}, `}
                      {addr.country} {addr.zip_code && `• ${addr.zip_code}`}
                    </p>
                    {addr.phone_number && (
                      <p className="text-xs text-gray-600">Tel: {addr.phone_number}</p>
                    )}
                  </div>
                  {addr.is_default && (
                    <span className="text-xs bg-main text-white px-2 py-1 rounded-full mt-2 sm:mt-0">
                      Principal
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 mb-3">
              No tienes direcciones registradas.
            </p>
          )}

          {!adding ? (
            <ButtonComponent
              text="Agregar nueva dirección"
              onClick={() => setAdding(true)}
              style="bg-main text-white w-full sm:w-auto mt-4 px-6 py-2 rounded-full hover:scale-105 transition-all"
            />
          ) : (
            <div className="mt-5 bg-main-dark/10 rounded-xl p-4 flex flex-col gap-3">
              <h3 className="font-semibold text-sm text-main-dark">Nueva dirección</h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Calle o descripción (Ej: Casa 25)"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Ciudad"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                  />
                  <input
                    type="text"
                    placeholder="Provincia / Estado"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Código postal"
                    value={form.zip_code}
                    onChange={(e) => setForm({ ...form, zip_code: e.target.value })}
                    className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                  />
                  <input
                    type="text"
                    placeholder="País"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Teléfono de contacto"
                  value={form.phone_number}
                  onChange={(e) => {
                    let digits = e.target.value.replace(/\D/g, "");
                    if (digits.length > 8) digits = digits.slice(0, 8);
                    const formatted =
                      digits.length > 4
                        ? `${digits.slice(0, 4)} ${digits.slice(4)}`
                        : digits;
                    setForm({ ...form, phone_number: formatted });
                  }}
                  maxLength={9}
                  inputMode="numeric"
                  pattern="^\\d{4}\\s\\d{4}$"
                  title="Debe tener el formato 8888 8888"
                  className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <ButtonComponent
                  text="Cancelar"
                  onClick={() => setAdding(false)}
                  style="bg-gray-400 text-white w-full sm:w-[48%] py-2 rounded-full hover:opacity-90"
                />
                <ButtonComponent
                  text="Guardar dirección"
                  onClick={handleAddAddress}
                  style="bg-contrast-secondary text-white w-full sm:w-[48%] py-2 rounded-full hover:scale-105 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* CONTRASEÑA */}
        <label className="flex items-center gap-2 pt-8 text-sm sm:text-base px-6">
          Cambiar contraseña
          <input
            type="checkbox"
            checked={cambiarPassword}
            onChange={() => setCambiarPassword(!cambiarPassword)}
          />
        </label>

        {cambiarPassword && (
          <div className="flex flex-col gap-5 mt-2 px-6">
            <input
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-main-dark/20 rounded-xl px-3 py-2 w-full sm:w-[50%] text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mt-10 w-full px-6">
          <ButtonComponent
            text="Cancelar"
            onClick={handleCancel}
            style="w-full sm:w-[48%] p-3 rounded-full text-white bg-main cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300"
          />
          <ButtonComponent
            text={savingUser ? "Guardando..." : "Guardar cambios"}
            onClick={handleSaveUser}
            style="w-full sm:w-[48%] p-3 rounded-full text-white bg-contrast-secondary cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300"
          />
        </div>
      </form>

      <div className="bg-gris-calido h-1 rounded-full"></div>
      {editableStore.is_verified === false ? (
        <div className="flex flex-col gap-6 justify-center items-center bg-white rounded-2xl py-10 px-4 sm:px-12 mx-4 shadow-lg border border-main/20 text-center">
          <h2 className="text-2xl font-semibold font-quicksand text-main mb-6">Información de usuario</h2>
          <div className="flex items-center justify-center w-14 h-14 bg-contrast-secondary/20 rounded-full">
            <IconExclamationCircle size={30} className="text-contrast-secondary" />
          </div>
          <p className="text-xl font-semibold text-main">Tu tienda está en verificación</p>
          <p className="text-main-dark/70 max-w-md">
            El equipo de TukiShop se pondrá en contacto contigo para verificar tu tienda.
          </p>
          <a
            href="https://wa.me/50687355629"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2 bg-contrast-secondary text-white rounded-full hover:scale-105 transition-all duration-300 shadow-sm"
          >
            <IconBrandWhatsapp size={20} />
            Contactar soporte
          </a>
        </div>
      ) : (
        <section className="">
          <h2 className="text-2xl font-semibold font-quicksand text-main mb-6">Información de la tienda</h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 px-4 sm:px-10"
          >
            <figure className="flex flex-col gap-4 sm:gap-10 w-full sm:w-1/3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <p className="text-sm sm:text-base font-semibold">Logo de tienda</p>
                <label className="bg-contrast-secondary/80 hover:bg-main/80 text-white p-2 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center">
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg .webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <IconEdit size={20} />
                </label>
              </div>
              <img
                src={
                  editableStore.image ||
                  "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"
                }
                alt="Logo"
                className="w-[60%] sm:w-2/3 max-w-[12rem] h-auto rounded-xl object-cover shadow-sm"
              />
            </figure>
            <figure className="flex flex-col gap-4 sm:gap-10 w-full sm:w-2/3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <p className="text-sm sm:text-base font-semibold">Banner de la tienda</p>
                <label className="bg-contrast-secondary/80 hover:bg-main/80 text-white p-2 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center">
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg .webp"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                  <IconEdit size={20} />
                </label>
              </div>
              <img
                src={
                  editableStore.banner ||
                  "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761410400/BannerNoSubido_avlp5v.png"
                }
                alt="Banner"
                className="rounded-xl object-cover w-full sm:w-auto max-h-[12rem] sm:max-h-[10rem] shadow-sm"
              />
            </figure>
          </form>

          <div className="w-full px-4 sm:px-10">
            <form className="flex flex-col gap-6 sm:gap-8 pt-8 sm:pt-10">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-10">
                <label className="flex flex-col w-full">
                  Nombre de la tienda
                  <textarea
                    name="name"
                    value={editableStore.name || ""}
                    onChange={handleChange}
                    rows={2}
                    className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
                  />
                </label>
                <label className="flex flex-col w-full">
                  Correo electrónico
                  <input
                    type="text"
                    placeholder={user?.email || "Correo de la tienda"}
                    className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
                    disabled
                  />
                </label>
              </div>

              <section className="flex flex-col sm:flex-row gap-5 sm:gap-10">
                <label className="flex flex-col w-full">
                  Teléfono de atención al cliente
                  <div className="bg-main-dark/20 rounded-xl px-3 flex items-center gap-2 w-full">
                    <IconPhone className="text-contrast-secondary" />
                    <input
                      name="support_phone"
                      type="tel"
                      placeholder="Ej. 8888 8888"
                      value={editableStore.support_phone || ""}
                      onChange={(e) => {
                        let digits = e.target.value.replace(/\D/g, "");
                        if (digits.length > 8) digits = digits.slice(0, 8);
                        const formatted =
                          digits.length > 4
                            ? `${digits.slice(0, 4)} ${digits.slice(4)}`
                            : digits;
                        setEditableStore((prev) =>
                          prev ? { ...prev, support_phone: formatted } : prev
                        );
                      }}
                      maxLength={9}
                      inputMode="numeric"
                      pattern="^\\d{4}\\s\\d{4}$"
                      title="Debe tener el formato 8888 8888"
                      className="w-full py-2 bg-transparent focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    Número visible para clientes en tu tienda.
                  </span>
                </label>
                <label className="flex flex-col w-full">
                  Correo de la tienda
                  <input
                    type="email"
                    name="support_email"
                    value={editableStore.support_email || ""}
                    onChange={handleChange}
                    className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
                  />
                </label>
              </section>

              <section>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <h2>Links / Redes sociales</h2>
                    {!addingSocial ? (
                      <button type="button" onClick={() => setAddingSocial(true)}>
                        <IconSquareRoundedPlus className="text-contrast-secondary cursor-pointer" />
                      </button>
                    ) : (
                      <button type="button" onClick={() => setAddingSocial(false)}>
                        <IconX className="text-contrast-secondary size-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {socialLinks.map((link, index) => (
                      <ButtonComponent
                        key={index}
                        text={link.text}
                        icon={iconMap[link.type]}
                        style="text-main-dark flex gap-2 bg-main-dark/20 py-3 px-2 rounded-xl font-semibold"
                        iconStyle="text-contrast-secondary"
                      />
                    ))}

                    {addingSocial && (
                      <div className="flex gap-2 items-center bg-main-dark/10 py-3 px-2 rounded-xl">
                        <select
                          value={newType}
                          onChange={(e) =>
                            setNewType(e.target.value as SocialLink["type"])
                          }
                          className="bg-transparent outline-none"
                        >
                          <option value="instagram">Instagram</option>
                          <option value="x">X</option>
                          <option value="facebook">Facebook</option>
                          <option value="link">Link</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Usuario o link"
                          value={newText}
                          onChange={(e) => setNewText(e.target.value)}
                          className="bg-transparent outline-none flex-1"
                        />
                        <button
                          type="button"
                          onClick={addSocialLink}
                          className="text-contrast-secondary font-semibold"
                        >
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-5 sm:gap-10">
                <label className="flex flex-col w-full">
                  Descripción de la tienda
                  <textarea
                    name="description"
                    value={editableStore.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className="bg-main-dark/20 rounded-xl px-3 py-2 text-sm sm:text-base"
                  />
                </label>
                <label className="flex flex-col w-full">
                  Dirección de la tienda
                  <textarea
                    name="registered_address"
                    value={editableStore.registered_address || ""}
                    onChange={handleChange}
                    rows={4}
                    className="bg-main-dark/20 rounded-xl px-3 py-2 text-sm sm:text-base"
                  />
                </label>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-10 w-full">
              <ButtonComponent
                text="Cancelar"
                onClick={handleCancelStore}
                style="w-full sm:w-[48%] p-3 rounded-full text-white bg-main cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300"
              />
              <ButtonComponent
                text={savingStore ? "Guardando..." : "Guardar tienda"}
                onClick={handleSaveStore}
                style="w-full sm:w-[48%] p-3 rounded-full text-white bg-contrast-secondary cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
