export function clamp(v: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

export function clamp01(v: number): number {
  return clamp(v, 0, 1);
}

export function mix(a: number, b: number, p: number): number {
  return a + (b - a) * p;
}

export function invLerp(a: number, b: number, v: number): number {
  return a === b ? 0 : (v - a) / (b - a);
}

export function ramp(a: number, b: number, t: number): number {
  const x = clamp01(invLerp(a, b, t));
  return x * x * (3 - 2 * x);
}

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - clamp01(x), 3);
}

export function gauss(d: number, sigma: number): number {
  if (sigma <= 0) return d === 0 ? 1 : 0;
  return Math.exp(-(d * d) / (2 * sigma * sigma));
}

export function lerpAngle(a: number, b: number, p: number): number {
  const delta = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  return a + delta * p;
}

export function damp(current: number, target: number, lambda: number, dt: number): number {
  return mix(current, target, 1 - Math.exp(-Math.max(0, lambda) * Math.max(0, dt)));
}

// Seeded PRNG (mulberry32)
export function createRng(seed: number) {
  let state = (seed >>> 0) || 1;
  return function random(lo?: number, hi?: number): number {
    state += 0x6D2B79F5;
    let x = state;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    const r = ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    if (lo === undefined) return r;
    if (hi === undefined) return r * lo;
    return lo + r * (hi - lo);
  };
}

// Simple 2D value noise (no p5 dependency)
const PERM = new Uint8Array(512);
(function initPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let seed = 7;
  for (let i = 255; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
})();

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 7;
  const u = h < 4 ? x : y;
  const v = h < 4 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

export function noise2d(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = PERM[PERM[X] + Y];
  const ab = PERM[PERM[X] + Y + 1];
  const ba = PERM[PERM[X + 1] + Y];
  const bb = PERM[PERM[X + 1] + Y + 1];
  return mix(
    mix(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    mix(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v,
  ) * 0.5 + 0.5;
}

// BezierPath with arc-length parameterization
export class BezierPath {
  points: Array<{ x: number; y: number }>;
  private _lengths: number[];
  private _length: number;
  private resolution: number;

  constructor(pts: Array<[number, number]>, resolution = 72) {
    this.points = pts.map(([x, y]) => ({ x, y }));
    this.resolution = resolution;
    this._lengths = [];
    this._length = 0;
    this.rebuild();
  }

  get length(): number {
    return this._length;
  }

  private rebuild() {
    this._lengths = new Array(this.resolution + 1);
    this._lengths[0] = 0;
    let prev = this.pointAtRaw(0);
    let total = 0;
    for (let i = 1; i <= this.resolution; i++) {
      const pt = this.pointAtRaw(i / this.resolution);
      total += Math.hypot(pt.x - prev.x, pt.y - prev.y);
      this._lengths[i] = total;
      prev = pt;
    }
    this._length = total;
  }

  private pointAtRaw(t: number): { x: number; y: number } {
    const p = this.points;
    const u = 1 - t;
    if (p.length === 4) {
      return {
        x: u * u * u * p[0].x + 3 * u * u * t * p[1].x + 3 * u * t * t * p[2].x + t * t * t * p[3].x,
        y: u * u * u * p[0].y + 3 * u * u * t * p[1].y + 3 * u * t * t * p[2].y + t * t * t * p[3].y,
      };
    }
    if (p.length === 3) {
      return {
        x: u * u * p[0].x + 2 * u * t * p[1].x + t * t * p[2].x,
        y: u * u * p[0].y + 2 * u * t * p[1].y + t * t * p[2].y,
      };
    }
    return { x: mix(p[0].x, p[1].x, t), y: mix(p[0].y, p[1].y, t) };
  }

  private tangentAtRaw(t: number): { x: number; y: number } {
    const p = this.points;
    const u = 1 - t;
    let tx: number, ty: number;
    if (p.length === 4) {
      tx = 3 * (u * u * (p[1].x - p[0].x) + 2 * u * t * (p[2].x - p[1].x) + t * t * (p[3].x - p[2].x));
      ty = 3 * (u * u * (p[1].y - p[0].y) + 2 * u * t * (p[2].y - p[1].y) + t * t * (p[3].y - p[2].y));
    } else if (p.length === 3) {
      tx = 2 * (u * (p[1].x - p[0].x) + t * (p[2].x - p[1].x));
      ty = 2 * (u * (p[1].y - p[0].y) + t * (p[2].y - p[1].y));
    } else {
      tx = p[1].x - p[0].x;
      ty = p[1].y - p[0].y;
    }
    const mag = Math.hypot(tx, ty);
    return mag < 1e-9 ? { x: 0, y: 0 } : { x: tx / mag, y: ty / mag };
  }

  private parameterAt(progress: number): number {
    const target = clamp01(progress) * this._length;
    let lo = 0, hi = this._lengths.length - 1;
    while (lo + 1 < hi) {
      const mid = (lo + hi) >> 1;
      if (this._lengths[mid] <= target) lo = mid;
      else hi = mid;
    }
    const from = this._lengths[lo];
    const to = this._lengths[hi];
    const local = to === from ? 0 : (target - from) / (to - from);
    return (lo + local) / this.resolution;
  }

  sample(progress: number): { x: number; y: number; tx: number; ty: number } {
    const t = this.parameterAt(clamp01(progress));
    const pt = this.pointAtRaw(t);
    const tan = this.tangentAtRaw(t);
    return { x: pt.x, y: pt.y, tx: tan.x, ty: tan.y };
  }
}
