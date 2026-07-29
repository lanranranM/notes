import { HAND_X, HAND_Y, HAND_W, HAND_H, H } from '../config';
import { handBobY, handRot } from './strings';
import type { InputState } from '../types';

export function drawHand(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  t: number,
  input: InputState,
): void {
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const D = input.D;
  const bob = handBobY(t, D);
  const rot = handRot(t, D);
  const pivotX = HAND_X + 150;
  const pivotY = H;

  ctx.save();
  ctx.translate(pivotX, pivotY);
  ctx.rotate(rot);
  ctx.translate(-pivotX, -pivotY);
  ctx.globalAlpha = 0.85;
  ctx.drawImage(img, HAND_X, HAND_Y + bob, HAND_W, HAND_H);
  ctx.globalAlpha = 1;
  ctx.restore();
}
