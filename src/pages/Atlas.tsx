import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BookOpen,
  Clock3,
  Compass,
  Gem,
  Landmark,
  MapPin,
  Microscope,
  Play,
  Search,
  Ticket,
  Video,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import MuseumHero3D from '../components/MuseumHero3D';
import './Atlas.css';

gsap.registerPlugin(ScrollTrigger);

type Localized = {
  ar: string;
  en: string;
};

type Masterpiece = {
  id: string;
  image: string;
  category: 'treasures' | 'artifacts' | 'architecture' | 'landscapes';
  periodKey: string;
  periodLabel: Localized;
  title: Localized;
  date: string;
  material: Localized;
  provenance: Localized;
  discovery: Localized;
  significance: Localized;
};

type AtlasAnchor = {
  id: string;
  label: Localized;
};

type FloorCorridor = {
  id: string;
  zone: string;
  title: Localized;
  orientation: Localized;
  connection: Localized;
  dwellTime: string;
  crowd: Localized;
  highlights: Localized[];
};

type FloorAtlasItem = {
  id: string;
  level: Localized;
  title: Localized;
  overview: Localized;
  bestTime: Localized;
  traffic: string;
  collectionMix: Localized;
  services: Localized[];
  corridors: FloorCorridor[];
};

type SystemBrief = {
  id: string;
  title: Localized;
  summary: Localized;
  metrics: Array<{ label: Localized; value: string }>;
  actions: Localized[];
};

const FACTS: Array<{ value: string; icon: typeof Landmark; label: Localized; detail: Localized }> = [
  {
    value: '100,000+',
    icon: Gem,
    label: { ar: 'قطعة أثرية', en: 'Artifacts' },
    detail: { ar: 'أكبر تجمّع للآثار المصرية القديمة في موقع واحد', en: 'Largest concentration of ancient Egyptian objects in one site' },
  },
  {
    value: '5,398',
    icon: BookOpen,
    label: { ar: 'مقتنيات توت عنخ آمون', en: 'Tutankhamun Objects' },
    detail: { ar: 'المجموعة الكاملة معروضة مع سياقها الجنائزي', en: 'The complete corpus displayed in one curatorial narrative' },
  },
  {
    value: '50',
    icon: Landmark,
    label: { ar: 'قاعة عرض', en: 'Galleries' },
    detail: { ar: 'مسار زمني يبدأ من ما قبل الأسرات حتى العصر الروماني', en: 'A chronological pathway from Predynastic Egypt to Rome' },
  },
  {
    value: '480,000 m²',
    icon: Compass,
    label: { ar: 'مساحة المتحف', en: 'Museum Area' },
    detail: { ar: 'مبنى ثقافي متكامل يضم العرض والحفظ والبحث', en: 'An integrated campus for display, conservation, and research' },
  },
  {
    value: '7,000',
    icon: Clock3,
    label: { ar: 'سنة تاريخ', en: 'Years of History' },
    detail: { ar: 'تطور الدولة المصرية والديانة والفن والعمارة عبر العصور', en: 'Statehood, religion, art, and architecture across millennia' },
  },
  {
    value: '24/7',
    icon: Microscope,
    label: { ar: 'عمل معامل الحفظ', en: 'Conservation Labs' },
    detail: { ar: 'متابعة علمية للمواد العضوية والحجرية والمعدنية', en: 'Continuous diagnostics for organic, stone, and metal objects' },
  },
];

const TIMELINE: Array<{
  years: string;
  title: Localized;
  summary: Localized;
  keyPoints: Localized[];
}> = [
  {
    years: 'c. 6000-3150 BCE',
    title: { ar: 'ما قبل الأسرات', en: 'Predynastic Egypt' },
    summary: {
      ar: 'تكوّن المجتمعات الزراعية على ضفاف النيل وبداية الرموز الجنائزية والملكية.',
      en: 'Farming communities emerge along the Nile with early funerary and royal symbols.',
    },
    keyPoints: [
      { ar: 'مقابر النخبة في نقادة', en: 'Elite cemeteries at Naqada' },
      { ar: 'تطور صناعة الفخار الملون', en: 'Advanced painted ceramics' },
    ],
  },
  {
    years: 'c. 3150-2686 BCE',
    title: { ar: 'العصر العتيق', en: 'Early Dynastic Period' },
    summary: {
      ar: 'توحيد البلاد وتأسيس البيروقراطية المركزية وظهور الكتابة الرسمية.',
      en: 'Political unification, centralized administration, and formalized writing.',
    },
    keyPoints: [
      { ar: 'بناء عاصمة ملكية في ممفيس', en: 'Royal capital at Memphis' },
      { ar: 'بواكير النقوش الهيروغليفية', en: 'Early hieroglyphic inscriptions' },
    ],
  },
  {
    years: 'c. 2686-2181 BCE',
    title: { ar: 'الدولة القديمة', en: 'Old Kingdom' },
    summary: {
      ar: 'عصر الأهرام الكبرى وتثبيت فن النحت الملكي وطقوس ما بعد الموت.',
      en: 'The age of pyramids with canonical royal statuary and funerary theology.',
    },
    keyPoints: [
      { ar: 'مشروعات الجيزة وسقارة', en: 'Giza and Saqqara programs' },
      { ar: 'نصوص الأهرام الأولى', en: 'Earliest Pyramid Texts' },
    ],
  },
  {
    years: 'c. 2055-1650 BCE',
    title: { ar: 'الدولة الوسطى', en: 'Middle Kingdom' },
    summary: {
      ar: 'إعادة توحيد الدولة وازدهار الأدب الرسمي والبعثات التعدينية.',
      en: 'Reunification, state literature, and expanded mining expeditions.',
    },
    keyPoints: [
      { ar: 'تماثيل واقعية للملوك', en: 'Highly individual royal portraits' },
      { ar: 'تعزيز الحصون والحدود', en: 'Fortified frontiers and garrisons' },
    ],
  },
  {
    years: 'c. 1550-1069 BCE',
    title: { ar: 'الدولة الحديثة', en: 'New Kingdom' },
    summary: {
      ar: 'الإمبراطورية المصرية، عصر المعابد الكبرى، وذروة الفنون الملكية.',
      en: 'Imperial Egypt, monumental temples, and peak royal craftsmanship.',
    },
    keyPoints: [
      { ar: 'وادي الملوك وكنوز توت', en: 'Valley of the Kings and Tut treasures' },
      { ar: 'مشروعات الكرنك والأقصر', en: 'Karnak and Luxor temple programs' },
    ],
  },
  {
    years: '332 BCE-395 CE',
    title: { ar: 'العصر اليوناني الروماني', en: 'Greco-Roman Egypt' },
    summary: {
      ar: 'امتزاج التقاليد المصرية مع الثقافة الهلنستية والرومانية.',
      en: 'Egyptian traditions blended with Hellenistic and Roman visual culture.',
    },
    keyPoints: [
      { ar: 'بورتريهات الفيوم', en: 'Fayum portraits' },
      { ar: 'عبادات مشتركة ومركّبة', en: 'Hybrid cult imagery' },
    ],
  },
];

const ZONES: Array<{
  code: string;
  title: Localized;
  floor: Localized;
  focus: Localized;
  duration: string;
  highlights: Localized[];
}> = [
  {
    code: 'A1',
    title: { ar: 'بوابة الحضارة', en: 'Origins Gallery' },
    floor: { ar: 'الدور الأرضي', en: 'Ground Floor' },
    focus: { ar: 'ما قبل الأسرات والعصر العتيق', en: 'Predynastic and Early Dynastic' },
    duration: '35-50 min',
    highlights: [
      { ar: 'فخار نقادة', en: 'Naqada painted pottery' },
      { ar: 'مقابر مبكرة', en: 'Early burial assemblages' },
      { ar: 'رموز السلطة الأولى', en: 'Earliest symbols of kingship' },
    ],
  },
  {
    code: 'B2',
    title: { ar: 'بناة الأهرام', en: 'Pyramid Builders' },
    floor: { ar: 'الدور الأرضي', en: 'Ground Floor' },
    focus: { ar: 'الدولة القديمة', en: 'Old Kingdom' },
    duration: '45-65 min',
    highlights: [
      { ar: 'تماثيل ملكية', en: 'Royal statuary' },
      { ar: 'نقوش مقابر', en: 'Tomb reliefs' },
      { ar: 'أدوات الحياة اليومية', en: 'Daily life objects' },
    ],
  },
  {
    code: 'C3',
    title: { ar: 'الدولة والكتابة', en: 'State and Scribal Culture' },
    floor: { ar: 'الدور الأرضي', en: 'Ground Floor' },
    focus: { ar: 'الدولة الوسطى', en: 'Middle Kingdom' },
    duration: '35-55 min',
    highlights: [
      { ar: 'برديات إدارية', en: 'Administrative papyri' },
      { ar: 'ألواح كتابية', en: 'Scribal palettes' },
      { ar: 'تماثيل حكام الأقاليم', en: 'Provincial portraiture' },
    ],
  },
  {
    code: 'D4',
    title: { ar: 'عصر الإمبراطورية', en: 'Imperial Egypt' },
    floor: { ar: 'الدور العلوي', en: 'Upper Floor' },
    focus: { ar: 'الدولة الحديثة', en: 'New Kingdom' },
    duration: '60-90 min',
    highlights: [
      { ar: 'أسلحة وعربات', en: 'Weapons and chariots' },
      { ar: 'ذهب ملكي', en: 'Royal goldwork' },
      { ar: 'نقوش معبدية', en: 'Temple narratives' },
    ],
  },
  {
    code: 'E5',
    title: { ar: 'توت عنخ آمون الكامل', en: 'Tutankhamun Complete Collection' },
    floor: { ar: 'الدور العلوي', en: 'Upper Floor' },
    focus: { ar: '5398 قطعة', en: '5,398 objects in sequence' },
    duration: '90-140 min',
    highlights: [
      { ar: 'القناع الذهبي', en: 'Golden funerary mask' },
      { ar: 'التوابيت الثلاثة', en: 'Nested coffins' },
      { ar: 'العرش والعجلة الملكية', en: 'Throne and chariot' },
    ],
  },
  {
    code: 'F6',
    title: { ar: 'معامل الحفظ', en: 'Open Conservation Labs' },
    floor: { ar: 'الدور السفلي', en: 'Lower Level' },
    focus: { ar: 'علوم الترميم', en: 'Conservation science' },
    duration: '25-40 min',
    highlights: [
      { ar: 'تصوير متعدد الأطياف', en: 'Multispectral imaging' },
      { ar: 'تحليل مواد', en: 'Material diagnostics' },
      { ar: 'توثيق ثلاثي الأبعاد', en: '3D digital documentation' },
    ],
  },
];

