'use client';

import { useRef, useEffect } from 'react';
import { W, H } from './config';
import { generateScore } from './generators';
import { createInputState, attachInput, updateInput, applyAutoWaypoints } from './input';
import { createBirdState, updateSimulation } from './simulation';
import { drawStaves } from './renderers/staff';
import { drawNotes } from './renderers/notes';
import { drawBirds } from './renderers/birds';
import { drawStrings } from './renderers/strings';
import { drawHand } from './renderers/hand';
import { drawTitle } from './renderers/title';
import type { NoteData, BirdState, InputState } from './types';

export function StaffCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Load hand image
    const handImg = new Image();
    handImg.src = '/hand.png';

    // Generate score
    const notes: NoteData[] = generateScore(20240717);
    const birds: BirdState[] = notes.map(() => createBirdState());

    // Input
    const input: InputState = createInputState();
    const detach = attachInput(canvas, input);

    let startTime = performance.now() / 1000;
    let lastTime = startTime;
    let lastInteractionT = 0;
    let rafId: number;

    function frame() {
      if (!ctx) return;
      const now = performance.now() / 1000;
      const t = now - startTime;
      const dt = Math.min(now - lastTime, 0.05);
      lastTime = now;

      // Track interaction for auto-demo
      if (input.active) lastInteractionT = t;

      // Auto waypoints if idle for 5s
      if (t - lastInteractionT > 5) {
        applyAutoWaypoints(input, t);
      }

      updateInput(input, dt, t);
      updateSimulation(notes, birds, input, dt, t);

      // Render
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = `rgb(${234}, ${228}, ${211})`;
      ctx.fillRect(0, 0, W, H);

      drawTitle(ctx, t, input);
      drawStaves(ctx, t, input);
      drawStrings(ctx, notes, birds, t, input);
      drawNotes(ctx, notes, birds, t, input);
      drawHand(ctx, handImg, t, input);
      drawBirds(ctx, notes, birds, t);

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      detach();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: W, height: H, maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
    />
  );
}
