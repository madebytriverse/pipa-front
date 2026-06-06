import { useState, useEffect } from "react";
import axios from "axios";
import { useCartTotals } from "./useCartTotals";
import { useProducts } from "../../modules/store/infrastructure/useProducts";
import { useCheckout } from "../../modules/cart/infraestructure/useCheckout";
import { IconUser, IconMail, IconPhone } from "@tabler/icons-react";
import { useCoupons } from "../../modules/admin/infrastructure/useCoupons";
import {
  IconMapPin,
  IconMinus,
  IconPlus,
  IconTicket,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useAlert } from "../../hooks/context/AlertContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "../ui/StripePaymentForm";
import { useAuth } from "../../hooks/context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../hooks/context/CartContext";
import { motion, AnimatePresence } from "framer-motion"; // Animaciones suaves

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
    "pk_test_51SJQBqLl2yLxOyLIFdLhdGoXjNKpBn2WFxWjMhInw72TUbRe7DVmYLa17tBOfswYlYqe0E3J3bqYWFyuJaEFYMLI00aJOZAoJY"
);

interface TotalsType {
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
  currency: string;
  items_count?: number;
}

interface ShoppingFormProps {
  variant?: "checkout" | "product";
  onAddToCart?: (quantity: number) => void;
  productId?: number;
  quantity?: number;
}

