import { useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navigation from './components/Navigation';
import TicketsButton from './components/TicketsButton';
import PageTransition from './components/PageTransition';
import InteractiveBackground from './components/InteractiveBackground';
import Home from './pages/Home';
import About from './pages/About';
import Atlas from './pages/Atlas';
import Exhibitions from './pages/Exhibitions';
import Videos from './pages/Videos';
import Visit from './pages/Visit';
import Tickets from './pages/Tickets';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);

    const rafId = window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [location.pathname, location.search, location.hash]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/atlas" element={<PageTransition><Atlas /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/exhibitions" element={<PageTransition><Exhibitions /></PageTransition>} />
        <Route path="/gallery" element={<Navigate to="/exhibitions" replace />} />
        <Route path="/videos" element={<PageTransition><Videos /></PageTransition>} />
        <Route path="/visit" element={<PageTransition><Visit /></PageTransition>} />
        <Route path="/tickets" element={<PageTransition><Tickets /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { i18n } = useTranslation();
  const dir = i18n.dir();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = dir;
  }, [i18n.language, dir]);

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    // Global snap for pinned sections (only on Home page)
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;

            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: "power2.out"
        }
      });
    };

    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <Router>
      <div className={`app ${dir === 'rtl' ? 'rtl' : 'ltr'}`}>
        <InteractiveBackground />
        <Navigation />
        <TicketsButton />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
