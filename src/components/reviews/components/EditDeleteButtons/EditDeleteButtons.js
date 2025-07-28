"use client";

import React from 'react';
import styles from './EditDeleteButtons.module.css';

/**
 * Abre un prompt para editar el nombre de la estrategia y devuelve
 * la estrategia modificada.
 */
export function prepararEstrategiaParaEnvio(estrategia) {
  const nuevoNombre = prompt('Nuevo nombre de la estrategia:', estrategia.nombre);
  return {
    ...estrategia,
    nombre: nuevoNombre?.trim() || estrategia.nombre
  };
}

/**
 * Muestra botones de Editar y Eliminar solo para estrategias dinámicas.
 */
export default function EditDeleteButtons({ isDinamico, estrategia, onEdit, onDelete }) {
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        aria-label="Editar estrategia"
        className={`${styles.button} ${styles.edit}`}
        onClick={() => {
          if (isDinamico) {
            const preparada = prepararEstrategiaParaEnvio(estrategia);
            onEdit(preparada);
          } else {
            onEdit(estrategia);
          }
        }}
      >
        <svg viewBox="0 0 16 16" className={`${styles.svgIcon} ${styles.svgIconRotateRight}`}>
          <path d="M1 11.9l-1 4.1 4.1-1 9.2-9.2-3.1-3.1-9.2 9.2zM1.5 15l-0.4-0.5 0.4-2 2 2-2 0.5zM10.9 4.4l-8.1 8-0.6-0.6 8.1-8 0.6 0.6z" />
          <path d="M15.3 0.7c-1.1-1.1-2.6-0.5-2.6-0.5l-1.5 1.5 3.1 3.1 1.5-1.5c0-0.1 0.6-1.5-0.5-2.6zM13.4 1.6l-0.5-0.5c0.6-0.6 1.1-0.1 1.1-0.1l-0.6 0.6z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Eliminar estrategia"
        className={`${styles.button} ${styles.delete}`}
        onClick={onDelete}
      >
        <svg viewBox="0 0 448 512" className={styles.svgIcon}>
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
        </svg>
      </button>
    </div>
  );
}
