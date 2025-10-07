export const MODULES = [
  { slug: 'plataforma', label: 'Plataforma Estratégica', href: '/dashboard/plataforma-estrategica' },
  { slug: 'indicadores', label: 'Indicadores', href: '/dashboard/indicadores' },
  { slug: 'otros', label: 'Otros Apartados del PED', href: '/dashboard/otros-apartados' },
  { slug: 'docs', label: 'Documentos de Apoyo', href: '/dashboard/documentos-apoyo' },
];

// Grupos → slugs permitidos
export const ACL = {
  PlataformaEstrategica: ['plataforma'],
  Indicadores: ['indicadores'],
  OtrosApartados: ['otros'],
  DocumentosApoyo: ['docs'],
};

export function computeAllowedSlugs(groups = []) {
  const allow = new Set();
  for (const g of groups) {
    const rule = ACL[g];
    if (!rule) continue;
    if (rule.includes('*')) return new Set(MODULES.map(m => m.slug));
    for (const s of rule) allow.add(s);
  }
  return allow;
}
