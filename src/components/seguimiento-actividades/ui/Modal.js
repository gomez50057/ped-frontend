"use client";

import { X } from "lucide-react";
import Button from "./Button";
import styles from "./Modal.module.css";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation">
      <section className={styles.modal} role="dialog" aria-modal="true" aria-label={title}>
        <header className={styles.header}>
          <h2>{title}</h2>
          <Button variant="ghost" size="sm" icon={X} onClick={onClose}>
            Cerrar
          </Button>
        </header>
        <div className={styles.body}>{children}</div>
      </section>
    </div>
  );
}
