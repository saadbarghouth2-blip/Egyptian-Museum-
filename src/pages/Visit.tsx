import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Accessibility,
  AlertCircle,
  Bus,
  Calendar,
  Car,
  Clock,
  Info,
  Layers,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Sparkles,
  Train,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import MuseumHero3D from '../components/MuseumHero3D';
import { AR_MAP_FALLBACK, EN_MAP_FALLBACK } from './visitMapFallbacks';
import './Visit.css';

gsap.registerPlugin(ScrollTrigger);

const OPENING_HOURS = [
  { day: 'sunday', hours: '09:00 - 20:00', note: '' },
  { day: 'monday', hours: '09:00 - 20:00', note: '' },
  { day: 'tuesday', hours: '09:00 - 20:00', note: '' },
  { day: 'wednesday', hours: '09:00 - 20:00', note: '' },
  { day: 'thursday', hours: '09:00 - 20:00', note: '' },
  { day: 'friday', hours: '09:00 - 20:00', note: '' },
  { day: 'saturday', hours: '09:00 - 22:00', note: 'extended' },
] as const;

const TICKET_PRICES = [
  { id: 'adults', price: '400 EGP' },
  { id: 'students', price: '200 EGP' },
  { id: 'children', price: 'Free' },
  { id: 'seniors', price: '200 EGP' },
  { id: 'residents', price: '100 EGP' },
  { id: 'groups', price: '300 EGP' },
] as const;

const GETTING_THERE = [
  { id: 'car', icon: Car },
  { id: 'bus', icon: Bus },
  { id: 'metro', icon: Train },
] as const;

const TIPS = [
  { id: 'bestTime' },
  { id: 'bring' },
  { id: 'photo' },
  { id: 'food' },
] as const;

const FLOOR_OPTIONS = [
  { id: 'all' },
  { id: 'ground' },
  { id: 'upper' },
  { id: 'lower' },
] as const;

const CROWD_WINDOWS = [
  { id: 'morning', factor: 0.86 },
  { id: 'midday', factor: 1.14 },
  { id: 'evening', factor: 0.94 },
] as const;

const MAP_ZONES = [
  { id: 'arrival', floor: 'ground', x: 8, y: 84, image: '/images/entrance_plaza.jpg', avgMinutes: 4, density: 66 },
  { id: 'securityGate', floor: 'ground', x: 16, y: 76, image: '/images/entrance_plaza.jpg', avgMinutes: 3, density: 72 },
  { id: 'ticketHall', floor: 'ground', x: 24, y: 71, image: '/images/atrium.jpg', avgMinutes: 4, density: 68 },
  { id: 'atrium', floor: 'ground', x: 30, y: 63, image: '/images/atrium.jpg', avgMinutes: 5, density: 84 },
  { id: 'grandHall', floor: 'ground', x: 40, y: 58, image: '/images/grand_hall.jpg', avgMinutes: 6, density: 77 },
  { id: 'staircase', floor: 'ground', x: 48, y: 50, image: '/images/staircase.jpg', avgMinutes: 6, density: 82 },
  { id: 'servicesHub', floor: 'ground', x: 27, y: 86, image: '/images/exhibition_hall.jpg', avgMinutes: 4, density: 52 },
  { id: 'giftShop', floor: 'ground', x: 42, y: 75, image: '/images/egyptian_jewelry.jpg', avgMinutes: 4, density: 48 },
  { id: 'tutankhamun', floor: 'upper', x: 63, y: 30, image: '/images/tutankhamun_mask.jpg', avgMinutes: 8, density: 90 },
  { id: 'khufuBoat', floor: 'upper', x: 68, y: 18, image: '/images/exhibition_hall.jpg', avgMinutes: 6, density: 61 },
  { id: 'oldKingdom', floor: 'upper', x: 74, y: 35, image: '/images/giza_plateau.jpg', avgMinutes: 7, density: 69 },
  { id: 'newKingdom', floor: 'upper', x: 79, y: 50, image: '/images/sarcophagus_room.jpg', avgMinutes: 7, density: 74 },
  { id: 'temporaryExhibit', floor: 'upper', x: 88, y: 44, image: '/images/mummy_case.jpg', avgMinutes: 5, density: 58 },
  { id: 'grecoRoman', floor: 'upper', x: 88, y: 67, image: '/images/canopic_jars.jpg', avgMinutes: 5, density: 55 },
  { id: 'conservation', floor: 'lower', x: 54, y: 80, image: '/images/exhibition_hall.jpg', avgMinutes: 6, density: 37 },
  { id: 'restorationLab', floor: 'lower', x: 45, y: 91, image: '/images/coffin_interior.jpg', avgMinutes: 6, density: 34 },
  { id: 'learningCenter', floor: 'lower', x: 63, y: 88, image: '/images/papyrus.jpg', avgMinutes: 5, density: 41 },
  { id: 'immersiveTheater', floor: 'lower', x: 73, y: 94, image: '/images/museum_night.jpg', avgMinutes: 5, density: 45 },
  { id: 'familyLounge', floor: 'lower', x: 34, y: 88, image: '/images/nile_sunset.jpg', avgMinutes: 4, density: 32 },
] as const;

