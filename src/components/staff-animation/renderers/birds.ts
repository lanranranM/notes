import { BIRD_SIZE, INK } from '../config';
import { ramp } from '../math';
import type { NoteData, BirdState } from '../types';

export function drawBirds(
  ctx: CanvasRenderingContext2D,
  notes: NoteData[],
  birds: BirdState[],
  t: number,
): void {
  for (let i = 0; i < notes.length; i++) {
    const b = birds[i];
    if (b.state === 'note') continue;
    const alpha = 1 - b.vis;
    if (alpha <= 0.01) continue;
    drawSwallow(ctx, b, notes[i], t, alpha);
  }
}

function drawSwallow(
  ctx: CanvasRenderingContext2D,
  bird: BirdState,
  note: NoteData,
  t: number,
  alpha: number,
): void {
  const s = BIRD_SIZE * bird.bScale;
  const speed = Math.hypot(bird.bvx, bird.bvy);
  const resting = bird.state === 'note';
  const rate = resting ? 3.0 : 4.2 + Math.min(2.2, speed * 0.008);
  const phase = 0.5 + 0.5 * Math.sin(t * rate + note.birdSeed * 8.7);
  let wingOpen = phase * phase * (3 - 2 * phase);
  if (resting) wingOpen = 0.28 + wingOpen * 0.56;

  const heading = bird.heading;

  ctx.save();
  ctx.translate(bird.bx, bird.by);
  ctx.rotate(heading);
  ctx.fillStyle = INK;
  ctx.globalAlpha = alpha;

  // Wings
  const tipX = -s * (0.82 + 0.34 * (1 - wingOpen));
  const tipY = s * (0.48 + 0.94 * wingOpen);
  const elbowX = -s * (0.24 + 0.22 * (1 - wingOpen));
  const elbowY = tipY * 0.58;

  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(s * 0.36, side * s * 0.1);
    ctx.quadraticCurveTo(elbowX, side * elbowY, tipX, side * tipY);
    ctx.quadraticCurveTo(
      -s * (0.5 + 0.18 * (1 - wingOpen)),
      side * tipY * 0.42,
      -s * 0.36,
      side * s * 0.2,
    );
    ctx.closePath();
    ctx.fill();
  }

  // Body (teardrop)
  ctx.beginPath();
  ctx.moveTo(s * 1.08, -s * 0.05);
  ctx.quadraticCurveTo(s * 0.93, -s * 0.31, s * 0.44, -s * 0.27);
  ctx.quadraticCurveTo(-s * 0.48, -s * 0.22, -s * 0.94, -s * 0.02);
  ctx.quadraticCurveTo(-s * 0.48, s * 0.23, s * 0.4, s * 0.2);
  ctx.quadraticCurveTo(s * 0.9, s * 0.14, s * 1.08, -s * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
