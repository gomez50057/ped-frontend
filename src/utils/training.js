import { normalizeName } from './utils';

export const trainingContent = {
  [normalizeName('Nivelación de tierras para la eficiencia hídrica')]: {
    titulo: 'Nivelación de tierras para la eficiencia hídrica',
    descripcion:
      'Domina las técnicas de nivelación del terreno para mejorar la eficiencia del riego y maximizar la productividad agrícola.',
    imagen: '/img/training/recursos/1.jpg',
    modulos: [
      {
        titulo: 'Módulo 1: Introducción a la nivelación de tierras y su papel en la gestión del agua',
        slug: normalizeName('Módulo 1: Introducción a la nivelación de tierras y su papel en la gestión del agua'),
        mainImage: '/img/training/recursos/4.jpg',
        thumbImages: ['/img/training/recursos/1.jpg', '/img/training/recursos/2.jpg'],
        statsTitle: 'Conceptos clave y beneficios',
        statsText: 'Explora qué es la nivelación de tierras, su relevancia en la agricultura y cómo contribuye al uso eficiente del agua y aumento de rendimiento.',
        quoteImage: '/img/training/recursos/avatar.jpg',
        quoteText: 'La base de una buena cosecha empieza con un terreno bien nivelado.',
        quoteAuthor: 'José Ramírez, especialista en mecanización agrícola',
        temas: [
          {
            titulo: '¿Qué es la nivelación de tierras?',
            contenido: 'La nivelación de tierras es una técnica agrícola que permite distribuir de manera uniforme el agua de riego sobre una superficie, mejorando su aprovechamiento.',
            media: { tipo: 'imagen', src: '/img/training/recursos/12.jpg' }
          },
          {
            titulo: 'Beneficios principales',
            contenido: 'Los terrenos bien nivelados permiten un uso más eficiente del agua, reducen la erosión y mejoran el rendimiento de los cultivos.',
            media: { tipo: 'video', src: 'https://www.youtube.com/embed/sD3Z5Tj_b4w?si=2NJKmv1hrXgc7JLM' }
          }
        ]
      },
      {
        titulo: 'Módulo 2: Diagnóstico del terreno y tecnologías aplicables',
        slug: normalizeName('Módulo 2: Diagnóstico del terreno y tecnologías aplicables'),
        mainImage: '/img/training/recursos/9.jpg',
        thumbImages: ['/img/training/recursos/3.jpg', '/img/training/recursos/4.jpg'],
        statsTitle: 'Evaluación inicial del terreno',
        statsText: 'Aprende cómo identificar irregularidades en el terreno, realizar levantamientos topográficos básicos y seleccionar la tecnología adecuada.',
        temas: [
          {
            titulo: 'Evaluación del terreno',
            contenido: 'Este tema aborda cómo realizar un diagnóstico inicial del campo, identificando puntos altos y bajos.',
            media: { tipo: 'imagen', src: '/img/training/recursos/15.jpg' }
          },
          {
            titulo: 'Tecnologías aplicables',
            contenido: 'Se presentan las tecnologías modernas disponibles para facilitar la nivelación y el análisis del terreno.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 3: Planeación y ejecución de la nivelación',
        slug: normalizeName('Módulo 3: Planeación y ejecución de la nivelación'),
        mainImage: '/img/training/recursos/8.jpg',
        thumbImages: ['/img/training/recursos/5.jpg', '/img/training/recursos/6.jpg'],
        statsTitle: 'Proceso técnico y maquinaria',
        statsText: 'Conoce las etapas para planificar y ejecutar la nivelación, el uso de maquinaria especializada y técnicas de calibración del terreno.',
        temas: [
          {
            titulo: 'Planeación estratégica',
            contenido: 'Cómo diseñar el plan de nivelación, identificando recursos, tiempos y equipos necesarios.',
            media: { tipo: 'imagen', src: '/img/training/recursos/1.jpgg' }
          },
          {
            titulo: 'Ejecución con maquinaria',
            contenido: 'Uso de tractores y niveladoras láser para realizar cortes y rellenos precisos.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 4: Seguimiento y mantenimiento de terrenos nivelados',
        slug: normalizeName('Módulo 4: Seguimiento y mantenimiento de terrenos nivelados'),
        mainImage: '/img/training/recursos/7.jpg',
        thumbImages: ['/img/training/recursos/7.jpg', '/img/training/recursos/8.jpg'],
        statsTitle: 'Manejo post-nivelación',
        statsText: 'Implementa prácticas de mantenimiento continuo para conservar la nivelación lograda y garantizar un uso sostenible del recurso hídrico.',
        temas: [
          {
            titulo: 'Monitoreo del terreno',
            contenido: 'Cómo realizar inspecciones regulares para detectar desajustes y corregirlos a tiempo.',
            media: { tipo: 'imagen', src: '/img/training/recursos/7.jpg' }
          },
          {
            titulo: 'Mantenimiento preventivo',
            contenido: 'Técnicas para evitar la degradación de la nivelación lograda por lluvias o mal manejo.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      }
    ]
  },
  [normalizeName('Tecnologías de riego por goteo')]: {
    titulo: 'Tecnologías de riego por goteo',
    descripcion: 'Explora cómo implementar y optimizar sistemas de riego por goteo para mejorar la eficiencia hídrica en cultivos.',
    imagen: '/img/training/recursos/1.jpg',
    modulos: [
      {
        titulo: 'Módulo 1: Fundamentos del riego por goteo',
        slug: normalizeName('Módulo 1: Fundamentos del riego por goteo'),
        mainImage: '/img/training/recursos/1.jpg',
        thumbImages: ['/img/training/recursos/2.jpg', '/img/training/recursos/3.jpg'],
        statsTitle: 'Importancia y principios',
        statsText: 'Este módulo cubre los principios básicos del riego por goteo, sus ventajas en la agricultura moderna y cuándo es más efectivo.',
        quoteImage: '/img/training/recursos/avatar.jpg',
        quoteText: '"La eficiencia del agua comienza con el conocimiento de cómo aplicarla."',
        quoteAuthor: 'Ana López, ingeniera agrónoma',
        temas: [
          {
            titulo: '¿Qué es el riego por goteo?',
            contenido: 'El riego por goteo es un método que aplica agua directamente a la raíz de las plantas, minimizando pérdidas por evaporación.',
            media: { tipo: 'imagen', src: '/img/training/recursos/8.jpg' }
          },
          {
            titulo: 'Beneficios sobre otros métodos',
            contenido: 'Permite un uso más eficiente del agua, reduce enfermedades foliares y mejora la absorción de nutrientes.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 2: Componentes del sistema de riego por goteo',
        slug: normalizeName('Módulo 2: Componentes del sistema de riego por goteo'),
        mainImage: '/img/training/recursos/4.jpg',
        thumbImages: ['/img/training/recursos/5.jpg', '/img/training/recursos/6.jpg'],
        statsTitle: 'Diseño del sistema',
        statsText: 'Revisión de los componentes técnicos: mangueras, emisores, filtros, válvulas y cómo elegirlos según tipo de cultivo.',
        temas: [
          {
            titulo: 'Tipos de emisores',
            contenido: 'Existen goteros compensados y no compensados, cada uno adecuado para distintas topografías.',
            media: { tipo: 'imagen', src: '/img/training/recursos/6.jpg' }
          },
          {
            titulo: 'Uso de filtros y válvulas',
            contenido: 'Evitan obstrucciones y controlan la presión del sistema, fundamentales para su funcionamiento adecuado.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 3: Instalación y mantenimiento',
        slug: normalizeName('Módulo 3: Instalación y mantenimiento'),
        mainImage: '/img/training/recursos/7.jpg',
        thumbImages: ['/img/training/recursos/8.jpg', '/img/training/recursos/9.jpg'],
        statsTitle: 'Procedimientos técnicos',
        statsText: 'Aprende cómo instalar correctamente un sistema de goteo, detectar fugas y realizar mantenimiento preventivo.',
        temas: [
          {
            titulo: 'Pasos para una instalación eficiente',
            contenido: 'Planificación del trazado, pruebas de presión y fijación de componentes.',
            media: { tipo: 'imagen', src: '/img/training/recursos/15.jpg' }
          },
          {
            titulo: 'Mantenimiento preventivo',
            contenido: 'Inspección regular, limpieza de filtros y detección de fugas son prácticas esenciales.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 4: Estrategias de uso eficiente del agua',
        slug: normalizeName('Módulo 4: Estrategias de uso eficiente del agua'),
        mainImage: '/img/training/recursos/10.jpg',
        thumbImages: ['/img/training/recursos/11.jpg', '/img/training/recursos/12.jpg'],
        statsTitle: 'Gestión hídrica avanzada',
        statsText: 'Técnicas para maximizar la eficiencia del riego, integrar sensores de humedad y adaptar la frecuencia al clima y tipo de suelo.',
        temas: [
          {
            titulo: 'Uso de sensores de humedad',
            contenido: 'Permite determinar cuándo y cuánto regar, mejorando la eficiencia del sistema.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          },
          {
            titulo: 'Adaptación al clima y suelo',
            contenido: 'Analizar la evapotranspiración local y tipo de suelo ayuda a ajustar los ciclos de riego.',
            media: { tipo: 'imagen', src: '/img/training/recursos/13.jpg' }
          }
        ]
      }
    ]
  },
  [normalizeName('Manejo y conservación del agua')]: {
    titulo: 'Manejo y conservación del agua',
    descripcion: 'Descubre estrategias efectivas para la gestión sostenible del recurso hídrico en contextos agrícolas y rurales.',
    imagen: '/img/training/recursos/13.jpg',
    modulos: [
      {
        titulo: 'Módulo 1: Ciclo hidrológico y disponibilidad de agua',
        slug: normalizeName('Módulo 1: Ciclo hidrológico y disponibilidad de agua'),
        mainImage: '/img/training/recursos/13.jpg',
        thumbImages: ['/img/training/recursos/14.jpg', '/img/training/recursos/15.jpg'],
        statsTitle: 'Fundamentos hídricos',
        statsText: 'Explora el ciclo del agua, la distribución del recurso en distintas regiones y su implicancia para la agricultura.',
        quoteImage: '/img/training/recursos/avatar.jpg',
        quoteText: 'Entender el agua es el primer paso para conservarla.',
        quoteAuthor: 'Laura Díaz, experta en sostenibilidad',
        temas: [
          {
            titulo: 'El ciclo hidrológico natural',
            contenido: 'Analiza cómo el agua circula en la naturaleza: evaporación, condensación, precipitación y escorrentía.',
            media: { tipo: 'imagen', src: '/img/training/recursos/14.jpg' }
          },
          {
            titulo: 'Factores que afectan la disponibilidad',
            contenido: 'Explora el impacto del cambio climático, deforestación y urbanización sobre la disponibilidad de agua.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 2: Técnicas de captación y almacenamiento',
        slug: normalizeName('Módulo 2: Técnicas de captación y almacenamiento'),
        mainImage: '/img/training/recursos/14.jpg',
        thumbImages: ['/img/training/recursos/13.jpg', '/img/training/recursos/15.jpg'],
        statsTitle: 'Soluciones prácticas',
        statsText: 'Revisión de métodos como captación de agua de lluvia, almacenamiento en aljibes y reservorios comunitarios.',
        temas: [
          {
            titulo: 'Sistemas de captación de lluvia',
            contenido: 'Diseño y materiales para recolectar agua desde techos y superficies impermeables.',
            media: { tipo: 'imagen', src: '/img/training/recursos/15.jpg' }
          },
          {
            titulo: 'Construcción de reservorios rurales',
            contenido: 'Pasos para implementar soluciones sostenibles con participación comunitaria.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 3: Uso eficiente del agua en cultivos',
        slug: normalizeName('Módulo 3: Uso eficiente del agua en cultivos'),
        mainImage: '/img/training/recursos/15.jpg',
        thumbImages: ['/img/training/recursos/14.jpg', '/img/training/recursos/13.jpg'],
        statsTitle: 'Manejo técnico',
        statsText: 'Aplicación de prácticas agronómicas para minimizar pérdidas y optimizar el uso de agua en distintas etapas del cultivo.',
        temas: [
          {
            titulo: 'Técnicas de riego eficientes',
            contenido: 'Comparativa entre riego por aspersión, goteo y surcos.',
            media: { tipo: 'imagen', src: '/img/training/recursos/13.jpg' }
          },
          {
            titulo: 'Programación del riego según el cultivo',
            contenido: 'Cómo determinar la frecuencia y cantidad según el tipo de planta y etapa de desarrollo.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 4: Educación y políticas de conservación',
        slug: normalizeName('Módulo 4: Educación y políticas de conservación'),
        mainImage: '/img/training/recursos/13.jpg',
        thumbImages: ['/img/training/recursos/15.jpg', '/img/training/recursos/14.jpg'],
        statsTitle: 'Sostenibilidad a largo plazo',
        statsText: 'Importancia de la educación hídrica y políticas públicas orientadas al uso responsable del agua.',
        temas: [
          {
            titulo: 'Iniciativas educativas en zonas rurales',
            contenido: 'Estrategias para capacitar a comunidades en el cuidado del agua desde edad temprana.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          },
          {
            titulo: 'Normativas y participación comunitaria',
            contenido: 'Cómo las leyes locales y la organización social pueden fomentar el uso responsable del agua.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      }
    ]
  },
  [normalizeName('Optimización de canales y drenajes agrícolas')]: {
    titulo: 'Optimización de canales y drenajes agrícolas',
    descripcion:
      'Aprende a diseñar, mantener y mejorar infraestructuras hidráulicas en terrenos agrícolas para un manejo más eficiente del agua.',
    imagen: '/img/training/recursos/12.jpg',
    modulos: [
      {
        titulo: 'Módulo 1: Principios de hidráulica agrícola',
        slug: normalizeName('Módulo 1: Principios de hidráulica agrícola'),
        mainImage: '/img/training/recursos/12.jpg',
        thumbImages: ['/img/training/recursos/11.jpg', '/img/training/recursos/10.jpg'],
        statsTitle: 'Bases técnicas',
        statsText: 'Este módulo presenta conceptos clave sobre el flujo del agua, presión, caudal y comportamiento hidráulico en agricultura.',
        quoteImage: '/img/training/recursos/avatar.jpg',
        quoteText: 'Un canal bien diseñado transforma la productividad del campo.',
        quoteAuthor: 'Carlos Méndez, especialista en ingeniería rural',
        temas: [
          {
            titulo: 'Conceptos básicos de hidráulica',
            contenido: 'Se estudian principios de energía, presión, velocidad y su aplicación práctica en sistemas agrícolas.',
            media: { tipo: 'imagen', src: '/img/training/recursos/13.jpg' }
          },
          {
            titulo: 'Medición y análisis de caudal',
            contenido: 'Instrumentos y técnicas para determinar el caudal en canales de riego, incluyendo métodos volumétricos y de velocidad.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 2: Diseño de canales agrícolas',
        slug: normalizeName('Módulo 2: Diseño de canales agrícolas'),
        mainImage: '/img/training/recursos/10.jpg',
        thumbImages: ['/img/training/recursos/11.jpg', '/img/training/recursos/12.jpg'],
        statsTitle: 'Diseño técnico',
        statsText: 'Aprende a calcular dimensiones, pendientes y materiales adecuados para construir canales eficientes y sostenibles.',
        temas: [
          {
            titulo: 'Factores de diseño',
            contenido: 'Pendiente, capacidad, materiales de revestimiento y topografía como elementos base en el diseño.',
            media: { tipo: 'imagen', src: '/img/training/recursos/14.jpg' }
          },
          {
            titulo: 'Software y herramientas CAD',
            contenido: 'Introducción al uso de AutoCAD Civil 3D para modelar canales agrícolas y generar planos técnicos.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 3: Sistemas de drenaje agrícola',
        slug: normalizeName('Módulo 3: Sistemas de drenaje agrícola'),
        mainImage: '/img/training/recursos/9.jpg',
        thumbImages: ['/img/training/recursos/10.jpg', '/img/training/recursos/11.jpg'],
        statsTitle: 'Control de excesos hídricos',
        statsText: 'Identifica tipos de drenaje (superficial y subterráneo), cómo implementarlos y mantenerlos en condiciones óptimas.',
        temas: [
          {
            titulo: 'Drenaje superficial vs subterráneo',
            contenido: 'Ventajas y limitaciones de ambos sistemas según el tipo de suelo y cultivo.',
            media: { tipo: 'imagen', src: '/img/training/recursos/15.jpg' }
          },
          {
            titulo: 'Técnicas de instalación',
            contenido: 'Pasos prácticos para implementar zanjas, tubos perforados y pozos de inspección.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      },
      {
        titulo: 'Módulo 4: Mantenimiento y rehabilitación de infraestructuras',
        slug: normalizeName('Módulo 4: Mantenimiento y rehabilitación de infraestructuras'),
        mainImage: '/img/training/recursos/8.jpg',
        thumbImages: ['/img/training/recursos/9.jpg', '/img/training/recursos/10.jpg'],
        statsTitle: 'Gestión operativa',
        statsText: 'Buenas prácticas para prolongar la vida útil de canales y drenajes, prevenir obstrucciones y evitar pérdidas de agua.',
        temas: [
          {
            titulo: 'Planificación de mantenimiento',
            contenido: 'Creación de cronogramas de limpieza, inspección visual y monitoreo de eficiencia.',
            media: { tipo: 'imagen', src: '/img/training/recursos/12.jpg' }
          },
          {
            titulo: 'Rehabilitación de canales deteriorados',
            contenido: 'Evaluación de daños estructurales y técnicas de reparación con materiales locales.',
            media: { tipo: 'video', src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FMiguelATelloV%2Fvideos%2F713860344396308%2F&show_text=false&width=560&t=0' }
          }
        ]
      }
    ]
  }


};