const ATLAS_ANCHORS: AtlasAnchor[] = [
  { id: 'atlas-facts', label: { ar: 'أرقام سريعة', en: 'Quick Metrics' } },
  { id: 'atlas-timeline', label: { ar: 'الخط الزمني', en: 'Timeline' } },
  { id: 'atlas-zones', label: { ar: 'دليل القاعات', en: 'Gallery Guide' } },
  { id: 'atlas-floors', label: { ar: 'الأدوار والممرات', en: 'Floors & Corridors' } },
  { id: 'atlas-systems', label: { ar: 'تشغيل الزيارة', en: 'Visit Systems' } },
  { id: 'atlas-explorer', label: { ar: 'موسوعة القطع', en: 'Objects Explorer' } },
  { id: 'atlas-routes', label: { ar: 'المسارات', en: 'Routes' } },
];

const FLOOR_ATLAS: FloorAtlasItem[] = [
  {
    id: 'lower',
    level: { ar: 'الدور السفلي', en: 'Lower Level' },
    title: { ar: 'خلف المشهد العلمي', en: 'Behind-the-Scenes Science' },
    overview: {
      ar: 'مستوى مخصص للمعامل والتعليم وتهيئة الزيارة الطويلة، مع مسارات واضحة تربط الخدمات بالمحتوى العلمي.',
      en: 'A level dedicated to labs, learning, and long-stay preparation, with clear links between services and scientific content.',
    },
    bestTime: { ar: 'أفضل وقت: 10:00-12:00 لتجنب الذروة', en: 'Best window: 10:00-12:00 before peak traffic' },
    traffic: 'Low to Medium',
    collectionMix: { ar: 'ترميم، تشخيص مواد، شاشات تفاعلية تعليمية', en: 'Conservation, material diagnostics, and educational interactives' },
    services: [
      { ar: 'مركز معلومات شامل', en: 'Full information desk' },
      { ar: 'قاعة محاضرات قصيرة', en: 'Short lecture hall' },
      { ar: 'نقاط شحن ومقاعد هادئة', en: 'Charging points and quiet seating' },
      { ar: 'مخارج سريعة للمصاعد', en: 'Fast elevator access points' },
    ],
    corridors: [
      {
        id: 'lower-labs',
        zone: 'F6',
        title: { ar: 'محور المعامل المفتوحة', en: 'Open Labs Spine' },
        orientation: { ar: 'يمتد بمحاذاة منطقة التحاليل', en: 'Runs along the diagnostics wing' },
        connection: { ar: 'يربط معامل الحفظ بشاشات التوثيق الرقمي', en: 'Connects conservation labs to digital documentation displays' },
        dwellTime: '20-35 min',
        crowd: { ar: 'حركة هادئة ومنظمة', en: 'Calm and structured flow' },
        highlights: [
          { ar: 'عرض حي لخطوات الفحص', en: 'Live conservation workflow snapshots' },
          { ar: 'محطات تفسير أدوات الترميم', en: 'Tool interpretation stations' },
          { ar: 'نقطة مقارنة قبل/بعد', en: 'Before/after intervention station' },
        ],
      },
      {
        id: 'lower-learning',
        zone: 'F6',
        title: { ar: 'ممر التعلم التجريبي', en: 'Experimental Learning Corridor' },
        orientation: { ar: 'حول قاعات الأنشطة التعليمية', en: 'Wrapped around learning activity rooms' },
        connection: { ar: 'يربط الجولات المدرسية بالمحتوى العلمي', en: 'Bridges school visits with scientific context' },
        dwellTime: '15-25 min',
        crowd: { ar: 'متوسط في أوقات المدارس', en: 'Moderate during school windows' },
        highlights: [
          { ar: 'تجارب خامات أثرية مبسطة', en: 'Hands-on material demos' },
          { ar: 'خطط زيارة سريعة للعائلات', en: 'Family-ready quick routes' },
          { ar: 'مسار سهل لذوي الاحتياجات', en: 'Accessible path guidance' },
        ],
      },
      {
        id: 'lower-service',
        zone: 'F6',
        title: { ar: 'حلقة الخدمات الذكية', en: 'Smart Services Ring' },
        orientation: { ar: 'دائري حول نقاط الراحة والدعم', en: 'Circular around support and comfort hubs' },
        connection: { ar: 'يخدم بداية ونهاية الرحلة داخل الأطلس', en: 'Supports both trip start and wrap-up' },
        dwellTime: '10-15 min',
        crowd: { ar: 'منخفض غالبًا', en: 'Usually low' },
        highlights: [
          { ar: 'خزائن ذكية', en: 'Smart lockers' },
          { ar: 'إرشادات مسارات فورية', en: 'Instant route guidance' },
          { ar: 'لوحات حالة القاعات الحية', en: 'Live gallery status boards' },
        ],
      },
    ],
  },
  {
    id: 'ground',
    level: { ar: 'الدور الأرضي', en: 'Ground Floor' },
    title: { ar: 'قلب الحركة التاريخية', en: 'Core Historical Flow' },
    overview: {
      ar: 'أكثر طابق حركةً، يبدأ منه السرد الزمني ويضم محاور التوجيه الرئيسية بين القاعات المبكرة.',
      en: 'The busiest floor where chronology starts, with the main orientation axes through early galleries.',
    },
    bestTime: { ar: 'أفضل وقت: 12:30-15:00 لتوزيع أفضل للزوار', en: 'Best window: 12:30-15:00 for smoother distribution' },
    traffic: 'High',
    collectionMix: { ar: 'ما قبل الأسرات، الدولة القديمة، مداخل القصص الملكية', en: 'Predynastic, Old Kingdom, and major royal story entrances' },
    services: [
      { ar: 'نقاط مساعدة كل 120 متر', en: 'Assistance points every ~120m' },
      { ar: 'إرشاد سمعي متعدد اللغات', en: 'Multilingual audio guide points' },
      { ar: 'مقاعد استراحة بينية', en: 'Intermittent seating bays' },
      { ar: 'لوحات كثافة مباشرة', en: 'Live density displays' },
    ],
    corridors: [
      {
        id: 'ground-hall',
        zone: 'A1',
        title: { ar: 'محور البهو الكبير', en: 'Grand Hall Axis' },
        orientation: { ar: 'من المدخل الرئيسي باتجاه بداية التسلسل', en: 'From main entry to chronology start' },
        connection: { ar: 'يربط التوجيه العام بقاعة البدايات', en: 'Links orientation to origins gallery' },
        dwellTime: '25-40 min',
        crowd: { ar: 'مرتفع في أول ساعتين', en: 'High in first two operating hours' },
        highlights: [
          { ar: 'تمثال رمسيس كنقطة ارتكاز', en: 'Ramesses colossus anchor point' },
          { ar: 'توزيع واضح للاتجاهات', en: 'Clear directional branching' },
          { ar: 'وصول مباشر للمصاعد', en: 'Direct elevator handoff' },
        ],
      },
      {
        id: 'ground-origins',
        zone: 'B2',
        title: { ar: 'ممر أصول الدولة', en: 'State Origins Corridor' },
        orientation: { ar: 'محاذي لقاعات ما قبل الأسرات', en: 'Adjacent to Predynastic galleries' },
        connection: { ar: 'ينقل الزائر من البدايات إلى عصر الأهرام', en: 'Transitions visitors from origins to pyramid age' },
        dwellTime: '30-50 min',
        crowd: { ar: 'متوسط إلى مرتفع', en: 'Medium to high' },
        highlights: [
          { ar: 'تتابع زمني واضح', en: 'Strong chronological continuity' },
          { ar: 'محتوى بصري قصير كل محطة', en: 'Short visual briefing per stop' },
          { ar: 'نقاط تصوير منظمة', en: 'Structured photo vantage points' },
        ],
      },
      {
        id: 'ground-scribes',
        zone: 'C3',
        title: { ar: 'ممشى الكتبة والإدارة', en: 'Scribal & State Walkway' },
        orientation: { ar: 'يمتد بين البرديات والنقوش الإدارية', en: 'Spans papyri and administrative records' },
        connection: { ar: 'يربط القاعات الموضوعية بمسار الدولة الوسطى', en: 'Connects thematic halls to Middle Kingdom narrative' },
        dwellTime: '20-35 min',
        crowd: { ar: 'متوسط', en: 'Moderate' },
        highlights: [
          { ar: 'لوحات تبسيط الكتابة', en: 'Writing-system decode panels' },
          { ar: 'محطات قراءة نصوص مترجمة', en: 'Translated text reading points' },
          { ar: 'إضاءة مريحة للتفاصيل الدقيقة', en: 'Detail-friendly controlled lighting' },
        ],
      },
    ],
  },
  {
    id: 'upper',
    level: { ar: 'الدور العلوي', en: 'Upper Floor' },
    title: { ar: 'ذروة المجموعة الملكية', en: 'Peak Royal Collection Level' },
    overview: {
      ar: 'طابق التجربة الممتدة لمقتنيات الدولة الحديثة ومجموعة توت كاملةً مع مسارات زمنية داخلية.',
      en: 'Extended immersive floor for New Kingdom material and the complete Tutankhamun corpus.',
    },
    bestTime: { ar: 'أفضل وقت: بعد 16:00 لمسار أكثر هدوءًا', en: 'Best window: after 16:00 for quieter flow' },
    traffic: 'Medium to High',
    collectionMix: { ar: 'توت عنخ آمون، الذهب الملكي، السرد الطقسي الجنائزي', en: 'Tutankhamun, royal goldwork, and funerary ritual sequence' },
    services: [
      { ar: 'مناطق شرح مدمجة في الممرات', en: 'Embedded explainers in corridors' },
      { ar: 'استراحات مشاهدة بانورامية', en: 'Panoramic pause zones' },
      { ar: 'مسارات خروج تدريجية لتجنب التكدس', en: 'Staggered exits to reduce bottlenecks' },
      { ar: 'توصيات مسار حسب الوقت المتبقي', en: 'Time-aware route recommendations' },
    ],
    corridors: [
      {
        id: 'upper-tut-entry',
        zone: 'E5',
        title: { ar: 'مدخل كنوز توت', en: 'Tut Treasures Entry Spine' },
        orientation: { ar: 'من بوابة الدور العلوي إلى تسلسل القطع الأولى', en: 'From upper gateway into first Tut sequence' },
        connection: { ar: 'يمهد لفهم الترتيب الجنائزي الكامل', en: 'Prepares visitors for complete funerary order' },
        dwellTime: '35-55 min',
        crowd: { ar: 'مرتفع في منتصف اليوم', en: 'High at mid-day peak' },
        highlights: [
          { ar: 'بطاقات تعريف مكثفة', en: 'Dense object briefs' },
          { ar: 'مقارنات بين مراحل الدفن', en: 'Burial-stage comparison views' },
          { ar: 'تنظيم محكم لتدفق الزوار', en: 'Strictly guided flow lanes' },
        ],
      },
      {
        id: 'upper-royal-loop',
        zone: 'D4',
        title: { ar: 'حلقة الدولة الحديثة', en: 'New Kingdom Loop' },
        orientation: { ar: 'ممر دائري يربط الذهب الملكي بالنقوش', en: 'Circular link between royal gold and narrative reliefs' },
        connection: { ar: 'يوصل بين القوة العسكرية والطقوس الملكية', en: 'Connects military power with royal ritual context' },
        dwellTime: '30-45 min',
        crowd: { ar: 'متوسط', en: 'Moderate' },
        highlights: [
          { ar: 'قراءة سريعة للمشهد السياسي', en: 'Quick political context readouts' },
          { ar: 'شرح مواد الصناعة الملكية', en: 'Royal craftsmanship material notes' },
          { ar: 'تتابع سهل لغير المتخصصين', en: 'Beginner-friendly sequencing' },
        ],
      },
      {
        id: 'upper-terrace',
        zone: 'E5',
        title: { ar: 'ممشى الإطلالة والختام', en: 'Panorama & Exit Walk' },
        orientation: { ar: 'ينتهي بمنصة رؤية هضبة الجيزة', en: 'Ends at Giza-facing panoramic point' },
        connection: { ar: 'يربط نهاية السرد داخل المتحف بالموقع الأثري خارجه', en: 'Bridges indoor narrative with the outdoor site' },
        dwellTime: '15-25 min',
        crowd: { ar: 'منخفض مساءً', en: 'Lower in late hours' },
        highlights: [
          { ar: 'نقطة استيعاب نهائية للتجربة', en: 'Final reflection stop' },
          { ar: 'لوحة تلخيص المسار المكتمل', en: 'Completed-route summary board' },
          { ar: 'خروج مرن نحو الخدمات أو القاعات المتخصصة', en: 'Flexible exit to services or specialist halls' },
        ],
      },
    ],
  },
];

