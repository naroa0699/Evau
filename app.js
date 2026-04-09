// ════════════════════════════════════════════════════════════════════════════
//  EVAU 2026 — app.js  (Firebase Firestore edition)
// ════════════════════════════════════════════════════════════════════════════

// ─── FIREBASE CONFIG ─────────────────────────────────────────────────────────
//
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAZZARFl37nV2qv8t_Gb1Jv4SjXvy_d5Wg",
  authDomain: "evau-2026.firebaseapp.com",
  projectId: "evau-2026",
  storageBucket: "evau-2026.firebasestorage.app",
  messagingSenderId: "853946776035",
  appId: "1:853946776035:web:60f7a7c30fba1069b908d6"
};

// ─── FIREBASE INIT ───────────────────────────────────────────────────────────

const CONFIG_MISSING = FIREBASE_CONFIG.apiKey.startsWith('PEGA_AQUI');

let db = null;
let auth = null;
let userId = null;
let saveTimer = null;

function firebaseReady() {
  if (CONFIG_MISSING) {
    document.getElementById('config-banner').style.display = 'block';
    return false;
  }
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    auth = firebase.auth();
    db = firebase.firestore();
    // Activa persistencia offline (funciona aunque no haya internet)
    db.enablePersistence({ synchronizeTabs: true }).catch(() => { });
    return true;
  } catch (e) {
    console.error('Firebase init error:', e);
    return false;
  }
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const TOPICS = {
  dt: [
    {
      id: 'dt1', name: 'Geometría Plana', items: [
        {
          title: 'Geometría Métrica. Fundamentos', children: [
            'Elementos: punto, recta plano',
            'Paralelismo',
            'Perpendicularidad',
            'Ángulos: unidades, relaciones, tipos y construcciones',
            'Rectificaciones de arcos',
            'Ángulos de la circunferencia. Arco capaz',
            'Potencia y eje radical',
            'Proporcionalidad y Teorema de Tales.',
            'Cuarta, tercera y media proporcional.',
            'Producto, división, cuadrado y raíz de segmentos',
            'Sección Áurea'
          ]
        },
        {
          title: 'Geometría Métrica. Construcciones', children: [
            'Triángulos',
            'Cuadriláteros',
            'Polígonos regulares',
            'Polígonos estrellados',
            'Igualdad, traslación, simetría y giro',
            'Homotecia',
            'Semejanza y escalas',
            'Equivalencias',
            'Homología y afinidad',
            'Inversión',
            'Concepto y clasificación',
            'Rectas tangentes a circunferencias',
            'Circunferencias tangentes a rectas y circunferencias',
            'Circunferencias tangentes a rectas',
            'Circunferencias tangentes entre sí pasando por puntos',
            'Circunferencias tangentes a circunferencia y recta por puntos',
            'Circunferencias tangentes a dos circunferencias dadas por puntos exteriores',
            'Circunferencias tangentes a tres circunferencias dadas',
            'Enlaces',
            'Óvalo, ovoide y espirales',
            'Hélices',
            'Curvas trigonométricas',
            'Curvas cíclicas',
            'Elipse',
            'Parábola',
            'Hipérbola'
          ]
        },
      ], diff: 'high'
    },
    {
      id: 'dt3', name: 'Geometría Descriptiva · Sistema Diédrico', items: [
        {
          title: 'Diédrico. Fundamentos', children: [
            'Fundamentos del sistema',
            'Punto',
            'Recta',
            'Plano'
          ]
        },
        {
          title: 'Diédrico. Conceptos', children: [
            'Intersecciones elementales',
            'Paralelismo',
            'Perpendicularidad',
            'Distancias',
            'Ángulos'
          ]
        },
        {
          title: 'Diédrico. Métodos', children: [
            'Abatimientos',
            'Cambios de plano',
            'Giros'
          ]
        },
        {
          title: 'Diédrico. Superficies, secciones, desarrollo y transformada', children: [
            'Tipos de superficies',
            'Superficies radiadas. Representación',
            'Representación del prisma',
            'Representación de la pirámide',
            'Representación del cilindro',
            'Representación del cono',
            'Superficies radiadas. Secciones',
            'Sección del prisma',
            'Sección de la pirámide',
            'Sección del cilindro',
            'Sección del cono',
            'Superficies radiadas. Desarrollo y transformada',
            'Desarrollo del prisma',
            'Desarrollo de la pirámide',
            'Desarrollo del cilindro',
            'Desarrollo del cono',
            'Poliedros regulares. Representación, secciones y desarrollo',
            'Tetraedro',
            'Hexaedro',
            'Octaedro',
            'Dodecaedro',
            'Icosaedro',
            'Superficies no regladas. Representación y secciones',
            'Esfera',
            'Toro'
          ]
        },
        {
          title: 'Sistema Diédrico. Intersecciones', children: [
            'Intersección entre recta y superficie radiada',
            'Intersección de rectas con la esfera',
            'Métodos generales para el cálculo de intersecciones entre superficies',
            'Métodos para el cálculo de intersecciones entre superficies de revolución'
          ]
        },
      ], diff: 'high'
    },
    {
      id: 'dt4', name: 'Sistema Axonométrico Ortogonal', items: [
        {
          title: 'Axonométrico. Fundamentos', children: [
            'Elementos. Isométrica, dimétrica, trimétrica',
            'Escalas gráficas y reducciones',
            'Punto',
            'Recta. Determinación y tipos',
            'Plano. Determinación y tipos'
          ]
        },
        {
          title: 'Axonométrico. Procedimientos', children: [
            'Intersecciones. Trazas ordinarias',
            'Distancias y abatimientos',
            'Perpendicularidad y verdadera magnitud',
            'Representación de figuras planas y cuerpos'
          ]
        },
      ], diff: 'med'
    },
    {
      id: 'dt5', name: 'Caballera y Planos Acotados', items: [
        {
          title: 'Perspectiva Caballera · Fundamentos', children: [
            'Elementos y fundamentos',
            'Escalas gráficas y reducciones',
            'Punto',
            'Recta. Determinación y tipos',
            'Plano. Determinación y tipos'
          ]
        },
        {
          title: 'Perspectiva Caballera · Procedimientos', children: [
            'Intersección recta-plano',
            'Abatimientos',
            'Perpendicularidad'
          ]
        },
        {
          title: 'Sistema Acotado · Fundamentos', children: [
            'Punto',
            'Recta. Pendiente e intervalo',
            'Plano. Determinación, tipos'
          ]
        },
        {
          title: 'Sistema Acotado · Procedimientos', children: [
            'Intersecciones. Arista y gotera',
            'Paralelismo',
            'Perpendicularidad',
            'Abatimientos. Punto, recta y figura plana',
            'Distancias',
            'Proyección de cuerpos'
          ]
        },
      ], diff: 'med'
    },
    {
      id: 'dt6', name: 'Perspectiva Cónica y Sombras', items: [
        {
          title: 'Sistema Cónico. Fundamentos', children: [
            'Elementos',
            'Punto',
            'Recta',
            'Plano',
            'Intersecciones'
          ]
        },
        {
          title: 'Sistema Cónico. Variables y métodos', children: [
            'Método directo',
            'Método de las prolongaciones',
            'Método de las distancias métricas',
            'Método de las proyecciones visuales',
            'Método de coordenadas',
            'Perspectiva cónica. Pautas'
          ]
        },
        {
          title: 'Sombras en los Sistemas de Representación', children: [
            'Sombras. Generalidades',
            'Sombras en Sistema Diédrico · Foco propio',
            'Sombras en Sistema Diédrico · Foco impropio',
            'Sombras en Sistema Axonométrico Ortogonal · Foco propio',
            'Sombras en Sistema Axonométrico Ortogonal · Foco impropio',
            'Sombras en Sistema Axonométrico Oblicuo · Foco impropio',
            'Sombras en Sistema Acotado · Foco impropio',
            'Sombras en Sistema Cónico · Foco propio',
            'Sombras en Sistema Cónico · Foco impropio'
          ]
        },
      ], diff: 'low'
    },
  ],
  ti: [
    {
      id: 'ti1', name: 'BLOQUE I. Proyectos de I+D y tecnología sostenible', items: [
        {
          title: 'Unidad 1. Proyectos de investigación y desarrollo', children: [
            'Técnicas y estrategias de trabajo en equipo',
            'Metodologías agile',
            'Desarrollo de un proyecto: fases',
            'Normalización',
            'Proyecto técnico: índice, memoria, planos, pliego, mediciones y presupuesto, anexos',
            'Informe de evaluación del impacto ambiental',
            'Difusión y comunicación de documentación técnica',
            'Práctica paso a paso, resumen y actividades de refuerzo'
          ]
        },
      ], diff: 'med'
    },
    {
      id: 'ti2', name: 'BLOQUE II. Materiales y fabricación', items: [
        {
          title: 'Unidad 2. Materiales y fabricación', children: [
            'Estructura interna y estructura cristalina de los materiales',
            'Propiedades de los materiales',
            'Metales: cristalización y diagramas de equilibrio de fases',
            'Alotropía y diagrama hierro-carbono',
            'Procedimientos de ensayo y medida',
            'Procesamiento y conformación',
            'Operaciones de ensamblaje',
            'Tratamientos de modificación y mejora',
            'Impacto ambiental',
            'Práctica paso a paso, problemas y actividades de refuerzo'
          ]
        },
      ], diff: 'med'
    },
    {
      id: 'ti3', name: 'BLOQUE III. Sistemas mecánicos', items: [
        {
          title: 'Unidad 3. Estructuras', children: [
            'Elementos de estructuras sencillas',
            'Estabilidad y cálculos básicos',
            'Tipos de cargas, apoyos y uniones',
            'Cálculo de esfuerzos en vigas y diagramas de esfuerzos',
            'Esfuerzos en barras articuladas y diagrama de Cremona',
            'Resumen, problemas y actividades'
          ]
        },
        {
          title: 'Unidad 4. Máquinas térmicas', children: [
            'Conceptos fundamentales y termodinámica',
            'Principios termodinámicos y transformaciones',
            'Ciclos termodinámicos',
            'Motores térmicos: combustión externa e interna',
            'Motores de explosión 4T y 2T; encendido por compresión',
            'Máquinas frigoríficas y bombas de calor',
            'Práctica paso a paso, actividades y problemas'
          ]
        },
        {
          title: 'Unidad 5. Neumática e hidráulica', children: [
            'Principios físicos de funcionamiento',
            'Circuitos y simbología neumática',
            'Producción y tratamiento del aire comprimido',
            'Regulación y control: válvulas',
            'Distribución del aire y actuadores neumáticos',
            'Diseño de circuitos neumáticos',
            'Oleohidráulica y bombas hidráulicas',
            'Control eléctrico de circuitos neumáticos e hidráulicos',
            'Simulaciones prácticas, resumen y problemas'
          ]
        },
      ], diff: 'high'
    },
    {
      id: 'ti4', name: 'BLOQUE IV. Sistemas eléctricos y electrónicos', items: [
        {
          title: 'Unidad 6. Circuitos de corriente alterna', children: [
            'Corriente monofásica y trifásica',
            'Parámetros y valores de CA. Diagrama de Fresnel',
            'Balance de potencias',
            'Ley de Ohm en corriente alterna',
            'Conceptos previos de máquinas eléctricas',
            'Máquinas eléctricas y aplicaciones',
            'Motores de CA monofásicos y trifásicos',
            'Resumen, ejercicios y problemas'
          ]
        },
        {
          title: 'Unidad 7. Electrónica digital', children: [
            'Sistemas de numeración y álgebra de Boole',
            'Puertas y niveles lógicos',
            'Tabla de verdad y simplificación de funciones',
            'Método algebraico y mapas de Karnaugh',
            'Circuitos combinacionales integrados',
            'Decodificadores, codificadores, multiplexores y demultiplexores',
            'Comparadores y sumadores',
            'Circuitos lógicos secuenciales y biestables',
            'Contadores y registros de desplazamiento',
            'Prácticas de simulación/montaje, actividades y problemas'
          ]
        },
      ], diff: 'high'
    },
    {
      id: 'ti5', name: 'BLOQUE V. Sistemas informáticos emergentes', items: [
        {
          title: 'Unidad 8. Sistemas informáticos emergentes', children: [
            'Fundamentos y tipos de inteligencia artificial',
            'Impacto social de la IA y sesgos',
            'Aplicaciones de la inteligencia artificial',
            'Big data',
            'Bases de datos distribuidas y relacionales',
            'Ciberseguridad a nivel de usuario',
            'Resumen y actividades de refuerzo'
          ]
        },
      ], diff: 'med'
    },
    {
      id: 'ti6', name: 'BLOQUE VI. Sistemas automáticos', items: [
        {
          title: 'Unidad 9. Sistemas automáticos', children: [
            'Sistemas automáticos y de control: estructura',
            'Lazo abierto y lazo cerrado',
            'Elementos de un sistema de control',
            'Función de transferencia',
            'Sensores',
            'Práctica paso a paso',
            'Resumen, actividades y problemas'
          ]
        },
      ], diff: 'high'
    },
  ]
};

