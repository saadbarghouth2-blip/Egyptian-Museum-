import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, Info, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import MuseumHero3D from '../components/MuseumHero3D';
import './Exhibitions.css';

gsap.registerPlugin(ScrollTrigger);

const HALLS = [
  { id: 'tutankhamun', image: '/images/tutankhamun_mask.jpg' },
  { id: 'prehistoric', image: '/images/papyrus.jpg' },
  { id: 'oldKingdom', image: '/images/giza_plateau.jpg' },
  { id: 'newKingdom', image: '/images/sarcophagus_room.jpg' },
  { id: 'grecoRoman', image: '/images/canopic_jars.jpg' },
  { id: 'conservation', image: '/images/exhibition_hall.jpg' },
] as const;

const TIPS = [
  { id: 'route', number: '01' },
  { id: 'audio', number: '02' },
  { id: 'timing', number: '03' },
  { id: 'photo', number: '04' },
] as const;

const FEATURED_MOMENTS = [
  { id: 'goldenThrone', image: '/images/golden_throne.jpg' },
  { id: 'tutChariot', image: '/images/tut_chariot.jpg' },
  { id: 'egyptianJewelry', image: '/images/egyptian_jewelry.jpg' },
] as const;

const STORY_GALLERY = [
  { id: 'atrium', image: '/images/atrium.jpg' },
  { id: 'staircase', image: '/images/staircase.jpg' },
  { id: 'goldenThrone', image: '/images/golden_throne.jpg' },
  { id: 'mummyCase', image: '/images/mummy_case.jpg' },
] as const;

const EXPERIENCE_TRACKS = [
  { id: 'express', number: '01' },
  { id: 'classic', number: '02' },
  { id: 'deepDive', number: '03' },
] as const;

const FAQ_ITEMS = [
  { id: 'tickets' },
  { id: 'family' },
  { id: 'accessibility' },
  { id: 'services' },
] as const;

