import { createRng } from './math';
import { STAFF_X0, STAFF_X1, STAFF_YS, FINGERS, INTRO_GAP } from './config';
import type { NoteData } from './types';

const SCALE_AEOLIAN = [0, 2, 3, 5, 7, 8, 10];

export function generateScore(seed: number): NoteData[] {
  const random = createRng(seed);
  const notes: NoteData[] = [];
  let k = 0;

  for (let s = 0; s < 5; s++) {
    const n = 11 + Math.floor(random(3));
    const row: Array<[number, number]> = [];
    let step = Math.floor(random(-2, 3));
    let beam = 0, left = 0;

    for (let i = 0; i < n; i++) {
      if (left === 0 && random() < 0.6 && i + 2 < n) {
        beam++;
        left = 2 + Math.floor(random(3));
      }
      const b = left > 0 ? beam : 0;
      if (left > 0) left--;
      row.push([step, b]);
      step += Math.floor(random(-2, 3));
      step = Math.max(-4, Math.min(4, step));
    }
    row[n - 1][1] = 0;

    let gaps = 0;
    for (let i = 1; i < n; i++) if (row[i][1] !== row[i - 1][1]) gaps++;
    const L = STAFF_X0 + 30;
    const R = STAFF_X1 - 26;
    const stepX = ((R - L) - gaps * 12) / (n - 1);
    let x = L;

    for (let i = 0; i < n; i++) {
      const [noteStep, noteBeam] = row[i];
      notes.push({
        staff: s,
        x,
        step: noteStep,
        beam: noteBeam,
        finger: k % FINGERS.length,
        seed: random(1000),
        birdSeed: random(1000),
        threshold: 0.42 + random(0.2),
        stemDown: noteStep >= 0,
        popT: 1.8 + k * INTRO_GAP,
      });
      k++;
      if (i + 1 < n) {
        x += stepX;
        if (row[i + 1][1] !== row[i][1]) x += 12;
      }
    }
  }

  // Unify stem direction within beam groups
  for (const n of notes) {
    if (!n.beam) continue;
    let extreme = n;
    for (const m of notes) {
      if (m.staff === n.staff && m.beam === n.beam && Math.abs(m.step) > Math.abs(extreme.step)) {
        extreme = m;
      }
    }
    n.stemDown = extreme.step > 0;
  }

  return notes;
}

export function getNoteY(note: NoteData): number {
  return STAFF_YS[note.staff] + 18 - note.step * (9 / 2);
}
