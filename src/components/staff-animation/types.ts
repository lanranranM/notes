export interface NoteData {
  staff: number;
  x: number;
  step: number;
  beam: number;
  finger: number;
  seed: number;
  birdSeed: number;
  threshold: number;
  stemDown: boolean;
  popT: number;
}

export interface BirdState {
  state: 'note' | 'scared' | 'return';
  vis: number;
  bx: number;
  by: number;
  bvx: number;
  bvy: number;
  heading: number;
  wingBias: number;
  bScale: number;
  calmT: number;
  repopT: number;
  returnPath: BezierPath | null;
  returnStart: number;
  returnDuration: number;
}

export interface InputState {
  x: number;
  y: number;
  speed: number;
  D: number;
  active: boolean;
}

export interface BezierPath {
  points: Array<{ x: number; y: number }>;
  length: number;
  sample(progress: number): { x: number; y: number; tx: number; ty: number };
}
