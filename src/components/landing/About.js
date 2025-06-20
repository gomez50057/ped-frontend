import styles from "@/styles/About.module.css";

export default function About() {
  return (
    <section>
      <div className={styles.aboutContainer}>
        <div className={styles.logoAcuerdo}>
        </div>
        <div className={styles.aboutTxt}>
          <h2><span>Primero</span> el <span className="spanDoarado">Pueblo</span></h2>
          <p>
            El Gobierno del Estado de Hidalgo a través de la Unidad de Planeación y Prospectiva impulsa la <span className={styles.subtitule}>Actualización del Plan Estatal de Desarrollo</span> con una visión que responde a las transformaciones alcanzadas en nuestra entidad, así como los nuevos retos y oportunidades, además de las prioridades planteadas en el Plan Nacional de Desarrollo 2025-2030. Esto se realiza afirmando nuestro compromiso con la participación ciudadana, la justicia social y el bienestar colectivo, trazando la ruta hacia el Hidalgo que queremos, con un desarrollo sustentable, incluyente y que promueva las oportunidades en todas las regiones, siempre en beneficio del pueblo.
          </p>
          <p>
            Con este nuevo Plan, reforzaremos la equidad social, la transparencia y honestidad en el trabajo, así como el impulso a la innovación, asegurando que cada acción gubernamental contribuya al potenciamiento de <span className={styles.subtitule}>Hidalgo.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