export default function ShoppingForm({
  variant = "checkout",
  onAddToCart,
  productId,
  quantity = 1,
}: ShoppingFormProps) {
  const { processCheckout, processGuestCheckout } = useCheckout();
  const { totals, getTotals, loading, error } = useCartTotals();
  const { getProductById } = useProducts();
  const { validateCoupon } = useCoupons();
  const { showAlert } = useAlert();
  const { user, token } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const params = useParams();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // 🏠 Campos de dirección manual
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [savingAddress, setSavingAddress] = useState(false);

  // 🧍 Campos del formulario de invitado
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const [localTotals, setLocalTotals] = useState<TotalsType>({
    subtotal: 0,
    taxes: 0,
    shipping: 0,
    total: 0,
    currency: "CRC",
  });
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState<number>(quantity);

  // 🧾 Estados del cupón
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const format = (n: number) => (n ?? 0).toLocaleString("es-CR");

  // ============================
  // 🔹 Cargar totales según modo
  // ============================
  useEffect(() => {
    let isMounted = true;
    const loadTotals = async () => {
      try {
        const id = productId ?? Number(params.id);
        if (variant === "product") {
          const productData = await getProductById(id);
          if (!productData || !isMounted) return;
          setProduct(productData);
          const price = productData.discount_price ?? productData.price;
          const subtotal = price * qty;
          const taxes = subtotal * 0.13;
          const total = subtotal + taxes;
          setLocalTotals({
            subtotal,
            taxes,
            shipping: 0,
            total,
            currency: "CRC",
          });
        } else if (variant === "checkout" && token) {
          const cartRes = await getTotals();
          if (isMounted && cartRes) setLocalTotals(cartRes);
        }
      } catch (err) {
        console.error("❌ Error al cargar totales:", err);
      }
    };
    loadTotals();
    return () => {
      isMounted = false;
    };
  }, [variant, productId, qty, token]);

  useEffect(() => {
  if (variant !== "checkout" || !cart) return;

  // 🔹 Solo recalcula localmente, no llama a getTotals cada vez
  const subtotal =
    cart.items?.reduce((acc, item) => {
      const price =
        item.product.discount_price && item.product.discount_price > 0
          ? item.product.discount_price
          : item.product.price;
      return acc + price * item.quantity;
    }, 0) ?? 0;

  const taxes = subtotal * 0.13;
  const shipping = cart.items?.length ? 3000 : 0;
  const total = subtotal + taxes + shipping - discount;

  setLocalTotals({
    subtotal,
    taxes,
    shipping,
    total,
    currency: "CRC",
  });
}, [cart, discount, variant]);


  // ============================
  // 🔹 Direcciones guardadas
  // ============================
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(data.addresses || []);
      } catch (error) {
        console.error("❌ Error al obtener direcciones:", error);
      }
    };
    if (user) fetchAddresses();
  }, [user, token]);

  // ============================
  // 💾 Guardar nueva dirección
  // ============================
  const handleSaveAddress = async () => {
    if (!street || !city || !country) {
      showAlert({
        title: "Campos incompletos",
        message: "Debes completar al menos la calle, ciudad y país.",
        type: "warning",
      });
      return;
    }

    try {
      const existe = addresses.some(
        (a) =>
          a.street?.trim().toLowerCase() === street.trim().toLowerCase() &&
          a.city?.trim().toLowerCase() === city.trim().toLowerCase()
      );
      if (existe) {
        showAlert({
          title: "Dirección duplicada",
          message: "Ya tienes una dirección guardada con la misma calle y ciudad.",
          type: "warning",
        });
        return;
      }

      setSavingAddress(true);
      const { data } = await axios.post(
        "/addresses",
        {
          street,
          city,
          state,
          country,
          zip_code: zipCode,
          phone_number: phoneNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert({
        title: "Dirección guardada",
        message: "La nueva dirección se ha guardado correctamente.",
        type: "success",
      });

      setAddresses((prev) => [...prev, data.address]);
      setSelectedAddressId(data.address.id);
    } catch (error) {
      console.error("❌ Error al guardar dirección:", error);
      showAlert({
        title: "Error al guardar",
        message: "No se pudo guardar la dirección. Inténtalo de nuevo.",
        type: "error",
      });
    } finally {
      setSavingAddress(false);
    }
  };

  // ============================
  // 💳 Pago con Stripe
  // ============================
  const handlePayment = async (paymentIntent: any) => {
    const isGuest = !user || !token;

    if (isGuest) {
      // Validaciones mínimas del invitado
      if (!guestName.trim() || !guestEmail.trim()) {
        showAlert({
          title: "Datos requeridos",
          message: "Por favor completa tu nombre y correo electrónico.",
          type: "warning",
        });
        return;
      }

      if (!street.trim() || !city.trim()) {
        showAlert({
          title: "Dirección requerida",
          message: "Por favor completa al menos la calle y ciudad antes de continuar.",
          type: "warning",
        });
        return;
      }

      const guestItems = (cart?.items ?? []).map((item) => ({
        product_id: item.product.id,
        store_id: item.product.store?.id ?? null,
        quantity: Number(item.quantity),
        unit_price: item.product.discount_price
          ? Number(item.product.discount_price)
          : Number(item.product.price),
      }));

      try {
        await processGuestCheckout(
          paymentIntent,
          localTotals,
          {
            guest_name: guestName,
            guest_email: guestEmail,
            guest_phone: phoneNumber,
            street,
            city,
            state,
            zip_code: zipCode,
            country: country || "Costa Rica",
          },
          guestItems
        );

        // Limpiar campos
        setGuestName("");
        setGuestEmail("");
        setStreet("");
        setCity("");
        setState("");
        setCountry("");
        setZipCode("");
        setPhoneNumber("");
        setCouponCode("");
        setAppliedCoupon(null);
        setDiscount(0);
        setCouponMessage("");
        setLocalTotals({ subtotal: 0, taxes: 0, shipping: 0, total: 0, currency: "CRC" });
      } catch (error) {
        console.error("❌ Error en guest checkout:", error);
      }
      return;
    }

    // --- Checkout autenticado ---
    const selected = addresses.find((a) => a.id === selectedAddressId);

    const finalAddress = selected
      ? selected
      : {
          street,
          city,
          state,
          country,
          zip_code: zipCode,
          phone_number: phoneNumber,
        };

    if (!finalAddress.street || !finalAddress.city) {
      showAlert({
        title: "Dirección requerida",
        message:
          "Debes seleccionar una dirección guardada o escribir una nueva antes de continuar.",
        type: "warning",
      });
      return;
    }

    try {
      await processCheckout(paymentIntent, totals, finalAddress);

      await showAlert({
        title: "Pago completado",
        message: "Tu compra se ha realizado con éxito 🎉",
        type: "success",
        confirmText: "Aceptar",
      });

      setSelectedAddressId(null);
      setStreet("");
      setCity("");
      setState("");
      setCountry("");
      setZipCode("");
      setPhoneNumber("");

      setCouponCode("");
      setAppliedCoupon(null);
      setDiscount(0);
      setCouponMessage("");

      setLocalTotals({ subtotal: 0, taxes: 0, shipping: 0, total: 0, currency: "CRC" });
    } catch (error) {
      console.error("❌ Error al procesar el pago:", error);
      showAlert({
        title: "Error en el pago",
        message: "Hubo un problema al procesar el pago. Intenta nuevamente.",
        type: "error",
        confirmText: "Aceptar",
      });
    }
  };


  // ============================
  // 🖼️ Render
  // ============================
  const rows: [string, number][] = [
    ["Subtotal:", localTotals?.subtotal ?? 0],
    ["Impuestos (13%):", localTotals?.taxes ?? 0],
  ];

  if (variant === "checkout" && (localTotals?.shipping ?? 0) > 0) {
    rows.push(["Envío:", localTotals.shipping ?? 0]);
  }

  return (
    <div className="font-quicksand">
      <h2 className="text-xl font-bold mb-4 text-main">
        {variant === "product" ? "Detalles del producto" : "Detalles de la compra"}
      </h2>

      {loading ? (
        <p className="text-gray-500 mt-5">Cargando totales...</p>
      ) : error ? (
        <p className="text-red-500 mt-5">{error}</p>
      ) : (
        <>
          {/* 💰 Totales animados */}
          <div className="flex flex-col gap-6 pt-6">
            {rows.map(([label, value]) => (
              <div key={label} className="border-t pt-5 flex justify-between">
                <p>{label}</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={value}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.25 }}
                    className="text-[#7E22CE] font-semibold"
                  >
                    ₡{format(value)}
                  </motion.p>
                </AnimatePresence>
              </div>
            ))}

            {discount > 0 && (
              <div className="border-t pt-5 flex justify-between text-green-600 font-semibold">
                <p>Descuento ({appliedCoupon?.code}):</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={discount}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.25 }}
                  >
                    -₡{format(discount)}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}

            <div className="border-t pt-5 flex justify-between">
              <p className="font-bold">Total:</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={localTotals?.total}
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="font-bold text-[#5B21B6]"
                >
                  ₡{format(localTotals?.total)}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* 🎟️ Campo de cupón */}
          {variant === "checkout" && (
            <div className="pt-8">
              <label className="flex items-center gap-2 font-semibold text-main mb-2">
                <IconTicket className="text-contrast-secondary" />
                Aplicar cupón
              </label>

              <div className="flex h-full py-2 gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ingresa tu código"
                  className="border border-gray-300 rounded-xl h-10 px-4 w-full focus:ring-2 focus:ring-contrast-secondary outline-none"
                  disabled={!!appliedCoupon}
                />

                {!appliedCoupon ? (
                  <Button
                    onClick={async () => {
                      if (!localTotals?.total || localTotals.total <= 0) {
                        setCouponMessage(
                          "No se puede aplicar un cupón sin productos en el carrito."
                        );
                        setAppliedCoupon(null);
                        setDiscount(0);
                        return;
                      }

                      const result = await validateCoupon(
                        couponCode,
                        localTotals.total,
                        user?.id
                      );

                      if (!result.valid) {
                        const backendMsg = result.message || "";
                        setCouponMessage(
                          backendMsg || "Cupón inválido o expirado."
                        );
                        setAppliedCoupon(null);
                        setDiscount(0);
                        return;
                      }

                      const newDiscount = result.discount ?? 0;
                      setAppliedCoupon(result);
                      setDiscount(newDiscount);

                      setLocalTotals((prev) => ({
                        ...prev,
                        total: Math.max(prev.total - newDiscount, 0),
                        shipping:
                          result.coupon?.type === "FREE_SHIPPING"
                            ? 0
                            : prev.shipping ?? 0,
                      }));

                      let appliedList = "";
                      if (result.applied_to?.length > 0) {
                        appliedList = result.applied_to
                          .map((p) => `${p.name} (x${p.quantity})`)
                          .join(", ");
                      }

                      setCouponMessage(
                        `Cupón aplicado: ${
                          result.coupon?.code ?? "Desconocido"
                        }${appliedList ? ` (Aplica a: ${appliedList})` : ""}`
                      );
                    }}
                    className="bg-contrast-secondary hover:bg-main text-white rounded-xl px-6 h-10"
                  >
                    Aplicar
                  </Button>
                ) : (
                  <Button
                    onClick={async () => {
                      setAppliedCoupon(null);
                      setDiscount(0);
                      setCouponMessage("Cupón eliminado.");
                      const res = await getTotals();
                      if (res) setLocalTotals(res);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-main rounded-full px-6"
                  >
                    Quitar
                  </Button>
                )}
              </div>

              {couponMessage && (
                <div className="mt-3 text-sm">
                  <p
                    className={`${
                      discount > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {couponMessage}
                  </p>
                  {appliedCoupon?.applied_to && discount > 0 && (
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {appliedCoupon.applied_to.map((item: any) => (
                        <li key={item.id}>
                          {item.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 🧍 Formulario de invitado */}
          {variant === "checkout" && (!user || !token) && (
            <>
              <div className="pt-10 flex flex-col gap-3 text-[#4C1D95]">
                <label className="flex items-center gap-2 text-base font-semibold">
                  <IconUser className="text-[#6B21A8]" />
                  Datos de contacto
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Nombre completo *"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2 col-span-2"
                  />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Correo electrónico *"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Teléfono"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                </div>

                <label className="flex items-center gap-2 text-base font-semibold mt-4">
                  <IconMapPin className="text-[#6B21A8]" />
                  Dirección de envío
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Calle *"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2 col-span-2"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ciudad *"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Provincia"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="País"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Código postal"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    onClick={() => navigate("/loginRegister")}
                    className="text-[#7C3AED] underline hover:text-[#5B21B6]"
                  >
                    Inicia sesión
                  </button>
                </p>
              </div>

              <div className="pt-10">
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    total={localTotals?.total || 0}
                    onPaymentSuccess={handlePayment}
                  />
                </Elements>
              </div>
            </>
          )}

          {/* 🏠 Dirección + Stripe */}
          {variant === "checkout" && user && token && (
            <>
              <div className="pt-10 flex flex-col gap-3 text-[#4C1D95]">
                <label className="flex items-center gap-2 text-base font-semibold">
                  <IconMapPin className="text-[#6B21A8]" />
                  Dirección de envío
                </label>
                <select
                  className="border border-[#C4B5FD] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const selected = addresses.find((a) => a.id === id);
                    if (selected) {
                      setSelectedAddressId(selected.id);
                      setStreet(selected.street || "");
                      setCity(selected.city || "");
                      setState(selected.state || "");
                      setCountry(selected.country || "");
                      setZipCode(selected.zip_code || "");
                      setPhoneNumber(selected.phone_number || "");
                    } else {
                      setSelectedAddressId(null);
                      setStreet("");
                      setCity("");
                      setState("");
                      setCountry("");
                      setZipCode("");
                      setPhoneNumber("");
                    }
                  }}
                  value={selectedAddressId ?? ""}
                >
                  <option value="">Escribir nueva dirección...</option>
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.street} - {addr.city}
                    </option>
                  ))}
                </select>

                {/* Campos manuales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Calle"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ciudad"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Provincia"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="País"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Código postal"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Teléfono"
                    className="border border-[#C4B5FD] rounded-lg px-3 py-2"
                  />
                </div>

                <Button
                  onClick={handleSaveAddress}
                  disabled={savingAddress}
                  className="mt-4 bg-contrast-secondary hover:bg-main text-white flex items-center gap-2 rounded-full px-5 py-2 w-fit"
                >
                  <IconDeviceFloppy size={18} />
                  {savingAddress ? "Guardando..." : "Guardar nueva dirección"}
                </Button>
              </div>

              <div className="pt-10">
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    total={localTotals?.total || 0}
                    onPaymentSuccess={handlePayment}
                  />
                </Elements>
              </div>
            </>
          )}

          {/* 🧍 Variante producto */}
          {variant === "product" && product && (
            <div className="pt-10 flex flex-col gap-4">
              <label className="text-md font-semibold text-main text-center">
                Cantidad
              </label>

              <div className="flex items-center justify-center">
                <div className="flex items-center justify-between w-48 bg-white border-2 border-main rounded-full px-2 py-1 shadow-sm">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-main text-white font-bold transition-all hover:bg-[#4A1F70] disabled:opacity-40"
                    disabled={qty <= 1}
                  >
                    <IconMinus size={16} />
                  </button>

                  <span className="text-lg font-quicksand font-semibold text-main w-10 text-center select-none">
                    {qty}
                  </span>

                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-main text-white font-bold transition-all hover:bg-[#4A1F70] disabled:opacity-40"
                    disabled={qty >= product.stock}
                  >
                    <IconPlus size={16} />
                  </button>
                </div>
              </div>

              <Button
                onClick={async () => {
                  try {
                    await onAddToCart?.(qty);
                    navigate("/shoppingCart");
                  } catch (err) {
                    console.error("❌ Error al añadir al carrito:", err);
                  }
                }}
                className="w-full bg-contrast-secondary hover:bg-main text-white shadow-md rounded-full transition-all mt-2"
              >
                Añadir {qty > 1 ? `${qty} productos` : "al carrito"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
