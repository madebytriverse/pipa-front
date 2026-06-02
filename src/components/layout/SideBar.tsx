import {
    IconBox,
    IconBuildingStore,
    /*IconClipboardText,*/
    /*IconFileCheck,*/
    IconMailOpened,
    IconPackage,
    IconPhotoScan,
    IconTag,
    IconUser,
} from "@tabler/icons-react";


interface SideBarProps {
    type: "SELLER" | "CUSTOMER" | "ADMIN" | null | undefined;
    onSelect: (section: string) => void;
    selected: string;
}

export default function SideBar({ type, onSelect, selected }: SideBarProps) {
    

    const baseItem =
        "flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium text-sm relative";
    const active =
        "bg-main-dark/10 text-main-dark border-l-4 border-contrast-secondary shadow-sm translate-x-2";
    const inactive =
        "text-gray-700 hover:bg-main-dark/5 hover:text-main-dark hover:translate-x-1";

    return (
        <aside className="flex flex-col justify-between bg-white/90 backdrop-blur-sm border-r border-main-dark/10 shadow-sm font-quicksand p-6 rounded-r-3xl h-full w-[18rem]">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-main-dark mb-6 text-center">
                    {type === "ADMIN" ? "Panel de Administración" : "Mi Cuenta"}
                </h2>

                <ul className="space-y-2">
                    {/* Customer / Seller */}
                    {(type === "CUSTOMER" || type === "SELLER") && (
                        <>
                            <li
                                className={`${baseItem} ${selected === "profile" ? active : inactive
                                    }`}
                                onClick={() => onSelect("profile")}
                            >
                                <IconUser size={18} />
                                <span>Información de la cuenta</span>
                            </li>

                            {/*<li
                                className={`${baseItem} ${selected === "transactions" ? active : inactive
                                    }`}
                                onClick={() => onSelect("transactions")}
                            >
                                <IconClipboardText size={18} />
                                <span>Historial de transacciones</span>
                            </li>*/}
                            <li
                                className={`${baseItem} ${selected === "orders" ? active : inactive
                                    }`}
                                onClick={() => onSelect("orders")}
                            >
                                <IconPackage size={18} />
                                <span>Mis pedidos</span>
                            </li>
                            {type === "SELLER" && (
                                <>
                                    <li
                                        className={`${baseItem} ${selected === "products" ? active : inactive
                                            }`}
                                        onClick={() => onSelect("products")}
                                    >
                                        <IconBuildingStore size={18} />
                                        <span>Mis productos</span>
                                    </li>
                                   {/* <li
                                        className={`${baseItem} ${selected === "orderStatus" ? active : inactive
                                            }`}
                                        onClick={() => onSelect("orderStatus")}
                                    >
                                        <IconFileCheck size={18} />
                                        <span>Estado de pedidos</span>
                                    </li>*/}
                                    <li
                                        className={`${baseItem} ${selected === "coupons" ? active : inactive
                                            }`}
                                        onClick={() => onSelect("coupons")}
                                    >
                                        <IconTag size={18} />
                                        <span>Cupones</span>
                                    </li>
                                </>
                            )}
                        </>
                    )}

                    {/* Admin */}
                    {type === "ADMIN" && (
                        <>
                            <li
                                className={`${baseItem} ${selected === "users" ? active : inactive
                                    }`}
                                onClick={() => onSelect("users")}
                            >
                                <IconUser size={18} />
                                <span>Usuarios</span>
                            </li>

                            <li
                                className={`${baseItem} ${selected === "coupons" ? active : inactive
                                    }`}
                                onClick={() => onSelect("coupons")}
                            >
                                <IconTag size={18} />
                                <span>Cupones</span>
                            </li>

                            <li
                                className={`${baseItem} ${selected === "mailbox" ? active : inactive
                                    }`}
                                onClick={() => onSelect("mailbox")}
                            >
                                <IconMailOpened size={18} />
                                <span>Buzón</span>
                            </li>

                            <li
                                className={`${baseItem} ${selected === "banners" ? active : inactive
                                    }`}
                                onClick={() => onSelect("banners")}
                            >
                                <IconPhotoScan size={18} />
                                <span>Banners</span>
                            </li>
                            <li
                                className={`${baseItem} ${selected === "support" ? active : inactive
                                    }`}
                                onClick={() => onSelect("support")}
                            >
                                <IconBox size={18} />
                                <span>Soporte de pedidos</span>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </aside>
    );
}
