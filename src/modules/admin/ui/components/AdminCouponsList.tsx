import { useState, useEffect } from "react";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import AdminCouponCard from "./AdminCouponCard";
import AdminCouponCRUDModal from "./AdminCouponCRUDModal";
import { useCoupons } from "../../infrastructure/useCoupons";

export default function AdminCouponsList() {
  const {
    coupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    fetchCoupons,
    loading,
  } = useCoupons();
  const [showModal, setShowModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);

  // 🔄 Cargar cupones al montar
  useEffect(() => {
    fetchCoupons();
  }, []);

  // 🧠 Abrir modal (crear)
  const handleCreateCoupon = () => {
    setSelectedCoupon(null);
    setShowModal(true);
  };

  // 💾 Guardar cupón
  const handleSaveCoupon = async (couponData: any) => {
    try {
      if (selectedCoupon) {
        console.log("✏️ Actualizando cupón:", selectedCoupon.id, couponData);
        await updateCoupon(selectedCoupon.id, couponData);
      } else {
        console.log("➕ Creando nuevo cupón:", couponData);
        await createCoupon(couponData);
      }
      await fetchCoupons();
      setShowModal(false);
    } catch (error: any) {
      console.error("❌ Error al guardar cupón:", error.response?.data || error);
    }
  };

  // 🗑️ Eliminar cupón
  const handleDeleteCoupon = async (id: number) => {
    if (confirm("¿Eliminar este cupón?")) {
      try {
        console.warn("🗑️ Eliminando cupón:", id);
        await deleteCoupon(id);
        await fetchCoupons();
      } catch (err) {
        console.error("❌ Error al eliminar cupón:", err);
      }
    }
  };

  return (
    <section className="pl-2 sm:pl-4 font-quicksand">
      <div className="pl-0 sm:pl-5">
        {/* Header */}
        <div className="pb-6 sm:pb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h1 className="text-lg sm:text-2xl border-b-3 border-main w-fit">
            Administración de cupones
          </h1>
          <ButtonComponent
            text="Crear cupón"
            style="bg-main-dark text-white rounded-full py-2 px-4 font-quicksand hover:bg-main transition-all duration-400 w-full sm:w-auto"
            onClick={handleCreateCoupon}
          />
        </div>

        {/* Lista de cupones */}
        <div>
          <h2 className="text-base sm:text-xl font-quicksand mb-3 sm:mb-4">
            Cupones
          </h2>

          {loading ? (
            <p className="text-gray-500">Cargando cupones...</p>
          ) : coupons.length > 0 ? (
            <div className="flex flex-col gap-4">
              {coupons.map((coupon) => (
                <AdminCouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onEdit={(coupon) => {
                    setSelectedCoupon(coupon);
                    setShowModal(true);
                  }}
                  onDelete={handleDeleteCoupon}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-500 italic">
                No hay cupones creados todavía.
              </p>
              <AdminCouponCard
                coupon={{
                  id: 1,
                  code: "TUKI20",
                  description: "20% de descuento en toda la tienda",
                  type: "PERCENTAGE",
                  value: 20,
                  active: true,
                  expires_at: "2025-12-31",
                }}
                onEdit={(coupon) => {
                  setSelectedCoupon(coupon);
                  setShowModal(true);
                }}
                onDelete={() => {}}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal CRUD */}
      {showModal && (
        <AdminCouponCRUDModal
          coupon={selectedCoupon}
          onClose={() => setShowModal(false)}
          onSave={handleSaveCoupon}
        />
      )}
    </section>
  );
}