const SYSTEM_BRIEFS: SystemBrief[] = [
  {
    id: 'flow',
    title: { ar: 'إدارة الحركة داخل الأطلس', en: 'Flow Management Layer' },
    summary: {
      ar: 'تنظيم الكثافة عبر نقاط انتقال واضحة بين القاعات الأساسية مع تحديثات لحظية.',
      en: 'Density managed through clear transfer points between core galleries with live updates.',
    },
    metrics: [
      { label: { ar: 'متوسط الانتقال بين المحاور', en: 'Avg axis transfer' }, value: '6-9 min' },
      { label: { ar: 'نقاط إعادة التوجيه', en: 'Re-orientation points' }, value: '18' },
      { label: { ar: 'مناطق تخفيف التكدس', en: 'Decompression bays' }, value: '12' },
    ],
    actions: [
      { ar: 'اتبع لوحة حالة الكثافة قبل دخول القاعات الكبرى.', en: 'Check live density boards before entering high-volume halls.' },
      { ar: 'اختَر مسار بديل عند وصول الإشغال إلى 80%.', en: 'Use alternate lanes once occupancy reaches 80%.' },
      { ar: 'استغل نقاط الانتقال كفواصل راحة قصيرة.', en: 'Use transfer nodes as short recovery pauses.' },
    ],
  },
  {
    id: 'access',
    title: { ar: 'إتاحة وشمول الزوار', en: 'Accessibility & Inclusion' },
    summary: {
      ar: 'بنية متكاملة للمصاعد، المنحدرات، والمحتوى الميسر بصريًا وسمعيًا.',
      en: 'Integrated elevators, ramps, and visual/audio accessible content layers.',
    },
    metrics: [
      { label: { ar: 'مسارات خالية من العوائق', en: 'Barrier-free routes' }, value: '100%' },
      { label: { ar: 'نقاط استراحة ميسرة', en: 'Accessible rest points' }, value: '30+' },
      { label: { ar: 'لغات الإرشاد المتاحة', en: 'Guide languages' }, value: '8' },
    ],
    actions: [
      { ar: 'ابدأ من الدور المناسب لقدرتك الحركية ثم توسع تدريجيًا.', en: 'Start on the floor best suited to your mobility, then expand gradually.' },
      { ar: 'فعّل وضع المسار الهادئ لتقليل المنعطفات والزحام.', en: 'Enable quiet-route mode for fewer turns and less crowding.' },
      { ar: 'استخدم الخرائط اللمسية عند نقاط التحويل الرئيسية.', en: 'Use tactile map points at main transfer nodes.' },
    ],
  },
  {
    id: 'learning',
    title: { ar: 'طبقة التعلم السريع', en: 'Rapid Learning Layer' },
    summary: {
      ar: 'نظام يقدم جرعات معرفة قصيرة داخل الممرات بدون تعطيل مسار الزيارة.',
      en: 'A micro-learning system delivering short knowledge bursts without blocking flow.',
    },
    metrics: [
      { label: { ar: 'محطات شرح دقيقة', en: 'Micro-brief stations' }, value: '42' },
      { label: { ar: 'متوسط قراءة المحطة', en: 'Per-stop reading time' }, value: '90 sec' },
      { label: { ar: 'مسارات تعليمية جاهزة', en: 'Prebuilt learning tracks' }, value: '9' },
    ],
    actions: [
      { ar: 'اجمع بين مسار القطع ومسار الممرات لنظرة أعمق.', en: 'Combine object and corridor tracks for deeper context.' },
      { ar: 'اختر نمط "الفكرة في دقيقة" في القاعات المزدحمة.', en: 'Switch to one-minute insight mode during crowded hours.' },
      { ar: 'أنهِ المسار بملخص رقمي قابل للمراجعة لاحقًا.', en: 'Finish with a digital recap for later review.' },
    ],
  },
];

