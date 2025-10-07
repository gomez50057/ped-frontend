/**
 * Convierte un texto en un slug:
 * - pasa a minúsculas
 * - quita tildes
 * - convierte ":" en "-"
 * - espacios → guiones
 * - elimina caracteres no alfanuméricos o guiones
 * - colapsa guiones múltiples y recorta en bordes
 */
export function normalizeName(text) {
  return text
    .toLowerCase()                    // minúsculas
    .normalize("NFD")                 // separa letra y tilde
    .replace(/[\u0300-\u036f]/g, "")  // elimina diacríticos
    .replace(/:/g, "-")               // ":" → "-"
    .replace(/\s+/g, "-")             // espacios → "-"
    .replace(/[^a-z0-9-]/g, "")       // mantiene solo a–z, 0–9, guiones
    .replace(/--+/g, "-")             // colapsa "--"
    .replace(/^-+|-+$/g, "");         // quita guiones al inicio/fin
}