const EXAM_BANK = [
  { id: 'dt-mad-2026-modelo', subject: 'dt', year: '2026', region: 'Madrid', convocatoria: 'modelo', title: 'DT-II · Madrid 2026 · Modelo', url: 'https://drive.google.com/file/d/1EOwkvTg5fCcoV92_kjloV5itIvdoljNl/view?usp=drive_link' },
  { id: 'dt-mad-2025-ord', subject: 'dt', year: '2025', region: 'Madrid', convocatoria: 'ordinaria', title: 'DT-II · Madrid 2025 · Ordinaria', url: 'https://drive.google.com/file/d/1M4yXYqSS2IbF5D5nlpjttB-MAFrhQGes/view?usp=drive_link' },
  { id: 'dt-mad-2025-ext', subject: 'dt', year: '2025', region: 'Madrid', convocatoria: 'extraordinaria', title: 'DT-II · Madrid 2025 · Extraordinaria', url: 'https://drive.google.com/file/d/1zU8kw6xGQxTVIgPOLMvV30d459njWJ2j/view?usp=drive_link' },
  { id: 'dt-mad-2025-coi', subject: 'dt', year: '2025', region: 'Madrid', convocatoria: 'coincidencias', title: 'DT-II · Madrid 2025 · Coincidencias', url: 'https://drive.google.com/file/d/1SZFesoBdQ_W2Z1Rh3xE4dhGrRGamu29L/view?usp=drive_link' },
  { id: 'dt-mad-2024-ord', subject: 'dt', year: '2024', region: 'Madrid', convocatoria: 'ordinaria', title: 'DT-II · Madrid 2024 · Ordinaria', url: 'https://drive.google.com/file/d/1VMILtyASwp2UqqF3olRAgQdeNBYrAqHe/view?usp=sharing' },
  { id: 'dt-mad-2024-ext', subject: 'dt', year: '2024', region: 'Madrid', convocatoria: 'extraordinaria', title: 'DT-II · Madrid 2024 · Extraordinaria', url: 'https://drive.google.com/file/d/1D_m1b-EqghPZUI66g8YzqKXXs-1Dg7FS/view?usp=drive_link' },
  { id: 'dt-mad-2024-coi', subject: 'dt', year: '2024', region: 'Madrid', convocatoria: 'coincidencias', title: 'DT-II · Madrid 2024 · Coincidencias', url: 'https://drive.google.com/file/d/1Ue7U9s-VBiHVwaRmtXidB3ajBTGmwLWM/view?usp=drive_link' },
  { id: 'dt-mad-2023-ord', subject: 'dt', year: '2023', region: 'Madrid', convocatoria: 'ordinaria', title: 'DT-II · Madrid 2023 · Ordinaria', url: 'https://drive.google.com/file/d/1smtUUlWgG6IA9TKcRqEnCde6c1puYoCv/view?usp=sharing' },
  { id: 'dt-mad-2023-ext', subject: 'dt', year: '2023', region: 'Madrid', convocatoria: 'extraordinaria', title: 'DT-II · Madrid 2023 · Extraordinaria', url: 'https://drive.google.com/file/d/1uQcGSMA-hY8Pv9ub4CTZ0Za4_QDRpfu7/view?usp=drive_link' },
  { id: 'dt-mad-2022-ord', subject: 'dt', year: '2022', region: 'Madrid', convocatoria: 'ordinaria', title: 'DT-II · Madrid 2022 · Ordinaria', url: 'https://drive.google.com/file/d/1_f_1VEnbXunhYlxsQPRXolGtqUZGGWA4/view?usp=sharing' },
  { id: 'dt-mad-2022-ext', subject: 'dt', year: '2022', region: 'Madrid', convocatoria: 'extraordinaria', title: 'DT-II · Madrid 2022 · Extraordinaria', url: 'https://drive.google.com/file/d/1P1PPeRlAa4eMtupx0j8-8EyzQk2RqzYT/view?usp=sharing' },
  { id: 'dt-mad-2022-coi', subject: 'dt', year: '2022', region: 'Madrid', convocatoria: 'coincidencias', title: 'DT-II · Madrid 2022 · Coincidencias', url: 'https://drive.google.com/file/d/1EykzGJa5dXsHKiF9hlLg-YEBdjMWjfYQ/view?usp=sharing' },
  { id: 'dt-mad-2021-ord', subject: 'dt', year: '2021', region: 'Madrid', convocatoria: 'ordinaria', title: 'DT-II · Madrid 2021 · Ordinaria', url: 'https://drive.google.com/file/d/1vkNVT0GsHQsSY0ULZcJjEN7B1-68TeHf/view?usp=sharing' },
  { id: 'dt-mad-2021-ext', subject: 'dt', year: '2021', region: 'Madrid', convocatoria: 'extraordinaria', title: 'DT-II · Madrid 2021 · Extraordinaria', url: 'https://drive.google.com/file/d/1PF6s_6xBzfvTEKbodi-I1gLL_8mesZ0K/view?usp=sharing' },
  { id: 'ti-mad-2026-modelo', subject: 'ti', year: '2026', region: 'Madrid', convocatoria: 'modelo', title: 'TI-II · Madrid 2026 · Modelo', url: 'https://drive.google.com/file/d/1MmXIPDnj36jqOiEIY15D86lQmgjbbSJ0/view?usp=drive_link' },
  { id: 'ti-mad-2025-ord', subject: 'ti', year: '2025', region: 'Madrid', convocatoria: 'ordinaria', title: 'TI-II · Madrid 2025 · Ordinaria', url: 'https://drive.google.com/file/d/13FPjfJKy9rlQT_dXz2Ly3v2ESHkiAHSS/view?usp=drive_link' },
  { id: 'ti-mad-2025-ext', subject: 'ti', year: '2025', region: 'Madrid', convocatoria: 'extraordinaria', title: 'TI-II · Madrid 2025 · Extraordinaria', url: 'https://drive.google.com/file/d/1BTVTDBAywddHMdoe6qihg0OOqOe-Z_rS/view?usp=drive_link' },
  { id: 'ti-mad-2025-coi', subject: 'ti', year: '2025', region: 'Madrid', convocatoria: 'coincidencias', title: 'TI-II · Madrid 2025 · Coincidencias', url: 'https://drive.google.com/file/d/13oXuBH_5fDjYoWJVbxABvIR6inhOJ_kQ/view?usp=drive_link' },
  { id: 'ti-mad-2024-ord', subject: 'ti', year: '2024', region: 'Madrid', convocatoria: 'ordinaria', title: 'TI-II · Madrid 2024 · Ordinaria', url: 'https://drive.google.com/file/d/1ShQxlRWulwIkG90Ptkz9YcvjRTePPnGf/view?usp=drive_link' },
  { id: 'ti-mad-2024-ext', subject: 'ti', year: '2024', region: 'Madrid', convocatoria: 'extraordinaria', title: 'TI-II · Madrid 2024 · Extraordinaria', url: 'https://drive.google.com/file/d/1PVoxgndjftleiX8pP460-EdMov9scTrV/view?usp=drive_link' },
  { id: 'ti-mad-2024-coi', subject: 'ti', year: '2024', region: 'Madrid', convocatoria: 'coincidencias', title: 'TI-II · Madrid 2024 · Coincidencias', url: 'https://drive.google.com/file/d/1IYUCup4MXaUVfn0gawfPU5wL_yUdnY3l/view?usp=drive_link' },
  { id: 'ti-mad-2023-ord', subject: 'ti', year: '2023', region: 'Madrid', convocatoria: 'ordinaria', title: 'TI-II · Madrid 2023 · Ordinaria', url: 'https://drive.google.com/file/d/1mWWmXE7dNSYJ5nsKrcO2fhisnCq2ze3d/view?usp=drive_link' },
  { id: 'ti-mad-2023-ext', subject: 'ti', year: '2023', region: 'Madrid', convocatoria: 'extraordinaria', title: 'TI-II · Madrid 2023 · Extraordinaria', url: 'https://drive.google.com/file/d/1YMHpN_xdaqpP1K9MbYcZFvQCrMIuXSVc/view?usp=drive_link' },
];

