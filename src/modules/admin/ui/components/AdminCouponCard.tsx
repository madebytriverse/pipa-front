import { IconEdit, IconTrash } from "@tabler/icons-react";
import ButtonComponent from "../../../../components/ui/ButtonComponent";

interface CouponCardProps {
    coupon: any;
    onEdit: (coupon: any) => void;
    onDelete: (id: number) => void;
}

export default function AdminCouponCard({ coupon, onEdit, onDelete }: CouponCardProps) {
    return (
        <div
            className="flex items-center justify-between w-full bg-main-dark/10 rounded-2xl px-6 py-4 hover:bg-main-dark/20 transition-all duration-200 shadow-sm cursor-pointer"
            onClick={() => onEdit(coupon)}
        >
            {/* Información del cupón */}
            <div className="flex flex-col">
                <p className="text-lg font-bold text-main-dark">{coupon.code}</p>
                <p className="text-sm text-gray-600">{coupon.description}</p>

                <div className="flex gap-2 text-sm mt-1">
                    <span className="px-2 py-0.5 bg-main-dark/10 rounded-lg font-semibold">
                        {coupon.type === "PERCENTAGE"
                            ? `${coupon.value}%`
                            : coupon.type === "FIXED"
                                ? `₡${coupon.value}`
                                : "Envío gratis"}
                    </span>

                    {coupon.active ? (
                        <span className="text-green-600 font-semibold">Activo</span>
                    ) : (
                        <span className="text-red-600 font-semibold">Inactivo</span>
                    )}
                </div>
            </div>

            {/* Botones */}
            <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
            >
                <ButtonComponent
                    icon={<IconEdit size={18} />}
                    style="bg-contrast-secondary text-white rounded-full p-2 hover:scale-110 transition-all duration-200"
                    onClick={() => onEdit(coupon)}
                />

                <ButtonComponent
                    icon={<IconTrash size={18} />}
                    style="bg-main text-white rounded-full p-2 hover:scale-110 transition-all duration-200"
                    onClick={() => onDelete(coupon.id)}
                />
            </div>
        </div>
    );
}
