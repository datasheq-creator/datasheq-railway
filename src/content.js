/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENIDO DEL SITIO (ES / EN)  ·  SITE CONTENT (ES / EN)
 *  Edita aquí textos, datos de contacto, planes, equipo, módulos y noticias.
 *  Todo lo marcado con "EDITAR" es un borrador o dato provisorio.
 *  (Everything marked "EDITAR" is draft/placeholder content to confirm.)
 *  The page and both emails read from this file — restart the server after editing.
 * ─────────────────────────────────────────────────────────────
 */

const settings = {
  brand: 'DATASHEQ',

  // Botón "Inicio de Sesión" del header
  loginUrl: 'https://app.datasheq.com',

  contact: {
    whatsappNumber: '56958961796', // con código de país, sin espacios ni "+"
    whatsappDisplay: '+56 9 5896 1796',
    email: 'contacto@datasheq.com',
    address: 'Baquedano 50, of. 709, Antofagasta',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Baquedano+50+Antofagasta+Chile',
  },

  app: {
    // EDITAR: enlaces reales de las tiendas. Los íconos y los códigos QR apuntan a /app/ios y /app/android,
    // que redirigen aquí; mientras estén vacíos, llevan a la sección "Descarga nuestra app".
    appStoreUrl: '',
    googlePlayUrl: '',
  },
};

const t = (es, en) => ({ es, en });

/* ───────────────────────── Equipo (sección Nosotros) ───────────────────────── */
const team = [
  { name: 'Constanza Lores', photo: 'constanza-lores', role: t('Control de Gestión', 'Management Control') },
  { name: 'Victor Achurra', photo: 'victor-achurra', role: t('Comercial & Tech', 'Sales & Tech') },
  { name: 'Paulina Espinoza', photo: 'paulina-espinoza', role: t('Finanzas & RRHH', 'Finance & HR') },
  { name: 'Francisca Wiegold', photo: 'francisca-wiegold', role: t('Diseño & Marketing', 'Design & Marketing') },
];

/* ───────────────────────── C-Legal: 01 / 02 / 03 ───────────────────────── */
// En "pains", **texto** se muestra en negrita.
const why = {
  pains: t(
    [
      'Información legal **dispersa**',
      'Procesos de verificación **manuales**',
      '**Dificultad** para identificar brechas',
      '**Poco seguimiento** de acciones',
      '**Horas** destinadas a tareas administrativas',
    ],
    [
      '**Scattered** legal information',
      '**Manual** verification processes',
      '**Hard** to spot compliance gaps',
      '**Little follow-up** on actions',
      '**Hours** spent on admin tasks',
    ]
  ),
  features: t(
    ['Repositorio legal', 'Verificación', 'Matrices', 'Planes de acción', 'Reportes', 'Dashboards'],
    ['Legal repository', 'Verification', 'Matrices', 'Action plans', 'Reports', 'Dashboards']
  ),
  benefits: [
    { icon: 'robot', title: t('Inteligencia', 'Intelligence'), text: t('IA aplicada a la gestión del cumplimiento.', 'AI applied to compliance management.') },
    { icon: 'chart', title: t('Visibilidad', 'Visibility'), text: t('Indicadores y analítica para conocer tu nivel de cumplimiento.', 'Indicators and analytics that show your compliance level.') },
    { icon: 'bolt', title: t('Eficiencia', 'Efficiency'), text: t('Automatiza tareas y reduce el trabajo operativo.', 'Automate tasks and cut operational work.') },
    { icon: 'shield', title: t('Prevención', 'Prevention'), text: t('Identifica brechas y actúa antes de que se conviertan en problemas.', 'Spot gaps and act before they become problems.') },
  ],
};