// ─── STATE ───────────────────────────────────────────────────────────────────

const MAX_LOGS = 200, MAX_MISTAKES = 300, MAX_MOCKS = 100;
const REVIEW_STEPS = [1, 3, 7, 14];
const CHECKLIST_DEF = { dni: false, resguardo: false, material: false, ruta: false, descanso: false };

const DEFAULT_STATE = {
  done: {}, logs: [], pomSessions: 0, pomDay: '',
  weeklyGoals: { dt: 4, ti: 4, sim: 1 },
  weeklyProgress: { dt: 0, ti: 0, sim: 0 },
  weekKey: '', mistakes: [], mockExams: [],
  examChecklist: { ...CHECKLIST_DEF },
};

let state = { ...DEFAULT_STATE };
let mockRunning = false, mockTimeLeft = 90 * 60, mockInterval = null;

function clamp(v, min, max, fb) {
  const n = Number(v);
  return Number.isNaN(n) ? fb : Math.min(Math.max(n, min), max);
}

function normalizeState(raw) {
  const src = (raw && typeof raw === 'object') ? raw : {};
  const logs = Array.isArray(src.logs)
    ? src.logs.map(l => ({
      id: String(l?.id || Date.now().toString(36) + '-' + Math.floor(Math.random() * 99999)),
      text: String(l?.text || ''),
      subject: ['dt', 'ti', 'gen'].includes(l?.subject) ? l.subject : 'gen',
      time: String(l?.time || ''),
      date: String(l?.date || ''),
      topicId: String(l?.topicId || ''),
      topicLabel: String(l?.topicLabel || ''),
    })).filter(l => l.text)
    : [];
  const mistakes = Array.isArray(src.mistakes)
    ? src.mistakes.map(m => ({
      id: String(m?.id || Date.now() + Math.random()),
      text: String(m?.text || ''),
      subject: ['dt', 'ti', 'gen'].includes(m?.subject) ? m.subject : 'gen',
      created: String(m?.created || today()),
      stage: clamp(m?.stage, 0, 10, 0),
      nextReview: String(m?.nextReview || today())
    })).filter(m => m.text)
    : [];
  const mocks = Array.isArray(src.mockExams)
    ? src.mockExams.map(e => ({ date: String(e?.date || today()), duration: clamp(e?.duration, 30, 240, 90), score: clamp(e?.score, 0, 10, 0) }))
    : [];
  return {
    ...DEFAULT_STATE, ...src,
    done: (src.done && typeof src.done === 'object') ? src.done : {},
    logs: logs.slice(0, MAX_LOGS),
    weeklyGoals: { dt: clamp(src.weeklyGoals?.dt, 0, 20, 4), ti: clamp(src.weeklyGoals?.ti, 0, 20, 4), sim: clamp(src.weeklyGoals?.sim, 0, 10, 1) },
    weeklyProgress: { dt: clamp(src.weeklyProgress?.dt, 0, 50, 0), ti: clamp(src.weeklyProgress?.ti, 0, 50, 0), sim: clamp(src.weeklyProgress?.sim, 0, 20, 0) },
    mistakes: mistakes.slice(0, MAX_MISTAKES),
    mockExams: mocks.slice(0, MAX_MOCKS),
    examChecklist: { ...CHECKLIST_DEF, ...(src.examChecklist || {}) },
  };
}

