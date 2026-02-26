import { useEffect, useRef, useState } from 'react';
import './LazyYouTubeVideo.css';

type LazyYouTubeVideoProps = {
  youtubeId: string;
  title: string;
  className?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  modestbranding?: boolean;
  controls?: boolean;
  allowFullScreen?: boolean;
};

export default function LazyYouTubeVideo({
  youtubeId,
  title,
  className = '',
  autoplay = true,
  muted = true,
  loop = true,
  modestbranding = true,
  controls = false,
  allowFullScreen = true,
}: LazyYouTubeVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const node = containerRef.current;
    if (!node) return;

    // Fallback: if the observer API is unavailable, load immediately.
    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      setIsLoaded(true);
      return;
    }

    // If already near viewport, do not wait for observer callback.
    const rect = node.getBoundingClientRect();
    const nearViewport = rect.top < window.innerHeight + 240 && rect.bottom > -240;
    if (nearViewport) {
      setIsLoaded(true);
      return;
    }

    let active = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!active) return;
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '240px',
        threshold: 0,
      },
    );

    observer.observe(node);

    // Safety net: never keep the card blank if observer misses.
    const fallbackTimer = window.setTimeout(() => {
      if (active) setIsLoaded(true);
    }, 2500);

    return () => {
      active = false;
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [isLoaded]);

  const embedUrl = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: muted ? '1' : '0',
    loop: loop ? '1' : '0',
    playlist: youtubeId,
    modestbranding: modestbranding ? '1' : '0',
    controls: controls ? '1' : '0',
    rel: '0',
    fs: allowFullScreen ? '1' : '0',
  });

  return (
    <div
      ref={containerRef}
      className={`lazy-youtube-container ${className}`}
      data-youtube-id={youtubeId}
    >
      {!isLoaded ? (
        <div
          className="youtube-skeleton"
          style={{ backgroundImage: `url(https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg)` }}
        >
          <div className="skeleton-thumbnail" />
          <div className="skeleton-play-button" />
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}?${embedUrl}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={allowFullScreen}
          loading="lazy"
          className="youtube-embed"
        />
      )}
    </div>
  );
}
