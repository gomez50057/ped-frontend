"use client";

import React from 'react';
import Link from 'next/link';
import styles from './ChoiceCard.module.css';

const items = [
  {
    label: 'Plataforma Estratégica',
    bg: '/img/dashboard/bg/plataforma.webp',
    href: '/dashboard/plataforma-estrategica'
  },
  {
    label: 'Indicadores',
    bg: '/img/dashboard/bg/indicadores.webp',
    href: '/dashboard/indicadores'
  },
  {
    label: 'Otros apartados del PED',
    bg: '/img/dashboard/bg/otros.webp',
    href: '/dashboard/otros-apartados'
  },
  {
    label: 'Consulta el Documento propuesto',
    bg: '/img/dashboard/bg/consulta.webp',
    download: '/pdf/Actualizacion_PED.pdf'
  },
  {
    label: 'Editar',
    bg: '/img/dashboard/bg/editar.webp',
    href: '/dashboard/editar'
  }
];

export default function ChoiceCard() {
  return (
    <section className={styles.ChoiceCard}>
      <p className={styles.titule}>
        <span className={styles.spanDoarado}>Selecciona</span> el{' '}
        <span>apartado</span> que <span className={styles.spanVino}>quieres revisar:</span>
      </p>
      <div className={styles.card}>
        {items.map((item, idx) => {
          const content = (
            <>
              <p className={styles.cardText}>{item.label}</p>
              <span
                className={item.download ? styles.downloadButton : styles.cardButton}
                aria-hidden="true"
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 7l-10 10" />
                  <path d="M8 7l9 0l0 9" />
                </svg>
              </span>
            </>
          );

          if (item.download) {
            return (
              <a
                key={idx}
                href={item.download}
                download
                className={styles.cardItem}
                style={{ backgroundImage: `url(${item.bg})` }}
                aria-label={item.label}
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href}
              className={styles.cardItem}
              style={{ backgroundImage: `url(${item.bg})` }}
              aria-label={item.label}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