const MAP_CONNECTIONS = [
  { from: 'arrival', to: 'securityGate' },
  { from: 'securityGate', to: 'ticketHall' },
  { from: 'ticketHall', to: 'atrium' },
  { from: 'arrival', to: 'atrium' },
  { from: 'atrium', to: 'grandHall' },
  { from: 'atrium', to: 'servicesHub' },
  { from: 'servicesHub', to: 'giftShop' },
  { from: 'grandHall', to: 'staircase' },
  { from: 'atrium', to: 'staircase' },
  { from: 'staircase', to: 'tutankhamun' },
  { from: 'tutankhamun', to: 'khufuBoat' },
  { from: 'staircase', to: 'oldKingdom' },
  { from: 'oldKingdom', to: 'newKingdom' },
  { from: 'staircase', to: 'newKingdom' },
  { from: 'newKingdom', to: 'grecoRoman' },
  { from: 'newKingdom', to: 'temporaryExhibit' },
  { from: 'temporaryExhibit', to: 'grecoRoman' },
  { from: 'staircase', to: 'conservation' },
  { from: 'conservation', to: 'restorationLab' },
  { from: 'conservation', to: 'learningCenter' },
  { from: 'learningCenter', to: 'immersiveTheater' },
  { from: 'restorationLab', to: 'familyLounge' },
  { from: 'familyLounge', to: 'learningCenter' },
] as const;

const ROUTE_PROFILES = [
  { id: 'highlights' },
  { id: 'family' },
  { id: 'accessible' },
  { id: 'scholar' },
] as const;

const CORRIDOR_CARDS = [
  { id: 'flow', icon: Clock },
  { id: 'navigation', icon: MapPin },
  { id: 'accessibility', icon: Accessibility },
  { id: 'services', icon: Info },
] as const;

type MapZoneId = (typeof MAP_ZONES)[number]['id'];
type RouteProfileId = (typeof ROUTE_PROFILES)[number]['id'];
type FloorId = (typeof FLOOR_OPTIONS)[number]['id'];
type CrowdWindowId = (typeof CROWD_WINDOWS)[number]['id'];
type ZoneTextField = 'short' | 'title' | 'description' | 'level' | 'walkTime' | 'crowd' | 'imageAlt';
type ZoneListField = 'corridors' | 'artifacts' | 'tips' | 'services';

const ROUTE_ZONE_ORDER: Record<RouteProfileId, MapZoneId[]> = {
  highlights: ['arrival', 'securityGate', 'atrium', 'grandHall', 'staircase', 'tutankhamun', 'newKingdom', 'grecoRoman'],
  family: ['arrival', 'ticketHall', 'atrium', 'servicesHub', 'staircase', 'newKingdom', 'temporaryExhibit', 'familyLounge'],
  accessible: ['arrival', 'securityGate', 'atrium', 'servicesHub', 'conservation', 'learningCenter', 'newKingdom', 'grecoRoman'],
  scholar: [
    'arrival',
    'ticketHall',
    'atrium',
    'grandHall',
    'staircase',
    'oldKingdom',
    'newKingdom',
    'khufuBoat',
    'grecoRoman',
    'conservation',
    'restorationLab',
  ],
};

