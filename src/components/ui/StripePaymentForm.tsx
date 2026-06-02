import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { Button } from "../ui/button";

interface StripePaymentFormProps {
  total: number;
  onPaymentSuccess: (paymentIntent: any) => void;
}

export default function StripePaymentForm({ total, onPaymentSuccess }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Límite de monto
    if (total > 850000) return alert("El monto excede ₡850 000.");

    setLoading(true);
    try {
      const { data } = await axios.post("/create-payment-intent", { amount: total });
      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (result.paymentIntent?.status === "succeeded") {
        onPaymentSuccess(result.paymentIntent);
      }
    } catch (err) {
      console.error("❌ Error en StripePaymentForm:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <CardElement
          options={{
            style: {
              base: { fontSize: "16px", color: "#32325d" },
              invalid: { color: "#fa755a" },
            },
          }}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full mt-4 bg-contrast-secondary hover:bg-main text-white">
        {loading ? "Procesando..." : "Pagar ahora"}
      </Button>
    </form>
  );
}
