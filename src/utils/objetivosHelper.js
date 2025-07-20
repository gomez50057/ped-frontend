// src/utils/objetivosHelper.js

// Importa tus datos de objetivos (cada uno trae su array .Estrategias)
import { dataObjetivoEG01 } from '@/utils/plataformaEstrategicaData';
// Si tienes más archivos de dataObjetivoEGxx, los agregas aquí:
// import { dataObjetivoEG02 } from '@/utils/plataformaEstrategicaData';

const ALL_OBJETIVOS = [
  ...dataObjetivoEG01,
  // ...dataObjetivoEG02,
];

// Aplastamos todas las Estrategias de cada objetivo
const ALL_ESTRATEGIAS = ALL_OBJETIVOS.flatMap(obj =>
  (obj.Estrategias || []).map(est => ({
    clave: est.clave,
    texto: est.nombre || est.Estrategia,
  }))
);

// Mapea clave → Propuesta Objetivo
export const MAP_OBJETIVOS = Object.fromEntries(
  ALL_OBJETIVOS.map(obj => [obj.clave, obj['Propuesta Objetivo']])
);

// Mapea clave → Texto de Estrategia
export const MAP_ESTRATEGIAS = Object.fromEntries(
  ALL_ESTRATEGIAS.map(est => [est.clave, est.texto])
);

export function getPropuestaObjetivoPorClave(clave) {
  return MAP_OBJETIVOS[clave] || '';
}

export function getPropuestaEstrategiaPorClave(clave) {
  return MAP_ESTRATEGIAS[clave] || '';
}

// Contador local
let dinamicoCounter = 1;
export function generarClaveDinamico() {
  const prefix = 'dinamico_';
  const valor = dinamicoCounter++;
  const clave = prefix + valor;
  // asegurar ≤ 32 chars
  if (clave.length > 32) {
    const maxNumLen = 32 - prefix.length;
    return prefix + String(valor).slice(-maxNumLen);
  }
  return clave;
}

export function prepararObjetivoParaEnvio(obj) {
  let nombre = obj.nombre;
  if (!nombre || !nombre.trim()) {
    const textoRef = getPropuestaObjetivoPorClave(obj.clave);
    nombre = textoRef ? `dinámico ${textoRef}` : 'dinámico [sin nombre definido]';
  }
  return { ...obj, nombre };
}

export function prepararEstrategiaParaEnvio(est) {
  let nombre = est.nombre;
  if (!nombre || !nombre.trim()) {
    const textoRef = getPropuestaEstrategiaPorClave(est.clave);
    nombre = textoRef ? `dinámico ${textoRef}` : 'dinámico [sin nombre definido]';
  }
  return { ...est, nombre };
}

export function transformarParaBackend(obj) {
  const estrategias = [];
  let cE = 1, cL = 1;

  // 1) Nuevas estrategias completas
  (obj.nuevas_estrategias || []).forEach(estr => {
    const claveE = estr.clave || `dinamico_estrategia_${cE++}`;
    // rellenar nombre con el texto estático
    const { nombre } = prepararEstrategiaParaEnvio({ clave: claveE, nombre: estr.nombre || '' });
    estrategias.push({
      clave: claveE,
      nombre,
      lineas: (estr.lineas || []).map(l => ({
        clave: l.clave || `dinamico_linea_${cL++}`,
        text: l.text,
      })),
    });
  });

  // 2) Líneas nuevas: cada bloque nl trae { estrategia_clave, lineas: [...] }
  (obj.nuevas_lineas || []).forEach(nl => {
    const claveE = nl.estrategia_clave;
    // líneas originales de esa estrategia
    const nombreE = prepararEstrategiaParaEnvio({ clave: claveE, nombre: '' }).nombre;
    estrategias.push({
      clave: claveE,
      nombre: nombreE,
      lineas: nl.lineas.map(l => ({
        clave: l.clave || `dinamico_linea_${cL++}`,
        text: l.text,
      })),
    });
  });

  return {
    clave: obj.clave,
    nombre: obj.nombre,
    estrategias,
  };
}