export default function Exhibitions() {
  const { t } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeHall, setActiveHall] = useState<string | null>(null);
  const getTranslatedList = (key: string): string[] => {
    const value = t(key, { returnObjects: true }) as unknown;
    return Array.isArray(value) ? value.map((entry) => String(entry)) : [];
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.exhibitions-hero-content',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.exhibitions-hero',
            start: 'top 80%',
          },
        },
      );

      gsap.fromTo(
        '.hall-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.halls-grid',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.featured-content',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.featured-section',
            start: 'top 70%',
          },
        },
      );

      gsap.fromTo(
        '.featured-image',
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.featured-section',
            start: 'top 70%',
          },
        },
      );

      gsap.fromTo(
        '.details-narrative',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.details-section',
            start: 'top 72%',
          },
        },
      );

      gsap.fromTo(
        '.story-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.details-gallery',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.experience-card',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.experience-grid',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.faq-card',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.faq-grid',
            start: 'top 78%',
          },
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="exhibitions-page">
      <section className="exhibitions-hero">
        <div className="exhibitions-hero-bg">
          <img src="/images/grand_hall.jpg" alt={t('exhibitions.hero.imageAlt')} />
          <div className="exhibitions-hero-overlay" />
        </div>
        <MuseumHero3D />
        <div className="exhibitions-hero-content">
          <span className="mono exhibitions-hero-label">{t('exhibitions.hero.label')}</span>
          <h1 className="headline-xl">{t('exhibitions.hero.title')}</h1>
          <p className="exhibitions-hero-description">{t('exhibitions.hero.description')}</p>
          <div className="hero-name-variants">
            {getTranslatedList('exhibitions.hero.altNames').map((name, idx) => (
              <span key={`${name}-${idx}`} className="hero-name-chip">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-section exhibitions-split exhibitions-split--featured">
        <div className="featured-content">
          <span className="mono featured-label">{t('exhibitions.featured.label')}</span>
          <h2 className="headline-lg">{t('exhibitions.featured.title')}</h2>
          <p className="featured-description">{t('exhibitions.featured.description')}</p>
          <p className="featured-description featured-description--secondary">
            {t('exhibitions.featured.descriptionExtended')}
          </p>
          <div className="featured-highlights">
            {getTranslatedList('exhibitions.featured.highlights').map((highlight, index) => (
              <span key={`${highlight}-${index}`} className="featured-highlight-pill">
                {highlight}
              </span>
            ))}
          </div>
          <div className="featured-stats">
            <div className="featured-stat">
              <span className="featured-stat-value">5,398</span>
              <span className="featured-stat-label">{t('exhibitions.featured.stats.artifacts')}</span>
            </div>
            <div className="featured-stat">
              <span className="featured-stat-value">3,300</span>
              <span className="featured-stat-label">{t('exhibitions.featured.stats.yearsOld')}</span>
            </div>
            <div className="featured-stat">
              <span className="featured-stat-value">12</span>
              <span className="featured-stat-label">{t('exhibitions.featured.stats.galleries')}</span>
            </div>
          </div>
          <a href="#halls" className="btn-gold">
            {t('exhibitions.featured.cta')}
            <ArrowRight size={16} />
          </a>
        </div>
        <div className="featured-image">
          <img className="featured-image-main" src="/images/tutankhamun_mask.jpg" alt={t('exhibitions.featured.imageAlt')} />
          <div className="featured-image-strip">
            {FEATURED_MOMENTS.map((moment) => (
              <figure key={moment.id} className="featured-thumb">
                <img src={moment.image} alt={t(`exhibitions.featured.moments.${moment.id}.imageAlt`)} />
                <figcaption>{t(`exhibitions.featured.moments.${moment.id}.caption`)}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="halls" className="halls-section exhibitions-split exhibitions-split--halls">
        <div className="halls-container">
          <div className="halls-header">
            <span className="mono section-label">{t('exhibitions.halls.label')}</span>
            <h2 className="headline-lg">{t('exhibitions.halls.title')}</h2>
          </div>

          <div className="halls-grid">
            {HALLS.map((hall) => {
              const highlights = getTranslatedList(`exhibitions.halls.items.${hall.id}.highlights`);
              const quickFacts = getTranslatedList(`exhibitions.halls.items.${hall.id}.quickFacts`);
              return (
                <div
                  key={hall.id}
                  className={`hall-card ${activeHall === hall.id ? 'active' : ''}`}
                  onClick={() => setActiveHall(activeHall === hall.id ? null : hall.id)}
                >
                  <div className="hall-image">
                    <img src={hall.image} alt={t(`exhibitions.halls.items.${hall.id}.title`)} />
                    <div className="hall-image-overlay" />
                  </div>
                  <div className="hall-content">
                    <span className="hall-subtitle">{t(`exhibitions.halls.items.${hall.id}.subtitle`)}</span>
                    <h3 className="hall-title">{t(`exhibitions.halls.items.${hall.id}.title`)}</h3>
                    <p className="hall-description">{t(`exhibitions.halls.items.${hall.id}.description`)}</p>

                    <div className={`hall-details ${activeHall === hall.id ? 'expanded' : ''}`}>
                      <div className="hall-highlights">
                        <h4>{t('exhibitions.halls.highlightsLabel')}</h4>
                        <div className="highlights-list">
                          {highlights.map((highlight, idx) => (
                            <span key={idx} className="highlight-tag">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="hall-story">{t(`exhibitions.halls.items.${hall.id}.story`)}</p>
                      <div className="hall-facts-list">
                        {quickFacts.map((fact, idx) => (
                          <p key={`${hall.id}-${idx}`} className="hall-fact-item">
                            {fact}
                          </p>
                        ))}
                      </div>
                      <div className="hall-meta">
                        <div className="hall-meta-item">
                          <Clock size={16} />
                          <span>{t(`exhibitions.halls.items.${hall.id}.duration`)}</span>
                        </div>
                        <div className="hall-meta-item">
                          <MapPin size={16} />
                          <span>{t(`exhibitions.halls.items.${hall.id}.location`)}</span>
                        </div>
                      </div>
                    </div>

                    <button className="hall-expand-btn" type="button">
                      <Info size={16} />
                      {activeHall === hall.id ? t('common.showLess') : t('common.learnMore')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="details-section exhibitions-split exhibitions-split--details">
        <div className="details-container">
          <div className="details-header">
            <span className="mono section-label">{t('exhibitions.details.label')}</span>
            <h2 className="headline-lg">{t('exhibitions.details.title')}</h2>
            <p className="details-intro">{t('exhibitions.details.intro')}</p>
          </div>

          <div className="details-layout">
            <div className="details-narrative">
              <p>{t('exhibitions.details.paragraph1')}</p>
              <p>{t('exhibitions.details.paragraph2')}</p>
              <p>{t('exhibitions.details.paragraph3')}</p>
              <div className="details-points">
                {getTranslatedList('exhibitions.details.keyPoints').map((point, idx) => (
                  <p key={`point-${idx}`} className="details-point">
                    {point}
                  </p>
                ))}
              </div>
            </div>

            <div className="details-gallery">
              {STORY_GALLERY.map((story) => (
                <article key={story.id} className="story-card">
                  <div className="story-card-image">
                    <img src={story.image} alt={t(`exhibitions.details.stories.${story.id}.imageAlt`)} />
                  </div>
                  <div className="story-card-content">
                    <h3 className="story-card-title">{t(`exhibitions.details.stories.${story.id}.title`)}</h3>
                    <p className="story-card-text">{t(`exhibitions.details.stories.${story.id}.text`)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="experience-section exhibitions-split exhibitions-split--experience">
        <div className="experience-container">
          <div className="experience-header">
            <span className="mono section-label">{t('exhibitions.experience.label')}</span>
            <h2 className="headline-lg">{t('exhibitions.experience.title')}</h2>
            <p className="experience-intro">{t('exhibitions.experience.intro')}</p>
          </div>

          <div className="experience-grid">
            {EXPERIENCE_TRACKS.map((track) => {
              const stops = getTranslatedList(`exhibitions.experience.tracks.${track.id}.stops`);
              return (
                <article key={track.id} className="experience-card">
                  <span className="experience-number">{track.number}</span>
                  <p className="experience-mode">{t(`exhibitions.experience.tracks.${track.id}.mode`)}</p>
                  <h3 className="experience-title">{t(`exhibitions.experience.tracks.${track.id}.title`)}</h3>
                  <p className="experience-summary">{t(`exhibitions.experience.tracks.${track.id}.summary`)}</p>
                  <div className="experience-meta">
                    <p>{t(`exhibitions.experience.tracks.${track.id}.duration`)}</p>
                    <p>{t(`exhibitions.experience.tracks.${track.id}.suitableFor`)}</p>
                  </div>
                  <div className="experience-stops">
                    {stops.map((stop, idx) => (
                      <span key={`${track.id}-${idx}`} className="experience-stop">
                        {stop}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="faq-section exhibitions-split exhibitions-split--faq">
        <div className="faq-container">
          <div className="faq-header">
            <span className="mono section-label">{t('exhibitions.faq.label')}</span>
            <h2 className="headline-lg">{t('exhibitions.faq.title')}</h2>
          </div>
          <div className="faq-grid">
            {FAQ_ITEMS.map((item) => (
              <article key={item.id} className="faq-card">
                <h3 className="faq-question">{t(`exhibitions.faq.items.${item.id}.q`)}</h3>
                <p className="faq-answer">{t(`exhibitions.faq.items.${item.id}.a`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tips-section exhibitions-split exhibitions-split--tips">
        <div className="tips-container">
          <div className="tips-header">
            <span className="mono section-label">{t('exhibitions.tips.label')}</span>
            <h2 className="headline-lg">{t('exhibitions.tips.title')}</h2>
          </div>

          <div className="tips-grid">
            {TIPS.map((tip) => (
              <div key={tip.id} className="tip-card">
                <span className="tip-number">{tip.number}</span>
                <h3 className="tip-title">{t(`exhibitions.tips.items.${tip.id}.title`)}</h3>
                <p className="tip-text">{t(`exhibitions.tips.items.${tip.id}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="exhibitions-cta-section exhibitions-split exhibitions-split--cta">
        <div className="exhibitions-cta-content">
          <h2 className="headline-md">{t('exhibitions.cta.title')}</h2>
          <p className="exhibitions-cta-text">{t('exhibitions.cta.text')}</p>
          <Link to="/tickets" className="btn-gold">
            {t('exhibitions.cta.button')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <div className="grain-overlay" />
    </div>
  );
}
