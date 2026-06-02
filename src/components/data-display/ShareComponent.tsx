import { useState } from "react";
import {
  IconShare,
  IconLink,
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
} from "@tabler/icons-react";
import ButtonComponent from "../ui/ButtonComponent";
import { useAlert } from "../../hooks/context/AlertContext";

interface ShareComponentProps {
  positionClass?: string;
  shareUrl: string;
  type?: "product" | "wishlist"; // 👈 nuevo
  titleText?: string; // opcional, para personalizar más
}

export default function ShareComponent({
  positionClass = "absolute right-3 top-25",
  shareUrl,
  type = "product",
  titleText = "",
}: ShareComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useAlert();

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case "link":
        navigator.clipboard.writeText(shareUrl);
        showAlert({
          type: "success",
          message: "Enlace copiado al portapapeles ",
          title: "Enlace copiado",
          confirmText: "Ok",
        });
        break;

      case "whatsapp":
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        // 🧠 Mensaje dinámico según tipo
        const message =
  type === "wishlist"
    ? `Oye, mirá mi lista de deseos en TukiShop${titleText ? `: ${titleText}` : ""} ${shareUrl}`
    : `Oye, mirá este producto de TukiShop${titleText ? `: ${titleText}` : ""} ${shareUrl}`;

        const encodedMessage = encodeURIComponent(message);

        const url = isIOS
          ? `whatsapp://send?text=${encodedMessage}`
          : `https://wa.me/?text=${encodedMessage}`;

        if (isIOS) {
          window.location.href = url;
        } else {
          window.open(url, "_blank");
        }
        break;

      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank"
        );
        break;

      case "instagram":
        showAlert({
          type: "info",
          message:
            "Instagram no permite compartir enlaces directamente desde el navegador",
          title: "Compartir en Instagram",
          confirmText: "Ok",
        });
        break;

      case "tiktok":
        showAlert({
          type: "info",
          message:
            "TikTok no permite compartir desde el navegador. Usa la app móvil ",
          title: "Compartir en TikTok",
          confirmText: "Ok",
        });
        break;

      case "x":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}`,
          "_blank"
        );
        break;
    }

    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      {/* 🔘 Botón principal */}
      <ButtonComponent
        icon={<IconShare />}
        text="Compartir"
        style="flex text-sm px-2 items-center gap-2 hover:font-semibold rounded-full cursor-pointer"
        iconStyle="text-contrast-secondary"
        onClick={() => setIsModalOpen((prev) => !prev)}
      />

      {/* 🔹 Burbuja dinámica */}
      <div className={positionClass}>
        <ul className="flex gap-3">
          <li
            className={`relative bottom-10 left-27 bg-main hover:bg-sky-500 p-2 rounded-full text-white transform transition-all duration-300 shadow-md delay-0 ${
              isModalOpen ? "scale-100" : "scale-0"
            }`}
            onClick={() => handleShare("link")}
          >
            <IconLink />
          </li>
          <li
            className={`relative bottom-10 left-27 bg-main hover:bg-green-600 p-2 rounded-full text-white transform transition-all duration-300 shadow-md delay-50 ${
              isModalOpen ? "scale-100" : "scale-0"
            }`}
            onClick={() => handleShare("whatsapp")}
          >
            <IconBrandWhatsapp />
          </li>
          <li
            className={`relative bottom-10 left-27 bg-main hover:bg-blue-600 p-2 rounded-full text-white transform transition-all duration-300 shadow-md delay-100 ${
              isModalOpen ? "scale-100" : "scale-0"
            }`}
            onClick={() => handleShare("facebook")}
          >
            <IconBrandFacebook />
          </li>
          <li
            className={`relative bottom-10 left-27 bg-main hover:bg-orange-500 p-2 rounded-full text-white transform transition-all duration-300 shadow-md delay-150 ${
              isModalOpen ? "scale-100" : "scale-0"
            }`}
            onClick={() => handleShare("instagram")}
          >
            <IconBrandInstagram />
          </li>
          <li
            className={`relative bottom-10 left-27 bg-main hover:bg-rose-500 p-2 rounded-full text-white transform transition-all duration-300 shadow-md delay-200 ${
              isModalOpen ? "scale-100" : "scale-0"
            }`}
            onClick={() => handleShare("tiktok")}
          >
            <IconBrandTiktok />
          </li>
          <li
            className={`relative bottom-10 left-27 bg-main hover:bg-black p-2 rounded-full text-white transform transition-all duration-300 shadow-md delay-250 ${
              isModalOpen ? "scale-100" : "scale-0"
            }`}
            onClick={() => handleShare("x")}
          >
            <IconBrandX />
          </li>
        </ul>
      </div>
    </div>
  );
}
