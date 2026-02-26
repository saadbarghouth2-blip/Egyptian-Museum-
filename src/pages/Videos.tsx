import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import MuseumHero3D from '../components/MuseumHero3D';
import LazyYouTubeVideo from '../components/LazyYouTubeVideo';
import './Videos.css';

gsap.registerPlugin(ScrollTrigger);

const VIDEOS = [
  {
    id: 'fullTour1',
    youtubeId: 'M3g39UZpjnY',
    thumbnail: '/images/hero_pharaoh.jpg',
    duration: '45:30',
    views: '2.4M',
    category: 'tour'
  },
  {
    id: 'staircase1',
    youtubeId: 'whwFP85b8QI',
    thumbnail: '/images/staircase.jpg',
    duration: '12:15',
    views: '1.8M',
    category: 'tour'
  },
  {
    id: 'obelisk1',
    youtubeId: '9ejvrfSPSI0',
    thumbnail: '/images/obelisk.jpg',
    duration: '8:45',
    views: '1.5M',
    category: 'documentary'
  },
  {
    id: 'ramesses1',
    youtubeId: '-FL-zuHHE-o',
    thumbnail: '/images/hero_pharaoh.jpg',
    duration: '14:20',
    views: '2.1M',
    category: 'tour'
  },
  {
    id: 'fullTour2',
    youtubeId: 'lCi0Nuapjuo',
    thumbnail: '/images/museum_night.jpg',
    duration: '52:10',
    views: '3.2M',
    category: 'tour'
  },
  {
    id: 'staircase2',
    youtubeId: 'HhAV5iZ4rzo',
    thumbnail: '/images/staircase.jpg',
    duration: '10:50',
    views: '1.3M',
    category: 'tour'
  },
  {
    id: 'obelisk2',
    youtubeId: 'UJVE2BUFLaA',
    thumbnail: '/images/obelisk.jpg',
    duration: '9:30',
    views: '980K',
    category: 'documentary'
  },
  {
    id: 'khufuBoat1',
    youtubeId: 'uc-V9O61e-Q',
    thumbnail: '/images/exhibition_hall.jpg',
    duration: '20:45',
    views: '2.8M',
    category: 'exhibition'
  },
  {
    id: 'fullTour3',
    youtubeId: 'qOR_F7A0Gd8',
    thumbnail: '/images/grand_hall.jpg',
    duration: '60:00',
    views: '3.8M',
    category: 'tour'
  },
  {
    id: 'ramesses2',
    youtubeId: '6BBjAocNA1k',
    thumbnail: '/images/hero_pharaoh.jpg',
    duration: '18:30',
    views: '2.5M',
    category: 'exhibition'
  },
  {
    id: 'staircase3',
    youtubeId: 'Lrblq2cjpp4',
    thumbnail: '/images/staircase.jpg',
    duration: '15:20',
    views: '1.6M',
    category: 'tour'
  },
  {
    id: 'khufuBoat2',
    youtubeId: '0CAvL4NUboI',
    thumbnail: '/images/exhibition_hall.jpg',
    duration: '25:40',
    views: '2.2M',
    category: 'exhibition'
  },
  {
    id: 'fullTour4',
    youtubeId: 'xhArwI0BEEg',
    thumbnail: '/images/museum_night.jpg',
    duration: '48:15',
    views: '2.9M',
    category: 'tour'
  },
  {
    id: 'obelisk3',
    youtubeId: 'F9onrrfT0jw',
    thumbnail: '/images/obelisk.jpg',
    duration: '11:00',
    views: '1.2M',
    category: 'documentary'
  },
  {
    id: 'khufuBoat3',
    youtubeId: 'keatQALD5AA',
    thumbnail: '/images/exhibition_hall.jpg',
    duration: '22:30',
    views: '1.9M',
    category: 'exhibition'
  },
  {
    id: 'fullTour5',
    youtubeId: 'Cj00iZMQ4qk',
    thumbnail: '/images/grand_hall.jpg',
    duration: '55:45',
    views: '3.5M',
    category: 'tour'
  },
  {
    id: 'ramesses3',
    youtubeId: '80sKr3dISaM',
    thumbnail: '/images/hero_pharaoh.jpg',
    duration: '16:50',
    views: '2.3M',
    category: 'exhibition'
  },
  {
    id: 'khufuBoat4',
    youtubeId: 'cUxq0nk16qA',
    thumbnail: '/images/exhibition_hall.jpg',
    duration: '19:20',
    views: '1.7M',
    category: 'exhibition'
  },
  {
    id: 'fullTour6',
    youtubeId: 'jIPAWhx7msc',
    thumbnail: '/images/museum_night.jpg',
    duration: '42:00',
    views: '2.6M',
    category: 'tour'
  },
  {
    id: 'khufuBoat5',
    youtubeId: 'eBC3ONViMSg',
    thumbnail: '/images/exhibition_hall.jpg',
    duration: '28:15',
    views: '2.0M',
    category: 'exhibition'
  },
  {
    id: 'museum1',
    youtubeId: 'KQ8ZoywAqgM',
    thumbnail: '/images/grand_hall.jpg',
    duration: '30:40',
    views: '3.3M',
    category: 'documentary'
  },
  {
    id: 'museum2',
    youtubeId: 'axw36u5-kIg',
    thumbnail: '/images/museum_night.jpg',
    duration: '35:20',
    views: '2.7M',
    category: 'documentary'
  },
] as const;

