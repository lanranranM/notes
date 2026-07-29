import { STAFF_YS, STAFF_MID, STEP_H } from './config';
import { gauss, noise2d, clamp01, BezierPath } from './math';
import type { NoteData, BirdState, InputState } from './types';

export function createBirdState(): BirdState {
  return {
    state: 'note',
    vis: 0,
    bx: 0,
    by: 0,
    bvx: 0,
    bvy: 0,
    heading: 0,
    wingBias: Math.random(),
    bScale: 0.9 + Math.random() * 0.5,
    calmT: 0,
    repopT: -1,
    returnPath: null,
    returnStart: 0,
    returnDuration: 0,
  };
}

export function noteBaseY(note: NoteData, input: InputState, t: number): number {
  const baseY = STAFF_YS[note.staff] + STAFF_MID - note.step * STEP_H;
  return baseY + staffDy(note.x, baseY, input, t);
}

export function staffDy(x: number, y: number, input: InputState, t: number): number {
  if (input.D <= 0) return 0;
  const g = gauss(x - input.x, 105);
  const pull = Math.max(-64, Math.min(64, (input.y - y) * 0.5));
  const shake = 7 * Math.sin(t * 9 + y * 0.09 + x * 0.015);
  return input.D * g * (pull + shake);
}

export function updateSimulation(
  notes: NoteData[],
  birds: BirdState[],
  input: InputState,
  dt: number,
  t: number,
): void {
  for (let i = 0; i < notes.length; i++) {
    const n = notes[i];
    const b = birds[i];
    const homeY = STAFF_YS[n.staff] + STAFF_MID - n.step * STEP_H;
    const wantVis = rampSimple(n.popT, n.popT + 0.22, t);

    const d = Math.hypot(n.x - input.x, homeY - input.y);
    const fear = input.D * gauss(d, 105);

    if (b.state === 'note') {
      b.vis += (wantVis - b.vis) * Math.min(1, dt * 8);
      if (fear > n.threshold && wantVis > 0.9) {
        b.state = 'scared';
        b.bx = n.x;
        b.by = homeY;
        const away = Math.atan2(homeY - input.y, n.x - input.x);
        b.bvx = Math.cos(away) * 140 + (noise2d(n.birdSeed, t) - 0.5) * 120;
        b.bvy = Math.sin(away) * 140 - 90 - noise2d(n.birdSeed + 40, t) * 60;
        b.heading = Math.atan2(b.bvy, b.bvx);
        b.calmT = 0;
        b.returnPath = null;
      }
    } else if (b.state === 'scared') {
      b.vis = Math.max(0, b.vis - dt * 7);

      const a1 = (noise2d(n.birdSeed, t * 1.1) - 0.5) * 1900;
      const a2 = (noise2d(n.birdSeed + 40, t * 1.1) - 0.5) * 1900;
      b.bvx += a1 * dt;
      b.bvy += a2 * dt - 60 * dt;

      const hx = b.bx - n.x;
      const hy = b.by - homeY;
      const hd = Math.hypot(hx, hy);
      if (hd > 130) {
        const pull = (hd - 130) * 6;
        b.bvx -= (hx / hd) * pull * dt * 60 * 0.16;
        b.bvy -= (hy / hd) * pull * dt * 60 * 0.16;
      }

      b.bvx *= (1 - 1.6 * dt);
      b.bvy *= (1 - 1.6 * dt);
      const sp = Math.hypot(b.bvx, b.bvy);
      if (sp > 300) {
        b.bvx *= 300 / sp;
        b.bvy *= 300 / sp;
      }
      b.bx += b.bvx * dt;
      b.by += b.bvy * dt;

      if (sp > 2) {
        b.heading = lerpAngleSimple(
          b.heading,
          Math.atan2(b.bvy, b.bvx),
          1 - Math.exp(-dt * 11),
        );
      }

      if (fear < 0.12) {
        b.calmT += dt;
      } else {
        b.calmT = 0;
      }
      if (b.calmT > 1.0 + (n.birdSeed % 1.8)) {
        beginReturn(n, b, t, homeY);
      }
    } else if (b.state === 'return') {
      updateReturn(n, b, t);
    }
  }
}

function beginReturn(n: NoteData, b: BirdState, t: number, homeY: number): void {
  const speed = Math.hypot(b.bvx, b.bvy);
  const dx = speed > 1 ? b.bvx / speed : 1;
  const dy = speed > 1 ? b.bvy / speed : -0.25;
  const distance = Math.hypot(n.x - b.bx, homeY - b.by);
  const lead = Math.max(38, Math.min(105, distance * 0.42));
  const side = Math.sin(n.birdSeed * 12.9898) >= 0 ? 1 : -1;
  const settle = 24 + 14 * (0.5 + 0.5 * Math.sin(n.birdSeed * 4.37));

  b.returnPath = new BezierPath([
    [b.bx, b.by],
    [b.bx + dx * lead, b.by + dy * lead],
    [n.x - side * settle, homeY - 20],
    [n.x, homeY],
  ], 72) as any;
  b.returnStart = t;
  const cruise = 172;
  b.returnDuration = Math.max(0.58, Math.min(1.85, (b.returnPath as any).length / cruise));
  b.state = 'return';
}

function updateReturn(n: NoteData, b: BirdState, t: number): void {
  const progress = clamp01((t - b.returnStart) / b.returnDuration);
  const path = b.returnPath as any;
  const pose = path.sample(progress);
  const speed = path.length / b.returnDuration;
  b.bx = pose.x;
  b.by = pose.y;
  b.bvx = pose.tx * speed;
  b.bvy = pose.ty * speed;

  if (speed > 2) {
    b.heading = Math.atan2(b.bvy, b.bvx);
  }

  if (progress >= 1) {
    b.state = 'note';
    b.repopT = t;
    b.returnPath = null;
    b.bvx = 0;
    b.bvy = 0;
  }
}

function rampSimple(a: number, b: number, t: number): number {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
}

function lerpAngleSimple(a: number, b: number, p: number): number {
  let delta = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  return a + delta * p;
}
