import { useEffect, useState } from "react";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import SellerCouponCard from "../components/SellerCouponCard";
import SellerCouponCRUDModal from "./SellerCouponCRUDModal";
import { useCoupons } from "../../../admin/infrastructure/useCoupons";

export default function SellerCouponsList() {
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

    // 🔄 Cargar solo los cupones del vendedor
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
                await updateCoupon(selectedCoupon.id, couponData);
            } else {
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
                        Mis cupones de tienda
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
                        Cupones disponibles
                    </h2>

                    {loading ? (
                        <p className="text-gray-500">Cargando cupones...</p>
                    ) : coupons.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {coupons.map((coupon) => (
                                <SellerCouponCard
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
                        <p className="text-gray-500 italic">
                            Aún no tienes cupones creados.
                        </p>
                    )}
                </div>
            </div>

            {/* Modal CRUD */}
            {showModal && (
                <SellerCouponCRUDModal
                    coupon={selectedCoupon}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveCoupon}
                />
            )}
        </section>
    );
}