const CATEGORIES = [
  { id: 'all' },
  { id: 'documentary' },
  { id: 'tour' },
  { id: 'exhibition' },
] as const;

export default function Videos() {
  const { t } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredVideos = activeCategory === 'all'
    ? VIDEOS
    : VIDEOS.filter(v => v.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.videos-hero-content',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.videos-hero',
            start: 'top 80%',
          },
        },
      );

      gsap.fromTo(
        '.video-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.videos-grid',
            start: 'top 80%',
          },
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, [activeCategory]);

  useEffect(() => {
    const interactive = pageRef.current?.querySelectorAll<HTMLElement>('.video-card, .filter-btn');
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
  }, [activeCategory]);

  return (
    <div ref={pageRef} className="videos-page">
      <section className="videos-hero">
        <div className="videos-hero-bg">
          <img src="/images/atrium.jpg" alt={t('videos.hero.imageAlt')} />
          <div className="videos-hero-overlay" />
        </div>
        <MuseumHero3D />
        <div className="videos-hero-content">
          <span className="mono videos-hero-label">{t('videos.hero.label')}</span>
          <h1 className="headline-xl">{t('videos.hero.title')}</h1>
          <p className="videos-hero-description">{t('videos.hero.description')}</p>
        </div>
      </section>

      <section className="videos-section videos-split videos-split--library">
        <div className="videos-container">
          <div className="videos-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                type="button"
              >
                {t(`videos.categories.${cat.id}`)}
              </button>
            ))}
          </div>

          <div className="videos-grid">
            {filteredVideos.map((video) => (
              <div key={video.id} className="video-card">
                <div className="video-thumbnail">
                  <LazyYouTubeVideo
                    youtubeId={video.youtubeId}
                    title={t(`videos.items.${video.id}.title`)}
                    className="video-thumbnail-media"
                    autoplay={true}
                    muted={true}
                    loop={true}
                    modestbranding={true}
                    controls={false}
                  />
                  <div className="video-thumbnail-overlay">
                    <span className="autoplay-pill autoplay-pill-small">
                      <Play size={12} fill="currentColor" />
                      LIVE
                    </span>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sound-toggle-btn sound-toggle-btn-small"
                      aria-label="Open in YouTube"
                    >
                      <Play size={12} />
                      VIEW
                    </a>
                    <span className="video-duration">{video.duration}</span>
                  </div>
                </div>
                <div className="video-info">
                  <h3 className="video-title">{t(`videos.items.${video.id}.title`)}</h3>
                  <p className="video-description">{t(`videos.items.${video.id}.description`)}</p>
                  <div className="video-meta">
                    <span className="video-meta-item">
                      <Eye size={14} />
                      {video.views}
                    </span>
                    <span className="video-category">{t(`videos.categories.${video.category}`)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grain-overlay" />
    </div>
  );
}
