import { INK } from '../config';
import { ramp } from '../math';
import { noteBaseY } from '../simulation';
import type { NoteData, BirdState, InputState } from '../types';

export function drawNotes(
  ctx: CanvasRenderingContext2D,
  notes: NoteData[],
  birds: BirdState[],
  t: number,
  input: InputState,
): void {
  ctx.save();

  for (let i = 0; i < notes.length; i++) {
    const n = notes[i];
    const b = birds[i];
    if (b.vis <= 0.01) continue;

    const repop = b.repopT > 0 ? ramp(b.repopT, b.repopT + 0.2, t) : 1;
    const popIn = ramp(n.popT, n.popT + 0.22, t);
    const sc = 0.6 + 0.4 * Math.min(popIn, repop);
    const x = n.x;
    const y = noteBaseY(n, input, t);

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    ctx.globalAlpha = b.vis;

    // Note head
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.save();
    ctx.rotate(-0.32);
    ctx.ellipse(0, 0, 4.75, 3.4, 0, 0, Math.PI * 2);
    ctx.restore();
    ctx.fill();

    // Stem
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.4;
    const sx = n.stemDown ? -4.2 : 4.2;
    const sy2 = n.stemDown ? 26 : -26;
    ctx.beginPath();
    ctx.moveTo(sx, n.stemDown ? 2 : -2);
    ctx.lineTo(sx, sy2);
    ctx.stroke();

    // Beam
    let beamed = false;
    if (n.beam) {
      let best: NoteData | null = null;
      let bd = 1e9;
      for (let j = 0; j < notes.length; j++) {
        const m = notes[j];
        if (m === n || m.staff !== n.staff || m.beam !== n.beam || m.x <= n.x) continue;
        if (m.x - n.x < bd) { bd = m.x - n.x; best = m; }
      }
      if (best && birds[notes.indexOf(best)].vis > 0.5) {
        const byy = noteBaseY(best, input, t);
        const dy = Math.max(-14, Math.min(14, byy - y));
        ctx.fillStyle = INK;
        ctx.beginPath();
        if (n.stemDown) {
          ctx.moveTo(sx, 22);
          ctx.lineTo(bd + sx, dy + 22);
          ctx.lineTo(bd + sx, dy + 26);
          ctx.lineTo(sx, 26);
        } else {
          ctx.moveTo(sx, -26);
          ctx.lineTo(bd + sx, dy - 26);
          ctx.lineTo(bd + sx, dy - 22);
          ctx.lineTo(sx, -22);
        }
        ctx.closePath();
        ctx.fill();
        beamed = true;
      }
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  ctx.restore();
}
