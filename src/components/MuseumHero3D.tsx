import type { CSSProperties } from 'react';

import './MuseumHero3D.css';

type Props = {
  className?: string;
};

type Shape = {
  key: string;
  kind: 'pyramid' | 'obelisk' | 'ring' | 'tablet' | 'shard';
  style: CSSProperties;
};

const SHAPES: Shape[] = [
  {
    key: 'p1',
    kind: 'pyramid',
    style: {
      left: '10%',
      top: '18%',
      width: '160px',
      height: '160px',
      '--rx': '58deg',
      '--ry': '12deg',
      '--rz': '18deg',
      '--dx': '22px',
      '--dy': '-14px',
      '--dur': '10s',
      '--del': '0s',
    } as CSSProperties,
  },
  {
    key: 'o1',
    kind: 'obelisk',
    style: {
      left: '80%',
      top: '16%',
      width: '60px',
      height: '220px',
      '--rx': '70deg',
      '--ry': '-18deg',
      '--rz': '-8deg',
      '--dx': '-18px',
      '--dy': '18px',
      '--dur': '12s',
      '--del': '0.6s',
    } as CSSProperties,
  },
  {
    key: 'r1',
    kind: 'ring',
    style: {
      left: '72%',
      top: '56%',
      width: '140px',
      height: '140px',
      '--rx': '72deg',
      '--ry': '22deg',
      '--rz': '0deg',
      '--dx': '-24px',
      '--dy': '-10px',
      '--dur': '11s',
      '--del': '0.2s',
    } as CSSProperties,
  },
  {
    key: 't1',
    kind: 'tablet',
    style: {
      left: '18%',
      top: '64%',
      width: '210px',
      height: '120px',
      '--rx': '64deg',
      '--ry': '-22deg',
      '--rz': '-18deg',
      '--dx': '18px',
      '--dy': '14px',
      '--dur': '13s',
      '--del': '1.1s',
    } as CSSProperties,
  },
  {
    key: 's1',
    kind: 'shard',
    style: {
      left: '46%',
      top: '12%',
      width: '120px',
      height: '160px',
      '--rx': '76deg',
      '--ry': '10deg',
      '--rz': '22deg',
      '--dx': '10px',
      '--dy': '20px',
      '--dur': '9s',
      '--del': '0.4s',
    } as CSSProperties,
  },
  {
    key: 'p2',
    kind: 'pyramid',
    style: {
      left: '52%',
      top: '70%',
      width: '120px',
      height: '120px',
      '--rx': '58deg',
      '--ry': '-14deg',
      '--rz': '-10deg',
      '--dx': '-12px',
      '--dy': '-16px',
      '--dur': '12.5s',
      '--del': '0.9s',
    } as CSSProperties,
  },
  {
    key: 'o2',
    kind: 'obelisk',
    style: {
      left: '6%',
      top: '38%',
      width: '46px',
      height: '180px',
      '--rx': '74deg',
      '--ry': '18deg',
      '--rz': '8deg',
      '--dx': '16px',
      '--dy': '-10px',
      '--dur': '14s',
      '--del': '0.3s',
    } as CSSProperties,
  },
  {
    key: 'r2',
    kind: 'ring',
    style: {
      left: '30%',
      top: '26%',
      width: '110px',
      height: '110px',
      '--rx': '66deg',
      '--ry': '-8deg',
      '--rz': '0deg',
      '--dx': '14px',
      '--dy': '10px',
      '--dur': '10.8s',
      '--del': '0.75s',
    } as CSSProperties,
  },
];

export default function MuseumHero3D({ className }: Props) {
  return (
    <div className={`museum-hero-3d ${className ?? ''}`} aria-hidden="true">
      <div className="museum-hero-3d__vignette" />
      {SHAPES.map((s) => (
        <div key={s.key} className={`museum-shape museum-shape--${s.kind}`} style={s.style} />
      ))}
    </div>
  );
}
