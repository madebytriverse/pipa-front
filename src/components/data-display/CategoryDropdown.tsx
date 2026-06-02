import { useState, useRef, useEffect } from "react";
import {
    IconMenu2,
    IconChevronDown,
    IconDots,
    IconBrush,
    IconCar,
    IconPerfume,
    IconToolsKitchen3,
    IconClock,
    IconBallFootball,
    IconDeviceGamepad2,
    IconTool,
    IconArmchair2,
    IconLeaf,
    IconBrandAppleArcade,
    IconHorseToy,
    IconBook2,
    IconWashMachine,
    IconPaw,
    IconMusic,
    IconFileInvoice,
    IconHanger,
    IconFirstAidKit,
    IconBrandStackshare,
} from "@tabler/icons-react";

export default function CategoryDropdown({
    categories,
    navigate,
}: {
    categories: any[];
    navigate: any;
}) {
    const categoryIcons: Record<string, React.ElementType> = {
        Arte: IconBrush,
        Automotriz: IconCar,
        Belleza: IconPerfume,
        Comida: IconToolsKitchen3,
        Decoración: IconClock,
        Deportes: IconBallFootball,
        Gaming: IconDeviceGamepad2,
        Herramientas: IconTool,
        Hogar: IconArmchair2,
        Jardinería: IconLeaf,
        Juegos: IconBrandAppleArcade,
        Juguetes: IconHorseToy,
        Libros: IconBook2,
        Limpieza: IconWashMachine,
        Mascotas: IconPaw,
        Música: IconMusic,
        Oficina: IconFileInvoice,
        Ropa: IconHanger,
        Salud: IconFirstAidKit,
        Tecnología: IconBrandStackshare,
        Otros: IconDots,
    };

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative " ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center sm:gap-2 hover:-translate-y-1 text-main-dark sm:text-white transform transition-all duration-300 hover:cursor-pointer"
            >
                <IconMenu2 className="h-5 w-5 hidden sm:block" />
                <span className="sm:font-light text-sm">Categorías</span>
                <IconChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 animate-fadeIn border border-gray-200
                max-h-79 sm:max-h-98 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                >
                    {categories.map((category) => {
                        const IconComponent = categoryIcons[category.name] || IconDots;
                        return (
                            <button
                                key={category.id}
                                onClick={() => {
                                    navigate(`/search/${category.id}`);
                                    setOpen(false);
                                }}
                                className="flex items-center cursor-pointer w-full text-left px-4 py-2 hover:font-semibold text-gray-800 hover:translate-x-2 transition-all duration-200"
                            >
                                <IconComponent className="inline-block h-5 w-5 mr-2 text-contrast-secondary" />
                                {category.name}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
