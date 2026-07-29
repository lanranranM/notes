import { W, H, WAYPOINTS } from './config';
import { clamp01, ramp, mix } from './math';
import type { InputState } from './types';

export function createInputState(): InputState {
  return { x: W / 2, y: H + 100, speed: 0, D: 0, active: false };
}

export function attachInput(
  canvas: HTMLCanvasElement,
  state: InputState,
): () => void {
  let prevX = state.x;
  let prevY = state.y;
  let lastMoveT = 0;

  function onMove(e: MouseEvent | TouchEvent) {
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    state.x = (clientX - rect.left) * W / rect.width;
    state.y = (clientY - rect.top) * H / rect.height;
    state.active = true;
    lastMoveT = performance.now();
  }

  function onLeave() {
    state.active = false;
  }

  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('touchmove', onMove, { passive: true });
  canvas.addEventListener('mouseleave', onLeave);
  canvas.addEventListener('touchend', onLeave);

  return () => {
    canvas.removeEventListener('mousemove', onMove);
    canvas.removeEventListener('touchmove', onMove);
    canvas.removeEventListener('mouseleave', onLeave);
    canvas.removeEventListener('touchend', onLeave);
  };
}

export function updateInput(state: InputState, dt: number, t: number): void {
  const dx = state.x - (state as any)._px || 0;
  const dy = state.y - (state as any)._py || 0;
  const instantSpeed = Math.hypot(dx, dy) / Math.max(dt, 1 / 120);

  state.speed = mix(state.speed, instantSpeed, 1 - Math.exp(-8 * dt));

  const targetD = clamp01(state.speed / 500);
  if (state.active) {
    state.D = mix(state.D, targetD, 1 - Math.exp(-6 * dt));
  } else {
    state.D *= Math.pow(0.92, dt * 60);
  }

  (state as any)._px = state.x;
  (state as any)._py = state.y;
}

export function applyAutoWaypoints(state: InputState, t: number): void {
  if (state.active) return;

  const wps = WAYPOINTS;
  if (t < wps[0][0] || t > wps[wps.length - 1][0]) return;

  let lo = 0;
  for (let i = 0; i < wps.length - 1; i++) {
    if (wps[i][0] <= t && t < wps[i + 1][0]) { lo = i; break; }
  }
  const [t0, x0, y0] = wps[lo];
  const [t1, x1, y1] = wps[lo + 1];
  const p = ramp(t0, t1, t);
  state.x = mix(x0, x1, p);
  state.y = mix(y0, y1, p);
  state.active = true;
}