function today() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function weekKey() {
  const n = new Date(), f = new Date(n.getFullYear(), 0, 1);
  const w = Math.ceil((((n - f) / 86400000) + f.getDay() + 1) / 7);
  return n.getFullYear() + '-W' + String(w).padStart(2, '0');
}

function addDays(base, n) {
  const d = new Date(base + 'T00:00:00'); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ─── FIREBASE PERSISTENCE ─────────────────────────────────────────────────────

/**
 * Guarda el estado en Firestore con debounce de 900ms.
 * Si Firebase no está listo no hace nada (no hay crash).
 */
function saveState() {
  if (!db || !userId) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    db.collection('users').doc(userId)
      .set({ state: JSON.stringify(state), updatedAt: new Date().toISOString() })
      .catch(err => console.error('[Firebase] Error al guardar:', err));
  }, 900);
}

/**
 * Carga el estado desde Firestore.
 * Usa autenticación anónima — el UID persiste en el navegador entre sesiones
 * gracias a la persistencia de Firebase Auth (IndexedDB).
 */
async function loadState() {
  if (!db || !auth) return;

  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        userId = user.uid;
        updateAuthUI(user);
        try {
          const doc = await db.collection('users').doc(userId).get();
          if (doc.exists && doc.data().state) {
            state = normalizeState(JSON.parse(doc.data().state));
          }
        } catch (err) {
          console.error('[Firebase] Error al cargar:', err);
        }
      } else {
        updateAuthUI(null);
      }
      resolve();
    });
  });
}

function updateAuthUI(user) {
  const loginBtn = document.getElementById('btn-login');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');
  const userPhoto = document.getElementById('user-photo');

  if (user) {
    loginBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    userName.textContent = user.displayName?.split(' ')[0] || 'Usuario';
    if (user.photoURL) { userPhoto.src = user.photoURL; }
  } else {
    loginBtn.style.display = 'flex';
    userInfo.style.display = 'none';
  }
}

async function signInWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithRedirect(provider);
  } catch (err) {
    console.error('[Firebase] Error al iniciar sesión:', err);
    showToast('Error al iniciar sesión con Google');
  }
}

async function handleRedirectResult() {
  try {
    const result = await auth.getRedirectResult();
    if (!result || !result.user) return;

    userId = result.user.uid;
    const doc = await db.collection('users').doc(userId).get();
    if (doc.exists && doc.data().state) {
      state = normalizeState(JSON.parse(doc.data().state));
    }
    syncDay(); syncWeek(); refreshAll();
    showToast('¡Bienvenida, ' + (result.user.displayName?.split(' ')[0] || '') + '!');
  } catch (err) {
    console.error('[Firebase] Error al iniciar sesión:', err);
    showToast('Error al iniciar sesión con Google');
  }
}

async function signOutUser() {
  if (!confirm('¿Cerrar sesión? Tus datos están guardados en la nube.')) return;
  await auth.signOut();
  userId = null;
  state = { ...DEFAULT_STATE };
  syncDay(); syncWeek(); refreshAll();
  showToast('Sesión cerrada');
}

// ─── LOADING OVERLAY ─────────────────────────────────────────────────────────

function hideLoading() {
  const el = document.getElementById('fb-loading');
  if (!el) return;
  el.classList.add('hidden');
  setTimeout(() => el.remove(), 500);
}

// ─── SYNC HELPERS ────────────────────────────────────────────────────────────

function syncDay() {
  if (state.pomDay !== today()) { state.pomDay = today(); state.pomSessions = 0; saveState(); }
}

function syncWeek() {
  if (state.weekKey !== weekKey()) { state.weekKey = weekKey(); state.weeklyProgress = { dt: 0, ti: 0, sim: 0 }; saveState(); }
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

function initTabs() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + target).classList.add('active');
    });
  });
  handleRedirectResult();
}

// ─── TOPICS ──────────────────────────────────────────────────────────────────

const openTopics = new Set(['dt-dt1']);
const openSubtopics = new Set(['dt-dt1-0']);

function splitInlineSubitems(text) {
  return String(text || '').split('·').map(s => s.trim()).filter(Boolean);
}

function normalizeTopicItem(item) {
  if (typeof item === 'string') {
    if (item.includes(':')) {
      const [titleRaw, restRaw = ''] = item.split(':');
      return { title: titleRaw.trim(), children: splitInlineSubitems(restRaw) };
    }
    return { title: item.trim(), children: [] };
  }
  if (item && typeof item === 'object') {
    return {
      title: String(item.title || item.name || '').trim(),
      children: Array.isArray(item.children) ? item.children.map(x => String(x).trim()).filter(Boolean) : []
    };
  }
  return { title: '', children: [] };
}

function getLeafIdsForTopic(topic) {
  const ids = [];
  topic.items.forEach((rawItem, idx) => {
    const item = normalizeTopicItem(rawItem);
    if (item.children.length) {
      item.children.forEach((_, j) => ids.push(topic.id + '-' + idx + '-' + j));
    } else {
      ids.push(topic.id + '-' + idx);
    }
  });
  return ids;
}

function getTopicNameById(subject, topicId) {
  if (!['dt', 'ti'].includes(subject)) return 'General';
  const topic = TOPICS[subject].find(t => t.id === topicId);
  return topic ? topic.name : '';
}

function refreshLogTopicSelect() {
  const subjectEl = document.getElementById('log-subject');
  const topicEl = document.getElementById('log-topic');
  if (!subjectEl || !topicEl) return;

  const subject = ['dt', 'ti', 'gen'].includes(subjectEl.value) ? subjectEl.value : 'gen';
  const previousValue = topicEl.value;
  topicEl.innerHTML = '';

  if (subject === 'gen') {
    topicEl.disabled = true;
    topicEl.innerHTML = '<option value="gen">General</option>';
    topicEl.value = 'gen';
    return;
  }

  topicEl.disabled = false;
  const freeOption = document.createElement('option');
  freeOption.value = 'gen';
  freeOption.textContent = 'Tema libre';
  topicEl.appendChild(freeOption);

  TOPICS[subject].forEach(topic => {
    const blockOption = document.createElement('option');
    blockOption.value = topic.id;
    blockOption.textContent = topic.name;
    topicEl.appendChild(blockOption);

    topic.items.forEach((rawItem, idx) => {
      const item = normalizeTopicItem(rawItem);
      if (!item.title) return;
      const unitOption = document.createElement('option');
      unitOption.value = topic.id + '::' + idx;
      unitOption.textContent = '↳ ' + item.title;
      topicEl.appendChild(unitOption);

      item.children.forEach((child, j) => {
        const childOption = document.createElement('option');
        childOption.value = topic.id + '::' + idx + '::' + j;
        childOption.textContent = '↳↳ ' + child;
        topicEl.appendChild(childOption);
      });
    });
  });

  const hasPrevious = Array.from(topicEl.options).some(o => o.value === previousValue);
  topicEl.value = hasPrevious ? previousValue : (topicEl.options[0]?.value || '');
}

