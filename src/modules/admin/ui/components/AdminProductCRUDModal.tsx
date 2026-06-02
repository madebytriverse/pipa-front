import React, { useEffect, useMemo, useRef, useState } from "react";
import { IconArrowLeft, IconTrash, IconWand } from "@tabler/icons-react";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import ProductCard from "../../../../components/data-display/ProductCard";
import FeaturedProductCard from "../../../../components/data-display/FeaturedProductCard";
import CategorySelector from "../../../../components/data-display/CategorySelector";

import { useOpenAI } from "../../../store/infrastructure/useOpenAI";
import { useProducts, type Category, type Product } from "../../../store/infrastructure/useProducts";


type ProductForm = Omit<
    Product,
    "price" | "discount_price" | "image" | "image_1_url" | "image_2_url" | "image_3_url"
> & {
    price: number;
    discount_price: number;
    images: (File | string | null)[];
};

type ProductPayload = Omit<ProductForm, "images"> & {
    image: File | string | null;
    image_1?: File | string | null;
    image_2?: File | string | null;
    image_3?: File | string | null;
    store_id: number;
};

interface AdminProductCRUDModalProps {
    productId?: number;
    storeId: number;
    onClose: () => void;
    onSaved?: () => void;
}

export default function AdminProductCRUDModal({
    productId,
    storeId,
    onClose,
    onSaved,
}: AdminProductCRUDModalProps) {
    const isEdit = !!productId;

    const {
        createProduct,
        updateProduct,
        getCategories,
        getProductById,
        loading,
        error,
        success,
    } = useProducts();

    const { getDescription, loading: loadingDescription, error: errorDescription } = useOpenAI();

    const [categories, setCategories] = useState<Category[]>([]);
    const [form, setForm] = useState<ProductForm>({
        name: "",
        description: "",
        details: "",
        price: 0,
        discount_price: 0,
        stock: 0,
        status: "ACTIVE",
        categories: [],
        images: [null, null, null],
        is_featured: false,
    });

    const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);

    // Refs para inputs de archivos
    const fileInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    // Bloquear scroll detrás del modal (consistente con tus otros modales)
    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const original = { overflow: document.body.style.overflow, paddingRight: document.body.style.paddingRight };
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        return () => {
            document.body.style.overflow = original.overflow;
            document.body.style.paddingRight = original.paddingRight;
        };
    }, []);

    // Cargar categorías
    useEffect(() => {
        (async () => {
            const result = await getCategories();
            setCategories(result || []);
        })();
    }, []);

    // Cargar producto si es edición
    useEffect(() => {
        if (!isEdit || !productId) return;
        (async () => {
            const product = await getProductById(productId);
            if (!product) return;

            const loadedImages: (string | null)[] = [
                (product as any).image_1_url || null,
                (product as any).image_2_url || null,
                (product as any).image_3_url || null,
            ];

            setForm({
                ...(product as any),
                images: loadedImages,
                price: Number(product.price) ?? 0,
                discount_price: Number(product.discount_price) ?? 0,
                categories: Array.isArray(product.categories) ? product.categories.map((c: any) => c.id) : [],
                status: product.status || "ACTIVE",
                details: product.details || "",
            });


            setPreviews(loadedImages);
        })();
    }, [isEdit, productId]);

    const mainPreview = useMemo(() => {
        return (
            previews[0] ||
            (typeof form.images[0] === "string"
                ? (form.images[0] as string)
                : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg")
        );
    }, [previews, form.images]);

    const handleGenerateDescription = async () => {
        const description = await getDescription(form.name);
        if (description) setForm((prev) => ({ ...prev, description }));
    };

    const MAX_PRICE = 850_000;

    const validate = () => {
        if (!form.name.trim()) {
            alert("Debes asignarle un nombre al producto.");
            return false;
        }
        if (!isEdit && !form.images[0]) {
            alert("Debes subir al menos una imagen principal.");
            return false;
        }
        if (Number(form.price) > MAX_PRICE) {
            alert(
                `Ingresaste ₡${Number(form.price).toLocaleString()} colones, pero el máximo permitido es ₡${MAX_PRICE.toLocaleString()}.`
            );
            return false;
        }
        return true;
    };

    const buildPayload = (override?: Partial<ProductPayload>): ProductPayload => {
        const base: ProductPayload = {
            image: form.images[0],
            store_id: storeId,
            price: Number(form.price),
            discount_price: Number(form.discount_price || 0),
            image_1: form.images[0],
            image_2: form.images[1],
            image_3: form.images[2],
            name: form.name,
            description: form.description,
            details: form.details,
            stock: form.stock,
            status: form.status,
            categories: form.categories,
            is_featured: form.is_featured,
        };
        return { ...base, ...(override || {}) };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (isEdit && productId) {
                await updateProduct(productId, buildPayload() as any);
                alert("Producto actualizado correctamente.");
            } else {
                await createProduct(buildPayload() as any);
                alert("Producto creado correctamente.");
                // Reset si es creación
                setForm({
                    name: "",
                    description: "",
                    details: "",
                    price: 0,
                    discount_price: 0,
                    stock: 0,
                    status: "ACTIVE",
                    categories: [],
                    images: [null, null, null],
                    is_featured: false,
                });
                setPreviews([null, null, null]);
                fileInputRefs.forEach((ref) => ref.current && (ref.current.value = ""));
            }
            onSaved?.();
            onClose();
        } catch (err: any) {
            console.error("Error al guardar producto:", err);
            if (err?.response?.data?.errors) {
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0];
                alert("⚠️ Error: " + firstError);
            } else if (err?.response?.data?.message) {
                alert("⚠️ " + err.response.data.message);
            } else {
                alert("⚠️ No se pudo guardar el producto. Revisa la consola para más detalles.");
            }
        }
    };

    const handleArchive = async () => {
        if (!isEdit || !productId) return;
        if (!window.confirm("¿Estás seguro de archivar este producto?")) return;

        try {
            await updateProduct(productId, buildPayload({ status: "ARCHIVED" }) as any);
            alert("Producto archivado correctamente.");
            onSaved?.();
            onClose();
        } catch {
            alert("No se pudo archivar el producto.");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileURL = URL.createObjectURL(file);

            // Actualizar form
            setForm((prev) => {
                const imgs = [...prev.images];
                imgs[index] = file;
                return { ...prev, images: imgs };
            });

            // Actualizar previews
            setPreviews((prev) => {
                // Liberar URL previa si era de File
                if (prev[index] && form.images[index] instanceof File) {
                    try {
                        URL.revokeObjectURL(prev[index]!);
                    } catch { }
                }
                const next = [...prev];
                next[index] = fileURL;
                return next;
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        // Limpiar input file
        if (fileInputRefs[index].current) {
            fileInputRefs[index].current!.value = "";
        }
        // Revocar URL si aplicaba
        if (previews[index] && form.images[index] instanceof File) {
            try {
                URL.revokeObjectURL(previews[index]!);
            } catch { }
        }
        // Limpiar estado
        setForm((prev) => {
            const imgs = [...prev.images];
            imgs[index] = null;
            return { ...prev, images: imgs };
        });
        setPreviews((prev) => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 font-quicksand px-3" onClick={onClose}>
            <div
                className="bg-white w-full sm:w-[1200px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 border border-main/10 animate-slideUp scrollbar-thin scrollbar-thumb-main/40 scrollbar-track-transparent"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1 text-gray-main hover:text-main transition-all text-sm sm:text-base"
                    >
                        <IconArrowLeft size={18} />
                        <span className="font-medium">Volver</span>
                    </button>

                    <h2 className="text-lg sm:text-2xl font-semibold text-main">
                        {isEdit ? "Editar producto" : "Nuevo producto"}
                    </h2>

                    <div className="w-12" /> {/* spacer simétrico */}
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-8 sm:gap-10">
                    {/* Línea 1: Nombre / Precios */}
                    <div className="w-full flex flex-col sm:flex-row justify-between gap-6 sm:gap-4">
                        <label className="flex flex-col sm:w-5/12 gap-2">
                            <p className="font-semibold">
                                Nombre del producto <span className="text-red-500">*</span>
                            </p>
                            <textarea
                                maxLength={54}
                                cols={35}
                                rows={2}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Nombre"
                                className="bg-main-dark/20 rounded-2xl p-2 w-full"
                            />
                        </label>

                        <div className="flex flex-col sm:flex-row sm:w-6/12 gap-4">
                            <label className="flex flex-col w-full gap-2">
                                <p className="font-semibold">
                                    Precio <span className="text-red-500">*</span>
                                </p>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                    placeholder="Precio"
                                    className="bg-main-dark/20 rounded-2xl p-2 w-full"
                                />
                            </label>

                            <label className="flex flex-col w-full gap-2">
                                <p className="font-semibold">Precio de oferta</p>
                                <input
                                    type="number"
                                    value={form.discount_price}
                                    onChange={(e) => setForm({ ...form, discount_price: Number(e.target.value) })}
                                    placeholder="Precio de oferta"
                                    className="bg-main-dark/20 rounded-2xl p-2 w-full"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Línea 2: Categorías / Stock & Estado */}
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-5">
                        <div className="flex flex-col sm:w-6/12 gap-2">
                            <p className="font-semibold">
                                Categorías <span className="text-red-500">*</span>
                            </p>
                            <CategorySelector
                                categories={categories}
                                selected={form.categories}
                                setSelected={(ids) => setForm({ ...form, categories: ids })}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:w-6/12 gap-4">
                            <label className="flex flex-col w-full gap-2">
                                <p className="font-semibold">
                                    Stock <span className="text-red-500">*</span>
                                </p>
                                <input
                                    type="number"
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                                    placeholder="Stock"
                                    className="bg-main-dark/20 rounded-2xl p-2 w-full"
                                />
                            </label>

                            <label className="flex flex-col w-full gap-2">
                                <p className="font-semibold">
                                    Estado <span className="text-red-500">*</span>
                                </p>
                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            status: e.target.value as "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED",
                                        })
                                    }
                                    className="bg-main-dark/20 rounded-2xl p-2 w-full"
                                >
                                    <option value="ACTIVE">Activo</option>
                                    <option value="INACTIVE">Inactivo</option>
                                    <option value="DRAFT">Borrador</option> {/* Corregido para ser más claro */}
                                    <option value="ARCHIVED">Archivado</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    {/* Línea 3: Dos columnas grandes */}
                    <div className="flex flex-col sm:flex-row gap-10 justify-between">
                        {/* Columna Izquierda */}
                        <div className="flex flex-col sm:w-6/12 gap-6">
                            {/* Descripción y Detalles agrupados */}
                            <div className="flex flex-col gap-4">
                                <label className="flex flex-col w-full gap-2">
                                    <p className="font-semibold">Descripción (Corta)</p>
                                    <textarea
                                        placeholder="Sobre este producto"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        cols={30}
                                        rows={3}
                                        className="bg-main-dark/20 rounded-xl px-3 py-2 w-full"
                                    />
                                    <div className="flex flex-col w-full items-center">
                                        <ButtonComponent
                                            type="button"
                                            text={loadingDescription ? "Cargando..." : "Autogenerar descripción"}
                                            onClick={handleGenerateDescription}
                                            icon={<IconWand />}
                                            style="flex justify-center text-sm w-full sm:w-[50%] px-3 py-2 items-center gap-2 rounded-full bg-main text-white hover:bg-contrast-secondary transition-colors duration-300"
                                        />
                                        {errorDescription && (
                                            <p className="text-red-500 text-sm text-center">{errorDescription}</p>
                                        )}
                                    </div>
                                </label>


                                <label className="flex flex-col w-full gap-2">
                                    <p className="font-semibold">Detalles </p>
                                    <textarea
                                        placeholder="Detalles, especificaciones, material, etc."
                                        value={form.details}
                                        onChange={(e) => setForm({ ...form, details: e.target.value })}
                                        cols={30}
                                        rows={5}
                                        className="bg-main-dark/20 rounded-xl px-3 py-2 w-full"
                                    />
                                </label>
                            </div>

                            {/* Imágenes */}
                            <div className="flex flex-col gap-4">
                                <p className="font-semibold text-lg text-main">Imágenes del producto</p>

                                {previews.map((previewUrl, index) => (
                                    <div
                                        key={index}
                                        className="relative border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-white/70"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="font-medium text-sm text-gray-700">Imagen {index + 1}</label>
                                            {previewUrl && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1"
                                                >
                                                    <IconTrash size={16} />
                                                    Quitar
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 max-sm:flex-col max-sm:items-start max-sm:gap-3">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt={`Previsualización ${index + 1}`}
                                                    className="w-24 h-20 rounded-lg object-cover border border-gray-300 max-sm:w-full max-sm:h-40"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-400 rounded-lg text-gray-400 text-xs max-sm:w-full max-sm:h-40">
                                                    Sin imagen
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                accept=".png, .jpg, .jpeg, .webp"
                                                ref={fileInputRefs[index]}
                                                onChange={(e) => handleImageChange(e, index)}
                                                className="flex-1 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-main-dark/20 file:text-main file:cursor-pointer hover:file:bg-main-dark/30 transition max-sm:w-full max-sm:text-xs"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="flex flex-col items-center sm:w-6/12 gap-6">
                            <label className="flex items-center gap-2">
                                <p className="font-semibold">Destacar producto</p>
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                    className="cursor-pointer"
                                />
                            </label>

                            {/* Preview */}
                            <div>
                                {form.is_featured ? (
                                    <FeaturedProductCard
                                        shop="Preview"
                                        title={form.name || "Nombre del producto"}
                                        price={Number(form.price) || 0}
                                        discountPrice={Number(form.discount_price) || 0}
                                        img={mainPreview}
                                        rating={0}
                                        edit="EDITING"
                                        id={0}
                                    />

                                ) : (
                                    <ProductCard
                                        shop="Preview"
                                        title={form.name || "Nombre del producto"}
                                        price={Number(form.price) || 0}
                                        discountPrice={Number(form.discount_price) || undefined}
                                        img={mainPreview}
                                        edit="EDITING"
                                        id={0}
                                    />
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex flex-col gap-4 w-full sm:w-2/3">
                                <ButtonComponent
                                    text={loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
                                    style="text-white text-lg py-2 rounded-full bg-contrast-main w-full hover:bg-contrast-secondary transition-all duration-400 cursor-pointer"
                                    type="submit"
                                />
                                <ButtonComponent
                                    text="Cancelar"
                                    style="text-white text-lg py-2 rounded-full bg-main-dark w-full hover:bg-main transition-all duration-400 cursor-pointer"
                                    onClick={onClose}
                                />
                                {isEdit && (
                                    <ButtonComponent
                                        text="Archivar producto"
                                        style="text-white text-lg py-2 rounded-full bg-red-600 w-full hover:bg-red-700 transition-all duration-400 cursor-pointer"
                                        onClick={handleArchive}
                                    />
                                )}
                            </div>

                            {error && <p className="text-red-500 mt-2">{error}</p>}
                            {success && <p className="text-green-500 mt-2">{success}</p>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}