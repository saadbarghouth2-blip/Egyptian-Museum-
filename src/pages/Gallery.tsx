import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ZoomIn, ChevronLeft, ChevronRight, Info, Heart, Share2, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MuseumHero3D from '../components/MuseumHero3D';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  {
    id: 1,
    src: '/images/tutankhamun_mask.jpg',
    title: 'Golden Mask of Tutankhamun',
    category: 'treasures',
    description: 'The iconic death mask of the boy king, crafted from 11kg of solid gold with lapis lazuli inlays. Discovered in 1922 by Howard Carter.',
    year: '1323 BC',
    dynasty: '18th Dynasty',
    material: 'Gold, Lapis Lazuli, Obsidian',
  },
  {
    id: 2,
    src: '/images/golden_throne.jpg',
    title: 'Throne of Tutankhamun',
    category: 'treasures',
    description: 'The golden throne featuring intricate inlays of gold, silver, glass, and precious stones depicting the young pharaoh with his queen.',
    year: '1323 BC',
    dynasty: '18th Dynasty',
    material: 'Gold, Silver, Semi-precious stones',
  },
  {
    id: 3,
    src: '/images/tut_chariot.jpg',
    title: 'Royal Chariot of Tutankhamun',
    category: 'treasures',
    description: 'One of six chariots found in Tutankhamun\'s tomb, featuring elaborate gilded decorations and scenes of the pharaoh in battle.',
    year: '1323 BC',
    dynasty: '18th Dynasty',
    material: 'Wood, Gold leaf, Bronze',
  },
  {
    id: 4,
    src: '/images/egyptian_jewelry.jpg',
    title: 'Royal Jewelry Collection',
    category: 'treasures',
    description: 'Exquisite jewelry pieces including the famous broad collar of Tutankhamun, showcasing the mastery of ancient Egyptian goldsmiths.',
    year: '1323 BC',
    dynasty: '18th Dynasty',
    material: 'Gold, Lapis Lazuli, Turquoise',
  },
  {
    id: 5,
    src: '/images/canopic_jars.jpg',
    title: 'Canopic Jars of Tutankhamun',
    category: 'treasures',
    description: 'Four alabaster jars with carved stoppers representing the Four Sons of Horus, used to store the pharaoh\'s internal organs.',
    year: '1323 BC',
    dynasty: '18th Dynasty',
    material: 'Alabaster, Gold',
  },
  {
    id: 6,
    src: '/images/mummy_case.jpg',
    title: 'Inner Coffin of Tutankhamun',
    category: 'treasures',
    description: 'The third and innermost coffin, made of solid gold weighing 110.4 kg, housed the mummy of the young pharaoh.',
    year: '1323 BC',
    dynasty: '18th Dynasty',
    material: 'Solid Gold',
  },
  {
    id: 7,
    src: '/images/papyrus.jpg',
    title: 'Book of the Dead Papyrus',
    category: 'artifacts',
    description: 'A well-preserved papyrus depicting spells and prayers from the Book of the Dead to guide the deceased through the afterlife.',
    year: '1550 BC',
    dynasty: '18th Dynasty',
    material: 'Papyrus, Ink',
  },
  {
    id: 8,
    src: '/images/scarab.jpg',
    title: 'Heart Scarab of Tutankhamun',
    category: 'artifacts',
    description: 'A large scarab amulet placed over the heart of the mummy, inscribed with spells from the Book of the Dead.',
    year: '1323 BC',
    dynasty: '18th Dynasty',
    material: 'Green Jasper, Gold',
  },
  {
    id: 9,
    src: '/images/ankh.jpg',
    title: 'Golden Ankh Cross',
    category: 'artifacts',
    description: 'The ankh, ancient Egyptian symbol of life, intricately crafted from gold with detailed engravings of deities and hieroglyphics.',
    year: '1400 BC',
    dynasty: '18th Dynasty',
    material: 'Gold, Semi-precious stones',
  },
  {
    id: 10,
    src: '/images/isis_statue.jpg',
    title: 'Statue of Goddess Isis',
    category: 'artifacts',
    description: 'A magnificent statue of Isis with outstretched wings, protector of the dead and goddess of magic and healing.',
    year: '664-332 BC',
    dynasty: 'Late Period',
    material: 'Basalt',
  },
  {
    id: 11,
    src: '/images/ushabti.jpg',
    title: 'Ushabti Figures',
    category: 'artifacts',
    description: 'Funerary figurines placed in tombs to serve the deceased in the afterlife, inscribed with magical spells.',
    year: '1550-1070 BC',
    dynasty: 'New Kingdom',
    material: 'Faience, Wood',
  },
  {
    id: 12,
    src: '/images/coffin_interior.jpg',
    title: 'Painted Coffin Interior',
    category: 'artifacts',
    description: 'The interior of a noble\'s coffin painted with the goddess Nut spreading her wings over the deceased.',
    year: '1070-945 BC',
    dynasty: '21st Dynasty',
    material: 'Wood, Paint',
  },
  {
    id: 13,
    src: '/images/hero_pharaoh.jpg',
    title: 'Colossus of Ramesses II',
    category: 'architecture',
    description: 'The 11-meter tall statue of Ramesses II that greets visitors at the museum entrance, relocated from Memphis.',
    year: '1279-1213 BC',
    dynasty: '19th Dynasty',
    material: 'Red Granite',
  },
  {
    id: 14,
    src: '/images/staircase.jpg',
    title: 'The Grand Staircase',
    category: 'architecture',
    description: 'The monumental staircase featuring 87 statues of pharaohs and deities arranged chronologically.',
    year: '2025 AD',
    dynasty: 'Modern',
    material: 'Stone, Glass',
  },
  {
    id: 15,
    src: '/images/obelisk.jpg',
    title: 'The Hanging Obelisk',
    category: 'architecture',
    description: 'An 11-meter obelisk suspended in the museum atrium, the first of its kind in any museum worldwide.',
    year: '2025 AD',
    dynasty: 'Modern Installation',
    material: 'Red Granite',
  },
  {
    id: 16,
    src: '/images/grand_hall.jpg',
    title: 'The Grand Hall',
    category: 'architecture',
    description: 'The main exhibition hall with dramatic natural lighting filtering through the translucent alabaster facade.',
    year: '2025 AD',
    dynasty: 'Modern',
    material: 'Concrete, Glass, Alabaster',
  },
  {
    id: 17,
    src: '/images/giza_plateau.jpg',
    title: 'Giza Plateau',
    category: 'landscapes',
    description: 'The iconic pyramids visible from the museum entrance, creating a dialogue between ancient and modern.',
    year: '2580-2510 BC',
    dynasty: '4th Dynasty',
    material: 'Limestone, Granite',
  },
  {
    id: 18,
    src: '/images/nile_sunset.jpg',
    title: 'Sunset over the Nile',
    category: 'landscapes',
    description: 'The Nile River at sunset, the lifeblood of ancient Egyptian civilization, as seen from Cairo.',
    year: 'Present',
    dynasty: 'Natural',
    material: 'N/A',
  },
  {
    id: 19,
    src: '/images/museum_night.jpg',
    title: 'Museum at Night',
    category: 'architecture',
    description: 'The museum facade illuminated against the night sky, resembling a lantern on the Giza plateau.',
    year: '2025 AD',
    dynasty: 'Modern',
    material: 'Concrete, Glass',
  },
  {
    id: 20,
    src: '/images/entrance_plaza.jpg',
    title: 'Entrance Plaza',
    category: 'architecture',
    description: 'The grand plaza with an ancient obelisk and a direct sightline to the pyramids of Giza.',
    year: '2025 AD',
    dynasty: 'Modern',
    material: 'Stone, Water features',
  },
  {
    id: 21,
    src: '/images/atrium.jpg',
    title: 'The Atrium',
    category: 'architecture',
    description: 'The bright atrium with glass roof and hieroglyphic columns, bringing natural light deep into the museum.',
    year: '2025 AD',
    dynasty: 'Modern',
    material: 'Glass, Steel, Stone',
  },
  {
    id: 22,
    src: '/images/exhibition_hall.jpg',
    title: 'Exhibition Hall',
    category: 'architecture',
    description: 'One of the 50 galleries showcasing ancient artifacts in climate-controlled environments.',
    year: '2025 AD',
    dynasty: 'Modern',
    material: 'Concrete, Glass',
  },
  {
    id: 23,
    src: '/images/sarcophagus_room.jpg',
    title: 'Sarcophagus Room',
    category: 'artifacts',
    description: 'A collection of ornate stone sarcophagi from various dynasties, showcasing Egyptian burial traditions.',
    year: 'Various',
    dynasty: 'Multiple',
    material: 'Stone, Paint',
  },
  {
    id: 24,
    src: '/images/nile_night.jpg',
    title: 'Nile by Night',
    category: 'landscapes',
    description: 'Cairo skyline reflected in the waters of the Nile, a view that has inspired for millennia.',
    year: 'Present',
    dynasty: 'Natural',
    material: 'N/A',
  },
];

