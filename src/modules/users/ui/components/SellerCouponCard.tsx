import { IconEdit, IconTrash, IconTag } from "@tabler/icons-react";
import ButtonComponent from "../../../../components/ui/ButtonComponent";

interface SellerCouponCardProps {
    coupon: any;
    onEdit: (coupon: any) => void;
    onDelete: (id: number) => void;
}

export default function SellerCouponCard({
    coupon,
    onEdit,
    onDelete,
}: SellerCouponCardProps) {
    const typeLabel =
        coupon.type === "PERCENTAGE"
            ? `${coupon.value}%`
            : coupon.type === "FIXED"
                ? `₡${coupon.value}`
                : "Envío gratis";

    const isExpired =
        coupon.expires_at && new Date(coupon.expires_at) < new Date();

    return (
        <div className="w-full bg-beige border border-taupe/30 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-quicksand transition-all hover:shadow-lg">
            {/* Izquierda: info */}
            <div className="flex flex-col gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                    <IconTag size={20} className="text-main" />
                    <h3 className="font-semibold text-lg">{coupon.code}</h3>
                </div>

                <p className="text-sm text-gray-700">{coupon.description || "Sin descripción"}</p>

                <div className="text-sm flex flex-wrap gap-2 text-gray-600">
                    <span>
                        <strong>Tipo:</strong> {typeLabel}
                    </span>
                    {coupon.min_purchase && (
                        <span>
                            <strong>Min:</strong> ₡{coupon.min_purchase}
                        </span>
                    )}
                    {coupon.max_discount && (
                        <span>
                            <strong>Máx:</strong> ₡{coupon.max_discount}
                        </span>
                    )}
                    {coupon.usage_limit && (
                        <span>
                            <strong>Límite:</strong> {coupon.usage_limit}
                        </span>
                    )}
                    {coupon.usage_per_user && (
                        <span>
                            <strong>Por usuario:</strong> {coupon.usage_per_user}
                        </span>
                    )}
                    {coupon.expires_at && (
                        <span>
                            <strong>Expira:</strong>{" "}
                            {new Date(coupon.expires_at).toLocaleDateString("es-CR")}
                        </span>
                    )}
                </div>

                <div>
                    {isExpired ? (
                        <span className="text-red-500 text-sm font-semibold">
                            Expirado
                        </span>
                    ) : coupon.active ? (
                        <span className="text-green-600 text-sm font-semibold">
                            Activo
                        </span>
                    ) : (
                        <span className="text-gray-400 text-sm font-semibold">
                            Inactivo
                        </span>
                    )}
                </div>
            </div>

            {/* Derecha: botones */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <ButtonComponent
                    style="flex-1 sm:flex-none bg-main text-white rounded-full py-4 px-4 hover:bg-main-dark transition-all"
                    onClick={() => onEdit(coupon)}
                    icon={<IconEdit size={18} />}
                />
                <ButtonComponent
                    style="flex-1 sm:flex-none bg-red-500 text-white rounded-full py-4 px-4 hover:bg-red-600 transition-all"
                    onClick={() => onDelete(coupon.id)}
                    icon={<IconTrash size={18} />}
                />
            </div>
        </div>
    );
}
