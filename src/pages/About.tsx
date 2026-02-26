import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Award,
  BookOpen,
  CalendarDays,
  Clock,
  Compass,
  Hammer,
  Landmark,
  Layers,
  Route,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import MuseumHero3D from '../components/MuseumHero3D';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  { year: '2002', id: 'visionBegins' },
  { year: '2005', id: 'foundationLaid' },
  { year: '2011', id: 'challenges' },
  { year: '2018', id: 'staircase' },
  { year: '2020', id: 'tutCollection' },
  { year: '2025', id: 'opening' },
] as const;

const STATS = [
  { icon: Landmark, value: '480K', labelKey: 'about.stats.area' },
  { icon: Compass, value: '100K', labelKey: 'about.stats.artifacts' },
  { icon: Users, value: '5,398', labelKey: 'about.stats.tutItems' },
  { icon: Clock, value: '7,000', labelKey: 'about.stats.years' },
  { icon: Hammer, value: '20+', labelKey: 'about.stats.yearsBuilding' },
  { icon: Award, value: '50+', labelKey: 'about.stats.galleries' },
] as const;

const FEATURES = [
  { id: 'sustainable' },
  { id: 'conservation' },
  { id: 'interactive' },
  { id: 'education' },
] as const;

type LocalizedText = { ar: string; en: string };

const ABOUT_ALT_NAMES = [
  { ar: 'حكاية المتحف', en: 'Museum Story' },
  { ar: 'بوابة الحضارة المصرية', en: 'Gateway to Egyptian Civilization' },
  { ar: 'رحلة البناء والكنوز', en: 'The Journey of Building and Treasures' },
] as const satisfies LocalizedText[];

const EXPERIENCE_LAYERS = [
  {
    id: 'arrivalNarrative',
    order: '01',
    icon: Compass,
    title: {
      ar: 'طبقة التوجيه والاستقبال',
      en: 'Arrival and Orientation Layer',
    },
    description: {
      ar: 'من أول دقيقة: نقاط استقبال، قراءة سريعة للمسارات، ومفاتيح تنقل تقلل التشتت داخل القاعات الكبيرة.',
      en: 'From minute one: orientation nodes, quick route reading, and movement cues that reduce friction in large halls.',
    },
    duration: {
      ar: '10-15 دقيقة في بداية الجولة',
      en: '10-15 minutes at the start',
    },
    points: [
      { ar: 'لوحات توجيه متعددة اللغات', en: 'Multilingual wayfinding panels' },
      { ar: 'ربط مباشر بين المدخل والعقد الرئيسية', en: 'Direct link between entry and major nodes' },
      { ar: 'توصيات فورية حسب كثافة الزوار', en: 'Real-time suggestions based on crowd levels' },
    ],
  },
  {
    id: 'galleryNarrative',
    order: '02',
    icon: Layers,
    title: {
      ar: 'طبقة السرد المتحفي',
      en: 'Curated Narrative Layer',
    },
    description: {
      ar: 'القاعات مرتبة كسرد بصري وزمني: من القطع الأيقونية إلى السياق التاريخي، مع انتقالات مفهومة بين العصور.',
      en: 'Galleries are arranged as visual and chronological storytelling, moving from iconic objects to historical context.',
    },
    duration: {
      ar: '90-180 دقيقة حسب المسار',
      en: '90-180 minutes based on route',
    },
    points: [
      { ar: 'مسارات سريعة ومسارات عميقة', en: 'Fast-track and deep-dive routes' },
      { ar: 'محطات توقف للشرح المكثف', en: 'Dense interpretation stop points' },
      { ar: 'تدرج واضح بين العصور', en: 'Clear progression between periods' },
    ],
  },
  {
    id: 'conservationNarrative',
    order: '03',
    icon: Shield,
    title: {
      ar: 'طبقة الحفظ والترميم',
      en: 'Conservation and Restoration Layer',
    },
    description: {
      ar: 'تجربة خلف الكواليس: كيف تُصان القطع الأثرية، وما التقنيات المستخدمة للحفاظ على التفاصيل الدقيقة.',
      en: 'A behind-the-scenes layer that reveals how artifacts are preserved and restored with advanced techniques.',
    },
    duration: {
      ar: '30-45 دقيقة للمتابعة التفصيلية',
      en: '30-45 minutes for a focused pass',
    },
    points: [
      { ar: 'نوافذ مشاهدة معامل الترميم', en: 'Lab-viewing windows' },
      { ar: 'شرح خطوات الصيانة قبل/بعد', en: 'Before-and-after restoration narratives' },
      { ar: 'محتوى تقني مبسط للزائر', en: 'Visitor-friendly technical interpretation' },
    ],
  },
  {
    id: 'learningNarrative',
    order: '04',
    icon: BookOpen,
    title: {
      ar: 'طبقة التعلم والتفاعل',
      en: 'Learning and Interaction Layer',
    },
    description: {
      ar: 'ورش ومحطات تفاعلية تجعل الجولة مناسبة للعائلات والطلاب، وتحول المشاهدة إلى تجربة تعليمية حية.',
      en: 'Workshops and interactive stations that make the visit richer for families, students, and curious learners.',
    },
    duration: {
      ar: '40-60 دقيقة قابلة للتوسعة',
      en: '40-60 minutes, expandable',
    },
    points: [
      { ar: 'محتوى عائلي وأنشطة للأطفال', en: 'Family-focused and child-friendly activities' },
      { ar: 'شاشات شرح تفاعلية', en: 'Interactive interpretation displays' },
      { ar: 'برامج تعليمية متدرجة', en: 'Tiered educational programs' },
    ],
  },
] as const;

