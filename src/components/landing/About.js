import styles from "@/styles/About.module.css";
import AnimatePath from "./AnimatePath";

export default function About() {
  return (
    <section>
      <div className={styles.aboutContainer}>
        <div className={styles.logoAcuerdo}>

        </div>
        <div className={styles.aboutTxt}>
          <h2>Un <span>Plan</span> para el <span className="spanDoarado">Futuro de Hidalgo</span></h2>
          <h3>Construido Contigo</h3>
          <p>
            El Gobierno de Hidalgo, con una visión participativa y enfocada en el bienestar de la población,
            ha desarrollado el Plan Estatal de Desarrollo. Este plan se basa en cuatro ejes estratégicos que
            guían el crecimiento del estado, impulsando la prosperidad y el desarrollo sostenible en todas las regiones.
          </p>
          <p>
            Además, incorpora tres temas transversales, fundamentales para garantizar que cada acción tenga un
            impacto positivo y duradero, promoviendo la equidad, la sostenibilidad y la innovación en todas las
            áreas del gobierno y la sociedad.
          </p>
        </div>
      </div>
      <div>
        <div className={styles.tren}>
          <AnimatePath />
        </div>
      </div>
    </section>
  );
}
