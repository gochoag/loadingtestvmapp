export const NAVIGATION_ITEMS = [
  { id: 'overview', label: 'Inicio', shortLabel: 'IN' },
  { id: 'products', label: 'Productos', shortLabel: 'PR' },
  { id: 'inventory', label: 'Inventario', shortLabel: 'IV' },
  { id: 'reports', label: 'Reportes', shortLabel: 'RP' },
]

export const SECTION_META = {
  overview: {
    eyebrow: 'Panel principal',
    title: 'Resumen operativo',
    subtitle: 'Supervisa inventario, catalogo y actividad desde un solo lugar.',
  },
  products: {
    eyebrow: 'Gestion',
    title: 'Administracion de productos',
    subtitle: 'Crea, edita y elimina registros desde el panel principal.',
  },
  inventory: {
    eyebrow: 'Existencias',
    title: 'Estado del inventario',
    subtitle: 'Detecta faltantes y revisa niveles de stock actuales.',
  },
  reports: {
    eyebrow: 'Analitica',
    title: 'Indicadores rapidos',
    subtitle: 'Consulta valor total, cobertura y referencias prioritarias.',
  },
}