function renderTopics() {
  ['dt', 'ti'].forEach(sub => {
    const container = document.getElementById('topics-' + sub);
    container.innerHTML = '';
    TOPICS[sub].forEach(t => {
      const leafIds = getLeafIdsForTopic(t);
      const allSubtopicsDone = leafIds.length ? leafIds.every(id => !!state.done[id]) : false;
      const diffMap = { high: 'Difícil', med: 'Medio', low: 'Fácil' };
      const topicKey = sub + '-' + t.id;

      const topicGroup = document.createElement('div');
      topicGroup.className = 'topic-group';

      const topicHeader = document.createElement('div');
      topicHeader.className = 'topic-header' + (allSubtopicsDone ? ' done' : '');
      topicHeader.innerHTML = `
        <span class="topic-toggle">▶</span>
        <div class="topic-info"><div class="topic-name">${t.name}</div></div>
        <div class="topic-diff diff-${t.diff}">${diffMap[t.diff]}</div>`;

      const topicList = document.createElement('div');
      topicList.className = 'topic-list';
      topicList.style.display = openTopics.has(topicKey) ? 'block' : 'none';
      topicHeader.querySelector('.topic-toggle').style.transform = openTopics.has(topicKey) ? 'rotate(90deg)' : 'rotate(0deg)';

      t.items.forEach((rawItem, idx) => {
        const item = normalizeTopicItem(rawItem);
        const subtopicKey = topicKey + '-' + idx;

        if (item.children.length) {
          const childIds = item.children.map((_, j) => t.id + '-' + idx + '-' + j);
          const allChildrenDone = childIds.every(id => !!state.done[id]);

          const subGroup = document.createElement('div');
          subGroup.className = 'subtopic-group';

          const subHeader = document.createElement('div');
          subHeader.className = 'subtopic-header' + (allChildrenDone ? ' done' : '');
          subHeader.innerHTML = `
            <span class="subtopic-toggle">▶</span>
            <div class="topic-info"><div class="topic-name">${item.title}</div></div>`;

          const subList = document.createElement('div');
          subList.className = 'subtopic-list';
          subList.style.display = openSubtopics.has(subtopicKey) ? 'block' : 'none';
          subHeader.querySelector('.subtopic-toggle').style.transform = openSubtopics.has(subtopicKey) ? 'rotate(90deg)' : 'rotate(0deg)';

          item.children.forEach((child, j) => {
            const id = t.id + '-' + idx + '-' + j;
            const done = !!state.done[id];
            const childEl = document.createElement('div');
            childEl.className = 'topic-item topic-item-l3' + (done ? ' done' : '');
            childEl.onclick = () => toggleSubtopic(id, sub);
            childEl.innerHTML = `
              <div class="topic-check">${done ? '✓' : ''}</div>
              <div class="topic-info"><div class="topic-name">${child}</div></div>`;
            subList.appendChild(childEl);
          });

          subHeader.onclick = (e) => {
            e.stopPropagation();
            const isOpen = subList.style.display !== 'none';
            subList.style.display = isOpen ? 'none' : 'block';
            subHeader.querySelector('.subtopic-toggle').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
            if (isOpen) openSubtopics.delete(subtopicKey); else openSubtopics.add(subtopicKey);
          };

          subGroup.appendChild(subHeader);
          subGroup.appendChild(subList);
          topicList.appendChild(subGroup);
          return;
        }

        const id = t.id + '-' + idx;
        const done = !!state.done[id];
        const div = document.createElement('div');
        div.className = 'topic-item' + (done ? ' done' : '');
        div.onclick = () => toggleSubtopic(id, sub);
        div.innerHTML = `
          <div class="topic-check">${done ? '✓' : ''}</div>
          <div class="topic-info"><div class="topic-name">${item.title}</div></div>`;
        topicList.appendChild(div);
      });

      topicHeader.onclick = (e) => {
        e.stopPropagation();
        const isOpen = topicList.style.display !== 'none';
        topicList.style.display = isOpen ? 'none' : 'block';
        topicHeader.querySelector('.topic-toggle').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
        if (isOpen) openTopics.delete(topicKey); else openTopics.add(topicKey);
      };

      topicGroup.appendChild(topicHeader);
      topicGroup.appendChild(topicList);
      container.appendChild(topicGroup);
    });
  });
  updateStats();
}

function toggleSubtopic(id, sub) {
  const was = !!state.done[id];
  state.done[id] = !was;
  if (!was && state.done[id]) state.weeklyProgress[sub] = (state.weeklyProgress[sub] || 0) + 1;
  if (was && !state.done[id]) state.weeklyProgress[sub] = Math.max((state.weeklyProgress[sub] || 0) - 1, 0);
  saveState(); renderTopics();
  if (state.done[id]) showToast('✓ Subtema completado');
}

function updateStats() {
  let dtDone = 0, tiDone = 0, dtTotal = 0, tiTotal = 0;
  TOPICS.dt.forEach(t => { const ids = getLeafIdsForTopic(t); dtTotal += ids.length; dtDone += ids.filter(id => !!state.done[id]).length; });
  TOPICS.ti.forEach(t => { const ids = getLeafIdsForTopic(t); tiTotal += ids.length; tiDone += ids.filter(id => !!state.done[id]).length; });

  const total = dtTotal + tiTotal, done = dtDone + tiDone;
  const pct = total ? Math.round(done / total * 100) : 0;

  document.getElementById('stat-total').textContent = pct + '%';
  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-remain').textContent = total - done;
  document.getElementById('badge-dt').textContent = dtDone + '/' + dtTotal;
  document.getElementById('badge-ti').textContent = tiDone + '/' + tiTotal;

  const pctDt = dtTotal ? Math.round(dtDone / dtTotal * 100) : 0;
  const pctTi = tiTotal ? Math.round(tiDone / tiTotal * 100) : 0;
  document.getElementById('fill-dt').style.width = pctDt + '%';
  document.getElementById('fill-ti').style.width = pctTi + '%';
  document.getElementById('pct-dt').textContent = pctDt + '%';
  document.getElementById('pct-ti').textContent = pctTi + '%';

  renderPlan(); renderWeeklyGoals();
}

// ─── COUNTDOWN ───────────────────────────────────────────────────────────────

