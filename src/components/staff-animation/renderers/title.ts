import { W, TITLE_Y, SUB_Y } from '../config';
import { ramp } from '../math';
import type { InputState } from '../types';

export function drawTitle(ctx: CanvasRenderingContext2D, t: number, input: InputState): void {
  const D = input.D;
  const word = 'Perform Your Life';
  const tracking = 6;

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 46px "Courier New", Courier, monospace';

  // Measure total width
  let total = 0;
  for (const ch of word) total += ctx.measureText(ch).width + tracking;
  total -= tracking;

  let x = (W - total) / 2;
  for (let i = 0; i < word.length; i++) {
    const appear = ramp(0.12 + i * 0.07, 0.30 + i * 0.07, t);
    const charW = ctx.measureText(word[i]).width;
    if (appear <= 0) { x += charW + tracking; continue; }

    const jy = D * 1.8 * Math.sin(t * 7 + i * 1.7);
    ctx.save();
    ctx.translate(x + charW / 2, TITLE_Y + jy);
    ctx.fillStyle = `rgba(26, 23, 18, ${appear})`;
    ctx.textAlign = 'center';
    ctx.fillText(word[i], 0, 0);
    ctx.restore();
    x += charW + tracking;
  }

  // Subtitle
  const ap2 = ramp(0.75, 1.05, t);
  if (ap2 > 0) {
    ctx.font = '15px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(26, 23, 18, ${0.88 * ap2})`;
    ctx.fillText('can we really control our life?', W / 2, SUB_Y);
  }

  ctx.restore();
}