export default function Visit() {
  const { t, i18n } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeRoute, setActiveRoute] = useState<RouteProfileId>('highlights');
  const [activeFloor, setActiveFloor] = useState<FloorId>('all');
  const [activeZone, setActiveZone] = useState<MapZoneId>('atrium');
  const [activeWindow, setActiveWindow] = useState<CrowdWindowId>('midday');
  const [zoneQuery, setZoneQuery] = useState('');
  const [routeOnly, setRouteOnly] = useState(false);
  const [showCorridorLayer, setShowCorridorLayer] = useState(true);
  const [showArtifactsLayer, setShowArtifactsLayer] = useState(false);
  const [showServicesLayer, setShowServicesLayer] = useState(false);

  const mapFallback = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar') ? AR_MAP_FALLBACK : EN_MAP_FALLBACK;
  const isArabic = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');
  const pick = (ar: string, en: string) => (isArabic ? ar : en);

  const tr = (key: string, fallback: string): string => {
    if (!i18n.exists(key)) return fallback;
    const value = t(key);
    return typeof value === 'string' ? value : fallback;
  };

  const getTranslatedList = (key: string, fallback: string[] = []): string[] => {
    if (!i18n.exists(key)) return fallback;
    const value = t(key, { returnObjects: true }) as unknown;
    return Array.isArray(value) ? value.map((entry) => String(entry)) : fallback;
  };

  const mapLabel = (key: keyof typeof EN_MAP_FALLBACK.labels): string => tr(`visit.map.${key}`, mapFallback.labels[key]);

  const routeLabel = (routeId: RouteProfileId, field: 'name' | 'duration'): string => {
    const fallback = mapFallback.routes[routeId][field] ?? EN_MAP_FALLBACK.routes[routeId][field];
    return tr(`visit.map.routes.${routeId}.${field}`, fallback);
  };

  const zoneText = (zoneId: MapZoneId, field: ZoneTextField): string => {
    const localizedZone = mapFallback.zones[zoneId];
    const englishZone = EN_MAP_FALLBACK.zones[zoneId];
    const fallback = localizedZone?.[field] ?? englishZone?.[field] ?? zoneId;
    return tr(`visit.map.zones.${zoneId}.${field}`, fallback);
  };

  const zoneList = (zoneId: MapZoneId, field: ZoneListField): string[] => {
    const localizedZone = mapFallback.zones[zoneId];
    const englishZone = EN_MAP_FALLBACK.zones[zoneId];
    const fallback = localizedZone?.[field] ?? englishZone?.[field] ?? [];
    return getTranslatedList(`visit.map.zones.${zoneId}.${field}`, fallback);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.visit-hero-content',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.visit-hero',
            start: 'top 80%',
          },
        },
      );

      gsap.fromTo(
        '.info-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.info-section',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.hours-table',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.hours-section',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.ticket-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.tickets-section',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.transport-card',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.getting-there-section',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.map-shell',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.map-container',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.corridor-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.corridor-insights',
            start: 'top 78%',
          },
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const accessibilityFeatures = t('visit.accessibility.list', { returnObjects: true }) as string[];
  const activeWindowFactor = CROWD_WINDOWS.find((window) => window.id === activeWindow)?.factor ?? 1;
  const adjustedDensity = (density: number) => Math.max(14, Math.min(98, Math.round(density * activeWindowFactor)));
  const adjustedMinutes = (zone: (typeof MAP_ZONES)[number]) => {
    const densityFactor = adjustedDensity(zone.density) / 100;
    return Math.max(2, Math.round(zone.avgMinutes * (0.78 + densityFactor * 0.74)));
  };
  const routeZones = ROUTE_ZONE_ORDER[activeRoute];
  const floorZones = useMemo(
    () => MAP_ZONES.filter((zone) => activeFloor === 'all' || zone.floor === activeFloor),
    [activeFloor],
  );
  const query = zoneQuery.trim().toLowerCase();
  const visibleZones = query
    ? floorZones.filter((zone) => {
        const title = zoneText(zone.id, 'title').toLowerCase();
        const short = zoneText(zone.id, 'short').toLowerCase();
        return title.includes(query) || short.includes(query);
      })
    : floorZones;
  const visibleZoneIds = useMemo(() => new Set(visibleZones.map((zone) => zone.id)), [visibleZones]);
  const visibleRouteZones = useMemo(
    () => routeZones.filter((zoneId) => visibleZoneIds.has(zoneId)),
    [routeZones, visibleZoneIds],
  );
  const resolvedActiveZoneId =
    visibleZoneIds.has(activeZone)
      ? activeZone
      : (visibleRouteZones[0] ?? visibleZones[0]?.id ?? floorZones[0]?.id ?? MAP_ZONES[0].id);
  const activeZoneData = MAP_ZONES.find((zone) => zone.id === resolvedActiveZoneId) ?? MAP_ZONES[0];

  const routeTimeline = visibleRouteZones.map((zoneId, index) => {
    const zone = MAP_ZONES.find((candidate) => candidate.id === zoneId);
    const cumulativeMinutes = visibleRouteZones
      .slice(0, index + 1)
      .reduce((sum, currentId) => {
        const currentZone = MAP_ZONES.find((candidate) => candidate.id === currentId);
        return sum + (currentZone ? adjustedMinutes(currentZone) : 0);
      }, 0);

    return {
      id: zoneId,
      order: index + 1,
      cumulativeMinutes,
      segmentMinutes: zone ? adjustedMinutes(zone) : 0,
      floor: zone?.floor ?? 'ground',
    };
  });

  const activeZoneCorridors = zoneList(activeZoneData.id, 'corridors');
  const activeZoneArtifacts = zoneList(activeZoneData.id, 'artifacts');
  const activeZoneTips = zoneList(activeZoneData.id, 'tips');
  const activeZoneServices = zoneList(activeZoneData.id, 'services');
  const activeZoneDensity = adjustedDensity(activeZoneData.density);

  const connected = new Set<MapZoneId>();
  MAP_CONNECTIONS.forEach((connection) => {
    if (connection.from === activeZoneData.id) connected.add(connection.to);
    if (connection.to === activeZoneData.id) connected.add(connection.from);
  });
  const nearbyZoneIds = [...connected].filter((zoneId) => {
    const zone = MAP_ZONES.find((candidate) => candidate.id === zoneId);
    return !!zone && (activeFloor === 'all' || zone.floor === activeFloor);
  });

  const mapStats = {
    avgDensity: visibleZones.length
      ? Math.round(visibleZones.reduce((sum, zone) => sum + adjustedDensity(zone.density), 0) / visibleZones.length)
      : 0,
    routeCoverage: routeZones.length ? Math.round((visibleRouteZones.length / routeZones.length) * 100) : 0,
    totalDynamicMinutes: routeTimeline[routeTimeline.length - 1]?.cumulativeMinutes ?? 0,
    visibleCount: visibleZones.length,
  };

  const crowdWindowLabel = (windowId: CrowdWindowId) => {
    if (windowId === 'morning') return pick('صباحًا', 'Morning');
    if (windowId === 'midday') return pick('منتصف اليوم', 'Midday');
    return pick('مساءً', 'Evening');
  };

  const floorDirectory = useMemo(
    () =>
      FLOOR_OPTIONS.filter((floor) => floor.id !== 'all').map((floor) => {
        const floorZones = MAP_ZONES.filter((zone) => zone.floor === floor.id);
        const floorMinutes = floorZones.reduce((sum, zone) => sum + zone.avgMinutes, 0);
        const avgDensity = floorZones.length
          ? Math.round(floorZones.reduce((sum, zone) => sum + zone.density, 0) / floorZones.length)
          : 0;
        return {
          id: floor.id,
          zones: floorZones,
          minutes: floorMinutes,
          avgDensity,
        };
      }),
    [],
  );

  return (
    <div ref={pageRef} className="visit-page">
      <section className="visit-hero">
        <div className="visit-hero-bg">
          <img src="/images/entrance_plaza.jpg" alt={t('visit.hero.imageAlt')} />
          <div className="visit-hero-overlay" />
        </div>
        <MuseumHero3D />
        <div className="visit-hero-content">
          <span className="mono visit-hero-label">{t('visit.hero.label')}</span>
          <h1 className="headline-xl">{t('visit.hero.title')}</h1>
          <p className="visit-hero-description">{t('visit.hero.description')}</p>
        </div>
      </section>

      <section className="info-section">
        <div className="info-container">
          <div className="info-card">
            <MapPin className="info-card-icon" size={32} />
            <h3 className="info-card-title">{t('visit.quick.location.title')}</h3>
            <p className="info-card-text">
              {t('visit.quick.location.line1')}<br />
              {t('visit.quick.location.line2')}<br />
              {t('visit.quick.location.line3')}
            </p>
          </div>
          <div className="info-card">
            <Clock className="info-card-icon" size={32} />
            <h3 className="info-card-title">{t('visit.quick.hours.title')}</h3>
            <p className="info-card-text">
              {t('visit.quick.hours.line1')}<br />
              {t('visit.quick.hours.line2')}<br />
              {t('visit.quick.hours.line3')}
            </p>
          </div>
          <div className="info-card">
            <Calendar className="info-card-icon" size={32} />
            <h3 className="info-card-title">{t('visit.quick.bestTime.title')}</h3>
            <p className="info-card-text">
              {t('visit.quick.bestTime.line1')}<br />
              {t('visit.quick.bestTime.line2')}<br />
              {t('visit.quick.bestTime.line3')}
            </p>
          </div>
        </div>
      </section>

      <section className="hours-tickets-section">
        <div className="hours-tickets-container">
          <div className="hours-section">
            <div className="section-header">
              <Clock className="section-header-icon" size={28} />
              <h2 className="headline-md">{t('visit.hours.title')}</h2>
            </div>
            <div className="hours-table">
              {OPENING_HOURS.map((item, index) => (
                <div key={index} className={`hours-row ${item.note ? 'highlight' : ''}`}>
                  <span className="hours-day">{t(`visit.hours.days.${item.day}`)}</span>
                  <span className="hours-time">{item.hours}</span>
                  {item.note && <span className="hours-note">{t('visit.hours.extended')}</span>}
                </div>
              ))}
            </div>
            <div className="hours-notice">
              <AlertCircle size={18} />
              <p>{t('visit.hours.notice')}</p>
            </div>
          </div>

          <div className="tickets-section">
            <div className="section-header">
              <Info className="section-header-icon" size={28} />
              <h2 className="headline-md">{t('visit.prices.title')}</h2>
            </div>
            <div className="tickets-grid">
              {TICKET_PRICES.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-info">
                    <span className="ticket-type">{t(`visit.prices.items.${ticket.id}.type`)}</span>
                    <span className="ticket-note">{t(`visit.prices.items.${ticket.id}.note`)}</span>
                  </div>
                  <span className="ticket-price">{ticket.price}</span>
                </div>
              ))}
            </div>
            <Link to="/tickets" className="btn-gold tickets-btn">
              {t('visit.prices.cta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="getting-there-section">
        <div className="getting-there-container">
          <div className="getting-there-header">
            <span className="mono section-label">{t('visit.directions.label')}</span>
            <h2 className="headline-lg">{t('visit.directions.title')}</h2>
          </div>

          <div className="transport-grid">
            {GETTING_THERE.map((transport) => (
              <div key={transport.id} className="transport-card">
                <transport.icon className="transport-icon" size={36} />
                <h3 className="transport-title">{t(`visit.directions.items.${transport.id}.title`)}</h3>
                <p className="transport-description">{t(`visit.directions.items.${transport.id}.description`)}</p>
              </div>
            ))}
          </div>

          <div className="map-container">
            <div className="map-shell">
              <div className="map-header">
                <h3 className="map-title">{t('visit.map.title')}</h3>
                <p className="map-text">{t('visit.map.subtitle')}</p>
              </div>

              <div className="map-floor-filters">
                <span className="map-floor-label">{mapLabel('floorsLabel')}</span>
                <div className="map-floor-tabs">
                  {FLOOR_OPTIONS.map((floor) => (
                    <button
                      key={floor.id}
                      type="button"
                      className={`map-floor-btn ${activeFloor === floor.id ? 'active' : ''}`}
                      onClick={() => setActiveFloor(floor.id)}
                    >
                      {t(`visit.map.floors.${floor.id}`)}
                    </button>
                  ))}
                </div>
              </div>

	              <div className="map-route-filters">
	                {ROUTE_PROFILES.map((route) => (
	                  <button
                    key={route.id}
                    type="button"
                    className={`map-route-btn ${activeRoute === route.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveRoute(route.id);
                      const zones = ROUTE_ZONE_ORDER[route.id];
                      const visibleCandidate = zones.find((zoneId) => {
                        const zoneData = MAP_ZONES.find((zone) => zone.id === zoneId);
                        return !!zoneData && (activeFloor === 'all' || zoneData.floor === activeFloor);
                      });
                      if (!visibleCandidate) {
                        const firstVisible = MAP_ZONES.find((zone) => activeFloor === 'all' || zone.floor === activeFloor);
                        if (firstVisible) setActiveZone(firstVisible.id);
                      } else if (!zones.includes(resolvedActiveZoneId)) {
                        setActiveZone(visibleCandidate);
                      }
                    }}
                  >
                    <span className="map-route-name">{routeLabel(route.id, 'name')}</span>
                    <span className="map-route-duration">{routeLabel(route.id, 'duration')}</span>
	                  </button>
	                ))}
	              </div>

	              <div className="map-interaction-tools">
	                <label className="map-search-box">
	                  <Search size={15} />
	                  <input
	                    type="text"
	                    value={zoneQuery}
	                    onChange={(event) => setZoneQuery(event.target.value)}
	                    placeholder={pick('ابحث عن قاعة أو نقطة', 'Search for a hall or node')}
	                  />
	                </label>
	                {zoneQuery.trim().length > 0 && visibleZones.length === 0 && (
	                  <p className="map-search-empty">{pick('لا توجد نتائج مطابقة، جرّب اسمًا آخر.', 'No matching nodes, try a different keyword.')}</p>
	                )}

	                <div className="map-window-filters">
	                  <span className="map-window-label">
	                    <SlidersHorizontal size={14} />
	                    {pick('كثافة حسب الوقت', 'Density by Time Window')}
	                  </span>
	                  <div className="map-window-tabs">
	                    {CROWD_WINDOWS.map((window) => (
	                      <button
	                        key={window.id}
	                        type="button"
	                        className={`map-window-btn ${activeWindow === window.id ? 'active' : ''}`}
	                        onClick={() => setActiveWindow(window.id)}
	                      >
	                        {crowdWindowLabel(window.id)}
	                      </button>
	                    ))}
	                  </div>
	                </div>

	                <div className="map-layer-controls">
	                  <button
	                    type="button"
	                    className={`map-layer-btn ${routeOnly ? 'active' : ''}`}
	                    onClick={() => setRouteOnly((prev) => !prev)}
	                  >
	                    <MapPin size={13} />
	                    {pick('المسار فقط', 'Route Only')}
	                  </button>
	                  <button
	                    type="button"
	                    className={`map-layer-btn ${showCorridorLayer ? 'active' : ''}`}
	                    onClick={() => setShowCorridorLayer((prev) => !prev)}
	                  >
	                    <Layers size={13} />
	                    {pick('الممرات', 'Corridors')}
	                  </button>
	                  <button
	                    type="button"
	                    className={`map-layer-btn ${showArtifactsLayer ? 'active' : ''}`}
	                    onClick={() => setShowArtifactsLayer((prev) => !prev)}
	                  >
	                    <Sparkles size={13} />
	                    {pick('التحف', 'Artifacts')}
	                  </button>
	                  <button
	                    type="button"
	                    className={`map-layer-btn ${showServicesLayer ? 'active' : ''}`}
	                    onClick={() => setShowServicesLayer((prev) => !prev)}
	                  >
	                    <Info size={13} />
	                    {pick('الخدمات', 'Services')}
	                  </button>
	                </div>
	              </div>

	              <div className="map-live-stats">
	                <article className="map-live-stat-card">
	                  <span>{pick('النقاط الظاهرة', 'Visible Nodes')}</span>
	                  <strong>{mapStats.visibleCount}</strong>
	                </article>
	                <article className="map-live-stat-card">
	                  <span>{pick('تغطية المسار', 'Route Coverage')}</span>
	                  <strong>{mapStats.routeCoverage}%</strong>
	                </article>
	                <article className="map-live-stat-card">
	                  <span>{pick('متوسط الكثافة', 'Average Density')}</span>
	                  <strong>{mapStats.avgDensity}%</strong>
	                </article>
	                <article className="map-live-stat-card">
	                  <span>{pick('زمن الجولة الحالي', 'Live Route Time')}</span>
	                  <strong>
	                    {mapStats.totalDynamicMinutes} {mapLabel('minuteUnit')}
	                  </strong>
	                </article>
	              </div>

	              <div className="map-layout">
	                <div className="interactive-map" role="img" aria-label={t('visit.map.a11yLabel')}>
	                  <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
	                    {showCorridorLayer &&
	                      MAP_CONNECTIONS.map((connection, idx) => {
	                        const fromZone = MAP_ZONES.find((zone) => zone.id === connection.from);
	                        const toZone = MAP_ZONES.find((zone) => zone.id === connection.to);
	                        if (!fromZone || !toZone) return null;

	                        const isInRoute = routeZones.includes(connection.from) && routeZones.includes(connection.to);
	                        if (routeOnly && !isInRoute) return null;

	                        const bothVisible = visibleZoneIds.has(fromZone.id) && visibleZoneIds.has(toZone.id);
	                        if (!bothVisible) return null;

	                        return (
	                          <line
	                            key={idx}
	                            x1={fromZone.x}
	                            y1={fromZone.y}
	                            x2={toZone.x}
	                            y2={toZone.y}
	                            className={`map-line ${isInRoute ? 'active' : ''}`}
	                          />
	                        );
	                      })}
	                  </svg>

	                  {MAP_ZONES.map((zone) => {
	                    const inRoute = routeZones.includes(zone.id);
	                    const isActive = resolvedActiveZoneId === zone.id;
	                    const isVisible = visibleZoneIds.has(zone.id);
	                    const hiddenByRouteOnly = routeOnly && !inRoute;
	                    return (
	                      <button
	                        key={zone.id}
	                        type="button"
	                        className={`map-node ${inRoute ? 'in-route' : ''} ${isActive ? 'active' : ''} ${isVisible && !hiddenByRouteOnly ? '' : 'hidden-floor'}`}
	                        style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
	                        onClick={() => setActiveZone(zone.id)}
	                        title={zoneText(zone.id, 'title')}
	                      >
	                        <span className="map-node-dot" />
	                        <span className="map-node-label">{zoneText(zone.id, 'short')}</span>
	                        {showArtifactsLayer && <span className="map-node-layer artifact" aria-hidden="true" />}
	                        {showServicesLayer && <span className="map-node-layer service" aria-hidden="true" />}
	                      </button>
	                    );
	                  })}
	                </div>

                <aside className="map-details-card">
                  <div className="map-details-image">
                    <img src={activeZoneData.image} alt={zoneText(activeZoneData.id, 'imageAlt')} />
                  </div>
                  <div className="map-details-content">
                    <h4 className="map-details-title">{zoneText(activeZoneData.id, 'title')}</h4>
                    <p className="map-details-description">{zoneText(activeZoneData.id, 'description')}</p>
                    <div className="map-details-meta">
                      <span>{zoneText(activeZoneData.id, 'level')}</span>
                      <span>{zoneText(activeZoneData.id, 'walkTime')}</span>
                      <span>{zoneText(activeZoneData.id, 'crowd')}</span>
                      <span>{t(`visit.map.floors.${activeZoneData.floor}`)}</span>
                      <span>
                        {activeZoneArtifacts.length} {mapLabel('artifactUnit')}
                      </span>
                      <span>
                        {activeZoneServices.length} {mapLabel('serviceUnit')}
                      </span>
                      <span>
                        {activeZoneCorridors.length} {mapLabel('corridorUnit')}
                      </span>
                    </div>
	                    <div className="map-density">
	                      <span className="map-density-label">{mapLabel('liveDensityLabel')}</span>
	                      <div className="map-density-track" aria-hidden="true">
	                        <span className="map-density-fill" style={{ width: `${activeZoneDensity}%` }} />
	                      </div>
	                      <span className="map-density-value">{activeZoneDensity}%</span>
	                    </div>
	                    <div className="map-corridor-list">
	                      {activeZoneCorridors.map((item, idx) => (
                        <p key={`${activeZoneData.id}-corridor-${idx}`} className="map-corridor-item">
                          {item}
                        </p>
                      ))}
                    </div>
                    <div className="map-artifacts-list">
                      <h5 className="map-list-title">{t('visit.map.artifactsTitle')}</h5>
                      <div className="map-list-wrap">
                        {activeZoneArtifacts.map((artifact, idx) => (
                          <span key={`${activeZoneData.id}-artifact-${idx}`} className="map-artifact-chip">
                            {artifact}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="map-tips-list">
                      <h5 className="map-list-title">{t('visit.map.navigationTipsTitle')}</h5>
                      {activeZoneTips.map((tip, idx) => (
                        <p key={`${activeZoneData.id}-tip-${idx}`} className="map-tip-item">
                          {tip}
                        </p>
                      ))}
                    </div>
	                    <div className="map-services-list">
	                      {activeZoneServices.map((service, idx) => (
	                        <span key={`${activeZoneData.id}-service-${idx}`} className="map-service-chip">
	                          {service}
	                        </span>
	                      ))}
	                    </div>
	                    <div className="map-nearby-zones">
	                      <h5 className="map-list-title">{pick('المناطق القريبة', 'Nearby Connected Zones')}</h5>
	                      <div className="map-nearby-list">
	                        {nearbyZoneIds.map((zoneId) => (
	                          <button key={`${activeZoneData.id}-near-${zoneId}`} type="button" onClick={() => setActiveZone(zoneId)}>
	                            {zoneText(zoneId, 'short')}
	                          </button>
	                        ))}
	                      </div>
	                    </div>
	                  </div>
	                </aside>
	              </div>

              <div className="active-route-summary">
                <h4 className="active-route-title">{t('visit.map.routeSummaryTitle')}</h4>
                <p className="active-route-subtitle">
                  {routeTimeline.length} {mapLabel('zoneUnit')} -{' '}
                  {routeTimeline[routeTimeline.length - 1]?.cumulativeMinutes ?? 0} {mapLabel('minuteUnit')}
                </p>
	                <div className="active-route-stops">
	                  {routeTimeline.map((step) => (
	                    <span key={step.id} className="active-route-stop">
	                      {step.order}. {zoneText(step.id, 'title')} - {step.cumulativeMinutes} {mapLabel('minuteUnit')} ({step.segmentMinutes}{' '}
	                      {mapLabel('minuteUnit')})
	                    </span>
	                  ))}
	                </div>
              </div>

              <div className="map-floor-overview">
                <h4 className="map-floor-overview-title">{t('visit.map.floorOverviewTitle')}</h4>
                <div className="map-floor-overview-grid">
                  {floorDirectory.map((floor) => (
                    <article key={floor.id} className="map-floor-overview-card">
                      <h5>{t(`visit.map.floors.${floor.id}`)}</h5>
                      <p>{t(`visit.map.floorDescriptions.${floor.id}`)}</p>
                      <div className="map-floor-overview-meta">
                        <span>
                          {floor.zones.length} {mapLabel('zoneUnit')}
                        </span>
                        <span>
                          {floor.minutes} {mapLabel('minuteUnit')}
                        </span>
                        <span>
                          {floor.avgDensity}% {mapLabel('densityUnit')}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="map-zone-directory">
                <h4 className="map-zone-directory-title">{mapLabel('directoryTitle')}</h4>
                <div className="map-zone-directory-grid">
                  {floorDirectory.map((floor) => (
                    <article key={floor.id} className="map-zone-directory-card">
                      <h5>{t(`visit.map.floors.${floor.id}`)}</h5>
                      <div className="map-zone-directory-list">
                        {floor.zones.map((zone) => (
                          <button
                            key={zone.id}
                            type="button"
                            className={`map-zone-directory-item ${resolvedActiveZoneId === zone.id ? 'active' : ''}`}
                            onClick={() => {
                              setActiveFloor(floor.id);
                              setActiveZone(zone.id);
                            }}
                          >
                            <span>{zoneText(zone.id, 'title')}</span>
                            <span>
                              {zone.avgMinutes} {mapLabel('minuteUnit')}
                            </span>
                          </button>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="corridor-insights">
              <div className="corridor-insights-header">
                <h3 className="corridor-insights-title">{t('visit.corridors.title')}</h3>
                <p className="corridor-insights-text">{t('visit.corridors.intro')}</p>
              </div>
              <div className="corridor-grid">
                {CORRIDOR_CARDS.map((card) => (
                  <article key={card.id} className="corridor-card">
                    <card.icon className="corridor-card-icon" size={24} />
                    <h4 className="corridor-card-title">{t(`visit.corridors.items.${card.id}.title`)}</h4>
                    <p className="corridor-card-description">{t(`visit.corridors.items.${card.id}.description`)}</p>
                    <div className="corridor-card-points">
                      {getTranslatedList(`visit.corridors.items.${card.id}.points`).map((point, idx) => (
                        <span key={`${card.id}-${idx}`} className="corridor-point">
                          {point}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="accessibility-section">
        <div className="accessibility-container">
          <div className="accessibility-content">
            <div className="accessibility-header">
              <Accessibility className="accessibility-icon" size={32} />
              <h2 className="headline-md">{t('visit.accessibility.title')}</h2>
            </div>
            <p className="accessibility-text">{t('visit.accessibility.text')}</p>
            <ul className="accessibility-list">
              {accessibilityFeatures.map((feature, index) => (
                <li key={index} className="accessibility-item">
                  <span className="accessibility-bullet" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="accessibility-image">
            <img src="/images/atrium.jpg" alt={t('visit.accessibility.imageAlt')} />
          </div>
        </div>
      </section>

      <section className="tips-section">
        <div className="tips-container">
          <div className="tips-header">
            <span className="mono section-label">{t('visit.tips.label')}</span>
            <h2 className="headline-lg">{t('visit.tips.title')}</h2>
          </div>

          <div className="tips-grid">
            {TIPS.map((tip, index) => (
              <div key={tip.id} className="tip-card-large">
                <span className="tip-number-large">0{index + 1}</span>
                <h3 className="tip-title-large">{t(`visit.tips.items.${tip.id}.title`)}</h3>
                <p className="tip-description">{t(`visit.tips.items.${tip.id}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <h2 className="headline-md">{t('visit.contact.title')}</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <Phone size={24} />
              <div>
                <span className="contact-label">{t('visit.contact.phoneLabel')}</span>
                <span className="contact-value">+20 2 35317344</span>
              </div>
            </div>
            <div className="contact-item">
              <Mail size={24} />
              <div>
                <span className="contact-label">{t('visit.contact.emailLabel')}</span>
                <span className="contact-value">info@gem.gov.eg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grain-overlay" />
    </div>
  );
}