function updateCountdown() {
  const diff = Math.max(new Date('2026-06-03T09:00:00') - new Date(), 0);
  document.getElementById('cd-days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}

// ─── POMODORO ────────────────────────────────────────────────────────────────

const MODES = { pomodoro: 25 * 60, short: 5 * 60, long: 15 * 60 };
const MLABEL = { pomodoro: 'Enfoque', short: 'Descanso', long: 'Descanso largo' };
let curMode = 'pomodoro', timeLeft = MODES.pomodoro, running = false, interval = null;

function setMode(m) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  curMode = m; timeLeft = MODES[m]; running = false; clearInterval(interval);
  document.getElementById('btn-start').textContent = 'Iniciar';
  document.getElementById('timer-mode-label').textContent = MLABEL[m];
  updateTimerDisplay();
}

function toggleTimer() {
  if (running) {
    clearInterval(interval); running = false;
    document.getElementById('btn-start').textContent = 'Reanudar';
  } else {
    running = true;
    document.getElementById('btn-start').textContent = 'Pausar';
    interval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(interval); running = false; timeLeft = 0;
        document.getElementById('btn-start').textContent = 'Iniciar';
        if (curMode === 'pomodoro') {
          state.pomSessions = Math.min((state.pomSessions || 0) + 1, 4);
          saveState(); updateSessionDots();
          showToast('Pomodoro completado. ¡Descansa!');
        } else {
          showToast('Descanso terminado. ¡A estudiar!');
        }
      }
      updateTimerDisplay();
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(interval); running = false; timeLeft = MODES[curMode];
  document.getElementById('btn-start').textContent = 'Iniciar';
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
  document.getElementById('timer-display').textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  const pct = timeLeft / MODES[curMode];
  document.getElementById('ring-fill').style.strokeDashoffset = 490.09 * (1 - pct);
}

function updateSessionDots() {
  const n = state.pomSessions || 0;
  for (let i = 0; i < 4; i++) document.getElementById('dot' + i).classList.toggle('filled', i < n);
  document.getElementById('pomodoro-counter').textContent = 'Sesión ' + (n + 1);
}

// ─── PLAN ─────────────────────────────────────────────────────────────────────

function daysLeft() {
  return Math.max(Math.ceil(Math.max(new Date('2026-06-03T09:00:00') - new Date(), 0) / 86400000), 1);
}

function getPendingLeafs() {
  const pending = [];
  ['dt', 'ti'].forEach(subject => {
    TOPICS[subject].forEach((topic, topicIdx) => {
      topic.items.forEach((rawItem, idx) => {
        const item = normalizeTopicItem(rawItem);
        if (item.children.length) {
          item.children.forEach((child, j) => {
            const id = topic.id + '-' + idx + '-' + j;
            if (!state.done[id]) {
              pending.push({
                id,
                subject,
                diff: topic.diff,
                topicName: topic.name,
                unitName: item.title,
                leafName: child,
                topicOrder: topicIdx,
                unitOrder: idx,
                leafOrder: j
              });
            }
          });
        } else {
          const id = topic.id + '-' + idx;
          if (!state.done[id]) {
            pending.push({
              id,
              subject,
              diff: topic.diff,
              topicName: topic.name,
              unitName: item.title,
              leafName: item.title,
              topicOrder: topicIdx,
              unitOrder: idx,
              leafOrder: 0
            });
          }
        }
      });
    });
  });
  return pending;
}

function renderPlan(opts = {}) {
  const manual = !!opts.manual;
  const pending = getPendingLeafs();

  const pace = pending.length / daysLeft();
  const badge = document.getElementById('pace-risk');
  const msg = document.getElementById('pace-msg');

  badge.className = 'badge';
  if (pace > 1.2) { badge.classList.add('badge-wine'); badge.textContent = 'Riesgo alto'; }
  else if (pace > 0.7) { badge.classList.add('badge-terra'); badge.textContent = 'Ritmo ajustado'; }
  else { badge.classList.add('badge-sage'); badge.textContent = 'Ritmo OK'; }

  msg.textContent = pending.length
    ? `${pending.length} subtemas pendientes · ${pace.toFixed(2)} subtemas/día necesarios hasta el examen.${manual ? ` Actualizado ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}` : ''}`
    : '¡Todo el temario cubierto! Centra el esfuerzo en simulacros y repasos.';

  const due = state.mistakes.filter(m => m.nextReview <= today()).length;
  const list = document.getElementById('plan-list');
  list.innerHTML = '';
  const actions = [];
  if (due > 0) actions.push(`Repasar ${due} error${due > 1 ? 'es' : ''} pendiente${due > 1 ? 's' : ''}`);

  const diffScore = { high: 3, med: 2, low: 1 };
  const byTemarioOrder = (a, b) =>
    (a.topicOrder - b.topicOrder) ||
    (a.unitOrder - b.unitOrder) ||
    (a.leafOrder - b.leafOrder);

  const ranked = [...pending].sort((a, b) => {
    // TI-II siempre se sugiere por orden natural del temario.
    if (a.subject === 'ti' && b.subject === 'ti') return byTemarioOrder(a, b);

    // Mantiene el criterio anterior para el resto (prioridad por dificultad).
    const diffCmp = diffScore[b.diff] - diffScore[a.diff];
    if (diffCmp !== 0) return diffCmp;

    return byTemarioOrder(a, b);
  });

  if (manual) {
    // Al refrescar manualmente, solo baraja DT para variar sugerencias;
    // TI conserva el orden del temario.
    const dtIndexes = [];
    const dtItems = [];
    ranked.forEach((item, i) => {
      if (item.subject === 'dt') {
        dtIndexes.push(i);
        dtItems.push(item);
      }
    });
    dtItems.sort(() => Math.random() - 0.5);
    dtIndexes.forEach((idx, i) => {
      ranked[idx] = dtItems[i];
    });
  }

  const seen = new Set();
  const picks = [];
  const pushPick = (p) => {
    const label = (p.subject === 'dt' ? 'DT-II' : 'TI-II') + ': ' + p.topicName + ' · ' + p.unitName;
    if (seen.has(label)) return false;
    seen.add(label);
    picks.push(label);
    return true;
  };

  // Si hay pendientes en ambas materias, garantiza presencia de las dos.
  const hasDtPending = ranked.some(p => p.subject === 'dt');
  const hasTiPending = ranked.some(p => p.subject === 'ti');
  if (hasDtPending && hasTiPending) {
    const firstTi = ranked.find(p => p.subject === 'ti');
    const firstDt = ranked.find(p => p.subject === 'dt');
    if (firstTi) pushPick(firstTi);
    if (firstDt) pushPick(firstDt);
  }

  ranked.forEach(p => {
    if (picks.length >= Math.max(4 - actions.length, 0)) return;
    pushPick(p);
  });

  picks.slice(0, Math.max(4 - actions.length, 0)).forEach(label => actions.push(label));

  if (!actions.length) actions.push('Todo al día — buen momento para un simulacro completo.');
  actions.forEach(text => {
    const el = document.createElement('div'); el.className = 'plan-item'; el.textContent = text;
    list.appendChild(el);
  });
}

// ─── WEEKLY GOALS ────────────────────────────────────────────────────────────

function renderWeeklyGoals() {
  document.getElementById('week-key-label').textContent = state.weekKey;
  document.getElementById('goal-dt').value = state.weeklyGoals.dt;
  document.getElementById('goal-ti').value = state.weeklyGoals.ti;
  document.getElementById('goal-sim').value = state.weeklyGoals.sim;

  const container = document.getElementById('goal-progress');
  container.innerHTML = '';
  const items = [
    { label: 'DT-II', val: state.weeklyProgress.dt, goal: state.weeklyGoals.dt, cls: '' },
    { label: 'TI-II', val: state.weeklyProgress.ti, goal: state.weeklyGoals.ti, cls: 'terra' },
    { label: 'Simulacros', val: state.weeklyProgress.sim, goal: state.weeklyGoals.sim, cls: 'wine' },
  ];
  items.forEach(item => {
    const pct = Math.min(Math.round((item.val / Math.max(item.goal, 1)) * 100), 100);
    const row = document.createElement('div'); row.className = 'goal-bar-row';
    row.innerHTML = `
      <div class="goal-bar-label"><span>${item.label}</span><span>${item.val} / ${item.goal} · ${pct}%</span></div>
      <div class="goal-bar-track"><div class="goal-bar-fill ${item.cls}" style="width:${pct}%"></div></div>`;
    container.appendChild(row);
  });
}

function saveWeeklyGoals() {
  state.weeklyGoals.dt = clamp(document.getElementById('goal-dt').value, 0, 20, 4);
  state.weeklyGoals.ti = clamp(document.getElementById('goal-ti').value, 0, 20, 4);
  state.weeklyGoals.sim = clamp(document.getElementById('goal-sim').value, 0, 10, 1);
  saveState(); renderWeeklyGoals(); showToast('Objetivos actualizados');
}

