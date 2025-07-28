"use client";

import { PlatformProvider } from "@/context/PlatformContext";
import ClientLayout from "@/components/shared/ClientLayout";
import NavbarDashboardViews from "@/components/shared/NavbarDashboardViews";


export default function DashboardLayout({ children }) {
  return (
    <PlatformProvider>
      <NavbarDashboardViews />
      <ClientLayout>
        {children}
      </ClientLayout>
    </PlatformProvider>
  );
}
