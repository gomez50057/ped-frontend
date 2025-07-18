export function crearElementoNuevo(overrides = {}) {
  return {
    pk: `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    ...overrides
  };
}

export function crearObjetivo(nombre = '') {
  return crearElementoNuevo({ clave: '', nombre, estrategias: [] });
}

export function crearEstrategia(nombre = '') {
  return crearElementoNuevo({ clave: '', nombre, lineas: [] });
}

export function crearLinea(text = '') {
  return crearElementoNuevo({ clave: '', text });
}
