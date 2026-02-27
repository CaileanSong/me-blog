'use client';

import { useEffect, useRef } from 'react';

type CodeEntity = {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  life: number;
  maxLife: number;
  size: number;
  width: number;
};

type FeedbackEntity = {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  kind: 'score' | 'combo';
};

const CODE_SNIPPETS = [
  'const x = await fetchData()',
  'useEffect(() => {}, [])',
  'if (isDark) setTheme("dark")',
  'return <main>{children}</main>',
  'export default function Page()',
  'type User = { id: string }',
  'npm run build',
  'git commit -m "feat"',
  'for (const item of list) {}',
  'console.log("hello world")',
  'SELECT * FROM posts LIMIT 10;',
  'pnpm add tailwindcss',
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function CodeSliceBackground({ darkMode }: { darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const entitiesRef = useRef<CodeEntity[]>([]);
  const feedbacksRef = useRef<FeedbackEntity[]>([]);
  const animationRef = useRef<number>(0);
  const idRef = useRef(0);
  const spawnAtRef = useRef(0);
  const comboRef = useRef({
    count: 0,
    lastHitAt: 0,
    flash: 0,
  });
  const mouseRef = useRef({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    lastTs: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.textBaseline = 'middle';
    };

    const spawnCode = (mouseX: number, mouseY: number, ts: number) => {
      if (ts - spawnAtRef.current < 2000) return;
      if (entitiesRef.current.length > 34) return;
      spawnAtRef.current = ts;

      const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      const size = randomBetween(13, 17);
      context.font = `600 ${size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      const width = context.measureText(snippet).width;

      const startX = Math.max(
        width / 2 + 8,
        Math.min(window.innerWidth - width / 2 - 8, mouseX + randomBetween(-130, 130)),
      );

      const entity: CodeEntity = {
        id: idRef.current++,
        text: snippet,
        x: startX,
        y: window.innerHeight + randomBetween(20, 44),
        vx: randomBetween(-0.8, 0.8),
        vy: -8.2,
        gravity: randomBetween(0.065, 0.095),
        life: randomBetween(190, 260),
        maxLife: 260,
        size,
        width,
      };

      const desiredPeakY = Math.max(52, Math.min(window.innerHeight - 80, mouseY + randomBetween(-48, 24)));
      const travel = Math.max(120, entity.y - desiredPeakY);
      entity.vy = -Math.sqrt(2 * entity.gravity * travel);

      entitiesRef.current.push(entity);
      if (entitiesRef.current.length > 42) {
        entitiesRef.current.splice(0, entitiesRef.current.length - 42);
      }
    };

    const splitEntity = (entity: CodeEntity, swipeDx: number, swipeDy: number, swipeSpeed: number) => {
      const pivot = Math.max(1, Math.floor(entity.text.length / 2));
      const leftText = entity.text.slice(0, pivot);
      const rightText = entity.text.slice(pivot);
      if (!leftText || !rightText) return;

      const size = entity.size;
      context.font = `600 ${size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

      const leftWidth = context.measureText(leftText).width;
      const rightWidth = context.measureText(rightText).width;
      const speedBoost = Math.min(1.7, swipeSpeed * 0.04);
      const distance = Math.hypot(swipeDx, swipeDy) || 1;
      const directionX = swipeDx / distance;
      const directionY = swipeDy / distance;
      const normalX = -directionY;
      const normalY = directionX;
      const splitPush = randomBetween(1.3, 2.1) + speedBoost;

      const leftEntity: CodeEntity = {
        ...entity,
        id: idRef.current++,
        text: leftText,
        x: entity.x - rightWidth * 0.22,
        vx: entity.vx + normalX * splitPush - directionX * 0.45,
        vy: entity.vy * 0.25 + normalY * splitPush * 0.35 - randomBetween(0.7, 1.2),
        gravity: randomBetween(0.12, 0.18),
        life: randomBetween(110, 170),
        maxLife: 170,
        width: leftWidth,
      };

      const rightEntity: CodeEntity = {
        ...entity,
        id: idRef.current++,
        text: rightText,
        x: entity.x + leftWidth * 0.22,
        vx: entity.vx - normalX * splitPush + directionX * 0.45,
        vy: entity.vy * 0.25 - normalY * splitPush * 0.35 - randomBetween(0.7, 1.2),
        gravity: randomBetween(0.12, 0.18),
        life: randomBetween(110, 170),
        maxLife: 170,
        width: rightWidth,
      };

      entitiesRef.current = entitiesRef.current
        .filter((item) => item.id !== entity.id)
        .concat(leftEntity, rightEntity);
    };

    const registerHitEffect = (x: number, y: number, ts: number) => {
      const inComboWindow = ts - comboRef.current.lastHitAt <= 650;
      comboRef.current.count = inComboWindow ? comboRef.current.count + 1 : 1;
      comboRef.current.lastHitAt = ts;
      comboRef.current.flash = Math.min(0.9, 0.26 + comboRef.current.count * 0.12);

      const score = 8 + comboRef.current.count * 2;
      feedbacksRef.current.push({
        id: idRef.current++,
        text: `+${score}`,
        x: x + randomBetween(-8, 8),
        y: y - randomBetween(8, 18),
        vx: randomBetween(-0.3, 0.3),
        vy: randomBetween(-1.5, -0.9),
        life: 58,
        maxLife: 58,
        size: 13,
        kind: 'score',
      });

      if (comboRef.current.count >= 2) {
        feedbacksRef.current.push({
          id: idRef.current++,
          text: `x${comboRef.current.count} COMBO`,
          x: x + randomBetween(-12, 12),
          y: y - randomBetween(24, 34),
          vx: randomBetween(-0.2, 0.2),
          vy: randomBetween(-1.9, -1.2),
          life: 72,
          maxLife: 72,
          size: 15,
          kind: 'combo',
        });
      }

      if (feedbacksRef.current.length > 28) {
        feedbacksRef.current.splice(0, feedbacksRef.current.length - 28);
      }
    };

    const segmentIntersectsEntity = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      entity: CodeEntity,
    ) => {
      const halfWidth = entity.width / 2 + 10;
      const halfHeight = entity.size + 8;
      const left = entity.x - halfWidth;
      const right = entity.x + halfWidth;
      const top = entity.y - halfHeight;
      const bottom = entity.y + halfHeight;

      if (
        (x1 >= left && x1 <= right && y1 >= top && y1 <= bottom) ||
        (x2 >= left && x2 <= right && y2 >= top && y2 <= bottom)
      ) {
        return true;
      }

      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      if (maxX < left || minX > right || maxY < top || minY > bottom) {
        return false;
      }

      const edgeIntersects = (
        ax: number,
        ay: number,
        bx: number,
        by: number,
        cx: number,
        cy: number,
        dx: number,
        dy: number,
      ) => {
        const denominator = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
        if (Math.abs(denominator) < 0.00001) return false;
        const r = ((ay - cy) * (dx - cx) - (ax - cx) * (dy - cy)) / denominator;
        const s = ((ay - cy) * (bx - ax) - (ax - cx) * (by - ay)) / denominator;
        return r >= 0 && r <= 1 && s >= 0 && s <= 1;
      };

      return (
        edgeIntersects(x1, y1, x2, y2, left, top, right, top) ||
        edgeIntersects(x1, y1, x2, y2, right, top, right, bottom) ||
        edgeIntersects(x1, y1, x2, y2, right, bottom, left, bottom) ||
        edgeIntersects(x1, y1, x2, y2, left, bottom, left, top)
      );
    };

    const handleMouseMove = (event: MouseEvent) => {
      const now = performance.now();
      const prevX = mouseRef.current.lastX;
      const prevY = mouseRef.current.lastY;
      const dx = event.clientX - mouseRef.current.lastX;
      const dy = event.clientY - mouseRef.current.lastY;
      const dt = Math.max(8, now - mouseRef.current.lastTs || 16);
      const distance = Math.hypot(dx, dy);
      const speed = distance / dt;

      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      mouseRef.current.lastX = event.clientX;
      mouseRef.current.lastY = event.clientY;
      mouseRef.current.lastTs = now;

      spawnCode(event.clientX, event.clientY, now);

      if (distance > 20 && speed > 0.85) {
        const hit = entitiesRef.current.find((entity) => {
          return segmentIntersectsEntity(prevX, prevY, event.clientX, event.clientY, entity);
        });

        if (hit) {
          splitEntity(hit, dx, dy, speed);
          registerHitEffect(event.clientX, event.clientY, now);
        }
      }
    };

    const tick = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      comboRef.current.flash = Math.max(0, comboRef.current.flash * 0.9 - 0.015);
      if (comboRef.current.flash > 0.01) {
        const glowColor = darkMode ? '45, 212, 191' : '148, 163, 184';
        const flashAlpha = comboRef.current.flash * (darkMode ? 0.18 : 0.13);
        const gradient = context.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          180,
        );
        gradient.addColorStop(0, `rgba(${glowColor}, ${flashAlpha})`);
        gradient.addColorStop(1, `rgba(${glowColor}, 0)`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }

      entitiesRef.current = entitiesRef.current.filter((entity) => {
        entity.x += entity.vx;
        entity.y += entity.vy;
        entity.vy += entity.gravity;
        entity.life -= 1;

        const lifeAlpha = Math.max(0, Math.min(1, entity.life / entity.maxLife));
        if (lifeAlpha <= 0) return false;
        if (entity.y > window.innerHeight + 60) return false;
        if (entity.x < -entity.width - 80 || entity.x > window.innerWidth + entity.width + 80) return false;

        const color = darkMode ? '153, 246, 228' : '71, 85, 105';
        context.font = `600 ${entity.size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
        context.fillStyle = `rgba(${color}, ${0.26 + lifeAlpha * 0.52})`;
        context.shadowColor = darkMode ? 'rgba(45, 212, 191, 0.35)' : 'rgba(148, 163, 184, 0.35)';
        context.shadowBlur = 8;
        context.fillText(entity.text, entity.x - entity.width / 2, entity.y);
        context.shadowBlur = 0;
        return true;
      });

      feedbacksRef.current = feedbacksRef.current.filter((feedback) => {
        feedback.x += feedback.vx;
        feedback.y += feedback.vy;
        feedback.vy += 0.02;
        feedback.life -= 1;

        const lifeAlpha = Math.max(0, Math.min(1, feedback.life / feedback.maxLife));
        if (lifeAlpha <= 0) return false;

        const color = feedback.kind === 'combo'
          ? (darkMode ? '45, 212, 191' : '15, 23, 42')
          : (darkMode ? '153, 246, 228' : '30, 41, 59');
        const shadow = feedback.kind === 'combo'
          ? (darkMode ? 'rgba(45, 212, 191, 0.5)' : 'rgba(15, 23, 42, 0.25)')
          : (darkMode ? 'rgba(45, 212, 191, 0.25)' : 'rgba(100, 116, 139, 0.25)');

        context.font = `700 ${feedback.size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
        context.fillStyle = `rgba(${color}, ${0.2 + lifeAlpha * 0.9})`;
        context.shadowColor = shadow;
        context.shadowBlur = feedback.kind === 'combo' ? 12 : 6;
        context.fillText(feedback.text, feedback.x, feedback.y);
        context.shadowBlur = 0;

        return true;
      });

      animationRef.current = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.cancelAnimationFrame(animationRef.current);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
