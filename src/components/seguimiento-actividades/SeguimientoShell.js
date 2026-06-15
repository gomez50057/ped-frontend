"use client";

import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  PlusCircle,
  ShieldAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchMe } from "@/services/seguimientoActividades";
import {
  canManageActivities,
  canManageUsers,
  canViewProjectsTab,
  hasSeguimientoAccess,
} from "./lib/permissions";
import ConfirmProvider from "./ui/ConfirmProvider";
import styles from "./SeguimientoShell.module.css";

const BASE_PATH = "/seguimiento-actividades";

export default function SeguimientoShell({ children, canAccess }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => router.push("/login"))
      .finally(() => setReady(true));
  }, [router]);

  const navItems = useMemo(() => {
    const items = [
      { href: BASE_PATH, label: "Resumen", icon: LayoutDashboard },
      { href: `${BASE_PATH}/actividades`, label: "Actividades", icon: ClipboardList },
      {
        href: `${BASE_PATH}/actividades/nueva`,
        label: "Nueva",
        icon: PlusCircle,
        visible: canManageActivities(user),
      },
      {
        href: `${BASE_PATH}/proyectos`,
        label: "Proyectos",
        icon: FolderKanban,
        visible: canViewProjectsTab(user),
      },
      {
        href: `${BASE_PATH}/usuarios`,
        label: "Usuarios",
        icon: Users,
        visible: canManageUsers(user),
      },
    ];
    return items.filter((item) => item.visible !== false);
  }, [user]);

  if (!ready) {
    return <div className={styles.loading}>Cargando seguimiento...</div>;
  }

  const allowedByRole = hasSeguimientoAccess(user);
  const allowedByPage = typeof canAccess === "function" ? canAccess(user) : true;

  return (
    <ConfirmProvider>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p>Plataforma institucional</p>
            <h1>Seguimiento de Actividades</h1>
            <span>{user?.full_name || user?.username || "Usuario"} · {user?.role || "Sin rol asignado"}</span>
          </div>
          <Link className={styles.backLink} href="/login">
            Salir
          </Link>
        </header>

        <nav className={styles.tabs} aria-label="Navegación de seguimiento">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={active ? styles.active : ""}>
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <main className={styles.main}>
          {allowedByRole && allowedByPage ? (
            children
          ) : (
            <section className={styles.denied}>
              <ShieldAlert size={32} aria-hidden="true" />
              <h2>Acceso no autorizado</h2>
              <p>No tienes un rol de Seguimiento de Actividades asignado para ver esta sección.</p>
              <Link href="/dashboard">Volver al dashboard</Link>
            </section>
          )}
        </main>
      </section>
    </ConfirmProvider>
  );
}
