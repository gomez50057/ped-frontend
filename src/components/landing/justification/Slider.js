"use client";

import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from './Slider.module.css';

const imgBasePath = "/img/";

gsap.registerPlugin(ScrollTrigger);

const Slider = ({ items }) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    const containerEl = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!containerEl || !wrapper) return;

    const containerWidth = containerEl.getBoundingClientRect().width;
    const wrapperWidth = wrapper.scrollWidth;
    const offset = 1000;

    const initialX = containerWidth - offset;
    const finalX = containerWidth - wrapperWidth - offset;

    gsap.set(wrapper, { x: initialX });

    const animation = gsap.to(wrapper, {
      x: finalX,
      ease: 'none',
      scrollTrigger: {
        trigger: containerEl,
        start: 'center center',
        pin: true,
        scrub: 1,
        end: () => `+=${wrapperWidth}`,
        invalidateOnRefresh: true,
      },
    });

    ScrollTrigger.refresh();

    return () => {
      animation.scrollTrigger.kill();
      animation.kill();
    };
  }, [items]);

  return (
    <div className={styles.sliderContainer} ref={containerRef}>
      <div className={styles.wrapper} ref={wrapperRef}>
        {/* Elemento 1 */}
        <div className={styles.element01}>
          <div className={styles.imgBackContainer}>
            <div className={styles.imgContainer}>
              <img
                src={`${imgBasePath}img01Justificacion.png`}
                alt="imagen Futuro de Hidalgo"
                className={styles.img}
              />
            </div>
          </div>
          <div className={styles.textElement01}>
            <h2>¿Qué es el <span className='spanDoarado'>Plan Hídrico del Valle del Mezquital?</span></h2>
            <div className={styles.line}></div>
            <p>
              Es un conjunto de <span>estrategias que buscan mejorar el uso y el cuidado del agua,</span> asegurando que todas las personas tengan acceso a este vital líquido de manera más eficiente y justa, especialmente las comunidades vulnerables. Para lograrlo se modernizará la infraestructura hídrica y se hará más eficiente el riego agrícola, a través de su tecnificación.
            </p>
          </div>
        </div>

        {/* Elemento 2 */}
        <div className={styles.element02}>
          <div className={styles.imgContainerElement02}>
            <img src={`${imgBasePath}img02Justificacion.png`} alt="Polígono del valle del mezquital" />
          </div>
          <div className={styles.fileShapeR}>
            <h2 className={styles.title}>
              ¿Qué busca el <span className='spanDoaradoClr'>Plan Hídrico</span> del <span className='spanDoaradoClr'>Valle del Mezquital?</span>
            </h2>
            <div className={styles.cardElement02}>
              {[
                "Garantizar el derecho humano al agua para todas y todos, sin excepción.",
                "Prevenir inundaciones que afecten a las familias y a su patrimonio.",
                "Sanear los ríos contaminados para proteger la salud y el medio ambiente.",
                "Aprovechar de mejor manera el agua de uso agrícola, mejorando la productividad de la tierra."
              ].map((text, index) => (
                <div key={index} className={styles.item}>
                  <img
                    className={styles.circle}
                    src={`${imgBasePath}agua icono.png`}
                    alt="Gota de agua"
                  />
                  <span className={styles.textElement02}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Slider.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node),
};

export default Slider;
