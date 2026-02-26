import { useEffect } from 'react';

import './InteractiveBackground.css';

const ORBS = Array.from({ length: 7 }, (_, index) => index + 1);

export default function InteractiveBackground() {
  useEffect(() => {
    const root = document.documentElement;

    const updatePointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      root.style.setProperty('--pointer-x', `${x}%`);
      root.style.setProperty('--pointer-y', `${y}%`);
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => window.removeEventListener('pointermove', updatePointer);
  }, []);

  return (
    <div className="interactive-background" aria-hidden="true">
      <div className="interactive-background__mesh" />
      <div className="interactive-background__beam" />
      <div className="interactive-background__orbs">
        {ORBS.map((orb) => (
          <span key={orb} className={`interactive-background__orb interactive-background__orb--${orb}`} />
        ))}
      </div>
      <div className="interactive-background__motif" />
      <div className="interactive-background__grain" />
    </div>
  );
}
