"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Autoplay, Keyboard, A11y, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import styles from "@/styles/ForosRegionalesSlider.module.css";

/* ==================== Aliases y catálogos ==================== */
const ID_ALIASES = {
  "mineral-de-la-reforma": "mineral-reforma",
  "mineral-del-monte": "mineral-monte",
  "pachuca-de-soto": "pachuca",
};

const PARTICIPA_INFO = {
  Reg01Tula: { fecha: "24-Octubre-2025", hora: "11:00 hrs.", lugar: "Universidad Tecnológica de Tula-Tepeji" },
  Reg06Tizayuca: { fecha: "28-Octubre-2025", hora: "11:00 hrs.", lugar: "Universidad Tecnológica de la Zona Metropolitana del Valle de México" },
  Reg07Actopan: { fecha: "29-Octubre-2025", hora: "12:00 hrs.", lugar: "Instituto Tecnológico Superior Del Occidente Del Estado De Hidalgo" },
  Reg11Huichapan: { fecha: "11-noviembre-2025", hora: "11:00 hrs.", lugar: "Instituto Tecnológico Superior Huichapan" },
  Reg10Apan: { fecha: "12-noviembre-2025", hora: "11:00 hrs.", lugar: "Instituto Tecnológico Superior del Oriente del Estado de Hidalgo" },
  Reg02Tulancingo: { fecha: "13-noviembre-2025", hora: "11:00 hrs.", lugar: "Universidad Politécnica de Tulancingo" },
  Reg12Jacala: { fecha: "14-noviembre-2025", hora: "11:00 hrs.", lugar: "Universidad Tecnológica Minera de Zimapán" },
  Reg09Zacualtipan: { fecha: "18-noviembre-2025", hora: "11:00 hrs.", lugar: "Universidad Tecnologica de la Sierra Hidalguense" },
  Reg04Huejutla: { fecha: "19-noviembre-2025", hora: "11:00 hrs.", lugar: "Universidad Tecnológica de la Huasteca Hidalguense" },
  Reg08Ixmiquilpan: { fecha: "20-noviembre-2025", hora: "11:00 hrs.", lugar: "Universidad Tecnológica del Valle del Mezquital" },
  Reg03Pachuca: { fecha: "21-noviembre-2025", hora: "10:00 hrs.", lugar: "Universidad Politécnica de Pachuca" },
  Reg05MR: { fecha: "21-noviembre-2025", hora: "10:00 hrs.", lugar: "Universidad Politécnica de Pachuca" },
};

/* ==================== Utils ==================== */
function normId(id) {
  return ID_ALIASES[id] ?? id;
}

/* ==================== Componente ==================== */
export default function ForosRegionalesSlider({ items = [] }) {
  const slides = useMemo(() => {
    return (items || []).map((m, idx) => {
      const id = normId(m.id);
      return {
        ...m,
        _id: id,
        participa: PARTICIPA_INFO[id] || null,
        reversed: idx % 2 === 1, // alterna layout L/R
      };
    });
  }, [items]);

  return (
    <section className={styles.wrap} aria-label="Carrusel promocional de municipios">
      {/* <div className={styles.contentTitule}>
        <p className={styles.tituleBack}>¿Cómo fue?</p>
        <p className={styles.titleFrond}>¿Cómo fue?</p>
      </div> */}

      <button className={`${styles.navBtn} ${styles.prev}`} aria-label="Anterior" />
      <button className={`${styles.navBtn} ${styles.next}`} aria-label="Siguiente" />

      <Swiper
        className={styles.swiper}
        modules={[EffectFade, Navigation, Autoplay, Keyboard, A11y, Parallax]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={650}
        loop
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        navigation={{ nextEl: `.${styles.next}`, prevEl: `.${styles.prev}` }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        parallax
      >
        {slides.map((s) => (
          <SwiperSlide key={s._id} className={styles.slide}>
            <article className={`${styles.card} ${s.reversed ? styles.reverse : ""}`} aria-label={s.name}>
              {/* Media */}
              <div className={styles.media} data-swiper-parallax={s.reversed ? "-25%" : "25%"}>
                <img
                  className={styles.mediaImg}
                  src={`/img/forosRegionales/${s.img}`}
                  alt={`Imagen de ${s.name}`}
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div
                className={`${styles.content} ${s.reversed ? styles.contentRight : styles.contentLeft}`}
                data-swiper-parallax={s.reversed ? "25%" : "-25%"}
              >
                <div className={styles.kicker}>
                  Foros Regionales · <span>{s.name}</span> 
                </div>
                <h3 className={styles.title}>
                  En <span className="spanVino">Dónde </span> y <span className="spanVino">Cuándo</span> serán los{" "}
                  <span className="spanDoarado">Foros Regionales</span>
                </h3>

                {/* Datos del taller */}
                <div className={styles.actions}>
                  {s.participa ? (
                    <div className={styles.meta} aria-label="Datos del taller">
                      <div>
                        <strong>Fecha:</strong> {s.participa.fecha}
                      </div>
                      <div>
                        <strong>Hora:</strong> {s.participa.hora}
                      </div>
                      <div>
                        <strong>Lugar:</strong> {s.participa.lugar}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.metaMuted}>
                      Próximamente fecha y sede del taller para {s.name}.
                    </div>
                  )}
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