const MASTERPIECES: Masterpiece[] = [
  {
    id: 'mask',
    image: '/images/tutankhamun_mask.jpg',
    category: 'treasures',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 18', en: '18th Dynasty' },
    title: { ar: 'قناع توت عنخ آمون الذهبي', en: 'Golden Mask of Tutankhamun' },
    date: 'c. 1323 BCE',
    material: { ar: 'ذهب ولازورد وزجاج', en: 'Gold, lapis lazuli, and glass' },
    provenance: { ar: 'مقبرة KV62 - وادي الملوك', en: 'Tomb KV62, Valley of the Kings' },
    discovery: { ar: 'اكتُشف عام 1922 في حجرة الدفن', en: 'Discovered in 1922 in the burial chamber' },
    significance: { ar: 'أيقونة عالمية للفن الجنائزي المصري', en: 'A global icon of Egyptian funerary art' },
  },
  {
    id: 'throne',
    image: '/images/golden_throne.jpg',
    category: 'treasures',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 18', en: '18th Dynasty' },
    title: { ar: 'عرش توت عنخ آمون', en: 'Throne of Tutankhamun' },
    date: 'c. 1330 BCE',
    material: { ar: 'خشب مذهّب وتطعيمات', en: 'Gilded wood with inlays' },
    provenance: { ar: 'مقبرة KV62', en: 'Tomb KV62' },
    discovery: { ar: 'ضمن غرفة الكنز الملكي', en: 'Recovered from the royal treasury context' },
    significance: { ar: 'يوثق صورة البلاط الملكي في أواخر العمارنة', en: 'Documents court aesthetics of late Amarna Egypt' },
  },
  {
    id: 'chariot',
    image: '/images/tut_chariot.jpg',
    category: 'treasures',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 18', en: '18th Dynasty' },
    title: { ar: 'العجلة الملكية', en: 'Royal Chariot' },
    date: 'c. 1323 BCE',
    material: { ar: 'خشب وجلد وصفائح ذهب', en: 'Wood, leather, and gilded sheets' },
    provenance: { ar: 'مقبرة KV62', en: 'Tomb KV62' },
    discovery: { ar: 'اُكتشفت مفككة ثم أعيد تجميعها', en: 'Found in disassembled state and reconstructed' },
    significance: { ar: 'تكشف هندسة النقل الملكي وطقوس الاستعراض', en: 'Reveals royal mobility engineering and ceremony' },
  },
  {
    id: 'canopic',
    image: '/images/canopic_jars.jpg',
    category: 'treasures',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 18', en: '18th Dynasty' },
    title: { ar: 'أواني الأحشاء الملكية', en: 'Canopic Jars' },
    date: 'c. 1323 BCE',
    material: { ar: 'ألباستر وكِساء ذهبي', en: 'Alabaster with gilded elements' },
    provenance: { ar: 'حجرة الكنز - KV62', en: 'Treasury chamber, KV62' },
    discovery: { ar: 'حُفظت داخل مقصورة طقسية', en: 'Stored inside a ritual shrine' },
    significance: { ar: 'تعكس عقائد الحفظ الجسدي والبعث', en: 'Reflects mummification and afterlife theology' },
  },
  {
    id: 'coffin',
    image: '/images/mummy_case.jpg',
    category: 'treasures',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 18', en: '18th Dynasty' },
    title: { ar: 'التابوت الداخلي الذهبي', en: 'Inner Golden Coffin' },
    date: 'c. 1323 BCE',
    material: { ar: 'ذهب خالص وتطعيمات زجاجية', en: 'Solid gold with glass inlay' },
    provenance: { ar: 'غرفة الدفن الملكية', en: 'Royal burial chamber' },
    discovery: { ar: 'استخراج تدريجي عبر مراحل حفظ دقيقة', en: 'Recovered through multi-stage conservation' },
    significance: { ar: 'من أثقل وأدق الأعمال المعدنية القديمة', en: 'One of the heaviest and finest ancient metal masterpieces' },
  },
  {
    id: 'papyrus',
    image: '/images/papyrus.jpg',
    category: 'artifacts',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الدولة الحديثة', en: 'New Kingdom' },
    title: { ar: 'بردية كتاب الموتى', en: 'Book of the Dead Papyrus' },
    date: 'c. 1550 BCE',
    material: { ar: 'بردي وأحبار معدنية', en: 'Papyrus and mineral inks' },
    provenance: { ar: 'طيبة الغربية', en: 'West Thebes' },
    discovery: { ar: 'ضمن مجموعة دفن كهنوتية', en: 'Recovered from a priestly funerary assemblage' },
    significance: { ar: 'شرح بصري لنصوص العبور الأخروي', en: 'Visual guide to afterlife spells and rituals' },
  },
  {
    id: 'scarab',
    image: '/images/scarab.jpg',
    category: 'artifacts',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 18', en: '18th Dynasty' },
    title: { ar: 'جعران القلب', en: 'Heart Scarab' },
    date: 'c. 1323 BCE',
    material: { ar: 'يشب أخضر مع إطار ذهبي', en: 'Green jasper in gold setting' },
    provenance: { ar: 'مقبرة ملكية', en: 'Royal burial context' },
    discovery: { ar: 'وضع فوق القلب داخل اللفائف', en: 'Placed above the heart within linen wrappings' },
    significance: { ar: 'نص وقائي جنائزي يمنع شهادة القلب ضد المتوفى', en: 'Protective funerary text preventing the heart from testifying against the deceased' },
  },
  {
    id: 'ankh',
    image: '/images/ankh.jpg',
    category: 'artifacts',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الدولة الحديثة', en: 'New Kingdom' },
    title: { ar: 'عنخ ذهبي', en: 'Ceremonial Golden Ankh' },
    date: 'c. 1400 BCE',
    material: { ar: 'ذهب وأحجار زينة', en: 'Gold and decorative stones' },
    provenance: { ar: 'جبانة طيبة', en: 'Theban necropolis' },
    discovery: { ar: 'قطعة طقسية ضمن أدوات المعبد', en: 'Recovered as ritual temple equipment' },
    significance: { ar: 'رمز الحياة الأبدية في التصوير الديني', en: 'Symbol of eternal life in religious iconography' },
  },
  {
    id: 'isis',
    image: '/images/isis_statue.jpg',
    category: 'artifacts',
    periodKey: 'late-period',
    periodLabel: { ar: 'العصر المتأخر', en: 'Late Period' },
    title: { ar: 'تمثال الإلهة إيزيس', en: 'Statue of Isis' },
    date: 'c. 664-332 BCE',
    material: { ar: 'بازلت', en: 'Basalt' },
    provenance: { ar: 'معبد محلي في الدلتا', en: 'Delta temple context' },
    discovery: { ar: 'عُثر عليه ضمن بقايا حجرة شعائرية', en: 'Recovered from ritual architecture remains' },
    significance: { ar: 'يمثل توازنًا بين الجلال الرسمي والرمزية الأمومية', en: 'Balances formal divinity with maternal symbolism' },
  },
  {
    id: 'ushabti',
    image: '/images/ushabti.jpg',
    category: 'artifacts',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الدولة الحديثة', en: 'New Kingdom' },
    title: { ar: 'تماثيل الأوشابتي', en: 'Ushabti Figures' },
    date: 'c. 1550-1070 BCE',
    material: { ar: 'فاينس وخشب', en: 'Faience and wood' },
    provenance: { ar: 'مقابر النخبة', en: 'Elite tomb groups' },
    discovery: { ar: 'وُجدت كمجموعات خدمة جنائزية', en: 'Found as afterlife servant sets' },
    significance: { ar: 'تعكس مفهوم العمل الرمزي في العالم الآخر', en: 'Reflects symbolic labor in afterlife beliefs' },
  },
  {
    id: 'coffin-interior',
    image: '/images/coffin_interior.jpg',
    category: 'artifacts',
    periodKey: 'third-intermediate',
    periodLabel: { ar: 'الأسرة 21', en: '21st Dynasty' },
    title: { ar: 'اللوحة الداخلية للتابوت', en: 'Painted Coffin Interior' },
    date: 'c. 1070-945 BCE',
    material: { ar: 'خشب وجص وأصباغ', en: 'Wood, gesso, and pigments' },
    provenance: { ar: 'منطقة طيبة', en: 'Theban region' },
    discovery: { ar: 'ألوان محفوظة بفضل بيئة دفن مستقرة', en: 'Pigments preserved by stable burial conditions' },
    significance: { ar: 'تصور الإلهة نوت كحماية كونية للمتوفى', en: 'Depicts Nut as cosmic protection for the deceased' },
  },
  {
    id: 'ramesses',
    image: '/images/hero_pharaoh.jpg',
    category: 'architecture',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 19', en: '19th Dynasty' },
    title: { ar: 'تمثال رمسيس الثاني', en: 'Colossus of Ramesses II' },
    date: 'c. 1279-1213 BCE',
    material: { ar: 'جرانيت أحمر', en: 'Red granite' },
    provenance: { ar: 'ممفيس القديمة', en: 'Ancient Memphis' },
    discovery: { ar: 'نُقل وثُبِّت بعناية في بهو المتحف', en: 'Relocated and stabilized in museum forecourt' },
    significance: { ar: 'بيان بصري للقوة الملكية عند مدخل المتحف', en: 'A monumental statement of kingship at entry' },
  },
  {
    id: 'obelisk',
    image: '/images/obelisk.jpg',
    category: 'architecture',
    periodKey: 'modern',
    periodLabel: { ar: 'تركيب متحفي حديث', en: 'Modern Museum Installation' },
    title: { ar: 'المسلة المعلقة', en: 'The Hanging Obelisk' },
    date: '2025 CE',
    material: { ar: 'جرانيت أحمر', en: 'Red granite' },
    provenance: { ar: 'قطعة ملكية أعيد تقديمها', en: 'Royal monument re-contextualized' },
    discovery: { ar: 'حامل إنشائي يسمح برؤية قاعدة المسلة', en: 'Custom support reveals the base of the obelisk' },
    significance: { ar: 'مزج بين الأثر القديم والهندسة المعاصرة', en: 'Fusion of ancient monumentality and contemporary engineering' },
  },
  {
    id: 'staircase',
    image: '/images/staircase.jpg',
    category: 'architecture',
    periodKey: 'modern',
    periodLabel: { ar: 'تصميم معاصر', en: 'Contemporary Curatorial Design' },
    title: { ar: 'الدرج العظيم', en: 'The Grand Staircase' },
    date: '2025 CE',
    material: { ar: 'حجر وزجاج ومعادن', en: 'Stone, glass, and structural metal' },
    provenance: { ar: 'المحور المركزي للحركة', en: 'Central visitor circulation axis' },
    discovery: { ar: 'يضم 87 تمثالًا في ترتيب زمني', en: 'Hosts 87 statues in chronological arrangement' },
    significance: { ar: 'يجمع الحركة المعمارية مع السرد المتحفي', en: 'Combines circulation architecture with narrative curation' },
  },
  {
    id: 'grand-hall',
    image: '/images/grand_hall.jpg',
    category: 'architecture',
    periodKey: 'modern',
    periodLabel: { ar: 'عمارة متحفية', en: 'Museum Architecture' },
    title: { ar: 'البهو الكبير', en: 'Grand Hall' },
    date: '2025 CE',
    material: { ar: 'خرسانة وألواح شفافة', en: 'Concrete and translucent cladding' },
    provenance: { ar: 'قلب الاستقبال والتوجيه', en: 'Core reception and orientation zone' },
    discovery: { ar: 'منصة توزيع رئيسية لكل المسارات', en: 'Main distribution hub for visitor routes' },
    significance: { ar: 'يربط الانبهار البصري بالتوجيه الوظيفي', en: 'Links visual spectacle with functional wayfinding' },
  },
  {
    id: 'giza',
    image: '/images/giza_plateau.jpg',
    category: 'landscapes',
    periodKey: 'old-kingdom',
    periodLabel: { ar: 'أفق الأسرة الرابعة', en: '4th Dynasty Horizon' },
    title: { ar: 'مشهد هضبة الجيزة', en: 'Giza Plateau Panorama' },
    date: 'c. 2580-2510 BCE context',
    material: { ar: 'حجر جيري وجرانيت', en: 'Limestone and granite monuments' },
    provenance: { ar: 'المشهد التاريخي المحيط بالمتحف', en: 'Historic landscape around the museum' },
    discovery: { ar: 'امتداد بصري مباشر بين المتحف والموقع', en: 'Direct visual continuity between museum and site' },
    significance: { ar: 'يضع المقتنيات في سياقها الجغرافي الأصلي', en: 'Anchors collections to their original geographic context' },
  },
  {
    id: 'nile-sunset',
    image: '/images/nile_sunset.jpg',
    category: 'landscapes',
    periodKey: 'geography',
    periodLabel: { ar: 'جغرافيا الحضارة', en: 'Civilizational Geography' },
    title: { ar: 'غروب النيل', en: 'Nile at Sunset' },
    date: 'Living landscape',
    material: { ar: 'نظام نهري طبيعي', en: 'Natural riverine system' },
    provenance: { ar: 'وادي النيل', en: 'Nile Valley' },
    discovery: { ar: 'يوضح بيئة نشأة الدولة المصرية', en: 'Frames the ecological basis of Egyptian state formation' },
    significance: { ar: 'النيل هو العمود الفقري للاقتصاد والعمارة القديمة', en: 'The Nile is the backbone of ancient economy and architecture' },
  },
  {
    id: 'jewelry-pectoral',
    image: '/images/egyptian_jewelry.jpg',
    category: 'artifacts',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 18', en: '18th Dynasty' },
    title: { ar: 'صدرية ذهبية ملكية', en: 'Royal Golden Pectoral' },
    date: 'c. 1350 BCE',
    material: { ar: 'ذهب مطعم بالأحجار شبه الكريمة', en: 'Gold with semi-precious inlays' },
    provenance: { ar: 'مجموعة دفن ملكية - طيبة', en: 'Royal funerary assemblage, Thebes' },
    discovery: { ar: 'عُثر عليها ضمن حلي جنائزية كاملة', en: 'Recovered within a complete funerary jewelry set' },
    significance: { ar: 'تكشف دقة صياغة المعادن ورمزية الحماية الملكية', en: 'Shows precision metalwork and royal protective symbolism' },
  },
  {
    id: 'sarcophagus-suite',
    image: '/images/sarcophagus_room.jpg',
    category: 'artifacts',
    periodKey: 'third-intermediate',
    periodLabel: { ar: 'الأسرات 21-22', en: '21st-22nd Dynasties' },
    title: { ar: 'مجموعة توابيت حجرية', en: 'Stone Sarcophagus Ensemble' },
    date: 'c. 1069-715 BCE',
    material: { ar: 'حجر جيري وجرانيت ونقوش ملونة', en: 'Limestone, granite, and painted inscriptions' },
    provenance: { ar: 'جبانة طيبة', en: 'Theban necropolis' },
    discovery: { ar: 'اكتشافات متفرقة جُمعت في عرض موضوعي واحد', en: 'Multiple finds curated into a single thematic installation' },
    significance: { ar: 'يوضح تطور طقوس الدفن وتعدد الأساليب الإقليمية', en: 'Illustrates evolving burial customs and regional styles' },
  },
  {
    id: 'atrium-axis',
    image: '/images/atrium.jpg',
    category: 'architecture',
    periodKey: 'modern',
    periodLabel: { ar: 'عمارة متحفية معاصرة', en: 'Contemporary Museum Architecture' },
    title: { ar: 'ردهة الأتريوم', en: 'Main Atrium' },
    date: '2025 CE',
    material: { ar: 'خرسانة عالية التحمل وزجاج ممتد', en: 'High-strength concrete and expansive glazing' },
    provenance: { ar: 'محور الانتقال بين القاعات', en: 'Primary inter-gallery transition hub' },
    discovery: { ar: 'مُصمم لتوزيع حركة الزوار على أكثر من مسار', en: 'Designed to distribute visitors across multiple paths' },
    significance: { ar: 'يربط التوجيه المكاني بالتجربة البصرية الواسعة', en: 'Links spatial orientation with broad visual experience' },
  },
  {
    id: 'exhibition-hall',
    image: '/images/exhibition_hall.jpg',
    category: 'architecture',
    periodKey: 'modern',
    periodLabel: { ar: 'بنية عرض حديثة', en: 'Modern Exhibition Infrastructure' },
    title: { ar: 'قاعة العرض الكبرى', en: 'Major Exhibition Hall' },
    date: '2025 CE',
    material: { ar: 'نظم إضاءة متحفية ووحدات عرض محكمة', en: 'Museum-grade lighting and controlled display systems' },
    provenance: { ar: 'نطاق المعارض الدورية', en: 'Rotating exhibition sector' },
    discovery: { ar: 'تهيئة مرنة لدعم سيناريوهات عرض متعددة', en: 'Flexible setup for multiple curatorial scenarios' },
    significance: { ar: 'تدعم عرض القطع الحساسة مع أعلى معايير الحفظ', en: 'Supports sensitive objects with high conservation standards' },
  },
  {
    id: 'entrance-plaza',
    image: '/images/entrance_plaza.jpg',
    category: 'architecture',
    periodKey: 'modern',
    periodLabel: { ar: 'واجهة المتحف', en: 'Museum Forecourt' },
    title: { ar: 'ساحة المدخل', en: 'Entrance Plaza' },
    date: '2025 CE',
    material: { ar: 'حجر طبيعي ومعالجات ظل معمارية', en: 'Natural stone and architectural shade treatments' },
    provenance: { ar: 'الواجهة الغربية للمتحف', en: 'Western museum frontage' },
    discovery: { ar: 'منطقة تجمع قبل بدء المسارات الداخلية', en: 'Gathering zone before entering internal routes' },
    significance: { ar: 'تؤسس الانتقال من الفضاء الحضري إلى السرد المتحفي', en: 'Establishes the transition from city realm to museum narrative' },
  },
  {
    id: 'museum-night',
    image: '/images/museum_night.jpg',
    category: 'landscapes',
    periodKey: 'modern',
    periodLabel: { ar: 'مشهد معماري ليلي', en: 'Nocturnal Architectural View' },
    title: { ar: 'المتحف ليلًا', en: 'Museum at Night' },
    date: 'Contemporary scene',
    material: { ar: 'إضاءة معمارية وواجهات حجرية', en: 'Architectural lighting and stone facades' },
    provenance: { ar: 'محيط المتحف الخارجي', en: 'Exterior museum perimeter' },
    discovery: { ar: 'يبرز تأثير الإضاءة على قراءة الكتل المعمارية', en: 'Highlights how lighting reshapes architectural perception' },
    significance: { ar: 'يضيف طبقة جمالية مختلفة لتجربة الزيارة', en: 'Adds a distinct aesthetic layer to the visit experience' },
  },
  {
    id: 'nile-night',
    image: '/images/nile_night.jpg',
    category: 'landscapes',
    periodKey: 'geography',
    periodLabel: { ar: 'جغرافيا الحضارة', en: 'Civilizational Geography' },
    title: { ar: 'النيل ليلًا', en: 'Nile at Night' },
    date: 'Living landscape',
    material: { ar: 'مشهد نهري طبيعي', en: 'Natural riverine landscape' },
    provenance: { ar: 'ضفاف وادي النيل', en: 'Nile Valley riverbanks' },
    discovery: { ar: 'يعكس الاستمرارية البيئية بين الماضي والحاضر', en: 'Reflects ecological continuity from antiquity to present' },
    significance: { ar: 'يوضح كيف يظل النيل عنصرًا حاكمًا في فهم الحضارة', en: 'Shows the Nile as a persistent key to understanding civilization' },
  },
  {
    id: 'ramesses-colossus-detail',
    image: '/images/hero_pharaoh.jpg',
    category: 'artifacts',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 19', en: '19th Dynasty' },
    title: { ar: 'تفصيل تمثال رمسيس', en: 'Ramesses Colossus Detail' },
    date: 'c. 1279-1213 BCE',
    material: { ar: 'جرانيت أحمر مصقول', en: 'Polished red granite' },
    provenance: { ar: 'ممفيس القديمة', en: 'Ancient Memphis' },
    discovery: { ar: 'حُفظت تفاصيل الوجه عبر مراحل ترميم دقيقة', en: 'Facial details preserved through phased conservation' },
    significance: { ar: 'يوضح تقنيات النحت الملكي على المقاييس الضخمة', en: 'Demonstrates large-scale royal sculptural precision' },
  },
  {
    id: 'canopic-shrine-panel',
    image: '/images/canopic_jars.jpg',
    category: 'treasures',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 18', en: '18th Dynasty' },
    title: { ar: 'لوحة مقصورة الأواني الكانوبية', en: 'Canopic Shrine Panel' },
    date: 'c. 1323 BCE',
    material: { ar: 'ألواح مذهبة ونقوش حامية', en: 'Gilded panels with protective inscriptions' },
    provenance: { ar: 'مقبرة KV62', en: 'Tomb KV62' },
    discovery: { ar: 'استعيدت ضمن تسلسل الحجرة الطقسية', en: 'Recovered within the ritual chamber sequence' },
    significance: { ar: 'تشرح العلاقة بين الحفظ الجسدي والعقيدة الجنائزية', en: 'Clarifies links between bodily preservation and funerary doctrine' },
  },
  {
    id: 'papyrus-judgement',
    image: '/images/papyrus.jpg',
    category: 'artifacts',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الدولة الحديثة', en: 'New Kingdom' },
    title: { ar: 'مشهد محكمة أوزير', en: 'Osirian Judgment Scene' },
    date: 'c. 1300 BCE',
    material: { ar: 'بردي وأحبار معدنية', en: 'Papyrus with mineral inks' },
    provenance: { ar: 'طيبة الغربية', en: 'West Thebes' },
    discovery: { ar: 'لوحة نصية كاملة بحالة قراءة ممتازة', en: 'Nearly complete textual panel in readable condition' },
    significance: { ar: 'مصدر بصري لفهم ميزان العدالة في العالم الآخر', en: 'Visual source for afterlife judgment theology' },
  },
  {
    id: 'ushabti-procession',
    image: '/images/ushabti.jpg',
    category: 'artifacts',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الدولة الحديثة', en: 'New Kingdom' },
    title: { ar: 'صف الأوشابتي الجنائزي', en: 'Funerary Ushabti Line' },
    date: 'c. 1200 BCE',
    material: { ar: 'فاينس أزرق محفور', en: 'Incised blue faience' },
    provenance: { ar: 'مجموعات دفن نخبوية', en: 'Elite tomb assemblages' },
    discovery: { ar: 'أعداد كبيرة مكتملة النصوص الطقسية', en: 'Large sets with preserved ritual inscriptions' },
    significance: { ar: 'يعكس تنظيم العمل الرمزي بعد الوفاة', en: 'Reflects organized symbolic labor in the afterlife' },
  },
  {
    id: 'coffin-celestial-register',
    image: '/images/coffin_interior.jpg',
    category: 'artifacts',
    periodKey: 'third-intermediate',
    periodLabel: { ar: 'الأسرة 21', en: '21st Dynasty' },
    title: { ar: 'السجل السماوي للتابوت', en: 'Celestial Coffin Register' },
    date: 'c. 1000 BCE',
    material: { ar: 'خشب مدهون وجص ملون', en: 'Painted wood and colored gesso' },
    provenance: { ar: 'طيبة', en: 'Thebes' },
    discovery: { ar: 'ألوان محفوظة بفضل بيئة دفن مستقرة', en: 'Pigments preserved by stable burial environment' },
    significance: { ar: 'يوضح الخرائط الكونية في الفن الجنائزي', en: 'Illustrates cosmological mapping in funerary art' },
  },
  {
    id: 'isis-black-stone',
    image: '/images/isis_statue.jpg',
    category: 'artifacts',
    periodKey: 'late-period',
    periodLabel: { ar: 'العصر المتأخر', en: 'Late Period' },
    title: { ar: 'إيزيس من الحجر الأسود', en: 'Isis in Black Stone' },
    date: 'c. 600 BCE',
    material: { ar: 'بازلت أسود', en: 'Black basalt' },
    provenance: { ar: 'دلتا النيل', en: 'Nile Delta temple zone' },
    discovery: { ar: 'اكتُشف داخل بقايا حجرة شعائرية', en: 'Found inside remains of a ritual chamber' },
    significance: { ar: 'نموذج متأخر لثبات الأيقونات الدينية', en: 'Late-period model of durable sacred iconography' },
  },
  {
    id: 'ankh-ritual-emblem',
    image: '/images/ankh.jpg',
    category: 'artifacts',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الدولة الحديثة', en: 'New Kingdom' },
    title: { ar: 'شارة العنخ الطقسية', en: 'Ritual Ankh Emblem' },
    date: 'c. 1400 BCE',
    material: { ar: 'ذهب وتطعيمات دقيقة', en: 'Gold with fine inlays' },
    provenance: { ar: 'جبانة طيبة', en: 'Theban necropolis' },
    discovery: { ar: 'ارتبطت بمجموعة أدوات معبدية', en: 'Associated with a ritual temple toolkit' },
    significance: { ar: 'تجسد مفهوم الحياة الأبدية في الطقس المصري', en: 'Embodies eternal life symbolism in Egyptian ritual' },
  },
  {
    id: 'scarab-regal-seal',
    image: '/images/scarab.jpg',
    category: 'artifacts',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 18', en: '18th Dynasty' },
    title: { ar: 'خاتم الجعران الملكي', en: 'Regal Scarab Seal' },
    date: 'c. 1323 BCE',
    material: { ar: 'حجر أخضر وإطار ذهبي', en: 'Green stone in gold mount' },
    provenance: { ar: 'سياق دفن ملكي', en: 'Royal funerary context' },
    discovery: { ar: 'كان مثبتًا ضمن اللفائف الداخلية', en: 'Found fixed within inner wrappings' },
    significance: { ar: 'يوثق وظيفة الجعران كنص حماية شخصي', en: 'Documents the scarab as a personal protective text object' },
  },
  {
    id: 'golden-throne-inlay',
    image: '/images/golden_throne.jpg',
    category: 'treasures',
    periodKey: 'new-kingdom',
    periodLabel: { ar: 'الأسرة 18', en: '18th Dynasty' },
    title: { ar: 'تفاصيل تطعيم العرش الذهبي', en: 'Golden Throne Inlay Detail' },
    date: 'c. 1330 BCE',
    material: { ar: 'خشب مذهب وأحجار تطعيم', en: 'Gilded wood with inset stones' },
    provenance: { ar: 'KV62 - غرفة الكنز', en: 'KV62 treasury context' },
    discovery: { ar: 'تفاصيل دقيقة نُظفت بتقنيات مجهرية', en: 'Fine details clarified through microscopic cleaning' },
    significance: { ar: 'يكشف طبقات مهارة الحرفيين الملكيين', en: 'Reveals layered craftsmanship of royal workshops' },
  },
  {
    id: 'grand-hall-royal-axis',
    image: '/images/grand_hall.jpg',
    category: 'architecture',
    periodKey: 'modern',
    periodLabel: { ar: 'عمارة متحفية', en: 'Museum Architecture' },
    title: { ar: 'محور البهو الملكي', en: 'Royal Hall Axis' },
    date: '2025 CE',
    material: { ar: 'خرسانة وزجاج عالي النفاذية', en: 'Concrete and high-transparency glazing' },
    provenance: { ar: 'مركز التوجيه داخل المتحف', en: 'Internal orientation core' },
    discovery: { ar: 'يربط المسارات الكبرى في نقطة بصرية واحدة', en: 'Connects major routes through one visual anchor' },
    significance: { ar: 'يحول الدخول إلى تجربة سردية فورية', en: 'Turns arrival into an immediate narrative experience' },
  },
  {
    id: 'staircase-statue-sequence',
    image: '/images/staircase.jpg',
    category: 'architecture',
    periodKey: 'modern',
    periodLabel: { ar: 'تصميم معاصر', en: 'Contemporary Design' },
    title: { ar: 'تسلسل تماثيل الدرج الكبير', en: 'Grand Staircase Statue Sequence' },
    date: '2025 CE',
    material: { ar: 'بنية حجرية مع إضاءة عرض', en: 'Stone structure with exhibition lighting' },
    provenance: { ar: 'المحور الرأسي للحركة', en: 'Primary vertical circulation axis' },
    discovery: { ar: 'توزيع تماثيل وفق منطق زمني واضح', en: 'Statues distributed in a clear chronological arc' },
    significance: { ar: 'يجمع الحركة الرأسية بالتدرج التاريخي', en: 'Combines vertical movement with historical progression' },
  },
  {
    id: 'giza-horizon-connection',
    image: '/images/giza_plateau.jpg',
    category: 'landscapes',
    periodKey: 'old-kingdom',
    periodLabel: { ar: 'الأفق الملكي', en: 'Royal Horizon' },
    title: { ar: 'محور اتصال أفق الجيزة', en: 'Giza Horizon Connection' },
    date: 'c. 26th century BCE context',
    material: { ar: 'منظر حجري طبيعي وأثري', en: 'Natural and monumental stone landscape' },
    provenance: { ar: 'امتداد بصري لهضبة الجيزة', en: 'Visual extension toward Giza plateau' },
    discovery: { ar: 'يوفر قراءة مكانية لمصدر كثير من القطع', en: 'Provides spatial reading for many object origins' },
    significance: { ar: 'يعيد ربط القطعة بمشهدها الجغرافي الأصلي', en: 'Reconnects objects with their native geographic scene' },
  },
];

