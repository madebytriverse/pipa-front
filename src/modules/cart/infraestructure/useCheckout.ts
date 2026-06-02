import axios from "axios";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useAlert } from "../../../hooks/context/AlertContext";
import { useCart } from "../../../hooks/context/CartContext";
import { useCartTotals } from "../../../components/forms/useCartTotals";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export function useCheckout() {
  const { token, user } = useAuth();
  const { showAlert } = useAlert();
  const { cart, clearCart, refreshCart } = useCart();
  const { clearCart: clearTotals } = useCartTotals();

  const processCheckout = async (
    paymentIntent: any,
    totals: any,
    addressData?: {
      street?: string;
      city?: string;
      state?: string;
      zip_code?: string;
      country?: string;
      phone_number?: string;
    }
  ) => {
    if (!token || !user) {
      showAlert({
        title: "Inicia sesión",
        message: "Debes iniciar sesión antes de realizar el pago 🧾",
        type: "warning",
      });
      return;
    }

    try {
      if (!cart || cart.items.length === 0) {
        showAlert({
          title: "Carrito vacío",
          message: "No hay productos para procesar el pago 🛒",
          type: "warning",
        });
        return;
      }

      // 🏪 Validación de dirección
      if (!addressData?.street?.trim()) {
        showAlert({
          title: "Dirección requerida 🏠",
          message: "Por favor escribe o selecciona una dirección antes de pagar.",
          type: "warning",
        });
        return;
      }

      // 🧾 Crear orden base
      const { data: initData } = await axios.post(
        "/checkout/init",
        {
          subtotal: totals?.subtotal || 0,
          shipping: totals?.shipping || 0,
          taxes: totals?.taxes || 0,
          total: totals?.total || 0,
          ...addressData,
          country: addressData?.country || "Costa Rica",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = initData?.order?.id;
      console.log("🧾 Orden creada:", orderId);

      // 🧩 Enviar items
      const items = cart.items.map((item) => ({
        product_id: item.product.id,
        store_id: item.product.store?.id || null,
        quantity: Number(item.quantity),
        unit_price: item.product.discount_price
          ? Number(item.product.discount_price)
          : Number(item.product.price),
      }));

      const { data: itemsRes } = await axios.post(
        "/checkout/items",
        { order_id: orderId, items },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🚨 Validar stock (el backend debe devolver error si no hay stock)
      if (itemsRes?.error && itemsRes.message.includes("stock")) {
        showAlert({
          title: "Stock insuficiente ⚠️",
          message:
            "Uno o más productos no tienen stock suficiente. El pago fue cancelado.",
          type: "error",
        });

        // Cancela el pago en Stripe si ya fue intentado
        await axios.post(
          "/checkout/confirm",
          {
            order_id: orderId,
            status: "CANCELLED",
            payment_id: paymentIntent?.id || "N/A",
            payment_method:
              paymentIntent?.payment_method_types?.[0]?.toUpperCase() || "CARD",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return;
      }

      // 🧩 Confirmar orden
      const { data: confirmRes } = await axios.post(
        "/checkout/confirm",
        {
          order_id: orderId,
          status: paymentIntent?.status === "succeeded" ? "PAID" : "FAILED",
          payment_id: paymentIntent?.id || "N/A",
          payment_method:
            paymentIntent?.payment_method_types?.[0]?.toUpperCase() || "CARD",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Orden confirmada:", confirmRes);

      // 💳 Mensajes según resultado
      if (paymentIntent?.status === "succeeded") {
        // Limpiar carrito
        await axios.post(
          `${import.meta.env.VITE_API_URL}/cart/clear`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await clearCart();
        await clearTotals();
        refreshCart();

        showAlert({
          title: "Pago exitoso 💳",
          message: "Tu orden fue enviada correctamente 🧾🚚",
          type: "success",
        });
      } else {
        showAlert({
          title: "Pago fallido ❌",
          message: "El pago no se completó correctamente. Intenta nuevamente.",
          type: "error",
        });
      }

      return confirmRes;
    } catch (err: any) {
      console.error("❌ Error en checkout:", err.response?.data || err);
      showAlert({
        title: "Error del servidor",
        message:
          err.response?.data?.message ||
          "No se pudo registrar la orden. Revisa los datos del pago.",
        type: "error",
      });
      throw err;
    }
  };

  return { processCheckout };
}
