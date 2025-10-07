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

export const contenidoPEDOpciones =[
  { "value": "directorio", "label": "I. Directorio" },
  { "value": "mensaje", "label": "II. Mensaje" },
  { "value": "presentacion", "label": "III. Presentación" },
  { "value": "como_leer_ped", "label": "IV. ¿Cómo leer el PED?" },
  { "value": "metodologia", "label": "V. Metodología" },
  { "value": "marco_normativo", "label": "VI. Marco Normativo" },
  { "value": "marco_planeacion", "label": "VII. Marco de Planeación" },
  { "value": "participacion_ciudadana", "label": "VIII. Participación Ciudadana" },
  { "value": "panorama_hidalgo", "label": "IX. Panorama del Estado de Hidalgo" },
  { "value": "evaluacion_plan_2022_2028", "label": "X. Evaluación del Plan Estatal de Desarrollo 2022 – 2028" },
  { "value": "plataforma_estrategica", "label": "XI. Plataforma Estratégica" },
  { "value": "rutas_transformacion_planeacion", "label": "XII. Las Rutas de la Transformación a través de la Planeación" },
  { "value": "programas_por_desarrollar", "label": "XIII. Programas por desarrollar" },
  { "value": "referencias", "label": "XIV. Referencias" },
  { "value": "glosario", "label": "XV. Glosario" },
  { "value": "anexo", "label": "XVI. Anexo" }
]