const IMAGE_LIBRARY: Array<{ src: string; title: string }> = [
  { src: '/images/atrium.jpg', title: 'Atrium' },
  { src: '/images/ushabti.jpg', title: 'Ushabti' },
  { src: '/images/ankh.jpg', title: 'Ankh' },
  { src: '/images/tut_chariot.jpg', title: 'Tut Chariot' },
  { src: '/images/tutankhamun_mask.jpg', title: 'Tutankhamun Mask' },
  { src: '/images/staircase.jpg', title: 'Grand Staircase' },
  { src: '/images/scarab.jpg', title: 'Scarab' },
  { src: '/images/sarcophagus_room.jpg', title: 'Sarcophagus Room' },
  { src: '/images/papyrus.jpg', title: 'Papyrus' },
  { src: '/images/obelisk.jpg', title: 'Obelisk' },
  { src: '/images/nile_sunset.jpg', title: 'Nile Sunset' },
  { src: '/images/nile_night.jpg', title: 'Nile Night' },
  { src: '/images/isis_statue.jpg', title: 'Isis Statue' },
  { src: '/images/museum_night.jpg', title: 'Museum at Night' },
  { src: '/images/hero_pharaoh.jpg', title: 'Ramesses II' },
  { src: '/images/mummy_case.jpg', title: 'Mummy Case' },
  { src: '/images/grand_hall.jpg', title: 'Grand Hall' },
  { src: '/images/golden_throne.jpg', title: 'Golden Throne' },
  { src: '/images/giza_plateau.jpg', title: 'Giza Plateau' },
  { src: '/images/exhibition_hall.jpg', title: 'Exhibition Hall' },
  { src: '/images/entrance_plaza.jpg', title: 'Entrance Plaza' },
  { src: '/images/egyptian_jewelry.jpg', title: 'Egyptian Jewelry' },
  { src: '/images/coffin_interior.jpg', title: 'Coffin Interior' },
  { src: '/images/canopic_jars.jpg', title: 'Canopic Jars' },
];

