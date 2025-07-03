import { useMemo } from 'react';
import { AXES } from '@/utils/axes';
import * as objetivos from '@/utils/plataformaEstrategicaData';
// --- Memoizar datos estáticos ---

export function useStaticWithId() {
  return useMemo(() => {
    return AXES.map(({ code }) => ({
      eje: code,
      propuestas: (objetivos[`dataObjetivo${code}`] || []).map(prop => ({
        ...prop,
        Estrategias: (prop.Estrategias || []).map(estr => ({
          ...estr,
          lineas: (estr['Lineas de acción'] || []).map(lin =>
            typeof lin === "object"
              ? ({
                ...lin,
                text: lin["Linea de acción"] || lin.text,
              })
              : ({
                id: undefined,
                text: lin
              })
          ),
        })),
      })),
    }));
  }, []);
}
