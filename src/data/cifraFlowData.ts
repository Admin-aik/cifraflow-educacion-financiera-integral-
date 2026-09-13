import { TeenAvatar, LearningModule } from '../types';
import avatarIrcarImg from '../assets/images/avatar_ircar_teen_1789306127303.jpg';
import avatarJorgeImg from '../assets/images/avatar_jorge_teen_1789306144754.jpg';
import avatarIvanImg from '../assets/images/avatar_ivan_teen_1789306162989.jpg';
import avatarCarlosImg from '../assets/images/avatar_carlos_teen_1789306180036.jpg';

export const TEEN_AVATARS: TeenAvatar[] = [
  {
    id: 'ircar',
    name: 'Ircar (Adolescente)',
    stage: 'Adolescente',
    title: 'Especialista Cloud & Optimización Financiera',
    specialty: 'Optimización de micro-gastos, radar cloud y arquitectura fintech',
    appearance: 'Joven estudiante adolescente con visor holográfico multidimensional y traje cyber-cadete.',
    perkTitle: 'Radar Anti-Gastos & Escudo Cloud',
    perkDescription: 'Reduce un 20% el impacto de penalizaciones imprevistas y otorga +25 pts en auditorías financieras.',
    glowColor: '#ff007f', // Fucsia Neón
    avatarIcon: '⚡',
    badge: 'CLOUD DEFENDER',
    bonusEffect: '+25 pts de bono en comprensión de costos y contratos cloud.',
    imageUrl: avatarIrcarImg,
    startingStats: {
      salary: 3800,
      savings: 2400,
      cashflowBonus: 250,
    },
  },
  {
    id: 'jorge',
    name: 'Jorge (Adolescente)',
    stage: 'Adolescente',
    title: 'Operador Táctico de Accesos & Nómina',
    specialty: 'Sistemas biométricos, pasarelas bancarias y protocolos FIDO2',
    appearance: 'Joven estudiante adolescente con interfaz táctica de pulso y credencial digital integrada.',
    perkTitle: '+15% Efectividad Finanzas & Blindaje FIDO2',
    perkDescription: 'Inmunidad ante ataques de phishing/vishing y +15% de efectividad en simulaciones bancarias.',
    glowColor: '#00f3ff', // Cian Neón
    avatarIcon: '🛡️',
    badge: 'FIDO2 SENTINEL',
    bonusEffect: '+15% de flujo de efectivo en conciliación de nómina y banca.',
    imageUrl: avatarJorgeImg,
    startingStats: {
      salary: 4100,
      savings: 2600,
      cashflowBonus: 300,
    },
  },
  {
    id: 'ivan',
    name: 'Iván (Adolescente)',
    stage: 'Adolescente',
    title: 'Auditor Forense Digital & Detective de Contratos',
    specialty: 'Análisis de cláusulas abusivas, decodificación legal y prevención de fraude',
    appearance: 'Joven estudiante adolescente con monóculo scanner de código inteligente y guantes tácticos de lectura rápida.',
    perkTitle: 'Monóculo Scanner de Cláusulas Abusivas',
    perkDescription: 'Detecta trampas contractuales y cláusulas ocultas con un 100% de precisión forense.',
    glowColor: '#34d399', // Esmeralda Neón
    avatarIcon: '🔍',
    badge: 'LEGAL FORENSIC',
    bonusEffect: '+30 pts adicionales por cada cláusula trampa desmontada.',
    imageUrl: avatarIvanImg,
    startingStats: {
      salary: 3900,
      savings: 2800,
      cashflowBonus: 280,
    },
  },
  {
    id: 'carlos',
    name: 'Carlos (Adolescente)',
    stage: 'Adolescente',
    title: 'Estratega Presupuestario & Emprendimiento',
    specialty: 'Modelo 50/30/20, estructuración de costos y Bolsa de Valores de Caracas (BVC)',
    appearance: 'Joven estudiante adolescente con tablet holográfica de proyección de portafolios y balances.',
    perkTitle: 'Reactor 50/30/20 & Portafolios de Inversión',
    perkDescription: 'Maximiza el punto de equilibrio comercial y optimiza las órdenes de compra bursátiles.',
    glowColor: '#fbbf24', // Ámbar/Oro Neón
    avatarIcon: '📈',
    badge: 'VENTURE STRATEGIST',
    bonusEffect: 'Bono multiplicador de puntos en retos de Emprendimiento y BVC.',
    imageUrl: avatarCarlosImg,
    startingStats: {
      salary: 4300,
      savings: 3000,
      cashflowBonus: 350,
    },
  },
];

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'comprension_lectora',
    number: 1,
    title: 'Comprensión Lectora Financiera',
    subtitle: 'Auditoría de Contratos, Cláusulas Ocultas & TEA/CAT',
    category: 'LECTURA',
    description: 'Aprende a decodificar la letra chica de contratos comerciales, créditos bancarios y ofertas de inversión digital para blindar tu patrimonio.',
    iconName: 'FileText',
    color: '#00f3ff',
    badge: 'MÓDULO 01',
    challenges: [
      {
        id: 'cl_1',
        moduleNumber: 1,
        moduleTitle: 'Comprensión Lectora Financiera',
        topic: 'Detección de Cláusula Abusiva en Contrato de Arrendamiento',
        contextDocument:
          'CONTRATO DE ARRENDAMIENTO RESIDENCIAL — CLÁUSULA DÉCIMA CUARTA: "El Arrendador se reserva el derecho de ajustar unilateralmente el canon de arrendamiento mensual en cualquier momento del período contractual sin previo aviso, y de retener la fianza íntegra si el Arrendatario no notifica su renovación con 180 días de antelación."',
        question:
          'Iván activa su Monóculo Forense sobre el contrato. ¿Por qué esta cláusula es considerada legalmente abusiva e inválida?',
        options: [
          {
            id: 'a',
            text: 'Porque el canon debe pagarse exclusivamente en lingotes de oro según el código civil.',
            isCorrect: false,
            explanation: 'Incorrecto. No existe ninguna disposición que exija pagos en metales preciosos.',
          },
          {
            id: 'b',
            text: 'Porque viola el principio de bilateralidad al permitir ajustes unilaterales y fija penalidades desproporcionadas no consensuadas.',
            isCorrect: true,
            explanation: '¡Exacto! Todo ajuste de precio debe estar sujeto a un índice objetivo preestablecido y a previo aviso legal.',
          },
          {
            id: 'c',
            text: 'Porque la fianza debe ser devuelta en efectivo al instante en que se firma el documento.',
            isCorrect: false,
            explanation: 'Incorrecto. La fianza se liquida al concluir el contrato tras comprobar el estado del inmueble.',
          },
          {
            id: 'd',
            text: 'Porque los contratos de arrendamiento no admiten cláusulas con números mayores a 10.',
            isCorrect: false,
            explanation: 'Incorrecto. La numeración de cláusulas es libre siempre que respete el marco jurídico.',
          },
        ],
        pointsReward: 120,
        penaltyAmount: -35,
        richInsight:
          'Principio Legal: Toda cláusula que otorgue facultades unilaterales a una de las partes para modificar el precio sin causales objetivas es nula de pleno derecho.',
      },
      {
        id: 'cl_2',
        moduleNumber: 1,
        moduleTitle: 'Comprensión Lectora Financiera',
        topic: 'Análisis Crítico de TEA vs CAT y Cargos de Manejo',
        contextDocument:
          'OFERTA CREDITICIA: "Préstamo Express para Jóvenes: Tasa Nominal Anual (TNA) de solo 18%". LETRA PEQUEÑA AL PIE: "Comisión de apertura: 6%, Seguro de desgravamen obligatorio mensual: 1.8%, Gastos administrativos fijos: $35/mes. Costo Anual Total (CAT) efectivo: 68.4% anual."',
        question:
          'Al evaluar esta oferta crediticia, ¿en cuál indicador debe basarse la decisión financiera real para no caer en un sobreendeudamiento engañoso?',
        options: [
          {
            id: 'a',
            text: 'En la Tasa Nominal Anual (TNA) del 18%, porque es la cifra destacada en grande en la publicidad.',
            isCorrect: false,
            explanation: 'Incorrecto. La TNA ignora seguros obligatorios, comisiones y gastos ocultos.',
          },
          {
            id: 'b',
            text: 'En el Costo Anual Total (CAT) del 68.4%, ya que consolida intereses, comisiones, seguros y gastos ocultos.',
            isCorrect: true,
            explanation: '¡Brillante! El CAT es el costo financiero total real que verdaderamente saldrá de tu bolsillo.',
          },
          {
            id: 'c',
            text: 'En el color del banner del banco emisor.',
            isCorrect: false,
            explanation: 'Incorrecto. El diseño visual no determina el costo financiero.',
          },
          {
            id: 'd',
            text: 'En el seguro de desgravamen exclusivamente.',
            isCorrect: false,
            explanation: 'Incorrecto. El seguro es solo uno de los múltiples componentes de gasto.',
          },
        ],
        pointsReward: 140,
        penaltyAmount: -40,
        richInsight:
          'Regla de Oro: Jamás te fíes de la Tasa Nominal. Compara siempre el CAT (Costo Anual Total) o la TEA (Tasa Efectiva Anual).',
      },
    ],
  },
  {
    id: 'primera_cuenta_banco',
    number: 2,
    title: 'Primera Cuenta de Banco & Pagos Digitales',
    subtitle: 'KYC Digital BDV/Plaza/Tesoro, Pago Móvil C2P, IGTF & Tasa BCV',
    category: 'BANCO',
    description: 'Simula el proceso real de apertura de tu primera cuenta bancaria venezolana, validación biométrica, pago móvil instantáneo y tributación.',
    iconName: 'Building2',
    color: '#34d399',
    badge: 'MÓDULO 02',
    challenges: [
      {
        id: 'pb_1',
        moduleNumber: 2,
        moduleTitle: 'Primera Cuenta de Banco & Pagos Digitales',
        topic: 'Apertura Digital KYC en Banca Nacional (BDV / Banco Plaza / Banco del Tesoro)',
        contextDocument:
          'PROCESO ONBOARDING DIGITAL: Un joven de 18 años descarga la app móvil del banco para abrir su primera cuenta corriente digital en bolívares. El sistema le solicita captura de cédula de identidad, validación facial biométrica liveness y RIF vigente.',
        question:
          '¿Cuál es el objetivo principal del protocolo KYC (Know Your Customer) y la prueba biométrica de vida solicitada por el banco?',
        options: [
          {
            id: 'a',
            text: 'Vender las fotos de los estudiantes en redes sociales para marketing de influencers.',
            isCorrect: false,
            explanation: 'Incorrecto. Los datos bancarios están protegidos bajo estricto secreto bancario y leyes de datos personales.',
          },
          {
            id: 'b',
            text: 'Prevenir la suplantación de identidad, el lavado de dinero y garantizar que la persona física realmente autoriza la apertura.',
            isCorrect: true,
            explanation: '¡Correcto! El KYC previene la usurpación y protege al titular frente al fraude financiero.',
          },
          {
            id: 'c',
            text: 'Cobrar una comisión en criptomonedas al momento de escanear la cara.',
            isCorrect: false,
            explanation: 'Incorrecto. La apertura digital de cuentas básicas está exenta de costo de emisión biométrica.',
          },
          {
            id: 'd',
            text: 'Verificar si el usuario tiene una laptop gamer.',
            isCorrect: false,
            explanation: 'Incorrecto. No tiene relación con requisitos de equipamiento computacional.',
          },
        ],
        pointsReward: 130,
        penaltyAmount: -30,
        richInsight:
          'Seguridad Bancaria: El KYC digital biométrico evita que ciberdelincuentes abran cuentas puente o mulas para mover fondos ilícitos a tu nombre.',
      },
      {
        id: 'pb_2',
        moduleNumber: 2,
        moduleTitle: 'Primera Cuenta de Banco & Pagos Digitales',
        topic: 'Pago Móvil C2P, Clave Dinámica OTP e IGTF',
        contextDocument:
          'ESCENARIO COMERCIAL: Carlos va a pagar una compra escolar de $30 equivalentes en un comercio. El comerciante le ofrece pagar vía Pago Móvil C2P (Comercio a Persona) o en divisas en efectivo gravadas con el 3% del IGTF.',
        question:
          'Si Carlos paga mediante Pago Móvil C2P en bolívares calculados a la Tasa Oficial BCV vigente, ¿cuál es el mecanismo de seguridad que aprueba la transacción?',
        options: [
          {
            id: 'a',
            text: 'El cliente genera un Token / Clave dinámica OTP temporal desde su app bancaria y se la suministra al comercio.',
            isCorrect: true,
            explanation: '¡Excelente! En C2P el comercio solicita el débito, pero solo se ejecuta si el cliente autoriza con su clave OTP temporal.',
          },
          {
            id: 'b',
            text: 'El cliente le entrega su clave secreta del cajero automático y tarjeta física al comerciante.',
            isCorrect: false,
            explanation: '¡Grave error! Jamás compartas tus claves maestras personales.',
          },
          {
            id: 'c',
            text: 'El banco llama por teléfono a los padres del estudiante en cada compra menor a $5.',
            isCorrect: false,
            explanation: 'Incorrecto. El protocolo C2P es instantáneo y descentralizado con clave dinámica.',
          },
          {
            id: 'd',
            text: 'Se debe esperar 72 horas hábiles para que la cámara de compensación libere el pago.',
            isCorrect: false,
            explanation: 'Incorrecto. El Pago Móvil interbancario liquida en tiempo real (segundos).',
          },
        ],
        pointsReward: 150,
        penaltyAmount: -35,
        richInsight:
          'C2P Inteligente: El Pago Móvil C2P invierte la transacción: el comercio inicia la solicitud de cobro, pero el control absoluto lo tiene tu código OTP de 8 dígitos con validez de 15 minutos.',
      },
    ],
  },
  {
    id: 'emprendimiento_costos',
    number: 3,
    title: 'Emprendimiento & Estructura de Costos',
    subtitle: 'Costos Fijos/Variables, Regla 50/30/20, Punto de Equilibrio & SENIAT',
    category: 'EMPRENDIMIENTO',
    description: 'Domina las finanzas de tu negocio juvenil. Aprende a calcular márgenes reales, punto de equilibrio y facturación fiscal conforme al SENIAT.',
    iconName: 'Rocket',
    color: '#34d399', // Verde esmeralda obligatorio
    badge: 'MÓDULO 03',
    challenges: [
      {
        id: 'emp_1',
        moduleNumber: 3,
        moduleTitle: 'Emprendimiento & Estructura de Costos',
        topic: 'Estructura de Costos Fijos vs Variables y Margen de Ganancia',
        contextDocument:
          'PROYECTO DE EMPRENDIMIENTO: Ircar y Carlos producen kits de robótica educativa. Tienen un alquiler de taller de $200/mes (fijo) e internet de $50/mes (fijo). Por cada kit, los microcontroladores y sensores cuestan $15 (variable). Venden cada kit a $35.',
        question:
          '¿Cuál es el margen de contribución unitario por cada kit vendido y qué tipo de costo representa el alquiler del taller?',
        options: [
          {
            id: 'a',
            text: 'El margen es $20 ($35 - $15) y el alquiler es un Costo Fijo que debe pagarse sin importar cuántos kits se vendan.',
            isCorrect: true,
            explanation: '¡Brillante! Margen = Precio de Venta ($35) - Costo Variable ($15) = $20. Los costos fijos son independientes del volumen de producción.',
          },
          {
            id: 'b',
            text: 'El margen es $50 y el alquiler es un costo voluntario que solo se paga si hay ganancias.',
            isCorrect: false,
            explanation: 'Incorrecto. El alquiler es un compromiso contractual obligatorio periódico.',
          },
          {
            id: 'c',
            text: 'El margen es negativo de -$10 y los microcontroladores son activos no amortizables.',
            isCorrect: false,
            explanation: 'Incorrecto. Los componentes son insumos variables directos.',
          },
          {
            id: 'd',
            text: 'No se puede calcular sin pedir un crédito en la bolsa de valores.',
            isCorrect: false,
            explanation: 'Incorrecto. La fórmula elemental de costos es directa: Precio - Costo Variable.',
          },
        ],
        pointsReward: 140,
        penaltyAmount: -40,
        richInsight:
          'Clave de Emprendimiento: Mantener los costos fijos al mínimo en las etapas iniciales de un negocio reduce drásticamente el riesgo de quiebra.',
      },
      {
        id: 'emp_2',
        moduleNumber: 3,
        moduleTitle: 'Emprendimiento & Estructura de Costos',
        topic: 'Regla de Oro Presupuestaria 50/30/20 y Cumplimiento SENIAT',
        contextDocument:
          'FINANZAS PERSONALES Y NEGOCIO: Carlos recibe su primer ingreso neto mensual de $500 como programador web independiente. Desea aplicar la regla financiera 50/30/20 y cumplir con los deberes formales de facturación legal del SENIAT.',
        question:
          '¿Cómo debe distribuir Carlos sus $500 mensuales bajo el estándar 50/30/20 de forma matemáticamente disciplinada?',
        options: [
          {
            id: 'a',
            text: '$400 en videojuegos y caprichos, $100 en comida y $0 en ahorros.',
            isCorrect: false,
            explanation: 'Incorrecto. Esto provocaría insolvencia y cero capacidad de inversión futura.',
          },
          {
            id: 'b',
            text: '$250 (50%) en Necesidades Básicas, $150 (30%) en Deseos/Estilo de Vida, y $100 (20%) en Ahorro Estratégico e Inversión.',
            isCorrect: true,
            explanation: '¡Exacto! La regla 50/30/20 garantiza sustento, disfrute responsable y acumulación de capital para generar ingresos pasivos.',
          },
          {
            id: 'c',
            text: 'Guardar el 100% debajo del colchón en billetes devaluados.',
            isCorrect: false,
            explanation: 'Incorrecto. El dinero estancado pierde poder adquisitivo frente a la inflación.',
          },
          {
            id: 'd',
            text: '$500 invertidos en un token desconocido prometido por un influencer.',
            isCorrect: false,
            explanation: 'Incorrecto. Eso es especulación de altísimo riesgo sin base financiera.',
          },
        ],
        pointsReward: 150,
        penaltyAmount: -35,
        richInsight:
          'Regla 50/30/20: El 20% destinado al ahorro e inversión no se toca: es el motor que con el tiempo te permite comprar activos y alcanzar la independencia financiera.',
      },
    ],
  },
  {
    id: 'bolsa_valores_caracas',
    number: 4,
    title: 'Bolsa de Valores de Caracas (BVC)',
    subtitle: 'SUNAVAL, Casas de Bolsa, Renta Variable & Renta Fija Indexada',
    category: 'BVC',
    description: 'Descubre el mercado bursátil venezolano. Cómo abrir tu cuenta con un intermediario autorizado por la SUNAVAL e invertir en empresas reales.',
    iconName: 'TrendingUp',
    color: '#fbbf24',
    badge: 'MÓDULO 04',
    challenges: [
      {
        id: 'bvc_1',
        moduleNumber: 4,
        moduleTitle: 'Bolsa de Valores de Caracas (BVC)',
        topic: 'Casas de Bolsa autorizadas por SUNAVAL y Apertura de Subcuenta',
        contextDocument:
          'MERCADO DE VALORES VENEZOLANO: Un estudiante desea comprar sus primeras acciones de empresas emblemáticas en la Bolsa de Valores de Caracas (BVC). Un amigo en redes le dice que le envíe dinero a su billetera personal para comprarlas por él.',
        question:
          '¿Cuál es el único canal legal y seguro para invertir en la Bolsa de Valores de Caracas según las leyes de la República?',
        options: [
          {
            id: 'a',
            text: 'Transferir dinero anónimamente por mensajería instantánea a influencers financieros.',
            isCorrect: false,
            explanation: '¡Peligro! Es una modalidad clásica de estafa y captación ilegal de fondos.',
          },
          {
            id: 'b',
            text: 'Acudir a una Casa de Bolsa debidamente registrada y autorizada por la SUNAVAL (Superintendencia Nacional de Valores) para abrir tu subcuenta en la Caja Venezolana de Valores (CVV).',
            isCorrect: true,
            explanation: '¡Impecable! Solo las Casas de Bolsa reguladas por SUNAVAL pueden intermediar órdenes y custodiar tus títulos en la CVV.',
          },
          {
            id: 'c',
            text: 'Comprar acciones en puestos informales en la calle.',
            isCorrect: false,
            explanation: 'Incorrecto. Los títulos valores son registros electrónicos custodiados por la CVV.',
          },
          {
            id: 'd',
            text: 'Solo los bancos extranjeros pueden operar en la BVC.',
            isCorrect: false,
            explanation: 'Incorrecto. Cualquier ciudadano venezolano con cédula y RIF puede abrir cuenta bursátil.',
          },
        ],
        pointsReward: 140,
        penaltyAmount: -40,
        richInsight:
          'Protección Bursátil: La Caja Venezolana de Valores (CVV) registra electrónicamente las acciones a tu nombre exclusivo, garantizando que nadie pueda sustraer tus títulos.',
      },
      {
        id: 'bvc_2',
        moduleNumber: 4,
        moduleTitle: 'Bolsa de Valores de Caracas (BVC)',
        topic: 'Renta Variable (Acciones) vs Papeles Comerciales Indexados (Renta Fija)',
        contextDocument:
          'ESTRATEGIA BURSÁTIL: Carlos analiza dos instrumentos de la BVC: 1) Acciones de una empresa agroindustrial que pagan dividendos y varían de precio según el mercado (Renta Variable), y 2) Papeles Comerciales emitidos a 180 días con rendimiento del 14% indexados al tipo de cambio oficial BCV (Renta Fija).',
        question:
          '¿Cuál es la principal diferencia de riesgo y retorno entre la Renta Variable y la Renta Fija indexada?',
        options: [
          {
            id: 'a',
            text: 'En la Renta Fija indexada conoces la tasa de rendimiento pactada desde el inicio y te cubres de la devaluación; en la Renta Variable eres copropietario y el rendimiento depende del desempeño y utilidades de la empresa.',
            isCorrect: true,
            explanation: '¡Respuesta maestra! La renta fija pacta un cupón de interés determinado, mientras que la acción te otorga copropiedad y derecho a dividendos futuros.',
          },
          {
            id: 'b',
            text: 'Ambos instrumentos garantizan duplicar el dinero cada semana sin importar nada.',
            isCorrect: false,
            explanation: 'Falso. Toda inversión conlleva una relación riesgo-retorno que debe evaluarse.',
          },
          {
            id: 'c',
            text: 'Las acciones nunca pueden cambiar de precio según la ley.',
            isCorrect: false,
            explanation: 'Incorrecto. Las acciones fluctúan todos los días hábiles según la oferta y demanda en la BVC.',
          },
          {
            id: 'd',
            text: 'La renta fija es solo para personas mayores de 90 años.',
            isCorrect: false,
            explanation: 'Incorrecto. Es un instrumento excelente para inversionistas jóvenes que buscan preservación de capital.',
          },
        ],
        pointsReward: 150,
        penaltyAmount: -35,
        richInsight:
          'Diversificación Inteligente: Combinar Renta Fija (para flujo seguro y predecible) con Renta Variable (para crecimiento del capital a largo plazo) es el fundamento de los grandes inversionistas.',
      },
    ],
  },
  {
    id: 'ciberseguridad_zero_trust',
    number: 5,
    title: 'Ciberseguridad Real & Zero Trust',
    subtitle: 'FIDO2, Passkeys, Phishing IA, Desmitificación de Antivirus Tradicional',
    category: 'CIBERSEGURIDAD',
    description: 'Aprende ciberseguridad defensiva moderna. Por qué un antivirus común no detiene el robo de credenciales y cómo implementar Passkeys y Zero Trust.',
    iconName: 'ShieldAlert',
    color: '#ff007f',
    badge: 'MÓDULO 05',
    challenges: [
      {
        id: 'cs_1',
        moduleNumber: 5,
        moduleTitle: 'Ciberseguridad Real & Zero Trust',
        topic: 'Desmitificación del Antivirus Tradicional vs Defensa de Identidad',
        contextDocument:
          'INCIDENTE DE SEGURIDAD: Un empleado bancario tiene instalado un antivirus famoso y actualizado. Sin embargo, recibe un enlace de phishing con clonación perfecta de login bancario, ingresa su usuario y contraseña, y un atacante le vacía la cuenta sin que el antivirus genere ninguna alerta.',
        question:
          'Jorge activa su Blindaje FIDO2. ¿Por qué el antivirus no pudo impedir este ciberataque y qué principio de seguridad moderna se debió aplicar?',
        options: [
          {
            id: 'a',
            text: 'Porque los antivirus tradicionales solo buscan firmas de malware de archivos ejecutables en disco, no pueden proteger tus credenciales si tú mismo las entregas voluntariamente en un sitio falso.',
            isCorrect: true,
            explanation: '¡Exacto! El phishing ataca la capa humana y de identidad, no un archivo ejecutable en disco. Por eso la autenticación robusta FIDO2/Passkeys es la verdadera defensa.',
          },
          {
            id: 'b',
            text: 'Porque el cable de internet estaba desenchufado.',
            isCorrect: false,
            explanation: 'Incorrecto. La conexión estaba activa y operativa.',
          },
          {
            id: 'c',
            text: 'Porque los virus solo atacan computadoras viejas.',
            isCorrect: false,
            explanation: 'Incorrecto. Todo sistema es vulnerable si la identidad y las credenciales son comprometidas.',
          },
          {
            id: 'd',
            text: 'Porque el atacante usó una supercomputadora cuántica de la NASA.',
            isCorrect: false,
            explanation: 'Incorrecto. La gran mayoría de fraudes son ingeniería social básica o phishing de credenciales.',
          },
        ],
        pointsReward: 140,
        penaltyAmount: -40,
        richInsight:
          'Realidad Ciber: El 85% de las brechas de seguridad ocurren por robo de credenciales o credenciales débiles, no por fallos del sistema operativo. ¡Protege tu identidad!',
      },
      {
        id: 'cs_2',
        moduleNumber: 5,
        moduleTitle: 'Ciberseguridad Real & Zero Trust',
        topic: 'Arquitectura Zero Trust & Autenticación Criptográfica FIDO2 / Passkeys',
        contextDocument:
          'PROTOCOLO ZERO TRUST: "Nunca confiar, siempre verificar". Una institución financiera migra todos sus sistemas a claves de paso (Passkeys) basadas en el estándar criptográfico FIDO2 / WebAuthn, eliminando las contraseñas escritas tradicionales.',
        question:
          '¿Por qué las Passkeys basadas en FIDO2 son inmunes al Phishing y al robo de contraseñas por ingeniería social?',
        options: [
          {
            id: 'a',
            text: 'Porque el navegador genera una firma criptográfica asimétrica que está vinculada exclusivamente al dominio legítimo del sitio web; si visitas una web clonada, el navegador jamás enviará la clave.',
            isCorrect: true,
            explanation: '¡Respuesta de nivel élite! FIDO2 liga el par de llaves criptográficas criptográficamente al origen (dominio web exacto), haciendo físicamente imposible el phishing.',
          },
          {
            id: 'b',
            text: 'Porque las Passkeys consisten en anotar tu contraseña en un papelito debajo del teclado.',
            isCorrect: false,
            explanation: '¡Nunca hagas eso! Las contraseñas en notas adhesivas son una pésima práctica.',
          },
          {
            id: 'c',
            text: 'Porque borran el disco duro automáticamente cada 10 minutos.',
            isCorrect: false,
            explanation: 'Incorrecto. Las Passkeys agilizan el acceso legítimo en segundos sin comprometer tus datos.',
          },
          {
            id: 'd',
            text: 'Porque solo funcionan con luz solar.',
            isCorrect: false,
            explanation: 'Incorrecto. Funcionan en cualquier dispositivo móvil o computadora con soporte biométrico.',
          },
        ],
        pointsReward: 150,
        penaltyAmount: -35,
        richInsight:
          'Estándar FIDO2: La clave privada nunca sale de tu enclave seguro (chip TPM o Secure Enclave de tu teléfono). Ni siquiera el servidor del banco conoce tu clave privada.',
      },
    ],
  },
];