const VIDEO_LIBRARY = [
  {
    id: 'newEra',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-egyptian-pyramids-in-the-desert-2197-large.mp4',
    poster: '/images/museum_night.jpg',
    duration: '5:32',
  },
  {
    id: 'tutComplete',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-sun-shining-over-the-pyramids-of-giza-2198-large.mp4',
    poster: '/images/tutankhamun_mask.jpg',
    duration: '12:45',
  },
  {
    id: 'engineering',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-desert-dunes-at-sunset-1195-large.mp4',
    poster: '/images/entrance_plaza.jpg',
    duration: '8:18',
  },
  {
    id: 'obelisk',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-egyptian-pyramids-in-the-desert-2197-large.mp4',
    poster: '/images/obelisk.jpg',
    duration: '4:55',
  },
  {
    id: 'staircase',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-sun-shining-over-the-pyramids-of-giza-2198-large.mp4',
    poster: '/images/staircase.jpg',
    duration: '6:22',
  },
  {
    id: 'conservation',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-desert-dunes-at-sunset-1195-large.mp4',
    poster: '/images/exhibition_hall.jpg',
    duration: '9:10',
  },
];

const ITINERARIES: Array<{ id: string; title: Localized; duration: string; stops: Localized[] }> = [
  {
    id: 'express',
    title: { ar: 'مسار سريع (3 ساعات)', en: 'Express Route (3 Hours)' },
    duration: '180 min',
    stops: [
      { ar: 'الدرج العظيم + تمثال رمسيس', en: 'Grand Staircase + Ramesses Colossus' },
      { ar: 'قاعات توت الأساسية', en: 'Core Tutankhamun rooms' },
      { ar: 'منصة المشهد البانورامي للجيزة', en: 'Panoramic Giza viewing axis' },
    ],
  },
  {
    id: 'full-day',
    title: { ar: 'مسار يوم كامل (6-7 ساعات)', en: 'Full-Day Deep Dive (6-7 Hours)' },
    duration: '390 min',
    stops: [
      { ar: 'الخط الزمني من ما قبل الأسرات حتى الدولة الحديثة', en: 'Chronology from Predynastic to New Kingdom' },
      { ar: 'المجموعة الكاملة لتوت عنخ آمون', en: 'Complete Tutankhamun corpus' },
      { ar: 'معامل الحفظ المفتوحة + قاعة الفيديو', en: 'Open conservation labs + media theater' },
    ],
  },
  {
    id: 'research',
    title: { ar: 'مسار باحث/متخصص', en: 'Research-Oriented Route' },
    duration: 'By appointment',
    stops: [
      { ar: 'مراجعة القطع حسب المادة والفترة', en: 'Object review by material and period' },
      { ar: 'جلسات تفسيرية مع مرشدي المحتوى العلمي', en: 'Interpretive sessions with scholarly guides' },
      { ar: 'استعراض توثيق رقمي عالي الدقة', en: 'High-resolution digital documentation review' },
    ],
  },
];

const CATEGORY_LABELS: Record<Masterpiece['category'] | 'all', Localized> = {
  all: { ar: 'كل الفئات', en: 'All Categories' },
  treasures: { ar: 'كنوز ملكية', en: 'Royal Treasures' },
  artifacts: { ar: 'قطع أثرية', en: 'Artifacts' },
  architecture: { ar: 'عمارة ومتاحف', en: 'Architecture' },
  landscapes: { ar: 'مشاهد تاريخية', en: 'Landscapes' },
};

