type ZoneFallback = {
  short: string;
  title: string;
  description: string;
  level: string;
  walkTime: string;
  crowd: string;
  corridors: string[];
  artifacts: string[];
  tips: string[];
  services: string[];
  imageAlt: string;
};

type RouteFallback = {
  name: string;
  duration: string;
};

export type MapFallbackLocale = {
  labels: {
    floorsLabel: string;
    liveDensityLabel: string;
    artifactUnit: string;
    serviceUnit: string;
    corridorUnit: string;
    densityUnit: string;
    directoryTitle: string;
    minuteUnit: string;
    zoneUnit: string;
  };
  routes: {
    highlights: RouteFallback;
    family: RouteFallback;
    accessible: RouteFallback;
    scholar: RouteFallback;
  };
  zones: Record<string, ZoneFallback>;
};

export const EN_MAP_FALLBACK: MapFallbackLocale = {
  labels: {
    floorsLabel: 'Floor Filter',
    liveDensityLabel: 'Live movement density',
    artifactUnit: 'artifacts',
    serviceUnit: 'services',
    corridorUnit: 'corridors',
    densityUnit: 'density',
    directoryTitle: 'Complete Floor Directory',
    minuteUnit: 'min',
    zoneUnit: 'zones',
  },
  routes: {
    highlights: {
      name: 'Highlights Route',
      duration: 'Approx. 90 minutes',
    },
    family: {
      name: 'Family Route',
      duration: 'Approx. 2.5 to 3 hours',
    },
    accessible: {
      name: 'Accessible Route',
      duration: 'Approx. 2 to 2.5 hours',
    },
    scholar: {
      name: 'Scholar Route',
      duration: 'Approx. 3 to 3.5 hours',
    },
  },
  zones: {
    securityGate: {
      short: 'Security',
      title: 'Security Screening Gateway',
      description:
        'Controlled entry point for visitor screening before the ticketing and orientation halls.',
      level: 'Ground Level',
      walkTime: '2-3 min to ticket hall',
      crowd: 'Peak: High',
      corridors: [
        'Dual queue lanes split family and group flow.',
        'Short bypass lane supports priority accessibility access.',
        'Clear line of sight to ticket hall minimizes hesitation.',
      ],
      artifacts: [
        'Entrance axis framing',
        'Directional light installation',
        'Introductory chronology panels',
      ],
      tips: [
        'Keep bags ready for quick screening.',
        'Use the accessibility lane when needed.',
        'Follow lane colors to avoid queue crossover.',
      ],
      services: ['Security support', 'Queue guidance', 'Accessibility assistance'],
      imageAlt: 'Security screening gate inside the museum entrance path',
    },
    ticketHall: {
      short: 'Tickets',
      title: 'Ticketing and Validation Hall',
      description:
        'Primary transaction and validation zone with digital kiosks and staffed counters.',
      level: 'Ground Level',
      walkTime: '3-4 min to atrium',
      crowd: 'Peak: Moderate to High',
      corridors: [
        'Parallel counter lanes reduce waiting time.',
        'Kiosk corridor supports quick re-issuance and QR checks.',
        'Direct merge lane reconnects visitors to the atrium spine.',
      ],
      artifacts: [
        'Museum orientation wall',
        'Program highlights display',
        'Daily event board',
      ],
      tips: [
        'Scan all tickets before moving as a group.',
        'Use self-service kiosks for faster check-in.',
        'Confirm your preferred route before entering the atrium.',
      ],
      services: ['Ticket desk', 'Self-service kiosks', 'Info counter', 'Rest area'],
      imageAlt: 'Ticket hall and validation counters',
    },
    grandHall: {
      short: 'Grand Hall',
      title: 'Grand Hall of Processional Works',
      description:
        'Expansive hall linking first orientation spaces to the staircase and upper narrative wings.',
      level: 'Ground Level',
      walkTime: '4-6 min across hall',
      crowd: 'Peak: Moderate',
      corridors: [
        'Central processional aisle supports two-way flow.',
        'Side corridors allow calm viewing without blocking movement.',
        'Transition corridor feeds directly into the staircase spine.',
      ],
      artifacts: [
        'Monumental royal statues',
        'Large relief fragments',
        'Ceremonial architectural pieces',
      ],
      tips: [
        'Walk side corridors for closer study of large pieces.',
        'Use central aisle only for continuous movement.',
        'Pause at marked bays rather than corridor corners.',
      ],
      services: ['Interpretation panels', 'Photo points', 'Visitor hosts'],
      imageAlt: 'Grand hall with major sculptural works',
    },
    servicesHub: {
      short: 'Services',
      title: 'Visitor Services Hub',
      description:
        'Operational support node with restrooms, seating, help desks, and route reassessment tools.',
      level: 'Ground Level',
      walkTime: '2-4 min to atrium or shop',
      crowd: 'Peak: Moderate',
      corridors: [
        'Short connector corridor links back to atrium.',
        'Looping circulation allows service access without crowding main flow.',
        'Clear return lane to grand hall and staircase.',
      ],
      artifacts: [
        'Visitor orientation graphics',
        'Accessible route screens',
        'Live crowd indicator panels',
      ],
      tips: [
        'Use this hub to reset route pace for your group.',
        'Refill water and rest before staircase transition.',
        'Check live density before choosing next gallery cluster.',
      ],
      services: ['Restrooms', 'Water station', 'Help desk', 'Family seating'],
      imageAlt: 'Service hub with visitor amenities',
    },
    giftShop: {
      short: 'Shop',
      title: 'Museum Gift Shop Wing',
      description:
        'Retail corridor with curated replicas, books, and craft pieces connected to the main route.',
      level: 'Ground Level',
      walkTime: '3-4 min loop',
      crowd: 'Peak: Low to Moderate',
      corridors: [
        'Single-loop circulation prevents dead-end congestion.',
        'Open display aisles keep exit path visible.',
        'Quick re-entry corridor returns to services hub.',
      ],
      artifacts: [
        'Replica catalog highlights',
        'Book collection wall',
        'Artisan craftsmanship corner',
      ],
      tips: [
        'Use this stop between major gallery clusters.',
        'Complete purchases before moving upstairs.',
        'Keep your re-entry path clear during busy times.',
      ],
      services: ['Retail checkout', 'Packaging desk', 'Tax invoice support'],
      imageAlt: 'Museum gift shop and circulation loop',
    },
    khufuBoat: {
      short: 'Khufu Boat',
      title: 'Khufu Solar Boat Gallery',
      description:
        'Specialized upper-level gallery focused on ancient shipbuilding, ritual transport, and structural engineering.',
      level: 'Upper Level',
      walkTime: '5-7 min in gallery',
      crowd: 'Peak: Moderate',
      corridors: [
        'Perimeter walkway supports long-form viewing of boat structure.',
        'Elevated angle points offer full-frame visual reading.',
        'Narrow study corridor connects to Old Kingdom sequence.',
      ],
      artifacts: [
        'Khufu boat structural sections',
        'Reconstruction methodology displays',
        'Ancient woodworking detail panels',
      ],
      tips: [
        'Follow perimeter path clockwise for complete narrative sequence.',
        'Use elevated points for full structural perspective.',
        'Continue to Old Kingdom wing through marked connector.',
      ],
      services: ['Interpretive screens', 'Seating bay', 'Guide station'],
      imageAlt: 'Khufu solar boat gallery and viewing path',
    },
    oldKingdom: {
      short: 'Old Kingdom',
      title: 'Old Kingdom Galleries',
      description:
        'Chronological wing showcasing early dynastic state-building, tomb culture, and sculptural canons.',
      level: 'Upper Level',
      walkTime: '6-8 min between halls',
      crowd: 'Peak: Moderate',
      corridors: [
        'Linear time-based corridor with side study alcoves.',
        'Cross corridor leads toward New Kingdom transition.',
        'Alternate loop path supports deeper object reading.',
      ],
      artifacts: [
        'Mastaba relief panels',
        'Old Kingdom statuary groups',
        'Administrative inscriptions',
      ],
      tips: [
        'Start with the primary linear corridor for chronology.',
        'Use side alcoves for detailed object labels.',
        'Transition via cross corridor to preserve timeline logic.',
      ],
      services: ['Research notes panels', 'Bench pockets', 'Quiet reading spots'],
      imageAlt: 'Old Kingdom corridor galleries',
    },
    temporaryExhibit: {
      short: 'Temporary',
      title: 'Temporary Exhibition Pavilion',
      description:
        'Flexible gallery platform for rotating collections, themed installations, and short-term research showcases.',
      level: 'Upper Level',
      walkTime: '4-6 min typical loop',
      crowd: 'Peak: Variable',
      corridors: [
        'Modular corridor plan adapts to each exhibition scenario.',
        'Entry threshold separates rotating content from permanent route.',
        'Exit corridor reconnects to Greco-Roman wing.',
      ],
      artifacts: [
        'Rotating highlighted collection',
        'Interactive learning stations',
        'Curatorial feature wall',
      ],
      tips: [
        'Check entry panel for current exhibition theme.',
        'Expect route differences across different seasons.',
        'Use exit signs to rejoin your original route smoothly.',
      ],
      services: ['Event desk', 'Digital labels', 'Short-talk corner'],
      imageAlt: 'Temporary exhibition hall with flexible displays',
    },
    restorationLab: {
      short: 'Restoration',
      title: 'Restoration Laboratory Corridor',
      description:
        'Lower-level corridor overlooking active restoration workflows and technical preservation commentary.',
      level: 'Lower Level',
      walkTime: '5-6 min through lab edge',
      crowd: 'Peak: Low',
      corridors: [
        'Observation corridor passes lab windows with stop pockets.',
        'One-way study lane avoids backtracking near narrow sections.',
        'Connector links to family and learning clusters.',
      ],
      artifacts: [
        'Conservation tools display',
        'Condition assessment examples',
        'Restoration timeline boards',
      ],
      tips: [
        'Use marked stop pockets when observing lab windows.',
        'Keep moving in one-way lane during guided sessions.',
        'Pair this stop with learning center for full context.',
      ],
      services: ['Lab guides', 'Accessibility seating', 'Interpretive screens'],
      imageAlt: 'Restoration laboratory corridor with viewing windows',
    },
    learningCenter: {
      short: 'Learning',
      title: 'Learning and Discovery Center',
      description:
        'Educational hub with workshop rooms, digital interactives, and thematic mini-routes for deeper understanding.',
      level: 'Lower Level',
      walkTime: '4-5 min core path',
      crowd: 'Peak: Low to Moderate',
      corridors: [
        'Workshop corridor links flexible classroom modules.',
        'Open loop corridor supports family-friendly circulation.',
        'Direct route to immersive theater for continuation.',
      ],
      artifacts: [
        'Hands-on replica stations',
        'Digital excavation simulations',
        'Pedagogical timeline wall',
      ],
      tips: [
        'Start from orientation screen to choose a workshop lane.',
        'Great pause point for children before theater segment.',
        'Use loop corridor for quick reorientation.',
      ],
      services: ['Workshop desks', 'Family seating', 'Charging points', 'Staff support'],
      imageAlt: 'Learning center with workshops and interactive displays',
    },
    immersiveTheater: {
      short: 'Theater',
      title: 'Immersive Theater Chamber',
      description:
        'Projection-based storytelling chamber blending archaeology, reconstruction, and atmospheric narrative media.',
      level: 'Lower Level',
      walkTime: '15-20 min session',
      crowd: 'Peak: Moderate',
      corridors: [
        'Pre-show corridor controls timed audience entry.',
        'Silent exit corridor protects ongoing screenings.',
        'Return path reconnects to learning and services nodes.',
      ],
      artifacts: [
        '3D reconstruction visualizations',
        'Contextual projection timeline',
        'Audio-spatial heritage narratives',
      ],
      tips: [
        'Arrive a few minutes early to join next session cycle.',
        'Use silent exit to avoid interrupting active screening.',
        'Continue to learning center for hands-on follow-up.',
      ],
      services: ['Show scheduling board', 'Accessibility seats', 'Audio assistance'],
      imageAlt: 'Immersive theater chamber inside museum lower level',
    },
    familyLounge: {
      short: 'Family',
      title: 'Family Lounge and Recharge Zone',
      description:
        'Quiet recovery area for families with children, designed for hydration, short breaks, and plan adjustments.',
      level: 'Lower Level',
      walkTime: 'Flexible 5-15 min stop',
      crowd: 'Peak: Low',
      corridors: [
        'Soft-flow corridor buffers noise from nearby galleries.',
        'Direct service lane links to restrooms and water points.',
        'Short connector rejoins restoration and learning routes.',
      ],
      artifacts: [
        'Family interpretation panels',
        'Child-friendly visual timeline',
        'Replica touch-safe corner',
      ],
      tips: [
        'Best stop for regrouping with children.',
        'Use this node before starting another major route section.',
        'Rejoin through connector lane to avoid staircase congestion.',
      ],
      services: ['Family seating', 'Nursing space', 'Water refill', 'Stroller bay'],
      imageAlt: 'Family lounge and rest area',
    },
  },
};

