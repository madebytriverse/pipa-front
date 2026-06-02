import React, { useEffect, useState } from "react";
import { useProducts } from "../infrastructure/useProducts";
import { useOpenAI } from "../infrastructure/useOpenAI";
import type { Product, Category } from "../infrastructure/useProducts";
import ButtonComponent from "../../../components/ui/ButtonComponent";
import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import ProductCard from "../../../components/data-display/ProductCard";
import { IconArrowBackUp, IconWand } from "@tabler/icons-react";
import FeaturedProductCard from "../../../components/data-display/FeaturedProductCard";
import CategorySelector from "../../../components/data-display/CategorySelector";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useParams } from "react-router-dom";
import { useAlert } from "../../../hooks/context/AlertContext";

type ProductForm = Omit<
  Product,
  | "price"
  | "discount_price"
  | "image"
  | "image_1_url"
  | "image_2_url"
  | "image_3_url"
> & {
  price: number;
  discount_price: number;
  images: (File | string | null)[];
  details: string;
};

type ProductPayload = Omit<ProductForm, "images"> & {
  image: File | string | null;
  image_1?: File | string | null;
  image_2?: File | string | null;
  image_3?: File | string | null;
};

export default function StoreProductCRUDPage() {
  const {
    createProduct,
    updateProduct,
    getCategories,
    getProductById,
    loading,
    error,
    success,
  } = useProducts();

  const { showAlert } = useAlert();
  const { id } = useParams();
  const { user } = useAuth();
  const {
    getDescription,
    loading: loadingDescription,
    error: errorDescription,
  } = useOpenAI();

  const fileInputRefs = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
  ];
  const [imageErrors, setImageErrors] = useState<(string | null)[]>([null, null, null]);

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

  const [categories, setCategories] = useState<Category[]>([]);
  const [previews, setPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);

  useEffect(() => {
    (async () => {
      const result = await getCategories();
      setCategories(result);
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const product = await getProductById(Number(id));
      if (product) {
        const loadedImages: (string | null)[] = [
          (product as any).image_1_url || null,
          (product as any).image_2_url || null,
          (product as any).image_3_url || null,
        ];

        setForm({
          ...(product as any),
          images: loadedImages,
          price: product.price,
          discount_price: product.discount_price,
          categories: Array.isArray(product.categories)
            ? product.categories.map((cat: any) => cat.id)
            : [],
          status: product.status || "ACTIVE",
          details: (product as any).details || "",
        });
        setPreviews(loadedImages);
      }
    })();
  }, [id]);

  const handleGenerateDescription = async () => {
    const description = await getDescription(form.name);
    if (description) {
      setForm((prev) => ({ ...prev, description }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🟢 Iniciando guardado de producto...");

    const storeId = user?.store?.id;
    if (!storeId) {
      showAlert({
        title: "Error al añadir",
        message: "Hubo un problema con la tienda del usuario",
        type: "error",
      });
      console.warn("❌ user sin store:", user);
      return;
    }

    // 🔹 Validar nombre e imagen principal
    if (!form.name.trim()) {
      showAlert({
        title: "Error",
        message: "Debes asignarle un nombre al producto.",
        type: "error",
      });
      return;
    }

    if (!form.images[0]) {
      showAlert({
        title: "Error al crear el producto",
        message: "Debes subir al menos una imagen principal.",
        type: "error",
      });
      console.warn("❌ form.images vacío:", form.images);
      return;
    }

    // 🔹 Validar precio máximo permitido
    const maxPrice = 850000;
    if (Number(form.price) > maxPrice) {
      showAlert({
        title: "Monto no permitido",
        message: `Ingresaste ₡${Number(form.price).toLocaleString()} colones, pero el máximo permitido es ₡${maxPrice.toLocaleString()}.`,
        type: "error",
      });
      console.warn(`❌ Precio ${form.price} supera el límite de ${maxPrice}`);
      return;
    }

    if (Number(form.price) === Number(form.discount_price)) {
      form.discount_price = 0;
    }

    const payload: ProductPayload = {

      image: form.images[0],
      store_id: storeId,
      price: Number(form.price),
      discount_price: Number(form.discount_price),
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

    console.log("🧾 PAYLOAD A ENVIAR:", payload);
    console.log("🧍 Usuario:", user);
    console.log("🖼️ Imágenes:", form.images);

    try {
      if (id) {
        console.log("✏️ Editando producto con ID:", id);
        await updateProduct(Number(id), payload as any);
        showAlert({
          title: "Producto editado",
          message: "El producto se ha editado correctamente",
          type: "success",
        });
      } else {
        console.log("🆕 Creando nuevo producto...");
        await createProduct(payload as any);
        showAlert({
          title: "Producto creado",
          message: "El producto se ha creado correctamente",
          type: "success",
        });


        // 🔹 Reset del formulario
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
        fileInputRefs.forEach((ref) => {
          if (ref.current) ref.current.value = "";
        });
      }
      setTimeout(() => {
        window.history.back();
      }, 1500);
    } catch (err: any) {
      console.error("🚨 Error al guardar producto:", err);

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0];
        alert("⚠️ Error: " + firstError);
      } else if (err.response?.data?.message) {
        alert("⚠️ " + err.response.data.message);
      } else {
        alert(
          "⚠️ No se pudo guardar el producto. Revisa la consola para más detalles."
        );
      }
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 2 * 1024 * 1024; // 2 MB

      if (file.size > maxSize) {
        // 🔹 Guardar error en el estado
        const newErrors = [...imageErrors];
        newErrors[index] = "La imagen no puede superar los 2 MB.";
        setImageErrors(newErrors);

        // Limpiar input
        if (fileInputRefs[index].current) {
          fileInputRefs[index].current!.value = "";
        }
        return;
      }

      // 🔹 Si es válida, limpiar el error y mostrar preview
      const newErrors = [...imageErrors];
      newErrors[index] = null;
      setImageErrors(newErrors);

      const fileURL = URL.createObjectURL(file);

      setForm((prevForm) => {
        const newImages = [...prevForm.images];
        newImages[index] = file;
        return { ...prevForm, images: newImages };
      });

      setPreviews((prevPreviews) => {
        const newPreviews = [...prevPreviews];
        newPreviews[index] = fileURL;
        return newPreviews;
      });
    }
  };


  const handleRemoveImage = (index: number) => {
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current!.value = "";
    }

    if (previews[index] && form.images[index] instanceof File) {
      URL.revokeObjectURL(previews[index]!);
    }

    setForm((prevForm) => {
      const newImages = [...prevForm.images];
      newImages[index] = null;
      return { ...prevForm, images: newImages };
    });
    setPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      newPreviews[index] = null;
      return newPreviews;
    });
  };

  const mainPreview =
    previews[0] ||
    (typeof form.images[0] === "string"
      ? form.images[0]
      : "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png");

  return (
    <div>
      <NavBar />
      <section className="flex flex-col font-quicksand gap-5 my-10 mx-auto max-w-[80rem] px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ButtonComponent
            icon={<IconArrowBackUp />}
            text="Volver"
            style="flex text-sm ml-0 sm:ml-5 px-2 items-center gap-2 rounded-full cursor-pointer"
            onClick={() => window.history.back()}
          />
          <h1 className="text-2xl sm:text-3xl font-bold border-b-2 sm:border-b-3 border-main">
            {id ? "Editar Producto" : "Nuevo Producto"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-10 py-6 sm:py-10"
        >
          {/* 🔹 Datos principales */}
          <div className="w-full flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
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

            <div className="flex flex-col sm:flex-row sm:w-6/12 gap-5">
              <label className="flex flex-col w-full gap-2">
                <p className="font-semibold">
                  Precio <span className="text-red-500">*</span>
                </p>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  placeholder="Precio"
                  className="bg-main-dark/20 rounded-2xl p-2 w-full"
                />
              </label>

              <label className="flex flex-col w-full gap-2">
                <p className="font-semibold">Precio de oferta</p>
                <input
                  type="text"
                  value={form.discount_price}
                  onChange={(e) =>
                    setForm({ ...form, discount_price: Number(e.target.value) })
                  }
                  placeholder="Precio de oferta"
                  className="bg-main-dark/20 rounded-2xl p-2 w-full"
                />
              </label>
            </div>
          </div>

          {/* 🔹 Categorías y stock */}
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

            <div className="flex flex-col sm:flex-row sm:w-6/12 gap-5">
              <label className="flex flex-col w-full gap-2">
                <p className="font-semibold">
                  Stock <span className="text-red-500">*</span>
                </p>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
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
                      status: e.target.value as
                        | "ACTIVE"
                        | "INACTIVE"
                        | "DRAFT",
                    })
                  }
                  className="bg-main-dark/20 rounded-2xl p-2 w-full"
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                  <option value="DRAFT">Archivado</option>
                </select>
              </label>
            </div>
          </div>

          {/* 🔹 Descripción + Detalles + Preview */}
          <div className="flex flex-col sm:flex-row gap-10 justify-between">
            {/* Izquierda */}
            <div className="flex flex-col sm:w-5/12 gap-6">

              {/* 🔹 Descripción llamativa */}
              <label className="flex flex-col w-full gap-2">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-main-dark">Descripción</p>
                  <span className="text-xs text-gray-500">Máx. 400 caracteres</span>
                </div>
                <div className="bg-main-dark/20 rounded-xl px-3 py-2 w-full">
                  <textarea
                    placeholder="Describe el producto de forma atractiva, por ejemplo: 'La camiseta perfecta para los fans del ciclismo, cómoda y con tela transpirable.' O utiliza el botón 'Autogenerar descripción'."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    maxLength={400}
                    rows={5}
                    className="bg-transparent w-full resize-none outline-none text-sm sm:text-base placeholder-gray-500"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  Esta descripción se mostrará en la página del producto para atraer al cliente.
                </span>
                <div className="flex flex-col w-full items-center mt-2">
                  <ButtonComponent
                    type="button"
                    text={loadingDescription ? "Cargando..." : "Autogenerar descripción"}
                    onClick={handleGenerateDescription}
                    icon={<IconWand />}
                    style="flex justify-center text-sm w-full sm:w-[50%] px-3 py-2 items-center gap-2 rounded-full bg-main text-white hover:bg-contrast-secondary transition-colors duration-300"
                  />
                  {errorDescription && (
                    <p className="text-red-500 text-sm text-center mt-1">
                      {errorDescription}
                    </p>
                  )}
                </div>
              </label>

              <div className="flex flex-col gap-4">
                <p className="font-semibold text-lg text-main">
                  Agregar imágenes
                </p>

                {previews.map((previewUrl, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-white/70 max-sm:p-3"
                  >
                    <div className="flex justify-between items-center mb-3 max-sm:flex-col max-sm:items-start max-sm:gap-1">
                      <label className="font-medium text-sm text-gray-700">
                        Imagen {index + 1}
                      </label>
                      {previewUrl && (
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold max-sm:self-end"
                        >
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
                    <div className="flex flex-col gap-1 mt-2 text-xs text-gray-500">
                      <p>Límite máximo por imagen: <span className="font-semibold text-main">2 MB</span></p>
                      {imageErrors[index] && (
                        <p className="text-red-500 font-medium">{imageErrors[index]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Derecha */}
            <div className="flex flex-col items-center sm:w-6/12 gap-6">
              {/* 🔹 Detalles técnicos */}
              <label className="flex flex-col w-full gap-2">
                <p className="font-semibold text-main-dark">Detalles técnicos</p>
                <div className="bg-main-dark/20 rounded-xl px-3 py-2 w-full">
                  <textarea
                    placeholder={`Ejemplo:
- Peso: 500g
- Material: Acero inoxidable
- Medidas: 20x10cm`} value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    rows={5}
                    className="bg-transparent w-full resize-none outline-none text-sm sm:text-base placeholder-gray-500"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  Incluí especificaciones técnicas o información adicional útil.
                </span>
              </label>
              <label className="flex items-center gap-2">
                <p className="font-semibold">Destacar producto</p>
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm({ ...form, is_featured: e.target.checked })
                  }
                  className="cursor-pointer"
                />
              </label>

              <div className="">
                {form.is_featured ? (
                  <FeaturedProductCard
                    shop="Preview"
                    title={form.name || "Nombre del producto"}
                    price={form.price}
                    discountPrice={form.discount_price}
                    img={mainPreview}
                    rating={0}
                    edit={"EDITING"}
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

              <div className="flex flex-col gap-4 w-full sm:w-2/3">
                <ButtonComponent
                  text={loading ? "Guardando..." : "Guardar"}
                  style="text-white text-lg py-2 rounded-full bg-contrast-main w-full hover:bg-contrast-secondary transition-all duration-400 cursor-pointer"
                  type="submit"
                />
                <ButtonComponent
                  text="Cancelar"
                  style="text-white text-lg py-2 rounded-full bg-main-dark w-full hover:bg-main transition-all duration-400 cursor-pointer"
                  onClick={() => window.history.back()}
                />
                {id && (
                  <ButtonComponent
                    text="Eliminar producto"
                    style="text-white text-lg py-2 rounded-full bg-red-600 w-full hover:bg-red-700 transition-all duration-400 cursor-pointer"
                    onClick={async () => {
                      if (!id) return;
                      if (
                        !window.confirm(
                          "¿Estás seguro de eliminar este producto?"
                        )
                      )
                        return;

                      const payload: ProductPayload = {
                        image: form.images[0] || null,
                        price: Number(form.price),
                        discount_price: Number(form.discount_price),
                        status: "ARCHIVED",
                        image_1: form.images[0],
                        image_2: form.images[1],
                        image_3: form.images[2],
                        name: form.name,
                        description: form.description,
                        details: form.details,
                        stock: form.stock,
                        categories: form.categories,
                        is_featured: form.is_featured,
                      };

                      try {
                        await updateProduct(Number(id), payload as any);
                        showAlert({message: "Producto eliminado correctamente", type: "success", title: "Producto eliminado", confirmText: "Ok"});
                        window.history.back();
                      } catch {
                        showAlert({message: "No se pudo eliminar el producto", type: "error", title: "Error al eliminar", confirmText: "Ok"});
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
        </form>
      </section>
      <Footer />
    </div>
  );
}