/* ───────────────────────── Planes ───────────────────────── */
// price: texto del precio; soon: true muestra "— próximamente"; off: ítem no incluido (gris)
// cta: 'free' | 'buy' | 'contact'
const plans = [
  {
    id: 'libre',
    name: t('Libre', 'Free'),
    price: '$0',
    period: t('/ 30 días', '/ 30 days'),
    cta: 'free',
    features: [
      t('App móvil', 'Mobile app'),
      t('1 usuario', '1 user'),
      t('1 verificación legal', '1 legal verification'),
      t('1 informe legal', '1 legal report'),
      t('Plan de acción', 'Action plan'),
      { off: true, ...t('Matriz legal', 'Legal matrix') },
    ],
  },
  {
    id: 'basico',
    name: t('Básico', 'Basic'),
    price: '$29.990 - $39.990',
    recommended: true,
    cta: 'buy',
    features: [
      t('App móvil', 'Mobile app'),
      t('2 usuarios', '2 users'),
      t('1 empresa / 1 instalación', '1 company / 1 site'),
      t('Verificaciones ilimitadas', 'Unlimited verifications'),
      t('Informes ilimitados', 'Unlimited reports'),
      t('Plan de acción + responsables', 'Action plan + owners'),
      t('Logotipo en documentos', 'Logo on documents'),
      t('Matriz legal', 'Legal matrix'),
    ],
  },
  {
    id: 'profesional',
    name: t('Profesional', 'Professional'),
    soon: true,
    highlight: true,
    cta: 'contact',
    features: [
      t('App móvil + administrador', 'Mobile app + admin'),
      t('20 usuarios', '20 users'),
      t('1 empresa / 5 instalaciones', '1 company / 5 sites'),
      t('Verificaciones ilimitadas', 'Unlimited verifications'),
      t('Informes ilimitados', 'Unlimited reports'),
      t('Plantillas de VL personalizables', 'Customisable VL templates'),
      t('Logotipo en documentos', 'Logo on documents'),
      t('Matriz legal', 'Legal matrix'),
    ],
  },
  {
    id: 'empresa',
    name: t('Empresa', 'Enterprise'),
    soon: true,
    cta: 'contact',
    features: [
      t('App móvil + administrador', 'Mobile app + admin'),
      t('50 usuarios', '50 users'),
      t('2 empresas / 10 instalaciones', '2 companies / 10 sites'),
      t('Verificaciones ilimitadas', 'Unlimited verifications'),
      t('Informes ilimitados', 'Unlimited reports'),
      t('Plantillas de VL personalizables', 'Customisable VL templates'),
      t('Actualizaciones legales', 'Legal updates'),
    ],
  },
];