const FLOOR_INTELLIGENCE = [
  {
    id: 'ground',
    image: '/images/entrance_plaza.jpg',
    imageAlt: {
      ar: 'الدور الأرضي في المتحف',
      en: 'Ground floor orientation experience',
    },
    title: {
      ar: 'الدور الأرضي: الانطباع الأول',
      en: 'Ground Floor: First Impression Layer',
    },
    description: {
      ar: 'منطقة الدخول والتوجيه والانتقال الرئيسي، وفيها تتشكل بداية الرحلة وتوزيع الحركة على القاعات.',
      en: 'The main entry, orientation, and transition level where the visit rhythm is set.',
    },
    badges: [
      { ar: 'ساحة الوصول', en: 'Arrival plaza' },
      { ar: 'الأتريوم', en: 'Grand atrium' },
      { ar: 'السلم الكبير', en: 'Grand staircase' },
    ],
    pace: {
      ar: 'توقفات قصيرة متكررة',
      en: 'Short, frequent pauses',
    },
  },
  {
    id: 'upper',
    image: '/images/tutankhamun_mask.jpg',
    imageAlt: {
      ar: 'قاعات الدور العلوي',
      en: 'Upper floor major galleries',
    },
    title: {
      ar: 'الدور العلوي: كثافة الكنوز',
      en: 'Upper Floor: High-Density Masterpieces',
    },
    description: {
      ar: 'القلب الزمني للمتحف: قاعات توت عنخ آمون، أجنحة الدولة القديمة والحديثة، ومسارات موضوعية متشابكة.',
      en: 'The chronological core with Tutankhamun galleries and major Old/New Kingdom sequences.',
    },
    badges: [
      { ar: 'قاعة توت الكاملة', en: 'Complete Tut collection' },
      { ar: 'أجنحة ملكية', en: 'Royal gallery wings' },
      { ar: 'ممرات سردية', en: 'Narrative-linked corridors' },
    ],
    pace: {
      ar: 'إيقاع متوسط إلى ممتد',
      en: 'Medium to extended pace',
    },
  },
  {
    id: 'lower',
    image: '/images/coffin_interior.jpg',
    imageAlt: {
      ar: 'مسارات الدور السفلي',
      en: 'Lower floor conservation paths',
    },
    title: {
      ar: 'الدور السفلي: العمق العلمي',
      en: 'Lower Floor: Conservation and Learning Depth',
    },
    description: {
      ar: 'مساحات أكثر هدوءًا تربط الحفظ بالمعرفة، وتمنح تجربة أقرب لفهم ما يحدث خلف العرض المتحفي.',
      en: 'A calmer layer connecting conservation workflows with learning hubs and immersive interpretation.',
    },
    badges: [
      { ar: 'ممرات الترميم', en: 'Restoration corridors' },
      { ar: 'مركز التعلم', en: 'Learning center' },
      { ar: 'مسرح غامر', en: 'Immersive theater' },
    ],
    pace: {
      ar: 'إيقاع هادئ ومفصل',
      en: 'Calm, detail-focused pace',
    },
  },
] as const;

