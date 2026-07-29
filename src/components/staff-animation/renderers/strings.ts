import { FINGERS, HAND_X, HAND_Y, HAND_W, HAND_H, H, STRING_COLOR } from '../config';
import { ramp, easeOutCubic, mix } from '../math';
import { noteBaseY } from '../simulation';
import type { NoteData, BirdState, InputState } from '../types';

export function fingerAnchors(t: number, input: InputState): [number, number][] {
  const D = input.D;
  const bobY = handBobY(t, D);
  const rot = handRot(t, D);
  const px = HAND_X + 150;
  const py = H;
  const sx = HAND_W / 179;
  const sy = HAND_H / 274;

  return FINGERS.map(([lx, ly]) => {
    const x = HAND_X + lx * sx;
    const y = HAND_Y + ly * sy + bobY;
    const dx = x - px;
    const dy = y - py;
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    return [px + dx * c - dy * s, py + dx * s + dy * c] as [number, number];
  });
}

export function handBobY(t: number, D: number): number {
  const rise = (1 - easeOutCubic(t / 0.9)) * 120;
  return rise + Math.sin(t * 0.9) * 2.5 + D * Math.sin(t * 3.1) * 6;
}

export function handRot(t: number, D: number): number {
  return Math.sin(t * 0.7) * 0.008 + D * Math.sin(t * 2.2) * 0.03;
}

export function drawStrings(
  ctx: CanvasRenderingContext2D,
  notes: NoteData[],
  birds: BirdState[],
  t: number,
  input: InputState,
): void {
  const D = input.D;
  const anchors = fingerAnchors(t, input);

  ctx.save();

  for (let i = 0; i < notes.length; i++) {
    const n = notes[i];
    const b = birds[i];

    const g0 = 0.25 + i * 0.035;
    const grow = ramp(g0, g0 + 0.5, t);
    if (grow <= 0) continue;
    const ease = easeOutCubic(grow);

    const [ax0, ay0] = anchors[n.finger];
    let bx: number, by: number, slack: number;

    if (b.state === 'note') {
      bx = n.x;
      by = noteBaseY(n, input, t);
      slack = 4 + 2.4 * Math.sin(t * 0.85 + n.seed);
    } else {
      bx = b.bx;
      by = b.by;
      slack = 22 + 14 * Math.sin(t * 3.3 + n.seed);
    }

    bx = mix(ax0, bx, ease);
    by = mix(ay0, by, ease);
    slack = mix(46, slack, ease);

    const sway = (2 + D * 9) * Math.sin(t * 1.25 + n.seed * 2.7)
               + (1 - ease) * 14 * Math.sin(t * 9 + n.seed);
    const mx = (ax0 + bx) / 2 + sway;
    const my = (ay0 + by) / 2 + slack;

    const a = b.state === 'note' ? 62 + 30 * D : 105;

    ctx.strokeStyle = `rgba(${STRING_COLOR[0]}, ${STRING_COLOR[1]}, ${STRING_COLOR[2]}, ${(a / 255) * Math.min(1, grow * 1.6)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ax0, ay0);
    ctx.bezierCurveTo(mx, my, mx, my, bx, by);
    ctx.stroke();
  }

  ctx.restore();
}
