"use client";

import React from 'react';
import Link from 'next/link';
import styles from './ChoiceCard.module.css';

const items = [
  {
    label: 'Plataforma Estratégica',
    bg: '/img/dashboard/bg/plataforma.webp',
    href: '/dashboard/plataforma-estrategica',
    text: 'Comprende los ejes, objetivos, estrategias y líneas de acción que guían el rumbo de Hidalgo a partir de cada sector. Cada uno de ellos responde a los retos y necesidades de la población, reflejando el compromiso del gobierno por un futuro más justo, sostenible y con oportunidades para todas y todos.'
  },
  {
    label: 'Indicadores',
    bg: '/img/dashboard/bg/indicadores.webp',
    href: '/dashboard/indicadores',
    text: 'Contiene los indicadores que darán seguimiento a los avances, identificando áreas de mejora. Contribuyen a un gobierno más transparente, tomando decisiones a partir de datos reales y orientando cada acción a alcanzar beneficios concretos para las personas.'
  },
  {
    label: 'Otros Apartados del PED',
    bg: '/img/dashboard/bg/otros.webp',
    href: '/dashboard/otros-apartados',
    text: 'Incluye apartados clave como el panorama del estado, el marco normativo, la participación ciudadana, las rutas de la transformación y los programas por desarrollar. Todos estos elementos garantizan que el Plan tenga bases sólidas y que la voz del pueblo esté presente en cada paso hacia la Transformación de Hidalgo.'
  },
  {
    label: 'Consulta el Documento Preliminar',
    bg: '/img/dashboard/bg/consulta.webp',
    download: '/pdf/Actualizacion_PED.pdf',
    text: 'Contiene el documento preliminar de la Actualización del Plan Estatal de Desarrollo 2025–2028 para su visualización.'
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
              <div className={styles.containerCard}>
                <p className={styles.cardText}>{item.label}</p>
                <p className={styles.cardDescription}>{item.text}</p>
              </div>

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