/* ───────────────────────── Módulos de la solución integral ───────────────────────── */
const modules = [
  {
    id: 'c-legal',
    name: 'C-Legal',
    icon: 'legal',
    subtitle: t('Cumplimiento Legal', 'Legal Compliance'),
    desc: t(
      'Identifica la normativa aplicable a tu operación, evalúa su cumplimiento artículo por artículo y genera informes en PDF.',
      'Identify the regulations that apply to your operation, assess compliance article by article and generate PDF reports.'
    ),
  },
  {
    id: 'c-controla',
    name: 'C-Controla',
    icon: 'controla',
    subtitle: t('Control Documental', 'Document Control'),
    desc: t(
      'Controla versiones, aprobaciones y vigencias de procedimientos, registros y documentos críticos.',
      'Control versions, approvals and expiry dates of procedures, records and critical documents.'
    ),
  },
  {
    id: 'c-previene',
    name: 'C-Previene',
    icon: 'previene',
    // EDITAR: en el PDF figura "Gestor Documental" (similar a C-Controla). Confirmar subtítulo.
    subtitle: t('Gestor Documental', 'Document Manager'),
    desc: t(
      'Centraliza la documentación preventiva: matrices de riesgo, procedimientos de trabajo seguro y planes de emergencia.',
      'Centralise preventive documentation: risk matrices, safe work procedures and emergency plans.'
    ),
  },
  {
    id: 'c-lidera',
    name: 'C-Lidera',
    icon: 'lidera',
    subtitle: t('Programas de Liderazgo', 'Leadership Programmes'),
    desc: t(
      'Planifica y da seguimiento a programas de liderazgo en seguridad: caminatas, observaciones y compromisos de la línea de mando.',
      'Plan and track safety leadership programmes: walkthroughs, observations and line-management commitments.'
    ),
  },
  {
    id: 'c-acredita',
    name: 'C-Acredita',
    icon: 'acredita',
    subtitle: t('Gestión del personal', 'Workforce Management'),
    desc: t(
      'Gestiona la acreditación de trabajadores y contratistas: documentos, exámenes, cursos y vencimientos en un solo lugar.',
      'Manage worker and contractor accreditation: documents, medical exams, courses and expiry dates in one place.'
    ),
  },
  {
    id: 'c-capacita',
    name: 'C-Capacita',
    icon: 'capacita',
    subtitle: t('Gestor del conocimiento', 'Knowledge Management'),
    desc: t(
      'Organiza capacitaciones, evaluaciones y el conocimiento de tu organización, con registro de asistencia y certificados.',
      'Organise training, assessments and company know-how, with attendance records and certificates.'
    ),
  },
  {
    id: 'c-investiga',
    name: 'C-Investiga',
    icon: 'investiga',
    subtitle: t('Reportabilidad e Incidentes', 'Reporting & Incidents'),
    desc: t(
      'Reporta incidentes desde terreno, investiga sus causas y haz seguimiento a las acciones correctivas.',
      'Report incidents from the field, investigate root causes and follow up on corrective actions.'
    ),
  },
];

/* ───────────────────────── Noticias ───────────────────────── */
// "body" se muestra al hacer clic en "Leer más". EDITAR: textos de las notas son borradores.
const news = [
  {
    id: 'decreto-44',
    badge: '44',
    tag: t('Legal', 'Legal'),
    date: t('27 Jul 2024', '27 Jul 2024'),
    title: t('Nuevo Decreto 44: cambios en planes de emergencia', 'New Decree 44: changes to emergency plans'),
    excerpt: t(
      'Revisa qué cambió y cómo actualizar tus verificaciones legales para seguir cumpliendo.',
      'See what changed and how to update your legal checks to stay compliant.'
    ),
    body: t(
      [
        'El Decreto Supremo N° 44 actualiza el marco de gestión preventiva de los riesgos laborales e introduce nuevas exigencias que impactan, entre otros, a los planes de emergencia de las empresas.',
        'En C-Legal puedes revisar el decreto artículo por artículo, marcar qué aplica a tu operación y registrar su cumplimiento con evidencia, para llegar preparado a cualquier fiscalización.',
        '¿Quieres saber cómo impacta a tu empresa? Escríbenos y te mostramos cómo verificarlo en terreno.',
      ],
      [
        'Supreme Decree No. 44 updates the framework for preventive management of occupational risks and introduces new requirements that affect, among other things, company emergency plans.',
        'In C-Legal you can review the decree article by article, flag what applies to your operation and record compliance with evidence, so you are ready for any inspection.',
        'Want to know how it affects your company? Contact us and we will show you how to verify it on site.',
      ]
    ),
  },
  {
    id: 'ds-78',
    badge: '78',
    tag: t('Legal', 'Legal'),
    date: t('11 Sep 2010', '11 Sep 2010'),
    title: t('DS 78/2010: lo esencial para operaciones portuarias', 'DS 78/2010: the essentials for port operations'),
    excerpt: t(
      'Guía rápida de los artículos más fiscalizados en puertos y cómo verificarlos en terreno.',
      'A quick guide to the most inspected articles in ports and how to verify them on site.'
    ),
    body: t(
      [
        'Las operaciones portuarias concentran exigencias normativas específicas y son foco frecuente de fiscalización.',
        'Con C-Legal puedes cargar el DS 78/2010 como parte de tu matriz legal, asignar responsables por artículo y generar un informe de cumplimiento en PDF directamente desde la app.',
        'Solicita una demo y te mostramos un ejemplo aplicado a tu operación.',
      ],
      [
        'Port operations are subject to specific regulatory requirements and are a frequent focus of inspections.',
        'With C-Legal you can add DS 78/2010 to your legal matrix, assign owners per article and generate a PDF compliance report straight from the app.',
        'Request a demo and we will walk you through an example based on your operation.',
      ]
    ),
  },
  {
    id: 'c-legal-070',
    badge: 'v0.7',
    tag: t('App', 'App'),
    date: t('Novedad', 'New'),
    title: t('C-Legal v0.7.0: nueva gestión de suscripciones', 'C-Legal v0.7.0: new subscription management'),
    excerpt: t(
      'Ahora los clientes administran su plan y usuarios desde el panel, con onboarding digital.',
      'Customers can now manage their plan and users from the dashboard, with digital onboarding.'
    ),
    body: t(
      [
        'La versión 0.7.0 de C-Legal incorpora la gestión de suscripciones desde el panel de administración.',
        'Ahora cada cliente puede administrar su plan, agregar o quitar usuarios y completar un onboarding 100% digital, sin trámites adicionales.',
        'Si ya eres cliente, actualiza la app para acceder a estas funciones.',
      ],
      [
        'C-Legal version 0.7.0 adds subscription management to the admin dashboard.',
        'Each customer can now manage their plan, add or remove users and complete a fully digital onboarding with no extra paperwork.',
        'If you are already a customer, update the app to access these features.',
      ]
    ),
  },
];

