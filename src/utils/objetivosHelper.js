// src/utils/objetivosHelper.js

// Importa todos tus dataObjetivoEGxx aquí:
import { dataObjetivoEG01 } from '@/utils/plataformaEstrategicaData';
// Si tuvieras más, los agregas aquí:
// import { dataObjetivoEG02 } from '@/utils/plataformaEstrategicaData';

// Junta todos los arrays en uno solo (agrega más si tienes):
const ALL_OBJETIVOS = [
  ...dataObjetivoEG01,
  // ...dataObjetivoEG02,
  // ...dataObjetivoEG03,
];

// Mapea clave → Propuesta Objetivo
export const MAP_OBJETIVOS = Object.fromEntries(
  ALL_OBJETIVOS.map(obj => [obj.clave, obj['Propuesta Objetivo']])
);

/**
 * Devuelve el texto de Propuesta Objetivo para una clave.
 * Si no existe, retorna string vacío.
 */
export function getPropuestaObjetivoPorClave(clave) {
  return MAP_OBJETIVOS[clave] || '';
}

/**
 * Contador módulo-local para desarrollo. No se usa en producción.
 */
let dinamicoCounter = 1;

/**
 * Genera una clave "dinamico_<n>" corta, útil en local.
 */
export function generarClaveDinamico() {
  const prefix = 'dinamico_';
  const valor = dinamicoCounter++;
  const clave = prefix + valor;
  if (clave.length > 32) {
    const maxNumLen = 32 - prefix.length;
    const numero = String(valor).slice(-maxNumLen);
    return prefix + numero;
  }
  return clave;
}

/**
 * Asegura que el objeto tiene el campo "nombre". Si está vacío,
 * lo rellena con "dinámico" + texto del objetivo.
 */
export function prepararObjetivoParaEnvio(obj) {
  let nombre = obj.nombre;
  if (!nombre || nombre.trim() === '') {
    const textoRef = getPropuestaObjetivoPorClave(obj.clave);
    nombre = textoRef
      ? `dinámico ${textoRef}`
      : 'dinámico [sin nombre definido]';
  }
  return { ...obj, nombre };
}

/**
 * Transforma el objetivo preparado para envío al backend,
 * usando claves dinámicas para evitar colisiones:
 *  - Estrategias nuevas → 'dinamico_estrategia_<n>'
 *  - Líneas nuevas      → 'dinamico_linea_<n>'
 */
export function transformarParaBackend(obj) {
  const estrategias = [];
  let envioEstrategiaCounter = 1;
  let envioLineaCounter = 1;

  // 1. Nuevas estrategias completas
  (obj.nuevas_estrategias || []).forEach(estr => {
    const claveE =
      estr.clave || `dinamico_estrategia_${envioEstrategiaCounter++}`;
    estrategias.push({
      clave: claveE,
      nombre: estr.nombre,
      lineas: (estr.lineas || []).map(l => ({
        clave: l.clave || `dinamico_linea_${envioLineaCounter++}`,
        text: l.text,
      })),
    });
  });

  // 2. Líneas nuevas como estrategias dinámicas para evitar duplicados
  (obj.nuevas_lineas || []).forEach(nl => {
    (nl.lineas || []).forEach(l => {
      const claveE = `dinamico_estrategia_${envioEstrategiaCounter++}`;
      estrategias.push({
        clave: claveE,
        nombre: '', // se completará con prepararObjetivoParaEnvio si es necesario
        lineas: [
          {
            clave: l.clave || `dinamico_linea_${envioLineaCounter++}`,
            text: l.text,
          },
        ],
      });
    });
  });

  return {
    clave: obj.clave,
    nombre: obj.nombre,
    estrategias,
  };
}