const VISITOR_MODES = [
  {
    id: 'express',
    icon: Clock,
    image: '/images/atrium.jpg',
    imageAlt: {
      ar: 'مسار الزيارة السريع داخل المتحف',
      en: 'Express route through the museum',
    },
    name: {
      ar: 'المسار السريع',
      en: 'Express Route',
    },
    duration: {
      ar: '90-120 دقيقة',
      en: '90-120 minutes',
    },
    fitFor: {
      ar: 'لمن لديه وقت محدود ويريد أهم المحطات',
      en: 'For visitors with limited time who want key highlights',
    },
    focus: {
      ar: 'أفضل للتعرف السريع على روح المتحف مع انتقالات قليلة.',
      en: 'Best for a quick first understanding of the museum with minimal transitions.',
    },
    stops: [
      { ar: 'ساحة الوصول والواجهة المعمارية', en: 'Arrival plaza and architectural forecourt' },
      { ar: 'الأتريوم + الدرج الكبير', en: 'Grand atrium and staircase' },
      { ar: 'قاعات توت عنخ آمون المختارة', en: 'Selected Tutankhamun galleries' },
      { ar: 'محطة ختامية في الجناح الهادئ', en: 'Closing stop in a calmer wing' },
    ],
    tips: [
      { ar: 'ابدأ مبكرًا لتجنب ذروة الازدحام.', en: 'Start early to avoid peak congestion.' },
      { ar: 'التزم بالمسار المباشر دون التفرعات الطويلة.', en: 'Stay on the direct path and skip deep branches.' },
      { ar: 'استخدم نقاط الإرشاد لتحديث ترتيب المحطات.', en: 'Use wayfinding points to adjust stop order quickly.' },
    ],
  },
  {
    id: 'family',
    icon: Users,
    image: '/images/exhibition_hall.jpg',
    imageAlt: {
      ar: 'مسار عائلي داخل قاعات المتحف',
      en: 'Family-friendly route inside the museum',
    },
    name: {
      ar: 'المسار العائلي',
      en: 'Family Route',
    },
    duration: {
      ar: '2.5-3.5 ساعات',
      en: '2.5-3.5 hours',
    },
    fitFor: {
      ar: 'للعائلات والأطفال مع فترات راحة مرنة',
      en: 'For families and children with flexible break points',
    },
    focus: {
      ar: 'يركز على القاعات الأكثر جذبًا بصريًا مع محطات تفاعلية وتوقفات مريحة.',
      en: 'Prioritizes visually engaging galleries with interactive stops and rest nodes.',
    },
    stops: [
      { ar: 'الأتريوم ونقطة التوجيه العائلي', en: 'Atrium and family orientation node' },
      { ar: 'الممرات الملكية الواسعة', en: 'Wide royal corridors' },
      { ar: 'مركز التعلم والأنشطة', en: 'Learning center and activity stations' },
      { ar: 'صالة العائلات وإعادة الشحن', en: 'Family lounge and recharge zone' },
    ],
    tips: [
      { ar: 'قسّم الجولة إلى مقاطع 35-45 دقيقة.', en: 'Split the visit into 35-45 minute segments.' },
      { ar: 'اجعل التوقفات المخطط لها جزءًا أساسيًا من الجولة.', en: 'Treat planned breaks as part of the route.' },
      { ar: 'ابدأ بالأجنحة الواسعة قبل القاعات كثيفة الحركة.', en: 'Start with wide galleries before dense sections.' },
    ],
  },
  {
    id: 'research',
    icon: BookOpen,
    image: '/images/papyrus.jpg',
    imageAlt: {
      ar: 'مسار بحثي داخل المتحف',
      en: 'Research-oriented route inside the museum',
    },
    name: {
      ar: 'مسار الباحثين',
      en: 'Research Route',
    },
    duration: {
      ar: '3-4 ساعات',
      en: '3-4 hours',
    },
    fitFor: {
      ar: 'للمهتمين بالتفاصيل والسياق التاريخي',
      en: 'For visitors seeking deeper context and object-level detail',
    },
    focus: {
      ar: 'يوفر انتقالًا أبطأ مع وقت أطول للقراءة والمقارنة بين العصور والمدارس الفنية.',
      en: 'Offers a slower cadence with extended time for reading and cross-period comparison.',
    },
    stops: [
      { ar: 'الدولة القديمة: البدايات النظامية', en: 'Old Kingdom galleries for foundational state narratives' },
      { ar: 'الدولة الحديثة: الذروة الملكية', en: 'New Kingdom wing for royal high point interpretation' },
      { ar: 'اليوناني الروماني: التحولات الثقافية', en: 'Greco-Roman wing for cultural transition reading' },
      { ar: 'ممرات الترميم: المادة والحفظ', en: 'Restoration corridors for material-preservation insight' },
    ],
    tips: [
      { ar: 'احتفظ بملاحظات قصيرة لكل قاعة للمقارنة لاحقًا.', en: 'Keep short notes per gallery for later comparison.' },
      { ar: 'استخدم المحطات الهادئة للقراءة المتعمقة.', en: 'Use quiet pockets for deeper label reading.' },
      { ar: 'اترك آخر 30 دقيقة للمراجعة الحرة.', en: 'Reserve the final 30 minutes for open revisits.' },
    ],
  },
] as const;