// ─── LOG ─────────────────────────────────────────────────────────────────────

function addLog() {
  const input = document.getElementById('log-input');
  const sub = ['dt', 'ti', 'gen'].includes(document.getElementById('log-subject').value)
    ? document.getElementById('log-subject').value : 'gen';
  const topicEl = document.getElementById('log-topic');
  const text = input.value.trim();
  if (!text) return;

  let topicId = 'gen', topicLabel = 'General';
  if (sub !== 'gen') {
    topicId = topicEl?.value || '';
    if (topicId === 'gen') {
      topicLabel = 'General';
    } else if (topicId.includes('::')) {
      topicLabel = (topicEl?.selectedOptions?.[0]?.textContent || '').replace(/^↳\s*/, '').trim() || 'Unidad';
    } else {
      topicLabel = topicEl?.selectedOptions?.[0]?.textContent?.trim() || getTopicNameById(sub, topicId) || 'Tema';
    }
  }

  const n = new Date();
  state.logs.unshift({
    id: Date.now().toString(36) + '-' + Math.floor(Math.random() * 99999),
    text, subject: sub, topicId, topicLabel,
    time: n.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    date: n.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
  });
  if (state.logs.length > MAX_LOGS) state.logs = state.logs.slice(0, MAX_LOGS);
  input.value = ''; saveState(); renderLogs(); renderPlan();
}

function clearLogs() {
  if (!state.logs.length) { showToast('No hay entradas que borrar'); return; }
  if (!confirm('¿Borrar todas las entradas del diario?')) return;
  state.logs = []; saveState(); renderLogs(); showToast('Diario limpiado');
}

function deleteLog(id) {
  const idx = state.logs.findIndex(l => l.id === id);
  if (idx < 0) return;
  state.logs.splice(idx, 1);
  saveState(); renderLogs(); showToast('Entrada eliminada');
}

function renderLogs() {
  const c = document.getElementById('log-entries');
  document.getElementById('badge-log').textContent = state.logs.length + ' entradas';
  document.getElementById('log-cap-counter').textContent = state.logs.length + '/200';

  if (!state.logs.length) {
    c.innerHTML = '<div class="empty-state" id="log-empty">Todavía no hay entradas. ¡Empieza a estudiar!</div>';
    return;
  }
  c.innerHTML = '';
  const sub = { 'dt': 'DT-II', 'ti': 'TI-II', 'gen': 'General' };
  state.logs.slice(0, 40).forEach(log => {
    const safe = ['dt', 'ti', 'gen'].includes(log.subject) ? log.subject : 'gen';
    const topicText = safe === 'gen' ? 'General' : (log.topicLabel || getTopicNameById(safe, log.topicId) || 'Tema sin indicar');
    const el = document.createElement('div'); el.className = 'log-entry';
    el.innerHTML = `<div class="log-dot ${safe}"></div>
      <div class="log-body">
        <div class="log-meta">${log.date || ''} · ${log.time || ''} · ${sub[safe]} · ${topicText}</div>
        <div class="log-text">${log.text || ''}</div>
      </div>
      <button class="btn btn-ghost btn-sm log-delete" data-action="delete-log" data-id="${log.id}">Eliminar</button>`;
    c.appendChild(el);
  });
}

// ─── MISTAKES ────────────────────────────────────────────────────────────────

function addMistake() {
  const sub = ['dt', 'ti', 'gen'].includes(document.getElementById('mistake-subject').value)
    ? document.getElementById('mistake-subject').value : 'gen';
  const input = document.getElementById('mistake-input');
  const text = input.value.trim();
  if (!text) return;
  state.mistakes.unshift({
    id: Date.now().toString(36) + '-' + Math.floor(Math.random() * 99999),
    text, subject: sub, created: today(), stage: 0, nextReview: today()
  });
  if (state.mistakes.length > MAX_MISTAKES) state.mistakes = state.mistakes.slice(0, MAX_MISTAKES);
  input.value = ''; saveState(); renderMistakes();
}

function markReviewed(id) {
  const m = state.mistakes.find(x => x.id === id);
  if (!m) return;
  m.stage = clamp(m.stage + 1, 0, 99, 1);
  m.nextReview = m.stage > REVIEW_STEPS.length ? '9999-12-31' : addDays(today(), REVIEW_STEPS[m.stage - 1]);
  saveState(); renderMistakes();
}

function deleteMistake(id) {
  const i = state.mistakes.findIndex(x => x.id === id);
  if (i < 0) return;
  state.mistakes.splice(i, 1);
  saveState(); renderMistakes(); renderPlan(); showToast('Error eliminado');
}

function renderMistakes() {
  const due = state.mistakes.filter(m => m.nextReview <= today()).slice(0, 30);
  document.getElementById('due-count').textContent = due.length + ' hoy';
  const c = document.getElementById('mistake-due'); c.innerHTML = '';
  if (!due.length) { c.innerHTML = '<div class="empty-state">Sin repasos pendientes por hoy</div>'; return; }
  const labels = { 'dt': 'DT-II', 'ti': 'TI-II', 'gen': 'General' };
  due.forEach(m => {
    const el = document.createElement('div'); el.className = 'mistake-item';
    el.innerHTML = `<div class="mistake-left">
      <div class="mistake-text">${m.text}</div>
      <div class="mistake-meta">${labels[m.subject] || 'General'} · repaso nº ${m.stage + 1}</div>
    </div>
    <div class="mistake-actions">
      <button class="btn btn-sage btn-sm" data-action="review" data-id="${m.id}">Hecho ✓</button>
      <button class="btn btn-ghost btn-sm" data-action="delete-mistake" data-id="${m.id}">Eliminar</button>
    </div>`;
    c.appendChild(el);
  });
  renderPracticeOverview();
}

// ─── MOCK ────────────────────────────────────────────────────────────────────

function updateMockDisplay() {
  const m = Math.floor(mockTimeLeft / 60), s = mockTimeLeft % 60;
  document.getElementById('mock-display').textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function setMockDuration(minutes) {
  if (mockRunning) return;
  mockTimeLeft = clamp(minutes, 30, 240, 90) * 60; updateMockDisplay();
}

function toggleMockTimer() {
  const btn = document.getElementById('mock-start');
  if (mockRunning) { clearInterval(mockInterval); mockRunning = false; btn.textContent = 'Reanudar'; return; }
  mockRunning = true; btn.textContent = 'Pausar';
  mockInterval = setInterval(() => {
    mockTimeLeft--;
    if (mockTimeLeft <= 0) { mockTimeLeft = 0; clearInterval(mockInterval); mockRunning = false; btn.textContent = 'Iniciar'; showToast('Tiempo de simulacro agotado'); }
    updateMockDisplay();
  }, 1000);
}

function resetMockTimer() {
  clearInterval(mockInterval); mockRunning = false;
  document.getElementById('mock-start').textContent = 'Iniciar';
  setMockDuration(clamp(document.getElementById('mock-duration').value, 30, 240, 90));
}

function completeMock() {
  const score = clamp(document.getElementById('mock-score').value, 0, 10, -1);
  if (score < 0) { showToast('Introduce una nota entre 0 y 10'); return; }
  const dur = clamp(document.getElementById('mock-duration').value, 30, 240, 90);
  state.mockExams.unshift({ date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }), duration: dur, score });
  if (state.mockExams.length > MAX_MOCKS) state.mockExams = state.mockExams.slice(0, MAX_MOCKS);
  state.weeklyProgress.sim = (state.weeklyProgress.sim || 0) + 1;
  document.getElementById('mock-score').value = '';
  saveState(); renderMockStats(); renderWeeklyGoals();
  showToast('Simulacro registrado · ' + score + '/10');
}

