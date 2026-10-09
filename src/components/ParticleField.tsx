"use client";

import { useEffect, useRef } from "react";

const COUNT = 1400;

/**
 * A slowly rotating sphere of dots drawn on a canvas. It leans toward the pointer,
 * pauses when off-screen, and renders a single still frame for reduced-motion users.
 */
export function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Points spread evenly over a sphere (Fibonacci lattice), with slight jitter for texture.
    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = Array.from({ length: COUNT }, (_, i) => {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const jitter = 1 + (Math.random() - 0.5) * 0.12;
      return { x: Math.cos(theta) * r * jitter, y: y * jitter, z: Math.sin(theta) * r * jitter };
    });

    let color = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "#fff";
    const themeObserver = new MutationObserver(() => {
      color = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();
      if (reduced) draw(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    resizeObserver.observe(canvas);

    // Pointer tilt, eased toward its target each frame.
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      tilt.tx = (e.clientY / window.innerHeight - 0.5) * 0.6;
      tilt.ty = (e.clientX / window.innerWidth - 0.5) * 0.6;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = color;
      const radius = Math.min(width, height) * 0.42;
      const cx = width / 2;
      const cy = height / 2;
      tilt.x += (tilt.tx - tilt.x) * 0.05;
      tilt.y += (tilt.ty - tilt.y) * 0.05;
      const ay = t * 0.00012 + tilt.y;
      const ax = 0.35 + tilt.x;
      const [sy, cyR, sx, cxR] = [Math.sin(ay), Math.cos(ay), Math.sin(ax), Math.cos(ax)];
      // A gentle breathing wobble so the surface feels alive.
      const wobble = 0.04 * Math.sin(t * 0.0008);

      for (const p of points) {
        const x1 = p.x * cyR - p.z * sy;
        const z1 = p.x * sy + p.z * cyR;
        const y2 = p.y * cxR - z1 * sx;
        const z2 = p.y * sx + z1 * cxR;
        const scale = 1 + wobble * Math.sin(p.y * 6 + t * 0.001);
        const depth = (z2 + 1) / 2; // 0 = back, 1 = front
        ctx!.globalAlpha = 0.08 + depth * 0.75;
        const size = 0.6 + depth * 1.3;
        ctx!.fillRect(cx + x1 * radius * scale, cy + y2 * radius * scale, size, size);
      }
      ctx!.globalAlpha = 1;
    }

    let frame = 0;
    let visible = true;
    const loop = (t: number) => {
      if (visible) draw(t);
      frame = requestAnimationFrame(loop);
    };
    const visibility = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    visibility.observe(canvas);

    if (reduced) draw(0);
    else frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      visibility.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