type VisitorModeId = (typeof VISITOR_MODES)[number]['id'];

const TIME_PLANS = [
  {
    id: 'twoHours',
    icon: Clock,
    label: {
      ar: 'خطة ساعتين',
      en: '2-Hour Plan',
    },
    duration: {
      ar: '120 دقيقة',
      en: '120 minutes',
    },
    objective: {
      ar: 'تركيز على أهم التجارب البصرية والرمزية.',
      en: 'Focus on iconic visual and symbolic highlights.',
    },
    sequence: [
      { ar: 'المدخل والواجهة + نقطة توجيه', en: 'Entrance forecourt and orientation node' },
      { ar: 'الأتريوم والدرج الكبير', en: 'Grand atrium and staircase' },
      { ar: 'مختارات توت عنخ آمون', en: 'Selected Tutankhamun highlights' },
      { ar: 'خروج عبر جناح هادئ', en: 'Exit through a calmer wing' },
    ],
    notes: [
      { ar: 'مثالية للزيارة الأولى السريعة.', en: 'Ideal for a first, fast museum pass.' },
      { ar: 'قلل التفرعات الطويلة داخل الأدوار.', en: 'Avoid long side branches during this plan.' },
    ],
  },
  {
    id: 'halfDay',
    icon: CalendarDays,
    label: {
      ar: 'خطة نصف يوم',
      en: 'Half-Day Plan',
    },
    duration: {
      ar: '3-4 ساعات',
      en: '3-4 hours',
    },
    objective: {
      ar: 'توازن بين السرد الزمني والتجربة المعمارية.',
      en: 'A balance between chronological narrative and architecture.',
    },
    sequence: [
      { ar: 'الدور الأرضي: التوجيه والانطلاق', en: 'Ground floor: orientation and launch' },
      { ar: 'الدور العلوي: الدولة القديمة + الحديثة', en: 'Upper floor: Old + New Kingdom wings' },
      { ar: 'قاعات توت بتفصيل متوسط', en: 'Tutankhamun galleries with medium depth' },
      { ar: 'توقف خفيف في الخدمات أو التعلم', en: 'Short break at services or learning node' },
    ],
    notes: [
      { ar: 'أفضل خيار لمعظم الزوار.', en: 'Best option for most visitors.' },
      { ar: 'يستوعب فترات راحة دون فقدان السرد.', en: 'Supports breaks without losing narrative flow.' },
    ],
  },
  {
    id: 'fullDay',
    icon: Route,
    label: {
      ar: 'خطة يوم كامل',
      en: 'Full-Day Plan',
    },
    duration: {
      ar: '5-7 ساعات',
      en: '5-7 hours',
    },
    objective: {
      ar: 'تجربة شاملة تشمل القاعات والعمق البحثي وخلف الكواليس.',
      en: 'A full-spectrum experience including deeper research-oriented layers.',
    },
    sequence: [
      { ar: 'انطلاقة معمارية كاملة من المدخل', en: 'Full architectural opening from forecourt to atrium' },
      { ar: 'مسار زمني شامل عبر الأدوار', en: 'Comprehensive chronological route across floors' },
      { ar: 'ممرات الترميم والتعلم التفاعلي', en: 'Restoration corridors and interactive learning hubs' },
      { ar: 'جولة مراجعة نهائية للمفضلات', en: 'Final revisit loop for favorite sections' },
    ],
    notes: [
      { ar: 'مناسب لعشاق التفاصيل والتصوير.', en: 'Great for detail-focused visitors and photographers.' },
      { ar: 'احتفظ بوقتين راحة مخططين مسبقًا.', en: 'Plan at least two structured break windows.' },
    ],
  },
] as const;