function renderMockStats() {
  document.getElementById('mock-count').textContent = state.mockExams.length + ' realizados';
  const c = document.getElementById('mock-stats'); c.innerHTML = '';
  if (!state.mockExams.length) { c.innerHTML = '<div class="empty-state">Aún no hay simulacros registrados.</div>'; renderPracticeOverview(); return; }
  const last = state.mockExams.slice(0, 5);
  const avg = (last.reduce((a, x) => a + x.score, 0) / last.length).toFixed(1);
  const avgEl = document.createElement('div'); avgEl.className = 'mock-avg';
  avgEl.textContent = `Media (últimos ${last.length}): ${avg} / 10`;
  c.appendChild(avgEl);
  last.forEach(e => {
    const el = document.createElement('div'); el.className = 'mock-history-item';
    el.innerHTML = `<span>${e.date} · ${e.duration} min</span><span class="mock-score-badge">${e.score}<small style="font-size:14px;opacity:.6">/10</small></span>`;
    c.appendChild(el);
  });
  renderPracticeOverview();
}

function renderPracticeOverview() {
  const due = state.mistakes.filter(m => m.nextReview <= today()).length;
  const active = state.mistakes.filter(m => {
    const hasText = typeof m.text === 'string' && m.text.trim().length > 0;
    const inCycle = Number.isFinite(Number(m.stage)) && Number(m.stage) <= REVIEW_STEPS.length;
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(String(m.nextReview || ''));
    return hasText && inCycle && validDate && m.nextReview !== '9999-12-31';
  }).length;
  const recent = state.mockExams.slice(0, 5);
  const avg = recent.length ? (recent.reduce((a, x) => a + x.score, 0) / recent.length).toFixed(1) : '--';

  const dueEl = document.getElementById('practice-due');
  const activeEl = document.getElementById('practice-active');
  const avgEl = document.getElementById('practice-avg');
  if (dueEl) dueEl.textContent = String(due);
  if (activeEl) activeEl.textContent = String(active);
  if (avgEl) avgEl.textContent = avg === '--' ? avg : `${avg}/10`;
}

// ─── CHECKLIST ───────────────────────────────────────────────────────────────

function renderChecklist() {
  let done = 0;
  document.querySelectorAll('.exam-check').forEach(i => { i.checked = !!state.examChecklist[i.dataset.check]; if (i.checked) done++; });
  document.getElementById('check-progress').textContent = done + '/5';
}

function updateChecklist() {
  document.querySelectorAll('.exam-check').forEach(i => { state.examChecklist[i.dataset.check] = !!i.checked; });
  saveState(); renderChecklist();
}

// ─── EXAM BANK ───────────────────────────────────────────────────────────────

function renderExamBank() {
  const sub = document.getElementById('bank-subject').value;
  const yr = document.getElementById('bank-year').value;
  const conv = document.getElementById('bank-convocatoria').value;
  const rows = EXAM_BANK.filter(e => (sub === 'all' || e.subject === sub) && (yr === 'all' || e.year === yr) && (conv === 'all' || e.convocatoria === conv));
  document.getElementById('bank-count').textContent = rows.length + ' resultados';
  const c = document.getElementById('bank-list'); c.innerHTML = '';
  if (!rows.length) { c.innerHTML = '<div class="empty-state">Sin resultados con estos filtros.</div>'; return; }
  const labels = { 'dt': 'DT-II', 'ti': 'TI-II' };
  const convLabels = { ordinaria: 'Ordinaria', extraordinaria: 'Extraordinaria', coincidencias: 'Coincidencias', modelo: 'Modelo' };
  rows.forEach(item => {
    const el = document.createElement('div'); el.className = 'bank-item';
    el.innerHTML = `<div class="bank-item-title">${item.title}</div>
      <div class="bank-meta">${labels[item.subject]} · ${item.region} · ${item.year} · ${convLabels[item.convocatoria] || 'Convocatoria'}</div>
      <a class="bank-link" href="${item.url}" target="_blank" rel="noopener noreferrer">Abrir →</a>`;
    c.appendChild(el);
  });
}

// ─── BACKUP ──────────────────────────────────────────────────────────────────

function exportBackup() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }));
  a.download = 'evau-backup-' + today() + '.json'; a.click();
}

function importBackupFile(file) {
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      state = normalizeState(JSON.parse(String(r.result || '{}')));
      syncDay(); syncWeek(); saveState(); refreshAll();
      showToast('Backup importado correctamente');
    } catch (e) { showToast('No se pudo importar el archivo'); }
  };
  r.readAsText(file);
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('notif');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

// ─── REFRESH ALL ─────────────────────────────────────────────────────────────

function refreshAll() {
  renderTopics(); renderLogs(); renderMistakes(); renderMockStats();
  renderChecklist(); renderExamBank(); updateTimerDisplay();
  updateSessionDots(); updateCountdown(); updateMockDisplay();
  refreshLogTopicSelect();
}

// ─── EVENTS ──────────────────────────────────────────────────────────────────

function bindEvents() {
  document.querySelectorAll('.mode-btn').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  document.getElementById('btn-start').addEventListener('click', toggleTimer);
  document.getElementById('btn-reset').addEventListener('click', resetTimer);
  document.getElementById('log-add').addEventListener('click', addLog);
  document.getElementById('log-clear').addEventListener('click', clearLogs);
  document.getElementById('log-input').addEventListener('keydown', e => { if (e.key === 'Enter') addLog(); });
  document.getElementById('log-subject').addEventListener('change', refreshLogTopicSelect);
  document.getElementById('log-entries').addEventListener('click', e => {
    if (e.target.dataset.action === 'delete-log') deleteLog(e.target.dataset.id);
  });
  document.getElementById('plan-refresh').addEventListener('click', () => {
    renderPlan({ manual: true });
    showToast('Plan actualizado');
  });
  document.getElementById('goals-save').addEventListener('click', saveWeeklyGoals);
  document.getElementById('mistake-add').addEventListener('click', addMistake);
  document.getElementById('mistake-input').addEventListener('keydown', e => { if (e.key === 'Enter') addMistake(); });
  document.getElementById('mock-duration').addEventListener('change', e => setMockDuration(e.target.value));
  document.getElementById('mock-start').addEventListener('click', toggleMockTimer);
  document.getElementById('mock-reset').addEventListener('click', resetMockTimer);
  document.getElementById('mock-complete').addEventListener('click', completeMock);
  document.getElementById('backup-export').addEventListener('click', exportBackup);
  document.getElementById('backup-import').addEventListener('click', () => document.getElementById('backup-file').click());
  document.getElementById('backup-file').addEventListener('change', e => { importBackupFile(e.target.files[0]); e.target.value = ''; });
  ['bank-subject', 'bank-year', 'bank-convocatoria'].forEach(id => document.getElementById(id).addEventListener('change', renderExamBank));
  document.querySelectorAll('.exam-check').forEach(i => i.addEventListener('change', updateChecklist));
  document.getElementById('mistake-due').addEventListener('click', e => {
    if (e.target.dataset.action === 'review') markReviewed(e.target.dataset.id);
    if (e.target.dataset.action === 'delete-mistake') deleteMistake(e.target.dataset.id);
  });
  document.getElementById('btn-login').addEventListener('click', signInWithGoogle);
  document.getElementById('btn-logout').addEventListener('click', signOutUser);
}

// ─── INIT (async) ─────────────────────────────────────────────────────────────

async function init() {
  const ok = firebaseReady();

  if (ok) {
    await loadState();          // espera a que Firebase cargue los datos
  }

  syncDay(); syncWeek();
  initTabs(); bindEvents(); refreshAll();
  hideLoading();                // oculta el overlay
  setInterval(updateCountdown, 1000);
}

init();