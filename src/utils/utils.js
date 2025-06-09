export const normalizeName = (str) => {
  return str
    .normalize("NFD") // Descompone los caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos
    .replace(/[^\w\s-]/g, "") // Elimina caracteres especiales
    .replace(/\s+/g, "-") // Reemplaza espacios con guiones
    .toLowerCase(); // Convierte a minúsculas
};

export const municipiosDeHidalgo = [
  '001 Acatlán', '002 Acaxochitlán', '003 Actopan', '004 Agua Blanca de Iturbide', '005 Ajacuba', '006 Alfajayucan',
  '007 Almoloya', '008 Apan', '009 El Arenal', '010 Atitalaquia', '011 Atlapexco', '012 Atotonilco el Grande',
  '013 Atotonilco de Tula', '014 Calnali', '015 Cardonal', '016 Cuautepec de Hinojosa', '017 Chapantongo',
  '018 Chapulhuacán', '019 Chilcuautla', '020 Eloxochitlán', '021 Emiliano Zapata', '022 Epazoyucan',
  '023 Francisco I. Madero', '024 Huasca de Ocampo', '025 Huautla', '026 Huazalingo', '027 Huehuetla',
  '028 Huejutla de Reyes', '029 Huichapan', '030 Ixmiquilpan', '031 Jacala de Ledezma', '032 Jaltocán',
  '033 Juárez Hidalgo', '034 Lolotla', '035 Metepec', '036 San Agustín Metzquititlán', '037 Metztitlán',
  '038 Mineral del Chico', '039 Mineral del Monte', '040 La Misión', '041 Mixquiahuala de Juárez',
  '042 Molango de Escamilla', '043 Nicolás Flores', '044 Nopala de Villagrán', '045 Omitlán de Juárez',
  '046 San Felipe Orizatlán', '047 Pacula', '048 Pachuca de Soto', '049 Pisaflores', '050 Progreso de Obregón',
  '051 Mineral de la Reforma', '052 San Agustín Tlaxiaca', '053 San Bartolo Tutotepec', '054 San Salvador',
  '055 Santiago de Anaya', '056 Santiago Tulantepec de Lugo Guerrero', '057 Singuilucan', '058 Tasquillo',
  '059 Tecozautla', '060 Tenango de Doria', '061 Tepeapulco', '062 Tepehuacán de Guerrero', '063 Tepeji del Río de Ocampo',
  '064 Tepetitlán', '065 Tetepango', '066 Villa de Tezontepec', '067 Tezontepec de Aldama', '068 Tianguistengo',
  '069 Tizayuca', '070 Tlahuelilpan', '071 Tlahuiltepa', '072 Tlanalapa', '073 Tlanchinol', '074 Tlaxcoapan',
  '075 Tolcayuca', '076 Tula de Allende', '077 Tulancingo de Bravo', '078 Xochiatipan', '079 Xochicoatlán',
  '080 Yahualica', '081 Zacualtipán de Ángeles', '082 Zapotlán de Juárez', '083 Zempoala', '084 Zimapán'
];


export const municipiosDeHidalgoModulos = [
  '003 Actopan', '005 Ajacuba', '006 Alfajayucan', '009 El Arenal', '010 Atitalaquia', '013 Atotonilco de Tula', '015 Cardonal', '019 Chilcuautla', '023 Francisco I. Madero', '030 Ixmiquilpan', '041 Mixquiahuala de Juárez', '050 Progreso de Obregón', '054 San Salvador', '055 Santiago de Anaya', '058 Tasquillo', '063 Tepeji del Río de Ocampo', '064 Tepetitlán', '065 Tetepango', '067 Tezontepec de Aldama', '070 Tlahuelilpan', '074 Tlaxcoapan', '076 Tula de Allende'
];

export const identificacionOpciones = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' }
];

export const distritosPorModulos = {
  'Distrito de Riego 003.Tula': [
    'Organización Productora agrícola y ganadera de las aguas para riego A.C. (Modulo 01 Actopan)',
    'Usuarios de Riego del sistema Endho-Xuchitlan, A.C.',
    'Usuarios y productores unidad Tepatepec A.C.',
    'Alto Tepatepec A.C.',
    'Asociación de campesinos de bombeo del Cerro del Xicuco A.C.',
    'Asociación de campesinos sección 45 El Solís A.C.',
    'Sistema de Riego Gamagaox A.C.',
    'Asociación de usuarios de la sección 14 El Bexha A.C.',
    'Bombeo Agricola Teltipan A.C.',
    'Bombeo Cerro Juandho de Teltipán',
    'Potrero Blanco y San Rafael',
    'Dendho-Cardonal'
  ],

  'Distrito de Riego 100.Alfajayucan': [
    'Asociación de usuarios de riego unidad Alfajayucan A.C.',
    'Zona de riego Tasquillo A.C.',
    'Usuarios canal Alto Ixmiquilpan A.C.',
    'Usuarios de riego canal Xotho A.C.',
    'Usuarios de riego canal del Centro',
    'Asociación de usuario del distrito de riego 027 Ixmiquilpan A.C.'
  ],

  'Distrito de Riego 112.Ajacuba': [
    'Asociación de Usuarios Valle del Mezquital'
  ]
};

export const productoSembrados = [
  'Maíz',
  'Avena para forraje',
  'Alfalfa',
  'Hortalizas'
];

export const cultivosAnuales = ['Maíz', 'Avena para forraje', 'Hortalizas'];

export const nivelesOpciones = [
  { value: 'bajo', label: 'Bajo' },
  { value: 'media', label: 'Media' },
  { value: 'alto', label: 'Alto' }
];

export const profundidadSueloOpciones = [
  { value: 'menor_40', label: 'Menor a 40 cm' },
  { value: 'entre_40_50', label: 'Entre 40 y 50 cm' },
  { value: 'mayor_50', label: 'Mayor a 50 cm' }
];

export const tipoRevestimientoOpciones = [
  { value: 'concreto', label: 'Concreto' },
  { value: 'tierra', label: 'Tierra' }
];

export const gastoCanalesOpciones = [
  { value: 'medio_rango', label: 'Medio rango' },
  { value: 'gasto_completo', label: 'Gasto completo' }
];

export const tipoSeccionOpciones = [
  { value: 'trapezoidal', label: 'Trapezoidal' },
  { value: 'rectangular', label: 'Rectangular' },
  { value: 'circular', label: 'Circular' },
  { value: 'irregular', label: 'Irregular' }
];

export const documentosPresentados = [
  { value: 'certificado_parcelario', label: 'Certificado parcelario' },
  { value: 'escrituras', label: 'Escrituras' },
  { value: 'titulo_propiedad', label: 'Título de propiedad' },
  { value: 'constancia_posesion', label: 'Constancia de posesión' }
];


export const pendientePromedio = [
  '0 a 1%',
  '1.1 a 2.5%',
  '2.6 a 4%',
  'mayor de 4',
];

export const profundidadSueloPedregosidad = [
  'mayor a 40 cm',
  'menor igual a 40 cm',
];

export const tipoSuelo = [
  'leptosoles',
  'regosoles',
  'calcisoles',
  'feozems',
  'vertisoles',
];