import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export async function uploadImage(file: File): Promise<string> {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append("image", file);

  try {
    const { data } = await axios.post("/upload-image", formData, {
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
        // OJO: NO pongas 'Content-Type' manual; el navegador arma el boundary.
      },
    });
    return data.url as string;
  } catch (err: any) {
    const serverMsg =
      err?.response?.data?.message ??
      err?.response?.data?.errors?.image?.[0] ??
      err?.message ??
      "Error desconocido al subir imagen";
    console.error("❌ uploadImage falló:", serverMsg, err?.response?.data);
    throw new Error(serverMsg);
  }
}
