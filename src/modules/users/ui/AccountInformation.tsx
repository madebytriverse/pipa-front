import { useState, type JSX } from "react";
import { useAuth } from "../../../hooks/context/AuthContext";
import AlertComponent from "../../../components/data-display/AlertComponent";
import SellerProfileComponent from "./components/SellerProfileComponent";
import CustomerProfileComponent from "./components/CustomerProfileComponent";

interface AccountInformationProps {
  type: "CUSTOMER" | "SELLER" | "ADMIN" | null | undefined;
}

export default function AccountInformation({ type }: AccountInformationProps): JSX.Element {
  const { user, loading } = useAuth();
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    message: "",
    type: "info" as "info" | "success" | "warning" | "error",
  });

  if (loading) return <div>Cargando...</div>;
  if (!user || (user.role !== "SELLER" && user.role !== "CUSTOMER"))
    return <div>No autorizado</div>;

  return (
    <div className="sm:pl-5">
      <div className="flex flex-col">
        <h1 className="text-xl sm:text-3xl font-quicksand font-bold border-b-4 border-main pb-2 w-fit">
          Información de la cuenta</h1>
      </div>

      {type === "CUSTOMER" && (
        <CustomerProfileComponent/>
      )}
      {type === "SELLER" && (
        <SellerProfileComponent/>
      )}

      <AlertComponent
        show={alert.show}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        confirmText="Aceptar"
        cancelText="Cerrar"
        onConfirm={() => setAlert((prev) => ({ ...prev, show: false }))}
        onCancel={() => setAlert((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