const EXPLORER_NOTES: Array<{ id: string; title: Localized; detail: Localized }> = [
  {
    id: 'context',
    title: { ar: 'اقرأ السياق أولًا', en: 'Start With Context' },
    detail: { ar: 'افتح الفترة التاريخية للقطعة قبل التعمق في خامتها ومصدرها.', en: 'Open the historical period first, then inspect material and provenance.' },
  },
  {
    id: 'compare',
    title: { ar: 'قارن بين القطع', en: 'Compare Pieces' },
    detail: { ar: 'جرّب اختيار قطع من نفس الفئة لملاحظة الفروق الدقيقة بسرعة.', en: 'Select pieces from the same category to spot subtle differences quickly.' },
  },
  {
    id: 'route',
    title: { ar: 'حوّلها لمسار زيارة', en: 'Turn It Into a Route' },
    detail: { ar: 'بعد التصفح، انتقل لمسارات الزيارة وطبّق القطع المختارة على الأرض.', en: 'After browsing, move to visit routes and apply selected pieces on-site.' },
  },
];

function pick(localized: Localized, isRTL: boolean) {
  return isRTL ? localized.ar : localized.en;
}

export default function Atlas() {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Masterpiece['category'] | 'all'>('all');
  const [period, setPeriod] = useState('all');
  const [activePieceId, setActivePieceId] = useState<string>(MASTERPIECES[0].id);
  const [activeFloorId, setActiveFloorId] = useState(FLOOR_ATLAS[1].id);
  const [activeCorridorId, setActiveCorridorId] = useState(FLOOR_ATLAS[1].corridors[0].id);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.atlas-reveal',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.atlas-page',
            start: 'top 85%',
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  const periodOptions = useMemo(() => {
    const map = new Map<string, Localized>();
    MASTERPIECES.forEach((piece) => map.set(piece.periodKey, piece.periodLabel));
    return [{ key: 'all', label: { ar: 'كل الفترات', en: 'All Periods' } }, ...Array.from(map.entries()).map(([key, label]) => ({ key, label }))];
  }, []);

  const filteredPieces = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return MASTERPIECES.filter((piece) => {
      const categoryMatch = category === 'all' ? true : piece.category === category;
      const periodMatch = period === 'all' ? true : piece.periodKey === period;
      const queryMatch =
        normalized.length === 0 ||
        piece.title.ar.toLowerCase().includes(normalized) ||
        piece.title.en.toLowerCase().includes(normalized) ||
        piece.material.ar.toLowerCase().includes(normalized) ||
        piece.material.en.toLowerCase().includes(normalized) ||
        piece.provenance.ar.toLowerCase().includes(normalized) ||
        piece.provenance.en.toLowerCase().includes(normalized);

      return categoryMatch && periodMatch && queryMatch;
    });
  }, [category, period, query]);

  const activeFloor = useMemo(() => FLOOR_ATLAS.find((floor) => floor.id === activeFloorId) ?? FLOOR_ATLAS[0], [activeFloorId]);

  const activeCorridor = useMemo(
    () => activeFloor.corridors.find((corridor) => corridor.id === activeCorridorId) ?? activeFloor.corridors[0],
    [activeCorridorId, activeFloor],
  );

  const activePiece = filteredPieces.find((piece) => piece.id === activePieceId) ?? filteredPieces[0] ?? MASTERPIECES[0];
  const relatedPieces = useMemo(
    () =>
      MASTERPIECES.filter(
        (piece) =>
          piece.id !== activePiece.id &&
          (piece.category === activePiece.category || piece.periodKey === activePiece.periodKey),
      ).slice(0, 5),
    [activePiece],
  );

  return (
    <div className={`atlas-page ${isRTL ? 'rtl' : 'ltr'}`}>
      <section className="atlas-hero atlas-reveal">
        <div className="atlas-hero-bg">
          <img src="/images/grand_hall.jpg" alt={pick({ ar: 'البهو الكبير', en: 'Grand Hall' }, isRTL)} />
          <div className="atlas-hero-overlay" />
        </div>
        <MuseumHero3D />
        <div className="atlas-hero-content">
          <span className="atlas-badge">{pick({ ar: 'أطلس المتحف', en: 'Museum Atlas' }, isRTL)}</span>
          <h1>{pick({ ar: 'منصة معرفية شاملة للمتحف المصري الكبير', en: 'A Complete Knowledge Platform for the Grand Egyptian Museum' }, isRTL)}</h1>
          <p>
            {pick(
              {
                ar: 'كل ما تحتاجه في مكان واحد: التسلسل التاريخي، تفاصيل القاعات، موسوعة القطع، الفيديوهات التفسيرية، ومسارات زيارة جاهزة.',
                en: 'Everything in one place: chronology, gallery-by-gallery coverage, object encyclopedia, interpretive video archive, and ready-to-use visit routes.',
              },
              isRTL,
            )}
          </p>
          <div className="atlas-hero-actions">
            <Link to="/tickets" className="btn-gold">
              {pick({ ar: 'احجز زيارتك', en: 'Book Your Visit' }, isRTL)}
            </Link>
            <Link to="/visit" className="btn-outline">
              {pick({ ar: 'خطة الزيارة', en: 'Plan Your Route' }, isRTL)}
            </Link>
          </div>
        </div>
      </section>

      <section className="atlas-navigation atlas-reveal">
        <div className="atlas-navigation-wrap">
          <p>{pick({ ar: 'تقسيم الصفحة', en: 'Page Structure' }, isRTL)}</p>
          <div className="atlas-navigation-links">
            {ATLAS_ANCHORS.map((anchor) => (
              <a key={anchor.id} href={`#${anchor.id}`} className="atlas-navigation-pill">
                {pick(anchor.label, isRTL)}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="atlas-facts" className="atlas-facts atlas-reveal">
        <div className="atlas-section-header">
          <h2>{pick({ ar: 'أرقام أساسية', en: 'Core Metrics' }, isRTL)}</h2>
          <p>{pick({ ar: 'مؤشرات سريعة لفهم حجم المحتوى داخل المتحف', en: 'Quick indicators for the scale of the museum experience' }, isRTL)}</p>
        </div>
        <div className="atlas-facts-grid">
          {FACTS.map((fact) => (
            <article key={fact.label.en} className="atlas-fact-card">
              <fact.icon size={28} />
              <span className="atlas-fact-value">{fact.value}</span>
              <span className="atlas-fact-label">{pick(fact.label, isRTL)}</span>
              <p>{pick(fact.detail, isRTL)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="atlas-timeline" className="atlas-timeline atlas-reveal">
        <div className="atlas-section-header">
          <h2>{pick({ ar: 'الخط الزمني للحضارة المصرية', en: 'Chronology of Egyptian Civilization' }, isRTL)}</h2>
          <p>{pick({ ar: 'مختصر علمي يساعدك تربط القطع بسياقها التاريخي', en: 'A concise scholarly timeline that anchors objects to historical context' }, isRTL)}</p>
        </div>
        <div className="atlas-timeline-list">
          {TIMELINE.map((item) => (
            <article key={item.years} className="atlas-timeline-item">
              <span className="atlas-timeline-years">{item.years}</span>
              <div className="atlas-timeline-body">
                <h3>{pick(item.title, isRTL)}</h3>
                <p>{pick(item.summary, isRTL)}</p>
                <ul>
                  {item.keyPoints.map((point) => (
                    <li key={point.en}>{pick(point, isRTL)}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="atlas-zones" className="atlas-zones atlas-reveal">
        <div className="atlas-section-header">
          <h2>{pick({ ar: 'دليل القاعات', en: 'Gallery Directory' }, isRTL)}</h2>
          <p>{pick({ ar: 'ملخص عملي لكل منطقة عرض: الموضوع، الدور، وأهم القطع', en: 'Practical summary of each display zone: focus, floor, and key highlights' }, isRTL)}</p>
        </div>
        <div className="atlas-zones-grid">
          {ZONES.map((zone) => (
            <article key={zone.code} className="atlas-zone-card">
              <div className="atlas-zone-head">
                <span className="atlas-zone-code">{zone.code}</span>
                <span className="atlas-zone-time">
                  <Clock3 size={15} />
                  {zone.duration}
                </span>
              </div>
              <h3>{pick(zone.title, isRTL)}</h3>
              <p>{pick(zone.focus, isRTL)}</p>
              <div className="atlas-zone-meta">
                <MapPin size={15} />
                {pick(zone.floor, isRTL)}
              </div>
              <ul>
                {zone.highlights.map((item) => (
                  <li key={item.en}>{pick(item, isRTL)}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="atlas-floors" className="atlas-floors atlas-reveal">
        <div className="atlas-section-header">
          <h2>{pick({ ar: 'أطلس الأدوار والممرات', en: 'Floors and Corridors Atlas' }, isRTL)}</h2>
          <p>
            {pick(
              {
                ar: 'استكشف المتحف كأنك بداخله: اختر الدور، راقب حركة الممرات، واطلع على تفاصيل كل محور وما يوصلك إليه.',
                en: 'Explore the museum like you are inside it: select a floor, inspect corridor flow, and open detailed path intelligence.',
              },
              isRTL,
            )}
          </p>
        </div>

        <div className="atlas-floor-layout">
          <aside className="atlas-floor-selector">
            {FLOOR_ATLAS.map((floor) => (
              <button
                key={floor.id}
                type="button"
                className={`atlas-floor-button ${activeFloor.id === floor.id ? 'active' : ''}`}
                onClick={() => setActiveFloorId(floor.id)}
                aria-pressed={activeFloor.id === floor.id}
              >
                <span>{pick(floor.level, isRTL)}</span>
                <strong>{pick(floor.title, isRTL)}</strong>
                <small>{floor.traffic}</small>
              </button>
            ))}
            <div className="atlas-piece-supplement">
              <h4>{pick({ ar: 'ملاحظات سريعة', en: 'Quick Notes' }, isRTL)}</h4>
              <div className="atlas-piece-note-list">
                {EXPLORER_NOTES.map((note) => (
                  <article key={note.id} className="atlas-piece-note">
                    <strong>{pick(note.title, isRTL)}</strong>
                    <p>{pick(note.detail, isRTL)}</p>
                  </article>
                ))}
              </div>
              <h4>{pick({ ar: 'قطع مرتبطة', en: 'Related Pieces' }, isRTL)}</h4>
              <div className="atlas-piece-related-list">
                {relatedPieces.map((piece) => (
                  <button key={piece.id} type="button" onClick={() => setActivePieceId(piece.id)} className="atlas-related-piece">
                    <span>{pick(piece.periodLabel, isRTL)}</span>
                    <strong>{pick(piece.title, isRTL)}</strong>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="atlas-floor-main">
            <article className="atlas-floor-overview">
              <div className="atlas-floor-overview-head">
                <h3>{pick(activeFloor.level, isRTL)}</h3>
                <span>{pick(activeFloor.bestTime, isRTL)}</span>
              </div>
              <p>{pick(activeFloor.overview, isRTL)}</p>
              <div className="atlas-floor-mix">
                <Compass size={16} />
                {pick(activeFloor.collectionMix, isRTL)}
              </div>
              <div className="atlas-floor-services">
                {activeFloor.services.map((service) => (
                  <span key={service.en}>{pick(service, isRTL)}</span>
                ))}
              </div>
            </article>

            <article className="atlas-corridors-grid">
              {activeFloor.corridors.map((corridor) => (
                <button
                  key={corridor.id}
                  type="button"
                  className={`atlas-corridor-card ${activeCorridor.id === corridor.id ? 'active' : ''}`}
                  onClick={() => setActiveCorridorId(corridor.id)}
                  aria-pressed={activeCorridor.id === corridor.id}
                >
                  <div className="atlas-corridor-head">
                    <span>{corridor.zone}</span>
                    <small>{corridor.dwellTime}</small>
                  </div>
                  <h4>{pick(corridor.title, isRTL)}</h4>
                  <p>{pick(corridor.orientation, isRTL)}</p>
                  <div className="atlas-corridor-crowd">{pick(corridor.crowd, isRTL)}</div>
                </button>
              ))}
            </article>
          </div>

          <aside className="atlas-corridor-panel">
            <h3>{pick(activeCorridor.title, isRTL)}</h3>
            <p>{pick(activeCorridor.connection, isRTL)}</p>
            <div className="atlas-corridor-meta">
              <span>
                <Clock3 size={14} />
                {pick({ ar: 'مدة مقترحة:', en: 'Suggested time:' }, isRTL)} {activeCorridor.dwellTime}
              </span>
              <span>
                <MapPin size={14} />
                {pick({ ar: 'منطقة:', en: 'Zone:' }, isRTL)} {activeCorridor.zone}
              </span>
            </div>
            <ul>
              {activeCorridor.highlights.map((highlight) => (
                <li key={highlight.en}>{pick(highlight, isRTL)}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section id="atlas-systems" className="atlas-systems atlas-reveal">
        <div className="atlas-section-header">
          <h2>{pick({ ar: 'طبقات تشغيل الزيارة', en: 'Visit Intelligence Layers' }, isRTL)}</h2>
          <p>
            {pick(
              {
                ar: 'معلومات عملية إضافية بشكل مختلف: مؤشرات، قرارات سريعة، وإرشادات تساعدك تختار المسار الأنسب فورًا.',
                en: 'Operational details in a different format: key metrics, quick decisions, and practical route guidance.',
              },
              isRTL,
            )}
          </p>
        </div>
        <div className="atlas-systems-grid">
          {SYSTEM_BRIEFS.map((system) => (
            <article key={system.id} className="atlas-system-card">
              <h3>{pick(system.title, isRTL)}</h3>
              <p>{pick(system.summary, isRTL)}</p>
              <div className="atlas-system-metrics">
                {system.metrics.map((metric) => (
                  <div key={metric.label.en}>
                    <strong>{metric.value}</strong>
                    <span>{pick(metric.label, isRTL)}</span>
                  </div>
                ))}
              </div>
              <ul>
                {system.actions.map((action) => (
                  <li key={action.en}>{pick(action, isRTL)}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="atlas-explorer" className="atlas-explorer atlas-reveal">
        <div className="atlas-section-header">
          <h2>{pick({ ar: 'موسوعة القطع', en: 'Masterpieces Explorer' }, isRTL)}</h2>
          <p>{pick({ ar: 'ابحث وصنّف القطع حسب الفترة أو الفئة مع بطاقة تعريف تفصيلية', en: 'Search and filter by period or category with detailed object records' }, isRTL)}</p>
        </div>

        <div className="atlas-controls">
          <label className="atlas-control">
            <Search size={16} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={pick({ ar: 'ابحث باسم القطعة أو المادة أو الموقع...', en: 'Search by title, material, or provenance...' }, isRTL)}
            />
          </label>

          <label className="atlas-control">
            <span>{pick({ ar: 'الفئة', en: 'Category' }, isRTL)}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value as Masterpiece['category'] | 'all')}>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {pick(label, isRTL)}
                </option>
              ))}
            </select>
          </label>

          <label className="atlas-control">
            <span>{pick({ ar: 'الفترة', en: 'Period' }, isRTL)}</span>
            <select value={period} onChange={(event) => setPeriod(event.target.value)}>
              {periodOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {pick(option.label, isRTL)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="atlas-results">
          <span>{pick({ ar: `عدد النتائج: ${filteredPieces.length}`, en: `Results: ${filteredPieces.length}` }, isRTL)}</span>
        </div>

        <div className="atlas-explorer-layout">
          <div className="atlas-cards-grid">
            {filteredPieces.map((piece) => (
              <button
                key={piece.id}
                type="button"
                onClick={() => setActivePieceId(piece.id)}
                className={`atlas-piece-card ${activePiece.id === piece.id ? 'active' : ''}`}
              >
                <img src={piece.image} alt={pick(piece.title, isRTL)} loading="lazy" />
                <div className="atlas-piece-card-content">
                  <span>{pick(piece.periodLabel, isRTL)}</span>
                  <h3>{pick(piece.title, isRTL)}</h3>
                  <p>{piece.date}</p>
                </div>
              </button>
            ))}
          </div>

          <aside className="atlas-piece-panel">
            <img src={activePiece.image} alt={pick(activePiece.title, isRTL)} />
            <div className="atlas-piece-panel-body">
              <h3>{pick(activePiece.title, isRTL)}</h3>
              <div className="atlas-piece-meta">
                <span>{pick(activePiece.periodLabel, isRTL)}</span>
                <span>{activePiece.date}</span>
              </div>
              <p>
                <strong>{pick({ ar: 'الخامة:', en: 'Material:' }, isRTL)}</strong> {pick(activePiece.material, isRTL)}
              </p>
              <p>
                <strong>{pick({ ar: 'المصدر:', en: 'Provenance:' }, isRTL)}</strong> {pick(activePiece.provenance, isRTL)}
              </p>
              <p>
                <strong>{pick({ ar: 'الاكتشاف:', en: 'Discovery:' }, isRTL)}</strong> {pick(activePiece.discovery, isRTL)}
              </p>
              <p>{pick(activePiece.significance, isRTL)}</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="atlas-videos" className="atlas-videos atlas-reveal">
        <div className="atlas-section-header">
          <h2>{pick({ ar: 'أرشيف الفيديو', en: 'Video Archive' }, isRTL)}</h2>
          <p>{pick({ ar: 'مقاطع توضيحية تعمل تلقائيًا لشرح القاعات والقطع وأساليب الحفظ', en: 'Autoplay explainers for galleries, objects, and conservation workflows' }, isRTL)}</p>
        </div>
        <div className="atlas-video-grid">
          {VIDEO_LIBRARY.map((video) => (
            <article key={video.id} className="atlas-video-card">
              <div className="atlas-video-media">
                <video autoPlay muted loop playsInline preload="metadata" poster={video.poster}>
                  <source src={video.src} type="video/mp4" />
                </video>
                <span className="atlas-video-pill">
                  <Play size={12} fill="currentColor" />
                  {video.duration}
                </span>
              </div>
              <div className="atlas-video-card-body">
                <h3>{pick({ ar: `فيلم ${video.id}`, en: `Episode ${video.id}` }, isRTL)}</h3>
                <p>
                  {pick(
                    {
                      ar: 'ملخص بصري سريع يربط المشهد المعماري أو القطعة بسياقها التاريخي.',
                      en: 'A concise visual briefing linking architecture and objects to historical context.',
                    },
                    isRTL,
                  )}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="atlas-library" className="atlas-library atlas-reveal">
        <div className="atlas-section-header">
          <h2>{pick({ ar: 'مكتبة الصور الكاملة', en: 'Complete Image Library' }, isRTL)}</h2>
          <p>{pick({ ar: 'جميع الصور المتاحة داخل التطبيق في معرض واحد', en: 'All available media images gathered in one visual index' }, isRTL)}</p>
        </div>
        <div className="atlas-library-grid">
          {IMAGE_LIBRARY.map((item) => (
            <figure key={item.src} className="atlas-library-item">
              <img src={item.src} alt={item.title} loading="lazy" />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="atlas-routes" className="atlas-routes atlas-reveal">
        <div className="atlas-section-header">
          <h2>{pick({ ar: 'مسارات زيارة مقترحة', en: 'Curated Visit Routes' }, isRTL)}</h2>
          <p>{pick({ ar: 'خطط جاهزة حسب وقتك وهدفك من الزيارة', en: 'Ready-made plans based on available time and visit intent' }, isRTL)}</p>
        </div>
        <div className="atlas-routes-grid">
          {ITINERARIES.map((route) => (
            <article key={route.id} className="atlas-route-card">
              <h3>{pick(route.title, isRTL)}</h3>
              <span>{route.duration}</span>
              <ul>
                {route.stops.map((stop) => (
                  <li key={stop.en}>{pick(stop, isRTL)}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="atlas-cta" className="atlas-cta atlas-reveal">
        <div className="atlas-cta-content">
          <div>
            <h2>{pick({ ar: 'جاهز تعيش التجربة على أرض الواقع؟', en: 'Ready to Experience It On-Site?' }, isRTL)}</h2>
            <p>{pick({ ar: 'بعد استكشاف الأطلس، احجز مسارك واختر القاعات اللي تناسب وقتك.', en: 'After exploring the atlas, book your route and prioritize the galleries you care about most.' }, isRTL)}</p>
          </div>
          <div className="atlas-cta-actions">
            <Link to="/tickets" className="btn-gold">
              <Ticket size={16} />
              {pick({ ar: 'احجز التذاكر', en: 'Book Tickets' }, isRTL)}
            </Link>
            <Link to="/videos" className="btn-primary">
              <Video size={16} />
              {pick({ ar: 'مكتبة الفيديو', en: 'Video Library' }, isRTL)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
