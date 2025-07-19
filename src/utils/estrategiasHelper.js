// src/utils/estrategiasHelper.js

// Importa los datos estáticos que contienen las estrategias
import { dataObjetivoEG01 } from '@/utils/plataformaEstrategicaData';
// Si tuvieras más, los agregas aquí:
// import { dataObjetivoEG02 } from '@/data/dataObjetivoEG02';
// ...

// Junta todos los arrays en uno solo (agrega más si tienes)
const ALL_OBJETIVOS = [
  ...dataObjetivoEG01,
  // ...dataObjetivoEG02,
  // ...
];

// Extrae todas las estrategias de todos los objetivos
const ALL_ESTRATEGIAS = ALL_OBJETIVOS.flatMap(obj =>
  (obj.Estrategias || []).map(estr => ({
    ...estr,
    // Normaliza clave y nombre, si tu dato es diferente ajústalo aquí
    clave: estr.clave || estr.id,
    nombre: estr.nombre || estr.Estrategia,
  }))
);

// Mapea clave → nombre de la Estrategia
export const MAP_ESTRATEGIAS = Object.fromEntries(
  ALL_ESTRATEGIAS.map(estr => [estr.clave, estr.nombre])
);

/**
 * Devuelve el nombre de la Estrategia para una clave.
 * Si no existe, retorna string vacío.
 */
export function getNombreEstrategiaPorClave(clave) {
  return MAP_ESTRATEGIAS[clave] || "";
}

/**
 * Asegura que el objeto Estrategia tiene el campo "nombre" requerido.
 * Si está vacío, lo rellena con el nombre estático o un placeholder.
 * @param {Object} estr Estrategia a enviar al backend
 * @returns {Object} Copia de la estrategia con nombre válido
 */
export function prepararEstrategiaParaEnvio(estr) {
  let nombre = estr.nombre;
  if (!nombre || nombre.trim() === "") {
    const nombreRef = getNombreEstrategiaPorClave(estr.clave);
    nombre = nombreRef ? nombreRef : "dinámico [sin nombre definido]";
  }
  return { ...estr, nombre };
}
