import Footer from "@/components/shared/Footer";
import ClientLayout from "@/components/shared/ClientLayout";
import "@/styles/globals.css";

export const metadata = {
  title: "Plan Estatal de Desarrollo | Gobierno del Estado de Hidalgo",
  description:
    "Consulta y participa en la Actualización del Plan Estatal de Desarrollo impulsado por la Unidad de Planeación y Prospectiva del Gobierno del Estado de Hidalgo.",

  icons: {
    icon: "/favicon.ico",
  },

  authors: [
    {
      name: "Unidad de Planeación y Prospectiva - Coordinación General de Planeación y Proyectos - Gabriel Gómez Gómez",
      // url: "https://planestataldedesarrollo.hidalgo.gob.mx", // personalizar
    },
  ],

  // Open Graph (para compartir en redes como Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: "Plan Estatal de Desarrollo | Gobierno de Hidalgo",
    description:
      "Consulta y participa en el Plan Estatal de Desarrollo del Estado de Hidalgo.",
    url: "https://planestataldedesarrollo.hidalgo.gob.mx",
    siteName: "Plan Estatal de Desarrollo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Plan Estatal de Desarrollo del Estado de Hidalgo",
      },
    ],
    locale: "es_MX",
    type: "website",
  },

  // URL base para generar links absolutos
  metadataBase: new URL("https://planestataldedesarrollo.hidalgo.gob.mx"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Footer />
      </body>
    </html>
  );
}