/* ───────────────────────── Opciones del formulario ───────────────────────── */
const industries = [
  { id: 'mineria', label: t('Minería', 'Mining') },
  { id: 'construccion', label: t('Construcción', 'Construction') },
  { id: 'energia', label: t('Energía', 'Energy') },
  { id: 'portuaria', label: t('Portuaria y logística', 'Ports & logistics') },
  { id: 'manufactura', label: t('Manufactura e industria', 'Manufacturing & industry') },
  { id: 'transporte', label: t('Transporte', 'Transport') },
  { id: 'agroindustria', label: t('Agroindustria y pesca', 'Agribusiness & fishing') },
  { id: 'salud', label: t('Salud', 'Healthcare') },
  { id: 'servicios', label: t('Servicios', 'Services') },
  { id: 'publico', label: t('Sector público', 'Public sector') },
  { id: 'otra', label: t('Otra', 'Other') },
];

const companySizes = [
  { id: '1-50', label: t('1 – 50 trabajadores', '1 – 50 employees') },
  { id: '51-200', label: t('51 – 200 trabajadores', '51 – 200 employees') },
  { id: '201-1000', label: t('201 – 1.000 trabajadores', '201 – 1,000 employees') },
  { id: '1000+', label: t('Más de 1.000 trabajadores', 'More than 1,000 employees') },
];

const contactPreferences = [
  { id: 'email', label: t('Email', 'Email') },
  { id: 'phone', label: t('Llamada', 'Phone call') },
  { id: 'whatsapp', label: t('WhatsApp', 'WhatsApp') },
];

// Plan de interés (select del formulario). Se preselecciona al hacer clic en un plan.
const planOptions = [
  ...plans.map((p) => ({ id: p.id, label: p.name })),
  { id: 'no-se', label: t('Aún no lo sé', 'Not sure yet') },
];

