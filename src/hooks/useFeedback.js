// src/hooks/useFeedback.js
import { useReducer, useCallback } from 'react';

// Estado inicial para el feedback
export const initialFeedbackState = {
  // La clave será el id de cada sección:
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

  return {
    // Estado completo de feedback: { [id]: { acuerdo, comentarios } }
    feedback: state,
    // Funciones para actualizar el estado
    setAcuerdo,
    setComentario
  };
}
