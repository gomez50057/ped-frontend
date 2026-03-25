"use client";

import Link from "next/link";
import styles from "@/styles/BibliotecaDigital.module.css";

const imgBasePath = "/img/page_links/";
const imgBibliotecaDigital = "/img/page_links/biblioteca_digital/";

export default function BibliotecaDigital({
  title = "Biblioteca Digital de Planeación",
  subtitle = "Accede a nuestra biblioteca digital, una plataforma en donde podrás consultar y descargar distintos instrumentos de planeación de una manera sencilla y dinámica.",
  href = "https://bibliotecadigitaluplaph.hidalgo.gob.mx/",
}) {
  return (
    <section className={styles.sectionItem}>
      <div className={styles.container}>
        <div className={styles.bgImg}>
          <img src={`${imgBasePath}bg.png`} alt={title} />
        </div>

        <div className={styles.imgRepresentation}>
          <img src={`${imgBibliotecaDigital}personas.png`} alt={title} />
        </div>

        <div className={styles.contentWrapper}>
          <Link href={href} target="_blank" rel="noopener noreferrer" className={styles.imageLink}>
            <div className={styles.imgButton}>
              <img src={`${imgBibliotecaDigital}boton.png`} alt={title} />
            </div>
          </Link>

          <div className={styles.overlayText}>
            <p>{subtitle}</p>

            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.button}
            >
              <span className={styles.ctaLink}>Conoce más ↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}