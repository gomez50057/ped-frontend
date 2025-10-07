"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './ChoiceCard.module.css';
import { MODULES, computeAllowedSlugs } from '@/utils/permissions';
import { getStoredGroups } from '@/utils/auth';

const items = [
  {
    slug: 'plataforma',
    label: 'Plataforma Estratégica',
    bg: '/img/dashboard/bg/plataforma.webp',
    text: 'Comprende los ejes, objetivos, estrategias y líneas de acción que guían el rumbo de Hidalgo...',
  },
  {
    slug: 'indicadores',
    label: 'Indicadores',
    bg: '/img/dashboard/bg/indicadores.webp',
    text: 'Contiene los indicadores que darán seguimiento a los avances...',
  },
  {
    slug: 'otros',
    label: 'Otros Apartados del PED',
    bg: '/img/dashboard/bg/otros.webp',
    text: 'Incluye panorama del estado, marco normativo, participación ciudadana...',
  },
  {
    slug: 'docs',
    label: 'Documentos de Apoyo',
    bg: '/img/dashboard/bg/consulta.webp',
    text: 'Documentos de apoyo para consolidar y fortalecer tus opiniones y propuestas.',
  },
];

export default function ChoiceCard() {
  const [allowed, setAllowed] = useState(new Set());

  useEffect(() => {
    const groups = getStoredGroups();
    const allow = computeAllowedSlugs(groups);
    setAllowed(allow);
  }, []);

  const hrefBySlug = (slug) => MODULES.find(m => m.slug === slug)?.href || '#';

  return (
    <section className={styles.ChoiceCard}>
      <p className={styles.titule}>
        <span className={styles.spanDoarado}>Selecciona</span> el{' '}
        <span>apartado</span> que <span className={styles.spanVino}>quieres revisar:</span>
      </p>

      <div className={styles.card}>
        {items.map((item, idx) => {
          const canAccess = allowed.has(item.slug);
          const styleBg = { backgroundImage: `url(${item.bg})` };

          const content = (
            <>
              <div className={styles.containerCard}>
                <p className={styles.cardText}>{item.label}</p>
                <p className={styles.cardDescription}>{item.text}</p>
              </div>

              <span
                className={styles.cardButton}
                aria-hidden="true"
                title={canAccess ? 'Ingresar' : 'Acceso limitado'}
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
                  <path d="M8 7h9v9" />
                </svg>
              </span>

              {!canAccess && (
                <span className={styles.lockedBadge} aria-label="Acceso limitado">
                  Acceso limitado
                </span>
              )}
            </>
          );

          if (canAccess) {
            return (
              <Link
                key={idx}
                href={hrefBySlug(item.slug)}
                className={styles.cardItem}
                style={styleBg}
                aria-label={item.label}
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={idx}
              className={`${styles.cardItem} ${styles.disabled}`}
              style={styleBg}
              aria-label={`${item.label} — Acceso limitado`}
              aria-disabled="true"
              role="group"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
