import { useEffect, useRef, useState, type SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Ticket,
  Star,
  Users,
  BookOpen,
  Calendar,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronRight,
  Pyramid,
  Landmark,
  Gem,
  History,
  Compass,
  Sun,
  Moon,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MuseumHero3D from '../components/MuseumHero3D';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);
const MotionLink = motion(Link);

type SlideId = 'gem' | 'tut' | 'history';

const HERO_SLIDES: Array<{ id: SlideId; video: string; image: string }> = [
  {
    id: 'gem',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-egyptian-pyramids-in-the-desert-2197-large.mp4',
    image: '/images/hero_pharaoh.jpg',
  },
  {
    id: 'tut',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-sun-shining-over-the-pyramids-of-giza-2198-large.mp4',
    image: '/images/giza_plateau.jpg',
  },
  {
    id: 'history',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-desert-dunes-at-sunset-1195-large.mp4',
    image: '/images/nile_sunset.jpg',
  },
];

const statistics = [
  { id: 'artifacts', value: 100000, suffix: '+', icon: Gem },
  { id: 'tutItems', value: 5398, suffix: '', icon: Crown },
  { id: 'galleries', value: 50, suffix: '', icon: Landmark },
  { id: 'area', value: 480000, suffix: '', icon: Compass },
] as const;

const highlights = [
  { id: 'mask', image: '/images/tutankhamun_mask.jpg' },
  { id: 'obelisk', image: '/images/obelisk.jpg' },
  { id: 'staircase', image: '/images/staircase.jpg' },
  { id: 'ramesses', image: '/images/hero_pharaoh.jpg' },
] as const;

const quickLinks = [
  { id: 'bookTickets', icon: Ticket, href: '/tickets', color: '#C9A227' },
  { id: 'planVisit', icon: Calendar, href: '/visit', color: '#C9A227' },
  { id: 'exhibitions', icon: BookOpen, href: '/exhibitions', color: '#C9A227' },
  { id: 'groupTours', icon: Users, href: '/visit', color: '#C9A227' },
] as const;

const features = [
  { id: 'location', icon: Pyramid },
  { id: 'history', icon: History },
  { id: 'sustainable', icon: Sun },
  { id: 'night', icon: Moon },
] as const;

const heroFloaters = [
  { id: 'f1', icon: Pyramid, className: 'hero-floater hero-floater--1' },
  { id: 'f2', icon: Gem, className: 'hero-floater hero-floater--2' },
  { id: 'f3', icon: Landmark, className: 'hero-floater hero-floater--3' },
  { id: 'f4', icon: Crown, className: 'hero-floater hero-floater--4' },
] as const;

const asObject = (value: unknown): Record<string, any> => (
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, any>) : {}
);

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

