// src/hooks/useFeedback.js
import { useReducer, useCallback } from 'react';

// Estado inicial para el feedback
export const initialFeedbackState = {
  // Ejemplo:
  // "EG01-propuesta-0": { acuerdo: null, comentarios: { comoDecir: "", justificacion: "" } }
};

// Reducer para manejar acciones de acuerdo y comentarios
export function feedbackReducer(state, action) {
  const { type, id, field, value } = action;

  switch (type) {
    case 'SET_ACUERDO':
      return {
        ...state,
        [id]: {
          acuerdo: value,
          // Si ya hay comentarios, mantenerlos, si no, inicializar vacíos
          comentarios: state[id]?.comentarios ?? { comoDecir: '', justificacion: '' }
        }
      };

    case 'SET_COMENTARIO':
      return {
        ...state,
        [id]: {
          // Mantener el acuerdo previo si existía, o null
          acuerdo: state[id]?.acuerdo ?? null,
          comentarios: {
            ...state[id]?.comentarios,
            [field]: value
          }
        }
      };

    case '__SET_ALL__':
      // Sobrescribe todo el estado con el nuevo objeto
      return { ...value };

    default:
      return state;
  }
}

// Hook personalizado para manejar el feedback
export function useFeedback() {
  const [state, dispatch] = useReducer(feedbackReducer, initialFeedbackState);

  /**
   * Establece el valor de 'acuerdo' para un id dado
   * @param {string} id - Identificador de la sección
   * @param {'yes'|'no'} value - Valor del acuerdo
   */
  const setAcuerdo = useCallback((id, value) => {
    dispatch({ type: 'SET_ACUERDO', id, value });
  }, []);

  /**
   * Establece un comentario (campo) para un id dado
   * @param {string} id - Identificador de la sección
   * @param {'comoDecir'|'justificacion'} field - Campo de comentario
   * @param {string} value - Texto del comentario
   */
  const setComentario = useCallback((id, field, value) => {
    dispatch({ type: 'SET_COMENTARIO', id, field, value });
  }, []);

  /**
   * Permite precargar todo el feedback de una sola vez (por ejemplo, desde el backend)
   * @param {object} data - Estado completo, con ids como llavesF
   */
  const setFeedback = useCallback((data) => {
    dispatch({ type: '__SET_ALL__', value: data });
  }, []);

  return {
    feedback: state,
    setAcuerdo,
    setComentario,
    setFeedback,
  };
}