const categories = [
  { id: 'all', count: 24 },
  { id: 'treasures', count: 6 },
  { id: 'artifacts', count: 10 },
  { id: 'architecture', count: 8 },
  { id: 'landscapes', count: 2 },
] as const;

const Gallery = () => {
  const { t } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setShowDetails(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const toggleFavorite = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gallery-hero-content',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.gallery-hero',
            start: 'top 80%',
          }
        }
      );

      gsap.fromTo('.gallery-stats',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.gallery-stats',
            start: 'top 85%',
          }
        }
      );

      gsap.fromTo('.gallery-item',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 80%',
          }
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [filteredImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, filteredImages.length]);

  return (
    <div ref={pageRef} className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="gallery-hero-bg">
          <img src="/images/exhibition_hall.jpg" alt={t('gallery.hero.imageAlt')} />
          <div className="gallery-hero-overlay" />
        </div>
        <MuseumHero3D />
        <div className="gallery-hero-content">
          <span className="mono gallery-hero-label">{t('gallery.hero.label')}</span>
          <h1 className="headline-xl">{t('gallery.hero.title')}</h1>
          <p className="gallery-hero-description">
            {t('gallery.hero.description')}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="gallery-stats">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">100K+</span>
            <span className="stat-label">{t('gallery.stats.totalArtifacts')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5,398</span>
            <span className="stat-label">{t('gallery.stats.tutItems')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50</span>
            <span className="stat-label">{t('gallery.stats.galleries')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">7,000</span>
            <span className="stat-label">{t('gallery.stats.years')}</span>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-container">
          {/* Filter Tabs */}
          <div className="gallery-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="filter-label">{t(`gallery.categories.${cat.id}`)}</span>
                <span className="filter-count">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="gallery-grid">
            {filteredImages.map((image, index) => (
              <div 
                key={image.id} 
                className={`gallery-item ${image.category === 'treasures' ? 'featured' : ''}`}
                onClick={() => openLightbox(index)}
              >
                <div className="gallery-item-image">
                  <img src={image.src} alt={image.title} loading="lazy" />
                  <div className="gallery-item-overlay">
                    <div className="overlay-actions">
                      <button 
                        className="overlay-btn"
                        onClick={(e) => toggleFavorite(image.id, e)}
                      >
                        <Heart 
                          size={20} 
                          fill={favorites.includes(image.id) ? '#C9A227' : 'none'}
                          color={favorites.includes(image.id) ? '#C9A227' : 'white'}
                        />
                      </button>
                      <ZoomIn size={28} className="zoom-icon" />
                      <button className="overlay-btn">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                  {image.category === 'treasures' && (
                    <span className="treasure-badge">{t('gallery.badges.royalTreasure')}</span>
                  )}
                </div>
                <div className="gallery-item-info">
                  <div className="item-meta">
                    <span className="gallery-item-category">{t(`gallery.categories.${image.category}`)}</span>
                    <span className="item-year">{image.year}</span>
                  </div>
                  <h3 className="gallery-item-title">{image.title}</h3>
                  <p className="gallery-item-desc">{image.description.substring(0, 80)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <X size={28} />
          </button>
          
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <ChevronLeft size={40} />
          </button>
          
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <ChevronRight size={40} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-container">
              <img 
                src={filteredImages[currentImageIndex].src} 
                alt={filteredImages[currentImageIndex].title}
                className="lightbox-image"
              />
              <div className="lightbox-actions">
                <button 
                  className="lightbox-action-btn"
                  onClick={() => toggleFavorite(filteredImages[currentImageIndex].id)}
                >
                  <Heart 
                    size={22} 
                    fill={favorites.includes(filteredImages[currentImageIndex].id) ? '#C9A227' : 'none'}
                  />
                </button>
                <button className="lightbox-action-btn">
                  <Share2 size={22} />
                </button>
                <button className="lightbox-action-btn">
                  <Download size={22} />
                </button>
                <button 
                  className={`lightbox-action-btn ${showDetails ? 'active' : ''}`}
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Info size={22} />
                </button>
              </div>
            </div>
            <div className={`lightbox-info ${showDetails ? 'expanded' : ''}`}>
              <h3 className="lightbox-title">{filteredImages[currentImageIndex].title}</h3>
              <p className="lightbox-description">{filteredImages[currentImageIndex].description}</p>
              
              {showDetails && (
                <div className="lightbox-details">
                  <div className="detail-row">
                    <span className="detail-label">{t('gallery.details.date')}</span>
                    <span className="detail-value">{filteredImages[currentImageIndex].year}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{t('gallery.details.dynasty')}</span>
                    <span className="detail-value">{filteredImages[currentImageIndex].dynasty}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{t('gallery.details.material')}</span>
                    <span className="detail-value">{filteredImages[currentImageIndex].material}</span>
                  </div>
                </div>
              )}
              
              <span className="lightbox-counter">
                {currentImageIndex + 1} / {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grain Overlay */}
      <div className="grain-overlay" />
    </div>
  );
};

export default Gallery;
