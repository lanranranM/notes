import { STAFF_X0, STAFF_X1, STAFF_YS, LINE_GAP, INK } from '../config';
import { ramp } from '../math';
import { staffDy } from '../simulation';
import type { InputState } from '../types';

export function drawStaves(ctx: CanvasRenderingContext2D, t: number, input: InputState): void {
  ctx.save();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.3;

  for (let s = 0; s < 5; s++) {
    const reveal = ramp(0.08 + s * 0.07, 0.62 + s * 0.07, t);
    if (reveal <= 0) continue;
    const xEnd = STAFF_X0 + (STAFF_X1 - STAFF_X0) * reveal;
    const y0 = STAFF_YS[s];

    for (let k = 0; k < 5; k++) {
      ctx.beginPath();
      for (let x = STAFF_X0; x <= xEnd; x += 7) {
        const y = y0 + k * LINE_GAP + staffDy(x, y0 + k * LINE_GAP, input, t);
        if (x === STAFF_X0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const yEnd = y0 + k * LINE_GAP + staffDy(xEnd, y0 + k * LINE_GAP, input, t);
      ctx.lineTo(xEnd, yEnd);
      ctx.stroke();
    }

    // Bar line at start
    ctx.lineWidth = 3;
    ctx.beginPath();
    const topY = y0 - 1 + staffDy(STAFF_X0, y0, input, t);
    const botY = y0 + 4 * LINE_GAP + 1 + staffDy(STAFF_X0, y0 + 4 * LINE_GAP, input, t);
    ctx.moveTo(STAFF_X0, topY);
    ctx.lineTo(STAFF_X0, botY);
    ctx.stroke();
    ctx.lineWidth = 1.3;
  }

  ctx.restore();
}
