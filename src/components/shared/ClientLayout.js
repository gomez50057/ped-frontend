"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HomeThemeToggle from "@/components/shared/HomeThemeToggle";

const HOME_THEME_STORAGE_KEY = "ped-home-theme-preference";

function isValidPreference(value) {
  return value === "light" || value === "dark";
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [themePreference, setThemePreference] = useState("light");
  const hideNavbar =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/seguimiento-actividades") ||
    pathname.startsWith("/revision") ||
    pathname.startsWith("/reconocimiento-uaeh") ||
    pathname.startsWith("/certificate-batch-preview");
  const isHome = pathname === "/";
  const resolvedTheme = useMemo(() => themePreference, [themePreference]);

  useEffect(() => {
    const savedPreference = window.localStorage.getItem(HOME_THEME_STORAGE_KEY);

    if (isValidPreference(savedPreference)) {
      setThemePreference(savedPreference);
    } else if (savedPreference === "system") {
      setThemePreference("light");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(HOME_THEME_STORAGE_KEY, themePreference);
  }, [themePreference]);

  if (isHome) {
    return (
      <div
        className="home-theme-scope"
        data-home-theme={resolvedTheme}
        data-home-theme-preference={themePreference}
      >
        {!hideNavbar && <Navbar />}
        <HomeThemeToggle
          preference={themePreference}
          resolvedTheme={resolvedTheme}
          onChange={setThemePreference}
        />
        {children}
        <Footer />
      </div>
    );
  }

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      <Footer />
    </>
  );
}
