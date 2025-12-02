import dynamic from "next/dynamic";

// ⚠️ No importes react-pdf ni react-pageflip aquí
const PdfFlipbookClient = dynamic(
  () => import("./PdfFlipbook.client"),
  {
    ssr: false, // ⬅️ clave: solo en el navegador
    loading: () => (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Cargando visor PED…
      </p>
    ),
  }
);

export default function PdfFlipbook() {
  return <PdfFlipbookClient />;
}