type TimePlanId = (typeof TIME_PLANS)[number]['id'];

const MILESTONE_GALLERY = [
  {
    id: 'vision',
    year: '2002',
    image: '/images/giza_plateau.jpg',
    title: {
      ar: 'انطلاق الرؤية',
      en: 'Vision Launch',
    },
    text: {
      ar: 'بداية المشروع كفكرة وطنية لإنشاء أكبر متحف أثري في العالم.',
      en: 'The project begins as a national vision for the largest archaeological museum.',
    },
  },
  {
    id: 'build',
    year: '2005',
    image: '/images/entrance_plaza.jpg',
    title: {
      ar: 'البدء في البناء',
      en: 'Construction Begins',
    },
    text: {
      ar: 'تشغيل الموقع على مساحة ضخمة مع بنية تحتية متحفية متقدمة.',
      en: 'Site works begin at scale with advanced museum infrastructure planning.',
    },
  },
  {
    id: 'staircase',
    year: '2018',
    image: '/images/staircase.jpg',
    title: {
      ar: 'اكتمال الدرج الكبير',
      en: 'Grand Staircase Milestone',
    },
    text: {
      ar: 'ظهور المحور الأيقوني الذي ينظم انتقال الزائر بين الطبقات السردية.',
      en: 'The iconic transition spine is completed, structuring visitor movement.',
    },
  },
  {
    id: 'tut',
    year: '2020',
    image: '/images/tutankhamun_mask.jpg',
    title: {
      ar: 'تجميع كنوز توت',
      en: 'Tut Collection Consolidation',
    },
    text: {
      ar: 'جمع المجموعة الكاملة لتوت عنخ آمون في سياق عرض واحد متكامل.',
      en: 'The complete Tutankhamun corpus is assembled into one coherent narrative.',
    },
  },
  {
    id: 'opening',
    year: '2025',
    image: '/images/museum_night.jpg',
    title: {
      ar: 'مرحلة الافتتاح',
      en: 'Opening Era',
    },
    text: {
      ar: 'تحول المشروع إلى تجربة حية تستقبل الجمهور من مختلف أنحاء العالم.',
      en: 'The project transitions into a live public experience for global audiences.',
    },
  },
] as const;

