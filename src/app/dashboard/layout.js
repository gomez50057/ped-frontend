"use client";

import { PlatformProvider } from "@/context/PlatformContext";
import ClientLayout from "@/components/shared/ClientLayout";

export default function DashboardLayout({ children }) {
  return (
    <PlatformProvider>
      <ClientLayout>
        {children}
      </ClientLayout>
    </PlatformProvider>
  );
}
