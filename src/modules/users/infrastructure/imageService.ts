import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export async function uploadImage(file: File): Promise<string> {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axios.post("/upload-image", formData, {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      // OJO: NO pongas 'Content-Type' manual; el navegador arma el boundary.
    },
  });

  // El backend responde: { url: 'https://...' }
  return data.url as string;
}
