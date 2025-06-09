import Footer from "@/components/shared/Footer";
import ClientLayout from "@/components/shared/ClientLayout";
import "@/styles/globals.css";

export const metadata = {
  title: "Plan Estatal de Desarrollo",
  description: "Plan Estatal de Desarrollo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Footer />
      </body>
    </html>
  );
}