/* ───────────────────────── Textos de la interfaz ───────────────────────── */
const ui = {
  meta_title: t('DATASHEQ — Gestión HSEQ digital e integral', 'DATASHEQ — Digital, integrated HSEQ management'),
  meta_description: t(
    'Centralizamos y simplificamos la gestión HSEQ en una plataforma inteligente que integra tecnología, IA y analítica avanzada.',
    'We centralise and simplify HSEQ management in an intelligent platform that combines technology, AI and advanced analytics.'
  ),
  tagline: t('Digitalización para todos', 'Digitalization for everyone'),

  // Header
  nav_home: t('Home', 'Home'),
  nav_solution: t('Nuestra solución', 'Our solution'),
  nav_news: t('Noticias', 'News'),
  nav_about: t('Nosotros', 'About us'),
  nav_login: t('Inicio de Sesión', 'Log in'),
  nav_contact: t('Contáctanos', 'Contact us'),
  nav_download: t('Descarga nuestra app', 'Download our app'),
  nav_menu: t('Menú', 'Menu'),
  lang_label: t('Idioma', 'Language'),
  back_to_top: t('Volver arriba', 'Back to top'),

  // Hero
  hero_title_1: t('Transformamos la gestión HSEQ en una ', 'We transform HSEQ management into a '),
  hero_title_hl: t('solución digital e Integral', 'digital, Integrated solution'),
  hero_title_2: t(', personalizada e intuitiva', ', personalised and intuitive'),
  hero_text: t(
    'Centralizamos y simplificamos la gestión HSEQ en una plataforma inteligente que integra tecnología, IA y analítica avanzada para optimizar procesos, anticipar riesgos y tomar mejores decisiones.',
    'We centralise and simplify HSEQ management in an intelligent platform that combines technology, AI and advanced analytics to optimise processes, anticipate risks and make better decisions.'
  ),
  hero_cta_primary: t('Soluciones', 'Solutions'),
  hero_cta_secondary: t('Contáctanos', 'Contact us'),
  hero_img_alt: t('Plataforma DATASHEQ en computador y aplicación móvil', 'DATASHEQ platform on a laptop and the mobile app'),

  // C-Legal
  clegal_title_1: t('C-Legal', 'C-Legal'),
  clegal_title_hl: t('Gestión Legal Inteligente', 'Smart Legal Management'),
  clegal_text: t(
    'Gestiona y controla el cumplimiento legal con IA, automatización y analítica avanzada.',
    'Manage and control legal compliance with AI, automation and advanced analytics.'
  ),
  clegal_cta_primary: t('Conócenos', 'Meet us'),
  clegal_cta_secondary: t('Planes', 'Plans'),
  clegal_img_alt: t('App C-Legal en un teléfono', 'C-Legal app on a phone'),

  why_1_title: t('¿Tu gestión de cumplimiento sigue siendo manual?', 'Is your compliance management still manual?'),
  why_2_title: t('Todo tu Compliance Legal, en un solo lugar', 'All your Legal Compliance, in one place'),
  why_3_title: t('Convierte la información legal en decisiones', 'Turn legal information into decisions'),
  why_1_img_alt: t('Sitio DATASHEQ en un computador', 'DATASHEQ website on a laptop'),
  why_2_img_alt: t('Pantallas de la app C-Legal', 'C-Legal app screens'),

  // Planes
  plans_eyebrow: t('Planes', 'Plans'),
  plans_title: t('Elige el plan que se adapta a tu negocio', 'Choose the plan that fits your business'),
  plans_text: t('Funcionalidades robustas a precios competitivos. Empieza gratis.', 'Robust features at competitive prices. Start for free.'),
  plans_recommended: t('Recomendado', 'Recommended'),
  plans_soon: t('próximamente', 'coming soon'),
  plans_cta_free: t('Empezar gratis', 'Start for free'),
  plans_cta_buy: t('Contratar', 'Get started'),
  plans_cta_contact: t('Contáctanos', 'Contact us'),
  plans_not_included: t('No incluido', 'Not included'),

  // CTA final
  cta_title_1: t('Lleva tu Compliance Legal', 'Take your Legal Compliance'),
  cta_title_hl: t('al siguiente nivel', 'to the next level'),
  cta_text: t(
    'Descubre cómo C-Legal puede transformar la forma en que tu organización gestiona el cumplimiento.',
    'Discover how C-Legal can transform the way your organisation manages compliance.'
  ),
  cta_button: t('Solicita una demo', 'Request a demo'),
  cta_ecosystem: t('C-Legal es parte del ecosistema Datasheq', 'C-Legal is part of the Datasheq ecosystem'),
  cta_solutions: t('Conoce nuestras soluciones', 'Explore our solutions'),

  // Solución integral (módulos)
  solution_eyebrow: t('Solución integral', 'Integrated solution'),
  solution_title: t('Solución integral para una gestión HSEQ más inteligente', 'An integrated solution for smarter HSEQ management'),
  solution_text_1: t(
    'Tecnología, Inteligencia Artificial y analítica avanzada para transformar la gestión HSEQ, simplificar procesos y mejorar la toma de decisiones.',
    'Technology, Artificial Intelligence and advanced analytics to transform HSEQ management, simplify processes and improve decision-making.'
  ),
  solution_text_2: t(
    'Descubre las soluciones Datasheq y lleva tu gestión HSEQ a un nuevo nivel, a través de planes de digitalización al alcance de todos, con procesos simples, integrados con IA en línea en la operación, y todo en una sola app.',
    'Discover Datasheq’s solutions and take your HSEQ management to the next level with digitalisation plans within everyone’s reach: simple processes, AI integrated live into operations, all in a single app.'
  ),
  module_cta: t('Solicitar demo', 'Request a demo'),
  solution_cta_title: t('¿Buscas una solución a tu medida?', 'Looking for a tailored solution?'),
  solution_cta_text: t(
    'Combinamos los módulos según la realidad de tu operación y te acompañamos en la implementación.',
    'We combine the modules to fit your operation and support you throughout the implementation.'
  ),
  solution_cta_btn: t('Conversemos', 'Let’s talk'),

  // Noticias
  news_eyebrow: t('Noticias', 'News'),
  news_title: t('Actualidad regulatoria y novedades', 'Regulatory updates and news'),
  news_text: t('Mantente al día con los cambios legales que afectan tu operación.', 'Stay up to date with the legal changes that affect your operation.'),
  news_read_more: t('Leer más', 'Read more'),
  news_cta: t('Hablar con un especialista', 'Talk to a specialist'),

  // App
  app_title_1: t('Descarga nuestra ', 'Download our '),
  app_title_hl: t('app', 'app'),
  app_text: t(
    'Todo el poder de C-Legal en tus manos. Descarga nuestra app y transforma la forma de gestionar HSEQ: más simple, más inteligente y desde cualquier lugar.',
    'All the power of C-Legal in your hands. Download our app and transform the way you manage HSEQ: simpler, smarter and from anywhere.'
  ),
  app_access: t('Para acceder a nuestra app:', 'To get our app:'),
  app_choose_store: t('Elige tu store', 'Choose your store'),
  app_scan: t('Escanea', 'Scan'),
  app_qr_ios: t('Código QR para App Store', 'QR code for the App Store'),
  app_qr_android: t('Código QR para Google Play', 'QR code for Google Play'),
  app_img_alt: t('App DATASHEQ en un teléfono móvil', 'DATASHEQ app on a mobile phone'),

  // Nosotros
  about_eyebrow: t('Nosotros', 'About us'),
  mission_title: t('Misión', 'Mission'),
  mission_text: t(
    [
      'Impulsar una gestión HSEQ más simple, preventiva e inteligente, entregando soluciones digitales que ayuden a las organizaciones a proteger a las personas, anticipar riesgos, fortalecer el cumplimiento y tomar mejores decisiones.',
      'Transformamos las necesidades reales de nuestros clientes en tecnología accesible, datos accionables y soluciones oportunas.',
    ],
    [
      'To drive simpler, more preventive and smarter HSEQ management by delivering digital solutions that help organisations protect people, anticipate risks, strengthen compliance and make better decisions.',
      'We turn our clients’ real needs into accessible technology, actionable data and timely solutions.',
    ]
  ),
  vision_title: t('Visión', 'Vision'),
  vision_text: t(
    [
      'Posicionar a Datasheq como una plataforma HSEQ referente en Chile, reconocida por transformar la gestión de riesgos y el cumplimiento en decisiones inteligentes, mediante tecnología accesible, inteligencia artificial y analítica de datos.',
      'Queremos hacer de la digitalización HSEQ una herramienta al alcance de todas las organizaciones.',
    ],
    [
      'To make Datasheq a leading HSEQ platform in Chile, recognised for turning risk management and compliance into smart decisions through accessible technology, artificial intelligence and data analytics.',
      'We want HSEQ digitalisation to be a tool within reach of every organisation.',
    ]
  ),
  team_title: t('Equipo', 'Team'),
  team_text: t(
    'Datasheq es un equipo multidisciplinario de 4 personas que integra conocimiento técnico, de negocios y tecnología para desarrollar herramientas digitales simples, eficientes e intuitivas que faciliten la gestión HSEQ (seguridad, salud ocupacional, medio ambiente y cumplimiento), el control y la toma de decisiones.',
    'Datasheq is a multidisciplinary team of 4 people combining technical, business and technology know-how to build simple, efficient and intuitive digital tools that make HSEQ management (safety, occupational health, environment and compliance), control and decision-making easier.'
  ),

  // Contacto
  contact_eyebrow: t('Contáctanos', 'Contact us'),
  contact_title: t('¿En qué te podemos ayudar?', 'How can we help you?'),
  contact_text: t(
    'Cuéntanos tu caso y un especialista HSEQ te contacta para una demo sin compromiso. También puedes escribirnos directo por WhatsApp.',
    'Tell us about your case and an HSEQ specialist will contact you for a no-obligation demo. You can also message us directly on WhatsApp.'
  ),
  contact_whatsapp: t('Whatsapp directo', 'WhatsApp'),
  contact_whatsapp_msg: t(
    'Hola DATASHEQ, me gustaría recibir información sobre sus soluciones HSEQ.',
    'Hello DATASHEQ, I would like to receive information about your HSEQ solutions.'
  ),
  contact_address_label: t('Dirección', 'Address'),

  // Formulario
  form_modal_title: t('Solicita una demo', 'Request a demo'),
  form_modal_text: t('Completa tus datos y un especialista HSEQ te contactará a la brevedad.', 'Fill in your details and an HSEQ specialist will contact you shortly.'),
  form_section_you: t('Tus datos', 'Your details'),
  form_section_company: t('Tu empresa', 'Your company'),
  form_section_need: t('Tu necesidad', 'Your needs'),
  f_name: t('Nombre y apellido', 'Full name'),
  f_position: t('Cargo', 'Job title'),
  f_email: t('Email corporativo', 'Work email'),
  f_phone: t('Teléfono / WhatsApp', 'Phone / WhatsApp'),
  f_company: t('Empresa', 'Company'),
  f_industry: t('Industria', 'Industry'),
  f_size: t('Tamaño de la empresa', 'Company size'),
  f_location: t('Ciudad / Región', 'City / Region'),
  f_plan: t('Plan de interés', 'Plan of interest'),
  f_solutions: t('Soluciones de interés', 'Solutions of interest'),
  f_preference: t('¿Cómo prefieres que te contactemos?', 'How would you like us to contact you?'),
  f_message: t('Cuéntanos tu caso', 'Tell us about your case'),
  f_message_ph: t(
    'Ej.: somos una empresa minera con 3 faenas y necesitamos controlar el cumplimiento legal y la acreditación de contratistas.',
    'E.g. we are a mining company with 3 sites and need to track legal compliance and contractor accreditation.'
  ),
  f_consent: t('Acepto que DATASHEQ me contacte para responder a esta solicitud.', 'I agree that DATASHEQ may contact me to respond to this request.'),
  f_select: t('Selecciona…', 'Select…'),
  f_optional: t('opcional', 'optional'),
  f_submit: t('Solicitar Demo', 'Request Demo'),
  f_sending: t('Enviando…', 'Sending…'),
  f_footnote: t('Al enviar aceptas que te contactemos - Nada de spam.', 'By submitting you agree to be contacted - no spam.'),
  f_required_note: t('Campos obligatorios', 'Required fields'),

  // Validación / estado
  err_required: t('Este campo es obligatorio.', 'This field is required.'),
  err_email: t('Ingresa un email válido.', 'Enter a valid email address.'),
  err_phone: t('Ingresa un teléfono válido.', 'Enter a valid phone number.'),
  err_too_short: t('Cuéntanos un poco más (mínimo 10 caracteres).', 'Tell us a bit more (at least 10 characters).'),
  err_too_long: t('El texto es demasiado largo.', 'The text is too long.'),
  err_consent: t('Debes aceptar para continuar.', 'You must agree to continue.'),
  err_invalid: t('Valor no válido.', 'Invalid value.'),
  err_generic: t('No pudimos enviar tu solicitud. Inténtalo nuevamente o escríbenos por WhatsApp.', 'We could not send your request. Please try again or message us on WhatsApp.'),
  err_rate: t('Recibimos demasiadas solicitudes desde tu conexión. Espera unos minutos e inténtalo de nuevo.', 'Too many requests from your connection. Please wait a few minutes and try again.'),
  err_fix: t('Revisa los campos marcados.', 'Please check the highlighted fields.'),
  ok_title: t('¡Gracias, {name}!', 'Thank you, {name}!'),
  ok_text: t('Recibimos tu solicitud. Un especialista HSEQ te contactará lo antes posible.', 'We have received your request. An HSEQ specialist will contact you as soon as possible.'),
  ok_copy: t('Te enviamos una copia a {email}.', 'We sent a copy to {email}.'),
  ok_again: t('Enviar otra solicitud', 'Send another request'),
  ok_close: t('Cerrar', 'Close'),
  close: t('Cerrar', 'Close'),

  // Footer
  footer_text: t(
    'Soluciones digitales para la gestión HSEQ: cumplimiento legal, control documental, personas y reportabilidad en una sola plataforma.',
    'Digital solutions for HSEQ management: legal compliance, document control, people and reporting in a single platform.'
  ),
  footer_links: t('Sitio', 'Site'),
  footer_contact: t('Contacto', 'Contact'),
  footer_rights: t('Todos los derechos reservados.', 'All rights reserved.'),

  // Emails
  email_client_subject: t('Recibimos tu mensaje — DATASHEQ', 'We received your message — DATASHEQ'),
  email_client_preheader: t('Gracias por escribirnos. Te contactaremos lo antes posible.', 'Thanks for reaching out. We will contact you as soon as possible.'),
  email_notice_title: t('Recibimos tu mensaje', 'We received your message'),
  email_notice_text: t(
    'Hola {name}, gracias por escribirnos. Un especialista HSEQ se pondrá en contacto contigo lo antes posible.',
    'Hi {name}, thank you for reaching out. An HSEQ specialist will get in touch with you as soon as possible.'
  ),
  email_summary_title: t('Resumen de tu solicitud', 'Your request at a glance'),
  email_about_title: t('Sobre DATASHEQ', 'About DATASHEQ'),
  email_solution_title: t('Nuestra solución integral', 'Our integrated solution'),
  email_news_title: t('Actualidad regulatoria', 'Regulatory updates'),
  email_app_title: t('Descarga nuestra app', 'Download our app'),
  email_visit: t('Visitar sitio web', 'Visit website'),
  email_contact_title: t('¿Necesitas hablar antes?', 'Need to talk sooner?'),
  email_footer: t(
    'Recibiste este correo porque completaste el formulario de contacto en nuestro sitio web. Si no fuiste tú, puedes ignorarlo.',
    'You received this email because you filled in the contact form on our website. If this wasn’t you, you can ignore it.'
  ),
  email_none: t('—', '—'),
};

module.exports = { settings, team, why, plans, planOptions, modules, news, industries, companySizes, contactPreferences, ui };