export const AR_MAP_FALLBACK: MapFallbackLocale = {
  labels: {
    floorsLabel: 'تصفية الأدوار',
    liveDensityLabel: 'كثافة الحركة اللحظية',
    artifactUnit: 'تحفة',
    serviceUnit: 'خدمة',
    corridorUnit: 'ممر',
    densityUnit: 'كثافة',
    directoryTitle: 'دليل القاعات الكامل',
    minuteUnit: 'دقيقة',
    zoneUnit: 'نقطة',
  },
  routes: {
    highlights: {
      name: 'مسار أبرز المحطات',
      duration: 'حوالي 90 دقيقة',
    },
    family: {
      name: 'مسار العائلات',
      duration: 'حوالي 2.5 إلى 3 ساعات',
    },
    accessible: {
      name: 'مسار مهيأ للحركة',
      duration: 'حوالي 2 إلى 2.5 ساعة',
    },
    scholar: {
      name: 'مسار الباحثين',
      duration: 'حوالي 3 إلى 3.5 ساعات',
    },
  },
  zones: {
    securityGate: {
      short: 'الأمن',
      title: 'بوابة التفتيش الأمني',
      description: 'نقطة دخول منظمة لفحص الزوار قبل الانتقال إلى منطقة التذاكر والتوجيه الرئيسي.',
      level: 'الدور الأرضي',
      walkTime: '2-3 دقائق إلى قاعة التذاكر',
      crowd: 'الذروة: عالية',
      corridors: [
        'مساران منفصلان لتوزيع حركة العائلات والمجموعات.',
        'مسار قصير مخصص لدعم الوصول المهيأ.',
        'خط رؤية مباشر نحو قاعة التذاكر لتقليل التوقف.',
      ],
      artifacts: ['محور واجهة الدخول', 'تركيب ضوئي إرشادي', 'لوحات مقدمة التسلسل الزمني'],
      tips: [
        'جهز الحقائب لتسريع إجراءات التفتيش.',
        'استخدم المسار المهيأ إذا كان مناسبًا لمجموعتك.',
        'اتبع ألوان المسارات لتجنب التداخل بين الصفوف.',
      ],
      services: ['دعم أمني', 'تنظيم صفوف', 'مساعدة حركة'],
      imageAlt: 'بوابة التفتيش الأمني داخل مسار مدخل المتحف',
    },
    ticketHall: {
      short: 'التذاكر',
      title: 'قاعة التذاكر والتحقق',
      description: 'منطقة معاملات رئيسية تضم شبابيك الخدمة وأكشاك التحقق الرقمي للزوار.',
      level: 'الدور الأرضي',
      walkTime: '3-4 دقائق إلى الأتريوم',
      crowd: 'الذروة: متوسطة إلى عالية',
      corridors: [
        'مسارات متوازية للشبابيك تقلل زمن الانتظار.',
        'ممر للأكشاك الرقمية لفحص سريع وإعادة إصدار التذاكر.',
        'ممر اندماج مباشر يعيد الزوار إلى العمود الرئيسي للحركة.',
      ],
      artifacts: ['جدار التوجيه العام', 'لوحة أبرز المعارض', 'لوحة الفعاليات اليومية'],
      tips: [
        'أكمل فحص التذاكر لكل المجموعة قبل التحرك.',
        'استخدم الأكشاك الذاتية لتسريع الدخول.',
        'حدد مسارك قبل الانتقال إلى الأتريوم.',
      ],
      services: ['شباك تذاكر', 'أكشاك ذاتية', 'مكتب معلومات', 'منطقة انتظار'],
      imageAlt: 'قاعة التذاكر ونقاط التحقق داخل المتحف',
    },
    grandHall: {
      short: 'القاعة الكبرى',
      title: 'القاعة الكبرى للأعمال الاحتفالية',
      description: 'قاعة واسعة تربط مناطق التوجيه الأولى بمحور السلم الكبير وأجنحة العرض العلوية.',
      level: 'الدور الأرضي',
      walkTime: '4-6 دقائق عبر القاعة',
      crowd: 'الذروة: متوسطة',
      corridors: [
        'ممر مركزي واسع يدعم الحركة في اتجاهين.',
        'ممرات جانبية للوقوف الهادئ دون تعطيل التدفق.',
        'ممر انتقال مباشر نحو محور السلم الكبير.',
      ],
      artifacts: ['تماثيل ملكية ضخمة', 'قطع نقوش معمارية كبيرة', 'عناصر احتفالية حجرية'],
      tips: [
        'استخدم الممرات الجانبية للمشاهدة الدقيقة.',
        'اترك الممر المركزي للحركة المستمرة.',
        'قف في الجيوب المحددة بدل زوايا الممر.',
      ],
      services: ['لوحات تفسير', 'نقاط تصوير', 'مضيفو زوار'],
      imageAlt: 'القاعة الكبرى بما تضمه من قطع نحتية محورية',
    },
    servicesHub: {
      short: 'الخدمات',
      title: 'مركز خدمات الزوار',
      description: 'عقدة خدمية تضم دورات المياه، مقاعد الراحة، المساعدة، ونقاط إعادة تخطيط المسار.',
      level: 'الدور الأرضي',
      walkTime: '2-4 دقائق إلى الأتريوم أو المتجر',
      crowd: 'الذروة: متوسطة',
      corridors: [
        'ممر رابط قصير يعيدك مباشرة إلى الأتريوم.',
        'حركة دائرية تسمح بالخدمة دون تعطيل المسار الرئيسي.',
        'مسار عودة واضح نحو القاعة الكبرى والسلم.',
      ],
      artifacts: ['رسومات توجيه', 'شاشات المسارات المهيأة', 'مؤشرات كثافة الزوار اللحظية'],
      tips: [
        'استخدم هذه النقطة لإعادة ضبط سرعة الجولة.',
        'خذ استراحة قصيرة قبل الصعود إلى السلم.',
        'راجع الكثافة المباشرة قبل اختيار القاعة التالية.',
      ],
      services: ['دورات مياه', 'نقطة مياه', 'مكتب مساعدة', 'جلسات عائلية'],
      imageAlt: 'مركز خدمات الزوار داخل الدور الأرضي',
    },
    giftShop: {
      short: 'المتجر',
      title: 'جناح متجر المتحف',
      description: 'ممر بيع منظم يضم نسخًا فنية وكتبًا ومنتجات حرفية متصلة بمسار الزيارة العام.',
      level: 'الدور الأرضي',
      walkTime: '3-4 دقائق جولة',
      crowd: 'الذروة: منخفضة إلى متوسطة',
      corridors: [
        'حركة دائرية داخلية تمنع الاختناق في النهايات.',
        'ممرات عرض مفتوحة تحافظ على وضوح اتجاه الخروج.',
        'ممر رجوع سريع إلى مركز الخدمات.',
      ],
      artifacts: ['مختارات نسخ أثرية', 'جدار كتب متخصصة', 'ركن الحرف اليدوية'],
      tips: [
        'اجعل هذه المحطة بين القاعات الثقيلة.',
        'أنهِ المشتريات قبل الصعود للأدوار العليا.',
        'اترك مسار الرجوع واضحًا عند الزحام.',
      ],
      services: ['نقطة دفع', 'تغليف', 'دعم فواتير'],
      imageAlt: 'متجر المتحف ومسار الحركة الدائري بداخله',
    },
    khufuBoat: {
      short: 'مركب خوفو',
      title: 'قاعة مركب خوفو الشمسية',
      description: 'قاعة متخصصة في تقنيات بناء السفن القديمة ودلالات النقل الطقسي في مصر القديمة.',
      level: 'الدور العلوي',
      walkTime: '5-7 دقائق داخل القاعة',
      crowd: 'الذروة: متوسطة',
      corridors: [
        'ممر محيطي لمشاهدة تفاصيل المركب بشكل كامل.',
        'نقاط مشاهدة مرتفعة لقراءة البنية الهندسية.',
        'ممر رابط ضيق يؤدي إلى جناح الدولة القديمة.',
      ],
      artifacts: ['عناصر بنيوية من مركب خوفو', 'شروحات إعادة التركيب', 'تفاصيل نجارة أثرية'],
      tips: [
        'ابدأ المسار المحيطي مع عقارب الساعة.',
        'استفد من نقاط الرؤية المرتفعة للمشهد الكامل.',
        'واصل إلى الدولة القديمة عبر الممر الرابط.',
      ],
      services: ['شاشات تفسير', 'مقاعد قصيرة', 'نقطة إرشاد'],
      imageAlt: 'قاعة مركب خوفو ومسارات المشاهدة المحيطة',
    },
    oldKingdom: {
      short: 'الدولة القديمة',
      title: 'قاعات الدولة القديمة',
      description: 'جناح زمني يعرض تشكل الدولة المبكرة وثقافة المقابر وتطور فنون النحت الرسمية.',
      level: 'الدور العلوي',
      walkTime: '6-8 دقائق بين القاعات',
      crowd: 'الذروة: متوسطة',
      corridors: [
        'ممر زمني خطي مع جيوب دراسة جانبية.',
        'ممر عرضي يربط تدريجيًا مع جناح الدولة الحديثة.',
        'حلقة بديلة للزوار الراغبين في قراءة أعمق.',
      ],
      artifacts: ['لوحات مصطبية', 'مجموعات تماثيل الدولة القديمة', 'نقوش إدارية'],
      tips: [
        'ابدأ بالممر الخطي للحفاظ على التسلسل.',
        'استفد من الجيوب الجانبية لقراءة بطاقات القطع.',
        'استخدم الممر العرضي للانتقال الزمني السلس.',
      ],
      services: ['لوحات بحثية', 'مقاعد استراحة', 'زوايا قراءة هادئة'],
      imageAlt: 'قاعات الدولة القديمة وممراتها الزمنية',
    },
    temporaryExhibit: {
      short: 'المعرض المؤقت',
      title: 'قاعة المعرض المؤقت',
      description: 'منصة عرض مرنة للمعارض الدورية والتركيبات الموضوعية والعروض البحثية قصيرة المدى.',
      level: 'الدور العلوي',
      walkTime: '4-6 دقائق في الجولة المتوسطة',
      crowd: 'الذروة: متغيرة',
      corridors: [
        'خطة ممرات مرنة تتغير بحسب سيناريو المعرض.',
        'عتبة دخول تفصل المعروض المؤقت عن المسار الدائم.',
        'ممر خروج يعيد الاتصال بجناح اليوناني الروماني.',
      ],
      artifacts: ['مختارات متغيرة دوريًا', 'محطات تفاعل رقمية', 'جدار القيّم الفني'],
      tips: [
        'راجع لوحة المدخل لمعرفة موضوع الدورة الحالية.',
        'توقع اختلاف المسار بين موسم وآخر.',
        'اتبع ممر الخروج للعودة السلسة لمسارك الأساسي.',
      ],
      services: ['مكتب فعاليات', 'بطاقات رقمية', 'ركن عروض قصيرة'],
      imageAlt: 'قاعة المعرض المؤقت بتوزيع عرض متغير',
    },
    restorationLab: {
      short: 'المعمل',
      title: 'ممر معامل الترميم',
      description: 'ممر سفلي يطل على سير أعمال الترميم مع محتوى تفسيري تقني عن حفظ الآثار.',
      level: 'الدور السفلي',
      walkTime: '5-6 دقائق على امتداد المعمل',
      crowd: 'الذروة: منخفضة',
      corridors: [
        'ممر مشاهدة بمحاذاة نوافذ المعمل مع جيوب توقف.',
        'مسار أحادي الاتجاه لتقليل الرجوع في المساحات الضيقة.',
        'ممر رابط إلى مناطق التعلم والعائلات.',
      ],
      artifacts: ['أدوات ترميم', 'أمثلة تقييم حالة', 'لوحات تسلسل المعالجة'],
      tips: [
        'استخدم نقاط التوقف المخصصة عند النوافذ.',
        'التزم بالاتجاه الواحد أثناء الفترات الإرشادية.',
        'ادمج هذه المحطة مع مركز التعلم لفهم أشمل.',
      ],
      services: ['إرشاد معملي', 'مقاعد مهيأة', 'شاشات تفسير'],
      imageAlt: 'ممر معامل الترميم مع نوافذ مشاهدة',
    },
    learningCenter: {
      short: 'التعلم',
      title: 'مركز التعلم والاكتشاف',
      description: 'مركز تعليمي يضم ورشًا تفاعلية ومسارات معرفية مصغرة لفهم أعمق للقطع الأثرية.',
      level: 'الدور السفلي',
      walkTime: '4-5 دقائق في المسار الأساسي',
      crowd: 'الذروة: منخفضة إلى متوسطة',
      corridors: [
        'ممر ورش يربط قاعات تعليمية مرنة.',
        'حلقة حركة مفتوحة مناسبة للعائلات.',
        'رابط مباشر إلى المسرح الغامر.',
      ],
      artifacts: ['محطات نسخ تعليمية', 'محاكاة حفائر رقمية', 'جدار زمني تربوي'],
      tips: [
        'ابدأ من شاشة التوجيه لاختيار نشاطك.',
        'محطة ممتازة للأطفال قبل المسرح.',
        'استخدم الحلقة المفتوحة لإعادة التموضع بسرعة.',
      ],
      services: ['طاولات ورش', 'جلسات عائلية', 'نقاط شحن', 'دعم فريق'],
      imageAlt: 'مركز التعلم والأنشطة التفاعلية داخل المتحف',
    },
    immersiveTheater: {
      short: 'المسرح',
      title: 'المسرح الغامر',
      description: 'قاعة عرض إسقاطي تحاكي السياقات الأثرية وتدمج السرد البصري مع إعادة البناء الرقمية.',
      level: 'الدور السفلي',
      walkTime: '15-20 دقيقة للجلسة',
      crowd: 'الذروة: متوسطة',
      corridors: [
        'ممر ما قبل العرض ينظم دخول الجمهور بالتوقيت.',
        'ممر خروج هادئ يحافظ على العروض الجارية.',
        'مسار عودة إلى مركز التعلم والخدمات.',
      ],
      artifacts: ['تصورات ثلاثية الأبعاد', 'خط زمني إسقاطي', 'سرد صوتي مكاني'],
      tips: [
        'احضر قبل بداية الجولة بدقائق قليلة.',
        'استخدم ممر الخروج الهادئ دون إزعاج العرض.',
        'واصل إلى مركز التعلم لتجربة تطبيقية.',
      ],
      services: ['جدول عروض', 'مقاعد مهيأة', 'مساعدة صوتية'],
      imageAlt: 'المسرح الغامر داخل الدور السفلي',
    },
    familyLounge: {
      short: 'العائلات',
      title: 'صالة العائلات وإعادة الشحن',
      description: 'منطقة هادئة للعائلات والأطفال للراحة السريعة وإعادة تنظيم خطة الجولة داخل المتحف.',
      level: 'الدور السفلي',
      walkTime: 'توقف مرن من 5 إلى 15 دقيقة',
      crowd: 'الذروة: منخفضة',
      corridors: [
        'ممر هادئ يعزل الضوضاء القادمة من القاعات المجاورة.',
        'خط خدمة مباشر إلى المياه ودورات المياه.',
        'رابط قصير يعيدك لمسارات التعلم والترميم.',
      ],
      artifacts: ['لوحات تفسير عائلية', 'خط زمني بصري للأطفال', 'ركن نسخ آمن للمس'],
      tips: [
        'أفضل نقطة لإعادة تجميع العائلة.',
        'استخدمها قبل بدء جزء جديد من المسار.',
        'العودة عبر الممر الرابط تقلل المرور في مناطق مزدحمة.',
      ],
      services: ['جلسات عائلية', 'ركن رضاعة', 'تعبئة مياه', 'موقف عربات أطفال'],
      imageAlt: 'صالة العائلات ومنطقة الراحة داخل المتحف',
    },
  },
};
