"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HomeThemeToggle.module.css";

const OPTIONS = [
  { value: "system", label: "Sistema" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
];

export default function HomeThemeToggle({
  preference,
  resolvedTheme,
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const currentLabel =
    preference === "system"
      ? `Sistema · ${resolvedTheme === "dark" ? "Oscuro" : "Claro"}`
      : preference === "dark"
        ? "Oscuro"
        : "Claro";

  return (
    <div
      ref={rootRef}
      className={`${styles.themeToggle} ${isOpen ? styles.themeToggleOpen : ""}`}
      aria-label="Selector de tema"
    >
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span className={styles.triggerIcon} aria-hidden="true">
          {resolvedTheme === "dark" ? "◐" : "◑"}
        </span>
        <span className={styles.triggerLabel}>Tema</span>
      </button>

      {isOpen ? (
        <div className={styles.panel} role="dialog" aria-label="Opciones de tema">
          <div className={styles.header}>
            <span className={styles.kicker}>Tema</span>
            <span className={styles.status}>{currentLabel}</span>
          </div>

          <div className={styles.buttonGroup} role="tablist" aria-label="Modo visual">
            {OPTIONS.map((option) => {
              const isActive = preference === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.button} ${isActive ? styles.buttonActive : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
