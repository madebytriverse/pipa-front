import { useEffect, useState } from "react";
import { IconX } from "@tabler/icons-react";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import { useCoupons } from "../../infrastructure/useCoupons";
import {
  useProducts,
  type Category,
} from "../../../store/infrastructure/useProducts";

interface AdminCouponCRUDModalProps {
  coupon?: any;
  onClose: () => void;
  onSave?: (couponData: any) => void;
}

interface CouponFormData {
  code: string;
  description: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  min_purchase?: number | string;
  max_discount?: number | string;
  store_id?: number | string;
  category_id?: number | string;
  product_id?: number | string;
  user_id?: number | string;
  usage_limit: number;
  usage_per_user: number;
  expires_at: string;
  active: boolean;
}

export default function AdminCouponCRUDModal({
  coupon,
  onClose,
  onSave,
}: AdminCouponCRUDModalProps) {
  const [formData, setFormData] = useState<CouponFormData>(
    coupon ?? {
      code: "",
      description: "",
      type: "PERCENTAGE",
      value: 0,
      min_purchase: "",
      max_discount: "",
      store_id: "",
      category_id: "",
      product_id: "",
      user_id: "",
      usage_limit: 1,
      usage_per_user: 1,
      expires_at: "",
      active: true,
    }
  );

  const { createCoupon, updateCoupon, loading } = useCoupons();
  const { getCategories } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getCategories();
      setCategories(data);
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const cleanData = (data: CouponFormData): CouponFormData => {
    const cleaned: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === "" || value === undefined) {
        cleaned[key] = null;
      } else if (
        [
          "value",
          "min_purchase",
          "max_discount",
          "store_id",
          "category_id",
          "product_id",
          "user_id",
          "usage_limit",
          "usage_per_user",
        ].includes(key)
      ) {
        cleaned[key] = Number(value);
      } else if (key === "active") {
        cleaned[key] = Boolean(value);
      } else {
        cleaned[key] = value;
      }
    }

    if (cleaned.type === "FREE_SHIPPING") cleaned.value = 0;

    return cleaned as CouponFormData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = cleanData(formData);

    try {
      if (coupon && coupon.id) {
        await updateCoupon(coupon.id, cleanedData);
      } else {
        await createCoupon(cleanedData);
      }

      if (onSave) onSave(cleanedData);
      onClose();
    } catch (err: any) {
      console.error("Error al guardar cupón:", err.response?.data || err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 font-quicksand animate-fadeIn px-3 sm:px-0"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full sm:w-[38rem] max-w-[95vw] sm:max-w-none p-5 sm:p-6 shadow-xl relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-main">
            {coupon ? "Editar cupón" : "Crear cupón"}
          </h2>
          <IconX
            className="cursor-pointer text-gray-500 hover:text-red-500 transition"
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Código */}
          <div>
            <label className="text-sm font-semibold">Código</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-semibold">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 resize-none focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
              rows={2}
            />
          </div>

          {/* Tipo y Valor */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold">Tipo</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
              >
                <option value="PERCENTAGE">Porcentaje (%)</option>
                <option value="FIXED">Monto fijo</option>
                <option value="FREE_SHIPPING">Envío gratis</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold">Valor</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Reglas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Compra mínima</label>
              <input
                type="number"
                name="min_purchase"
                value={formData.min_purchase}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Descuento máximo</label>
              <input
                type="number"
                name="max_discount"
                value={formData.max_discount}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Relacionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Tienda (ID)</label>
              <input
                type="number"
                name="store_id"
                value={formData.store_id}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Categoría</label>
              <select
                name="category_id"
                value={formData.category_id || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">Producto (ID)</label>
              <input
                type="number"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Usuario (ID)</label>
              <input
                type="number"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Límites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">
                Límite total de uso
              </label>
              <input
                type="number"
                name="usage_limit"
                value={formData.usage_limit}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">
                Límite por usuario
              </label>
              <input
                type="number"
                name="usage_per_user"
                value={formData.usage_per_user}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Fecha y estado */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold">Expira en</label>
              <input
                type="date"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 text-sm sm:text-base"
              />
            </div>

            <label className="flex items-center gap-2 mt-2 sm:mt-6 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <span className="text-sm font-semibold">Activo</span>
            </label>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">
            <ButtonComponent
              text="Cancelar"
              style="bg-gray-300 text-black rounded-full px-4 py-2 hover:bg-gray-400 transition-all duration-300 w-full sm:w-auto"
              onClick={onClose}
            />
            <ButtonComponent
              text={loading ? 'Guardando...' : 'Guardar cupón'}
              style="bg-main-dark text-white rounded-full px-4 py-2 hover:bg-main transition-all duration-300 w-full sm:w-auto"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