export default function About() {
  const { t, i18n } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<VisitorModeId>('express');
  const [activePlan, setActivePlan] = useState<TimePlanId>('twoHours');
  const isArabic = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');
  const pick = (text: LocalizedText) => (isArabic ? text.ar : text.en);
  const activeModeData = useMemo(
    () => VISITOR_MODES.find((mode) => mode.id === activeMode) ?? VISITOR_MODES[0],
    [activeMode],
  );
  const activePlanData = useMemo(
    () => TIME_PLANS.find((plan) => plan.id === activePlan) ?? TIME_PLANS[0],
    [activePlan],
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-hero-content',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-hero',
            start: 'top 80%',
          },
        },
      );

      gsap.fromTo(
        '.stat-card',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.timeline-item',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.timeline-section',
            start: 'top 70%',
          },
        },
      );

      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 70%',
          },
        },
      );

      gsap.fromTo(
        '.experience-card',
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.experience-section',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.floor-intelligence-card',
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.floor-intelligence-section',
            start: 'top 76%',
          },
        },
      );

      gsap.fromTo(
        '.visitor-modes-shell',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.visitor-modes-section',
            start: 'top 78%',
          },
        },
      );

      gsap.fromTo(
        '.planner-shell',
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.visit-planner-section',
            start: 'top 78%',
          },
        },
      );

      gsap.fromTo(
        '.milestone-card',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.09,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.milestones-gallery-section',
            start: 'top 78%',
          },
        },
      );

      gsap.fromTo(
        '.architecture-content',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.architecture-section',
            start: 'top 70%',
          },
        },
      );

      gsap.fromTo(
        '.architecture-image',
        { opacity: 0, x: 50, scale: 1.05 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.architecture-section',
            start: 'top 70%',
          },
        },
      );

      gsap.fromTo(
        '.highlight-item',
        { opacity: 0, y: 22, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.architecture-highlights',
            start: 'top 80%',
          },
        },
      );

      gsap.to('.about-hero-bg img', {
        scale: 1.12,
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interactive = pageRef.current?.querySelectorAll<HTMLElement>(
      '.stat-card, .timeline-item, .feature-card, .experience-card, .floor-intelligence-card, .visitor-modes-shell, .planner-shell, .milestone-card',
    );
    if (!interactive || interactive.length === 0) return;

    const cleanup: Array<() => void> = [];

    interactive.forEach((card) => {
      const onMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      };

      const onLeave = () => {
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      };

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      cleanup.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => cleanup.forEach((fn) => fn());
  }, []);

  return (
    <div ref={pageRef} className="about-page">
      <section className="about-hero">
        <div className="about-hero-bg">
          <img src="/images/museum_night.jpg" alt={t('about.hero.imageAlt')} />
          <div className="about-hero-overlay" />
        </div>
        <MuseumHero3D />
        <div className="about-hero-content">
          <span className="mono about-hero-label">{t('about.hero.label')}</span>
          <h1 className="headline-xl">{t('about.hero.title')}</h1>
          <p className="about-hero-description">{t('about.hero.description')}</p>
          <div className="about-name-chips">
            {ABOUT_ALT_NAMES.map((name) => (
              <span key={name.en} className="about-name-chip">
                {pick(name)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          {STATS.map((stat, index) => (
            <div key={index} className="stat-card">
              <stat.icon className="stat-icon" size={32} />
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{t(stat.labelKey)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="architecture-section">
        <div className="architecture-content">
          <span className="mono section-label">{t('about.architecture.label')}</span>
          <h2 className="headline-lg">{t('about.architecture.title')}</h2>
          <p className="architecture-text">{t('about.architecture.p1')}</p>
          <p className="architecture-text">{t('about.architecture.p2')}</p>
          <div className="architecture-highlights">
            <div className="highlight-item">
              <span className="highlight-number">11m</span>
              <span className="highlight-text">{t('about.architecture.highlights.obelisk')}</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">87</span>
              <span className="highlight-text">{t('about.architecture.highlights.statues')}</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">28m</span>
              <span className="highlight-text">{t('about.architecture.highlights.ramesses')}</span>
            </div>
          </div>
        </div>
        <div className="architecture-image">
          <img src="/images/entrance_plaza.jpg" alt={t('about.architecture.imageAlt')} />
        </div>
      </section>

      <section className="timeline-section">
        <div className="timeline-container">
          <div className="timeline-header">
            <span className="mono section-label">{t('about.timeline.label')}</span>
            <h2 className="headline-lg">{t('about.timeline.title')}</h2>
          </div>

          <div className="timeline">
            {TIMELINE.map((event) => (
              <div key={event.id} className="timeline-item">
                <div className="timeline-year">{event.year}</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">{t(`about.timeline.events.${event.id}.title`)}</h3>
                  <p className="timeline-description">{t(`about.timeline.events.${event.id}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <span className="mono section-label">{t('about.features.label')}</span>
            <h2 className="headline-lg">{t('about.features.title')}</h2>
          </div>

          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.id} className="feature-card">
                <h3 className="feature-title">{t(`about.features.items.${f.id}.title`)}</h3>
                <p className="feature-description">{t(`about.features.items.${f.id}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="experience-section">
        <div className="experience-container">
          <div className="experience-header">
            <span className="mono section-label">{pick({ ar: 'قراءة أشمل للمتحف', en: 'A Broader Reading' })}</span>
            <h2 className="headline-lg">{pick({ ar: 'التجربة بأكثر من عدسة', en: 'The Experience Through Multiple Lenses' })}</h2>
            <p className="experience-intro">
              {pick({
                ar: 'بدل شكل واحد للزيارة، الصفحة الآن تعرض المتحف كطبقات: حركة، سرد، ترميم، وتعلم. اختر العمق الذي يناسب وقتك واهتمامك.',
                en: 'Instead of one fixed narrative, this page now frames the museum in layers: movement, storytelling, conservation, and learning.',
              })}
            </p>
          </div>

          <div className="experience-grid">
            {EXPERIENCE_LAYERS.map((layer) => (
              <article key={layer.id} className="experience-card">
                <div className="experience-card-head">
                  <span className="experience-index">{layer.order}</span>
                  <layer.icon className="experience-icon" size={21} />
                </div>
                <h3 className="experience-title">{pick(layer.title)}</h3>
                <p className="experience-description">{pick(layer.description)}</p>
                <span className="experience-duration">{pick(layer.duration)}</span>
                <ul className="experience-points">
                  {layer.points.map((point, idx) => (
                    <li key={`${layer.id}-${idx}`}>{pick(point)}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="floor-intelligence-section">
        <div className="floor-intelligence-container">
          <div className="floor-intelligence-header">
            <span className="mono section-label">{pick({ ar: 'ذكاء الأدوار', en: 'Floor Intelligence' })}</span>
            <h2 className="headline-lg">{pick({ ar: 'الخريطة الفكرية لكل دور', en: 'A Strategic Guide to Each Floor' })}</h2>
            <p className="floor-intelligence-intro">
              {pick({
                ar: 'كل دور له شخصية مختلفة. هنا ملخص سريع يساعدك تقرر أين تبدأ، وما الذي تركز عليه، وكيف تضبط إيقاعك داخل المتحف.',
                en: 'Each floor has its own personality. Use this compact guide to decide where to start and how to pace your visit.',
              })}
            </p>
          </div>

          <div className="floor-intelligence-grid">
            {FLOOR_INTELLIGENCE.map((floor) => (
              <article key={floor.id} className="floor-intelligence-card">
                <div className="floor-intelligence-image">
                  <img src={floor.image} alt={pick(floor.imageAlt)} />
                </div>
                <div className="floor-intelligence-content">
                  <h3 className="floor-intelligence-title">{pick(floor.title)}</h3>
                  <p className="floor-intelligence-description">{pick(floor.description)}</p>
                  <div className="floor-intelligence-badges">
                    {floor.badges.map((badge, idx) => (
                      <span key={`${floor.id}-${idx}`} className="floor-intelligence-badge">
                        {pick(badge)}
                      </span>
                    ))}
                  </div>
                  <div className="floor-intelligence-footer">
                    <span>{pick({ ar: 'الإيقاع المقترح', en: 'Suggested pace' })}</span>
                    <strong>{pick(floor.pace)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="floor-intelligence-note">
            <Sparkles size={18} />
            <p>
              {pick({
                ar: 'نصيحة: ابدأ من الدور الأرضي للتوجيه، ثم اختر بين العمق الزمني في العلوي أو الهدوء العلمي في السفلي حسب طاقة مجموعتك.',
                en: 'Tip: start with ground-floor orientation, then choose upper-floor density or lower-floor depth based on your group energy.',
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="visitor-modes-section">
        <div className="visitor-modes-container">
          <div className="visitor-modes-header">
            <span className="mono section-label">{pick({ ar: 'صمّم زيارتك', en: 'Design Your Visit' })}</span>
            <h2 className="headline-lg">{pick({ ar: 'اختر نمط الجولة المناسب لك', en: 'Pick the Visiting Mode That Fits You' })}</h2>
            <p className="visitor-modes-intro">
              {pick({
                ar: 'اختيار النمط الصحيح يغيّر التجربة بالكامل. بدّل بين الأنماط وشاهد خطة زيارة عملية تشمل المدة، المحطات الأساسية، ونصائح الحركة.',
                en: 'The right mode changes the entire museum experience. Switch between modes to preview duration, core stops, and movement tips.',
              })}
            </p>
          </div>

          <div className="visitor-mode-tabs" role="tablist" aria-label={pick({ ar: 'أنماط الزيارة', en: 'Visitor modes' })}>
            {VISITOR_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={activeMode === mode.id}
                className={`visitor-mode-tab ${activeMode === mode.id ? 'active' : ''}`}
                onClick={() => setActiveMode(mode.id)}
              >
                <mode.icon size={16} />
                <span>{pick(mode.name)}</span>
              </button>
            ))}
          </div>

          <article className="visitor-modes-shell">
            <div className="visitor-mode-image">
              <img src={activeModeData.image} alt={pick(activeModeData.imageAlt)} />
            </div>

            <div className="visitor-mode-content">
              <h3 className="visitor-mode-title">{pick(activeModeData.name)}</h3>
              <p className="visitor-mode-focus">{pick(activeModeData.focus)}</p>

              <div className="visitor-mode-meta">
                <span>
                  {pick({ ar: 'المدة', en: 'Duration' })}: <strong>{pick(activeModeData.duration)}</strong>
                </span>
                <span>
                  {pick({ ar: 'مناسب لـ', en: 'Best for' })}: <strong>{pick(activeModeData.fitFor)}</strong>
                </span>
              </div>

              <div className="visitor-mode-grid">
                <div className="visitor-mode-column">
                  <h4>{pick({ ar: 'المحطات الأساسية', en: 'Core Stops' })}</h4>
                  <ul className="visitor-mode-list">
                    {activeModeData.stops.map((stop, idx) => (
                      <li key={`${activeModeData.id}-stop-${idx}`}>{pick(stop)}</li>
                    ))}
                  </ul>
                </div>
                <div className="visitor-mode-column">
                  <h4>{pick({ ar: 'نصائح تنفيذ المسار', en: 'Execution Tips' })}</h4>
                  <ul className="visitor-mode-list">
                    {activeModeData.tips.map((tip, idx) => (
                      <li key={`${activeModeData.id}-tip-${idx}`}>{pick(tip)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="visit-planner-section">
        <div className="visit-planner-container">
          <div className="visit-planner-header">
            <span className="mono section-label">{pick({ ar: 'خطة حسب وقتك', en: 'Plan By Available Time' })}</span>
            <h2 className="headline-lg">{pick({ ar: 'حدد وقتك وشوف المسار المناسب', en: 'Set Your Time and Get the Right Flow' })}</h2>
            <p className="visit-planner-intro">
              {pick({
                ar: 'لو وقتك محدود أو مفتوح، هذه الخطة تساعدك تختار توزيع ذكي للزيارة بدون إهدار وقت أو تفويت المحطات المهمة.',
                en: 'Whether your time is tight or flexible, this planner suggests a practical distribution without losing key moments.',
              })}
            </p>
          </div>

          <div className="visit-planner-tabs" role="tablist" aria-label={pick({ ar: 'خطط الوقت', en: 'Time plans' })}>
            {TIME_PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                role="tab"
                aria-selected={activePlan === plan.id}
                className={`visit-planner-tab ${activePlan === plan.id ? 'active' : ''}`}
                onClick={() => setActivePlan(plan.id)}
              >
                <plan.icon size={16} />
                <span>{pick(plan.label)}</span>
              </button>
            ))}
          </div>

          <article className="planner-shell">
            <div className="planner-summary">
              <activePlanData.icon className="planner-icon" size={22} />
              <h3>{pick(activePlanData.label)}</h3>
              <p>{pick(activePlanData.objective)}</p>
              <div className="planner-meta">
                <span>{pick({ ar: 'المدة الإجمالية', en: 'Total Duration' })}</span>
                <strong>{pick(activePlanData.duration)}</strong>
              </div>
            </div>

            <div className="planner-details">
              <div className="planner-column">
                <h4>{pick({ ar: 'تسلسل الزيارة المقترح', en: 'Suggested Sequence' })}</h4>
                <ol className="planner-list">
                  {activePlanData.sequence.map((step, idx) => (
                    <li key={`${activePlanData.id}-seq-${idx}`}>{pick(step)}</li>
                  ))}
                </ol>
              </div>
              <div className="planner-column">
                <h4>{pick({ ar: 'ملاحظات تنفيذية', en: 'Execution Notes' })}</h4>
                <ul className="planner-list">
                  {activePlanData.notes.map((note, idx) => (
                    <li key={`${activePlanData.id}-note-${idx}`}>{pick(note)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="milestones-gallery-section">
        <div className="milestones-gallery-container">
          <div className="milestones-gallery-header">
            <span className="mono section-label">{pick({ ar: 'خط زمني بصري', en: 'Visual Milestones' })}</span>
            <h2 className="headline-lg">{pick({ ar: 'محطات رئيسية في رحلة المتحف', en: 'Key Moments in the Museum Journey' })}</h2>
          </div>

          <div className="milestones-gallery-grid">
            {MILESTONE_GALLERY.map((item) => (
              <article key={item.id} className="milestone-card">
                <div className="milestone-image">
                  <img src={item.image} alt={pick(item.title)} />
                </div>
                <div className="milestone-content">
                  <span className="milestone-year">{item.year}</span>
                  <h3>{pick(item.title)}</h3>
                  <p>{pick(item.text)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="about-cta-content">
          <h2 className="headline-md">{t('about.cta.title')}</h2>
          <p className="about-cta-text">{t('about.cta.text')}</p>
          <div className="about-cta-buttons">
            <Link to="/tickets" className="btn-gold">
              {t('about.cta.getTickets')}
            </Link>
            <Link to="/visit" className="btn-primary">
              {t('about.cta.planVisit')}
            </Link>
          </div>
        </div>
      </section>

      <div className="grain-overlay" />
    </div>
  );
}
