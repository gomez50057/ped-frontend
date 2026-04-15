"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HomeThemeToggle from "@/components/shared/HomeThemeToggle";

const HOME_THEME_STORAGE_KEY = "ped-home-theme-preference";

function isValidPreference(value) {
  return value === "system" || value === "light" || value === "dark";
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [themePreference, setThemePreference] = useState("system");
  const [systemTheme, setSystemTheme] = useState("light");
  const hideNavbar =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/revision") ||
    pathname.startsWith("/reconocimiento-uaeh") ||
    pathname.startsWith("/certificate-batch-preview");
  const isHome = pathname === "/";
  const resolvedTheme = useMemo(
    () => (themePreference === "system" ? systemTheme : themePreference),
    [systemTheme, themePreference]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const savedPreference = window.localStorage.getItem(HOME_THEME_STORAGE_KEY);

    if (isValidPreference(savedPreference)) {
      setThemePreference(savedPreference);
    }

    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handleSystemThemeChange = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
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