function Crown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stat-card',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 80%',
          },
        },
      );

      gsap.fromTo(
        '.highlight-card',
        { opacity: 0, y: 60, rotateY: -15 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.highlights-section',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.feature-card',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.quick-link-card',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.quick-links-section',
            start: 'top 85%',
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const slide = HERO_SLIDES[currentSlide];
  const slideKey = `home.hero.slides.${slide.id}` as const;

  return (
    <div ref={containerRef} className={`home-page ${isRTL ? 'rtl' : 'ltr'}`}>
      <section className="hero-video-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="video-background"
          >
            <video
              ref={(el) => {
                videoRefs.current[currentSlide] = el;
              }}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              poster={slide.image}
              className="hero-video"
            >
              <source src={slide.video} type="video/mp4" />
            </video>
            <div className="video-overlay" />
          </motion.div>
        </AnimatePresence>

        <MuseumHero3D />
        <div className="hero-floaters" aria-hidden="true">
          {heroFloaters.map((floater) => (
            <div key={floater.id} className={floater.className}>
              <floater.icon size={26} />
            </div>
          ))}
        </div>

        <div className="hero-content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="hero-content"
            >
              <motion.span
                className="hero-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t('home.hero.badge')}
              </motion.span>

              <motion.h1
                className="hero-headline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t(`${slideKey}.headline`)}
              </motion.h1>

              <motion.p
                className="hero-subheadline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t(`${slideKey}.subheadline`)}
              </motion.p>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {t(`${slideKey}.description`)}
              </motion.p>

              <motion.div
                className="hero-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/tickets" className="btn-gold btn-large">
                  {t('home.hero.buttons.bookTickets')}
                  <ArrowLeft size={20} className={isRTL ? '' : 'rotate-180'} />
                </Link>
                <Link to="/exhibitions" className="btn-outline btn-large">
                  {t('home.hero.buttons.exploreExhibitions')}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="video-controls">
          <button onClick={() => setIsMuted(!isMuted)} className="control-btn" type="button">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="control-btn" type="button">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>

        <div className="slide-navigation">
          <button onClick={prevSlide} className="nav-arrow" type="button" aria-label="Previous slide">
            <ChevronLeft size={32} />
          </button>

          <div className="slide-dots">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`slide-dot ${currentSlide === index ? 'active' : ''}`}
                type="button"
                aria-label={`Slide ${index + 1}`}
              >
                <span
                  className="dot-progress"
                  style={{
                    animationDuration: currentSlide === index && isPlaying ? '8s' : '0s',
                    animationPlayState: isPlaying ? 'running' : 'paused',
                  }}
                />
              </button>
            ))}
          </div>

          <button onClick={nextSlide} className="nav-arrow" type="button" aria-label="Next slide">
            <ChevronRight size={32} />
          </button>
        </div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span>{t('home.hero.scrollDown')}</span>
          <div className="scroll-line" />
        </motion.div>
      </section>

      <section className="stats-section home-split home-split--stats">
        <div className="stats-container">
          {statistics.map((stat) => (
            <motion.div
              key={stat.id}
              className="stat-card"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <stat.icon className="stat-icon" size={40} />
              <div className="stat-number">
                <span className="stat-number-value" dir="ltr">
                  <CountUp end={stat.value} duration={3} separator="," suffix={stat.suffix} />
                </span>
              </div>
              <span className="stat-label">{t(`home.stats.${stat.id}`)}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="quick-links-section home-split home-split--quick-links">
        <div className="quick-links-container">
          {quickLinks.map((link) => (
            <MotionLink
              key={link.id}
              to={link.href}
              className="quick-link-card"
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="quick-link-icon" style={{ backgroundColor: `${link.color}20` }}>
                <link.icon size={28} style={{ color: link.color }} />
              </div>
              <span className="quick-link-label">{t(`home.quickLinks.${link.id}`)}</span>
              <ChevronLeft size={20} className={`quick-link-arrow ${isRTL ? '' : 'rotate-180'}`} />
            </MotionLink>
          ))}
        </div>
      </section>

      <section className="features-section home-split home-split--features">
        <div className="features-container">
          <div className="features-header">
            <span className="section-badge">{t('home.features.badge')}</span>
            <h2 className="section-title">{t('home.features.title')}</h2>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                className="feature-card"
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              >
                <div className="feature-icon-wrapper">
                  <feature.icon className="feature-icon" size={36} />
                </div>
                <h3 className="feature-title">{t(`home.features.items.${feature.id}.title`)}</h3>
                <p className="feature-description">{t(`home.features.items.${feature.id}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="highlights-section home-split home-split--highlights">
        <div className="highlights-container">
          <div className="highlights-header">
            <span className="section-badge">{t('home.highlights.badge')}</span>
            <h2 className="section-title">{t('home.highlights.title')}</h2>
            <p className="section-subtitle">{t('home.highlights.subtitle')}</p>
          </div>

          <div className="highlights-grid">
            {highlights.map((item) => (
              <MotionLink
                key={item.id}
                to="/exhibitions"
                className="highlight-card"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="highlight-image">
                  <img src={item.image} alt={t(`home.highlights.items.${item.id}.title`)} />
                  <div className="highlight-overlay" />
                  <motion.div className="highlight-view" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                    <Play size={48} />
                  </motion.div>
                </div>
                <div className="highlight-content">
                  <h3 className="highlight-title">{t(`home.highlights.items.${item.id}.title`)}</h3>
                  <p className="highlight-description">{t(`home.highlights.items.${item.id}.description`)}</p>
                  <span className="highlight-link">
                    {t('home.highlights.learnMore')}
                    <ArrowLeft size={16} className={isRTL ? '' : 'rotate-180'} />
                  </span>
                </div>
              </MotionLink>
            ))}
          </div>
        </div>
      </section>

      <section className="artifacts-section home-split home-split--artifacts">
        <div className="artifacts-container">
          <div className="artifacts-header">
            <span className="section-badge">{t('home.artifacts.badge')}</span>
            <h2 className="section-title">{t('home.artifacts.title')}</h2>
            <p className="section-subtitle">{t('home.artifacts.subtitle')}</p>
          </div>

          <div className="artifacts-grid">
            {[
              'tutMask',
              'throne',
              'chariot',
              'necklace',
              'sarcophagus',
              'kohl',
            ].map((artifactId, index) => {
              const artifact = asObject((t as any)(`home.artifacts.items.${artifactId}`, { returnObjects: true }));
              return (
                <motion.div
                  key={artifactId}
                  className="artifact-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="artifact-detail-badge">{artifact.period}</div>
                  <h3 className="artifact-title">{artifact.title}</h3>
                  <p className="artifact-description">{artifact.description}</p>
                  <div className="artifact-specs">
                    {artifact.year && (
                      <div className="spec-item">
                        <span className="spec-label">{t('home.labels.year')}</span>
                        <span className="spec-value">{artifact.year}</span>
                      </div>
                    )}
                    {artifact.material && (
                      <div className="spec-item">
                        <span className="spec-label">{t('home.labels.material')}</span>
                        <span className="spec-value">{artifact.material}</span>
                      </div>
                    )}
                    {(artifact.weight || artifact.dimensions || artifact.layers || artifact.collection) && (
                      <div className="spec-item">
                        <span className="spec-label">{t('home.labels.details')}</span>
                        <span className="spec-value">
                          {artifact.weight || artifact.dimensions || artifact.layers || artifact.collection}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="timeline-section home-split home-split--timeline">
        <div className="timeline-container">
          <div className="timeline-header">
            <span className="section-badge">{t('home.historicalTimeline.badge')}</span>
            <h2 className="section-title">{t('home.historicalTimeline.title')}</h2>
            <p className="section-subtitle">{t('home.historicalTimeline.subtitle')}</p>
          </div>

          <div className="timeline">
            {[
              'predynastic',
              'oldKingdom',
              'middleKingdom',
              'newKingdom',
              'ptolemaicGrecoRoman',
            ].map((periodId, index) => {
              const period = asObject((t as any)(
                `home.historicalTimeline.periods.${periodId}`,
                { returnObjects: true }
              ));
              const periodHighlights = asArray<string>(period.highlights);
              return (
                <motion.div
                  key={periodId}
                  className="timeline-item"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="timeline-marker">
                    <div className="timeline-dot" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header-text">
                      <h3 className="timeline-period">{period.period}</h3>
                      <p className="timeline-dates">{period.dates}</p>
                    </div>
                    <p className="timeline-description">{period.description}</p>
                    <div className="timeline-highlights">
                      {periodHighlights.slice(0, 3).map((highlight: string, i: number) => (
                        <span key={i} className="timeline-highlight">
                          {highlight}
                        </span>
                      ))}
                    </div>
                    <p className="timeline-achievement">
                      <strong>{t('home.labels.achievement')}:</strong> {period.achievements}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="architecture-section home-split home-split--architecture">
        <div className="architecture-container">
          <div className="architecture-header">
            <span className="section-badge">{t('home.architecture.badge')}</span>
            <h2 className="section-title">{t('home.architecture.title')}</h2>
            <p className="section-subtitle">{t('home.architecture.subtitle')}</p>
          </div>

          <div className="architecture-grid">
            {[
              'hangingObelisk',
              'grandStaircase',
              'ramasesesColossus',
              'alabasterFacade',
              'triangularDesign',
              'atrium',
            ].map((featureId, index) => {
              const feature = asObject((t as any)(`home.architecture.highlights.${featureId}`, {
                returnObjects: true,
              }));
              return (
                <motion.div
                  key={featureId}
                  className="architecture-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="arch-icon">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="arch-title">{feature.title}</h3>
                  <p className="arch-description">{feature.description}</p>
                  <div className="arch-details">
                    {(feature.height || feature.area) && (
                      <div className="detail">
                        <span className="detail-label">{t('home.labels.dimension')}</span>
                        <span className="detail-value">{feature.height || feature.area}</span>
                      </div>
                    )}
                    {(feature.weight || feature.statues) && (
                      <div className="detail">
                        <span className="detail-label">{t('home.labels.features')}</span>
                        <span className="detail-value">{feature.weight || feature.statues}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="experience-section home-split home-split--experience">
        <div className="experience-container">
          <div className="experience-header">
            <span className="section-badge">{t('home.visitorExperience.badge')}</span>
            <h2 className="section-title">{t('home.visitorExperience.title')}</h2>
            <p className="section-subtitle">{t('home.visitorExperience.subtitle')}</p>
          </div>

          <div className="experience-grid">
            {['timing', 'navigationTips', 'comfortTips', 'gainingKnowledge', 'photography', 'withFamily'].map(
              (categoryId, index) => {
                const category = asObject((t as any)(`home.visitorExperience.categories.${categoryId}`, {
                  returnObjects: true,
                }));
                const categoryTips = asArray<{ heading?: string; details?: string }>(category.tips);
                return (
                  <motion.div
                    key={categoryId}
                    className="experience-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="exp-icon">
                      {categoryId === 'timing' && <Clock size={32} />}
                      {categoryId === 'navigationTips' && <MapPin size={32} />}
                      {categoryId === 'comfortTips' && <Zap size={32} />}
                      {categoryId === 'gainingKnowledge' && <BookOpen size={32} />}
                      {categoryId === 'photography' && <Sparkles size={32} />}
                      {categoryId === 'withFamily' && <Users size={32} />}
                    </div>
                    <h3 className="exp-title">{category.title}</h3>
                    <div className="exp-tips">
                      {categoryTips.slice(0, 2).map((tip, i: number) => (
                        <div key={i} className="exp-tip">
                          <strong>{tip.heading}</strong>
                          <p>{tip.details}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        </div>
      </section>

      <section className="visit-info-section home-split home-split--visit-info">
        <div className="visit-info-container">
          <div className="visit-info-header">
            <span className="section-badge">{t('home.visitInfo.badge')}</span>
            <h2 className="section-title">{t('home.visitInfo.title')}</h2>
          </div>

          <div className="visit-info-grid">
            <motion.div className="info-card-large" whileHover={{ y: -8 }}>
              <div className="info-icon-wrapper">
                <Clock size={32} />
              </div>
              <h3>{t('home.visitInfo.cards.hours.title')}</h3>
              <p className="info-main">{t('home.visitInfo.cards.hours.main')}</p>
              <p className="info-sub">{t('home.visitInfo.cards.hours.sub')}</p>
              <p className="info-note">{t('home.visitInfo.cards.hours.note')}</p>
            </motion.div>

            <motion.div className="info-card-large" whileHover={{ y: -8 }}>
              <div className="info-icon-wrapper">
                <MapPin size={32} />
              </div>
              <h3>{t('home.visitInfo.cards.location.title')}</h3>
              <p className="info-main">{t('home.visitInfo.cards.location.main')}</p>
              <p className="info-sub">{t('home.visitInfo.cards.location.sub')}</p>
              <p className="info-note">{t('home.visitInfo.cards.location.note')}</p>
            </motion.div>

            <motion.div className="info-card-large" whileHover={{ y: -8 }}>
              <div className="info-icon-wrapper">
                <Ticket size={32} />
              </div>
              <h3>{t('home.visitInfo.cards.prices.title')}</h3>
              <p className="info-main">{t('home.visitInfo.cards.prices.main')}</p>
              <p className="info-sub">{t('home.visitInfo.cards.prices.sub')}</p>
              <p className="info-note">{t('home.visitInfo.cards.prices.note')}</p>
            </motion.div>

            <motion.div className="info-card-large" whileHover={{ y: -8 }}>
              <div className="info-icon-wrapper">
                <Star size={32} />
              </div>
              <h3>{t('home.visitInfo.cards.time.title')}</h3>
              <p className="info-main">{t('home.visitInfo.cards.time.main')}</p>
              <p className="info-sub">{t('home.visitInfo.cards.time.sub')}</p>
              <p className="info-note">{t('home.visitInfo.cards.time.note')}</p>
            </motion.div>
          </div>

          <div className="visit-info-actions">
            <Link to="/tickets" className="btn-gold btn-large">
              {t('home.visitInfo.actions.bookNow')}
            </Link>
            <Link to="/visit" className="btn-outline btn-large">
              {t('home.visitInfo.actions.moreInfo')}
            </Link>
          </div>
        </div>
      </section>

      <section className="newsletter-section home-split home-split--newsletter">
        <div className="newsletter-container">
          <motion.div
            className="newsletter-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">{t('home.newsletter.title')}</h2>
            <p className="section-subtitle">{t('home.newsletter.subtitle')}</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('home.newsletter.placeholder')}
                className="newsletter-input"
              />
              <button type="submit" className="btn-gold">
                {t('home.newsletter.cta')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-brand">
            <h3 className="footer-logo">{t('home.footer.logo')}</h3>
            <p className="footer-tagline">{t('home.footer.tagline')}</p>
            <p className="footer-description">{t('home.footer.description')}</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>{t('home.footer.columns.explore')}</h4>
              <Link to="/about">{t('home.footer.links.about')}</Link>
              <Link to="/exhibitions">{t('home.footer.links.exhibitions')}</Link>
              <Link to="/exhibitions">{t('home.footer.links.gallery')}</Link>
              <Link to="/videos">{t('home.footer.links.videos')}</Link>
            </div>
            <div className="footer-column">
              <h4>{t('home.footer.columns.visit')}</h4>
              <Link to="/visit">{t('home.footer.links.planVisit')}</Link>
              <Link to="/tickets">{t('home.footer.links.tickets')}</Link>
              <Link to="/visit">{t('home.footer.links.gettingHere')}</Link>
              <Link to="/visit">{t('home.footer.links.accessibility')}</Link>
            </div>
            <div className="footer-column">
              <h4>{t('home.footer.columns.connect')}</h4>
              <a href="#">{t('home.footer.links.contact')}</a>
              <a href="#">{t('home.footer.links.press')}</a>
              <a href="#">{t('home.footer.links.careers')}</a>
              <a href="#">{t('home.footer.links.support')}</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            {String.fromCharCode(169)} 2026 {t('home.footer.logo')}. {t('home.footer.rights')}
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              FB
            </a>
            <a href="#" aria-label="Instagram">
              IG
            </a>
            <a href="#" aria-label="Twitter">
              TW
            </a>
            <a href="#" aria-label="YouTube">
              YT
            </a>
          </div>
        </div>
      </footer>

      <div className="grain-overlay" />
    </div>
  );
}
