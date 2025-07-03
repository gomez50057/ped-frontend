"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook para obtener la ruta actual
import styles from './Navbar.module.css';

const LOGOS = [
  { src: "/img/Logox2.png", alt: "Gobierno del Estado de Hidalgo y Planeación" },
  { src: "/img/logo.png", alt: "Logo de PED" },
];

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Salir", href: "/login" },

  // {
  //   label: "Materiales de apoyo",
  //   submenu: [
  //     { label: "Ecos del territorio hídrico", href: "/ecos-del-territorio-hidrico" },
  //     { label: "Planeación para el futuro del agua", href: "/planeacion-para-el-futuro-del-agua" },
  //   ],
  // },
  // {
  //   label: "Tecnificación y nivelación parcelaria",
  //   href: "https://bancodeproyectos.hidalgo.gob.mx/planhidrico/login/",
  //   external: true,
  // },
];

/**
 * Navbar: Componente principal que representa la barra de navegación.
 */
const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true); // Controla la visibilidad del navbar en scroll
  const [menuOpen, setMenuOpen] = useState(false); // Controla el estado del menú en mobile
  const [submenuOpen, setSubmenuOpen] = useState(false); // Controla el submenu en mobile
  const lastScrollPos = useRef(0); // Referencia para guardar el último scroll
  const pathname = usePathname(); // Hook para detectar cambios de ruta

  /**
   * Hook: Controla la visibilidad de la navbar en base al scroll del usuario.
   */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(currentScrollPos < lastScrollPos.current || currentScrollPos < 10);
      lastScrollPos.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Hook: Cierra el menú y el submenu al cambiar de página.
   */
  useEffect(() => {
    setMenuOpen(false);
    setSubmenuOpen(false);
  }, [pathname]);

  /**
   * toggleMenu: Alterna el menú principal en mobile.
   */
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

  /**
   * toggleSubmenu: Alterna el submenu en mobile.
   */
  const toggleSubmenu = useCallback(() => setSubmenuOpen(prev => !prev), []);

  /**
   * handleLinkClick: Cierra el menú y submenu en mobile después de hacer clic en un enlace.
   */
  const handleLinkClick = () => {
    setMenuOpen(false);
    setSubmenuOpen(false);
  };

  /**
   * renderNavItems: Renderiza el menú de navegación para desktop y mobile.
   * @param {boolean} isMobile - Determina si el renderizado es para mobile o desktop.
   */
  const renderNavItems = (isMobile = false) => (
    <ul className={isMobile ? styles.navbarOpcMobile : styles.navbarOpcDesktop}>
      {NAV_ITEMS.map((item, index) => (
        <li
          key={index}
          className={`
            ${item.submenu ? styles.dropdown : ""} 
            ${isMobile && item.label === "Materiales de apoyo" && submenuOpen ? styles.dropdownOpen : ""}
          `}
        >
          {item.submenu ? (
            <>
              <span className={styles.dropdownToggle} onClick={isMobile ? toggleSubmenu : undefined}>{item.label}</span>
              <ul className={`${styles.dropdownMenu} ${isMobile && submenuOpen ? styles.menuOpen : ""}`}>
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link href={subItem.href} onClick={isMobile ? handleLinkClick : undefined}>
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Link
              href={item.href}
              onClick={isMobile ? handleLinkClick : undefined}
              target={item.external ? "_blank" : "_self"}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Navbar principal */}
      <nav
        className={`${styles.Navbar} 
          ${isVisible ? styles.active : styles.hidden} 
          ${lastScrollPos.current > 100 ? styles.scrolled : ''}
        `}
      >
        <div className={styles.NavbarList}>
          {/* Logos de la navbar */}
          <div className={styles.NavbarImg}>
            {LOGOS.map((logo, index) => (
              <img key={index} src={logo.src} alt={logo.alt} />
            ))}
          </div>

          {/* Menú de navegación */}
          <div className={styles.NavbarInicio}>
            {/* Botón hamburguesa visible solo en mobile */}
            <div className={styles.NavbarCirculo} onClick={toggleMenu}>
              <img src="/img/estrella.webp" alt="Menú" />
            </div>
            {/* Menú horizontal para desktop */}
            {renderNavItems(false)}
          </div>
        </div>
      </nav>

      {/* Menú desplegable para mobile */}
      <div className={`${styles.NavbarMenuContainer} ${menuOpen ? styles.menuOpen : ''}`}>
        {renderNavItems(true)}
      </div>
    </>
  );
};

export default Navbar;
