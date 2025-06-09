import React from 'react';
import styles from '../../styles/formatText.module.css';
/**
 *   *texto* Dorado italica negrita
 *   _texto_ vino italica negrita
 */
export const formatText = (text) => {
  // Separa el string en partes usando una expresión regular que captura *...* o _..._
  const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <span key={index} className={styles.goldItalic}>
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return (
        <span key={index} className={styles.vinoItalic}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
};
