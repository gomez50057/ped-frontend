"use client";

import { PlatformProvider } from "@/context/PlatformContext";

export default function DashboardLayout({ children }) {
  return (
    <PlatformProvider>
      {children}
    </PlatformProvider>
  );
}
