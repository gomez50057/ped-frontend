"use client";

import { PlatformProvider } from "@/context/PlatformContext";
import ClientLayout from "@/components/shared/ClientLayout";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";

export default function DashboardLayout({ children }) {
  return (
    <PlatformProvider>
      <ClientLayout>
        <GoogleAnalytics />
        {children}
      </ClientLayout>
    </PlatformProvider>
  );
}
