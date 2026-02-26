import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, Menu, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from '@/i18n/i18n';

import './Navigation.css';

const NAV_LINKS = [
  { path: '/', labelKey: 'nav.home' },
  { path: '/atlas', labelKey: 'nav.atlas' },
  { path: '/about', labelKey: 'nav.about' },
  { path: '/exhibitions', labelKey: 'nav.exhibitions' },
  { path: '/videos', labelKey: 'nav.videos' },
  { path: '/visit', labelKey: 'nav.visit' },
] as const;

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    let rafId = 0;

    const handleScroll = () => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        const maxScrollable = document.documentElement.scrollHeight - window.innerHeight;

        setIsScrolled(currentScroll > 40);
        setScrollProgress(maxScrollable > 0 ? Math.min(1, currentScroll / maxScrollable) : 0);
        rafId = 0;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMobileMenuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsLanguageMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLanguageMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isLanguageMenuOpen]);

  const currentLang = useMemo(() => {
    const resolved = (i18n.resolvedLanguage ?? i18n.language) || 'en';
    const match = SUPPORTED_LANGUAGES.find(l => resolved === l.code || resolved.startsWith(`${l.code}-`));
    return match?.code ?? 'en';
  }, [i18n.language, i18n.resolvedLanguage]);

  const isActive = (path: string) => location.pathname === path;

  const setLanguage = (lng: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gem_lang', lng);
      window.localStorage.setItem('gem_lang_explicit', '1');
    }
    setIsLanguageMenuOpen(false);
    void i18n.changeLanguage(lng);
  };

  return (
    <>
      <motion.nav
        className={`navigation ${isScrolled ? 'scrolled' : ''} ${isRTL ? 'rtl' : 'ltr'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="nav-container">
          <Link to="/" className="nav-logo" aria-label={t('nav.home')}>
            <motion.div
              className="logo-icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 2L38 38H2L20 2Z" fill="url(#gold-gradient)" />
                <defs>
                  <linearGradient id="gold-gradient" x1="20" y1="2" x2="20" y2="38">
                    <stop stopColor="#D4AF37" />
                    <stop offset="1" stopColor="#F4D03F" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            <div className="logo-text">
              <span className="logo-main">{t('nav.logoMain')}</span>
              <span className="logo-sub">{t('nav.logoSub')}</span>
            </div>
          </Link>

          <div className="nav-links">
            {NAV_LINKS.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={link.path} className={`nav-link ${isActive(link.path) ? 'active' : ''}`}>
                  <span className="nav-link-hover" />
                  <span className="nav-link-text">{t(link.labelKey)}</span>
                  {isActive(link.path) && (
                    <motion.div className="nav-link-underline" layoutId="activeNav" />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="nav-right">
            <div className="nav-language-menu" ref={languageMenuRef}>
              <button
                className={`nav-language-trigger ${isLanguageMenuOpen ? 'open' : ''}`}
                onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                type="button"
                aria-label={t('common.language')}
                aria-haspopup="listbox"
                aria-expanded={isLanguageMenuOpen}
              >
                <Globe size={18} />
                <span className="nav-language-code">{currentLang.toUpperCase()}</span>
                <ChevronDown size={14} className="nav-language-chevron" />
              </button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    className="nav-language-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    role="listbox"
                    aria-label={t('common.language')}
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        className={`nav-language-option ${currentLang === l.code ? 'active' : ''}`}
                        onClick={() => setLanguage(l.code)}
                        type="button"
                        role="option"
                        aria-selected={currentLang === l.code}
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="nav-icon-btn" aria-label={t('common.search')} type="button">
              <Search size={20} />
            </button>

            <Link to="/tickets" className="nav-ticket-btn">
              <span>{t('common.bookNow')}</span>
            </Link>
          </div>

          <motion.button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            type="button"
            aria-label={isMobileMenuOpen ? 'Close' : 'Menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
        <div className="nav-progress-track" aria-hidden="true">
          <motion.div className="nav-progress-bar" style={{ scaleX: scrollProgress }} />
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={`mobile-menu ${isRTL ? 'rtl' : 'ltr'}`}
            initial={{ opacity: 0, x: isRTL ? 300 : -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 300 : -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="mobile-menu-links">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(link.labelKey)}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mobile-language"
              >
                <span className="mobile-language-label">{t('common.language')}</span>
                <div className="mobile-language-options">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      className={`mobile-language-btn ${currentLang === l.code ? 'active' : ''}`}
                      onClick={() => setLanguage(l.code)}
                      type="button"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Link
                  to="/tickets"
                  className="mobile-ticket-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('home.hero.buttons.bookTickets')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
