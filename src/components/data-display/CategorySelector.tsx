import { useState } from "react";
import { IconPlus, IconX } from "@tabler/icons-react";
import type { Category } from "../../modules/store/infrastructure/useProducts";

interface CategorySelectorProps {
    categories: Category[];
    selected: number[];
    setSelected: (ids: number[]) => void;
}

export default function CategorySelector({
    categories,
    selected,
    setSelected,
}: CategorySelectorProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (id: number) => {
        if (!selected.includes(id)) {
            setSelected([...selected, id]);
        }
        setOpen(false);
    };

    const handleRemove = (id: number) => {
        setSelected(selected.filter((catId) => catId !== id));
    };

    return (
        <div className="relative w-full sm:w-1/2">
            {/* Botón + */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-center sm:justify-start gap-2 bg-main-dark/20 p-2 rounded-full cursor-pointer w-full sm:w-auto"
            >
                <IconPlus size={16} />
                <span className="text-sm sm:text-base">Agregar categoría</span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full mt-2 left-0 w-full bg-light-gray rounded-lg shadow-md z-50 p-2 max-sm:text-sm">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
                    >
                        <IconX size={16} />
                    </button>

                    <ul className="flex flex-col gap-2 mt-6 max-h-60 overflow-y-auto">
                        {categories
                            .filter((cat) => !selected.includes(cat.id))
                            .map((cat) => (
                                <li key={cat.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(cat.id)}
                                        className="w-full text-left p-2 hover:bg-main-dark/20 rounded-lg"
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            {/* Chips de categorías seleccionadas */}
            <div className="flex flex-wrap gap-2 mt-2">
                {selected.map((id) => {
                    const cat = categories.find((c) => c.id === id);
                    if (!cat) return null;
                    return (
                        <div
                            key={id}
                            className="bg-contrast-secondary text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs sm:text-sm"
                        >
                            {cat.name}
                            <button
                                type="button"
                                onClick={() => handleRemove(id)}
                                className="hover:text-gray-200"
                            >
                                <IconX size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
