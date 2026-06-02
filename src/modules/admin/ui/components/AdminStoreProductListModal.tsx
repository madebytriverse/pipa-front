import { useEffect, useState } from "react";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import ProductCard from "../../../../components/data-display/ProductCard";
import FeaturedProductCard from "../../../../components/data-display/FeaturedProductCard";
import { useProducts, type Product } from "../../../store/infrastructure/useProducts";
import { getStore } from "../../../store/infrastructure/storeService";
import AdminProductCRUDModal from "./AdminProductCRUDModal";

interface AdminStoreProductListModalProps {
    storeId: number;
    storeName: string;
    onClose: () => void;
}

export default function AdminStoreProductListModal({
    storeId,
    storeName,
    onClose,
}: AdminStoreProductListModalProps) {
    const { getProductsByStore, loading, error } = useProducts();
    const [store, setStore] = useState<any | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | undefined>(undefined);


    useEffect(() => {
        const fetchStoreAndProducts = async () => {
            try {
                const storeData = await getStore(storeId);
                setStore(storeData);

                const productData = await getProductsByStore(storeId);
                setProducts(productData || []);
            } catch (err) {
                console.error("Error al cargar productos de la tienda:", err);
            }
        };

        fetchStoreAndProducts();
    }, [storeId]);

    const openCreateModal = () => {
        setEditingProductId(undefined);
        setShowProductModal(true);
    };

    const openEditModal = (id: number) => {
        setEditingProductId(id);
        setShowProductModal(true);
    };

    const closeProductModal = () => setShowProductModal(false);

    const refreshProducts = async () => {
        const data = await getProductsByStore(storeId);
        setProducts(data || []);
    };


    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const normalProducts = filteredProducts.filter((p) => !p.is_featured);
    const featuredProducts = filteredProducts.filter((p) => p.is_featured);

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 font-quicksand px-3"
            onClick={onClose}
        >
            <div
                className="bg-white w-full sm:w-[1200px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 border border-main/10 animate-slideUp scrollbar-thin scrollbar-thumb-main/40 scrollbar-track-transparent"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 🔹 Header */}
                <div className="flex flex-col items-center border-b border-gray-200 pb-4 mb-6 relative">
                    {/* Botón volver */}
                    <button
                        onClick={onClose}
                        className="absolute left-0 top-2 flex items-center gap-1 text-gray-main hover:text-main transition-all text-sm sm:text-base"
                    >
                        <IconArrowLeft size={18} />
                        <span className="font-medium">Volver</span>
                    </button>

                    <ButtonComponent
                        text="Nuevo producto"
                        onClick={openCreateModal}
                        style="absolute right-0 top-2 bg-contrast-secondary text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-contrast-main transition-all"
                    />

                    {/* Logo y título */}
                    <div className="flex flex-col bg-white sm:flex-row items-center gap-3 sm:gap-5">
                        {store?.image ? (
                            <img
                                src={store.image}
                                alt="Logo tienda"
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain border-2 border-main"
                            />
                        ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-main/20 flex items-center justify-center text-main text-2xl font-semibold">
                                {storeName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="text-center sm:text-left">
                            <h2 className="text-xl sm:text-2xl font-semibold text-main">
                                Productos de {storeName}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {filteredProducts.length} producto
                                {filteredProducts.length !== 1 ? "s encontrados" : " encontrado"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 🔍 Buscador */}
                <div className="flex justify-end mb-8">
                    <div className="flex items-center bg-main-dark/10 gap-2 px-2 py-1.5 rounded-full w-full sm:w-[350px]">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar producto..."
                            className="bg-transparent outline-none px-2 w-full"
                        />
                        <ButtonComponent
                            icon={<IconSearch size={18} />}
                            iconStyle="text-white cursor-pointer"
                            style="bg-gradient-to-br to-contrast-main from-contrast-secondary rounded-full w-12 h-8 flex items-center justify-center"
                        />
                    </div>
                </div>

                {/* Mensajes de carga o error */}
                {loading && (
                    <p className="text-center text-gray-500 py-4">Cargando productos...</p>
                )}
                {error && <p className="text-center text-red-500 py-4">{error}</p>}

                {/* Lista de productos normales */}
                {!loading && normalProducts.length > 0 && (
                    <section className="mb-10">
                        <h3 className="text-lg sm:text-xl font-semibold text-main mb-4 border-b-2 border-main w-fit mx-auto sm:mx-0">
                            Productos
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-6 px-0 sm:px-4">
                            {normalProducts.map((product) => (
                                <div key={product.id} onClick={() => openEditModal(product.id ?? 0)} className="cursor-pointer">
                                    <ProductCard
                                        shop={storeName}
                                        title={product.name}
                                        price={product.price}
                                        discountPrice={product.discount_price || undefined}
                                        img={product.image_1_url ?? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
                                        edit="EDIT"
                                        id={product.id ?? 0}
                                        onEditClick={(id) => openEditModal(id)}
                                    />
                                </div>

                            ))}
                        </div>
                    </section>
                )}

                {/* Productos destacados */}
                {!loading && featuredProducts.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-main mb-4 border-b-2 border-main w-fit mx-auto sm:mx-0">
                            Productos destacados
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center px-0 sm:px-4">
                            {featuredProducts.map((product) => (
                                <div key={product.id} onClick={() => openEditModal(product.id ?? 0)} className="cursor-pointer">
                                    <FeaturedProductCard
                                        shop={storeName}
                                        img={product.image_1_url ?? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
                                        title={product.name}
                                        price={product.price}
                                        discountPrice={product.discount_price}
                                        rating={product.rating ?? 0}
                                        edit="EDIT"
                                        id={product.id ?? 0}
                                        onEditClick={(id) => openEditModal(id)}
                                    />

                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Sin productos */}
                {!loading && filteredProducts.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No hay productos disponibles.</p>
                )}
            </div>
            {showProductModal && (
                <AdminProductCRUDModal
                    productId={editingProductId}
                    storeId={storeId}
                    onClose={closeProductModal}
                    onSaved={refreshProducts}
                />
            )}

        </div>
    );
}
