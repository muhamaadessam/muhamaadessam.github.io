'use client';

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'framer-motion';
import { pointerPosition } from '@/lib/motion';
import type { ReactNode } from 'react';

export default function TiltSurface({ children, style, className = '', ...props }: Omit<HTMLMotionProps<'div'>, 'children'> & { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 22 });
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(50);
  const light = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(144,202,249,0.18), transparent 60%)`;

  return (
    <motion.div
      {...props}
      className={`tilt-surface ${className}`}
      style={{ ...style, transformPerspective: 1200, rotateX: reducedMotion ? 0 : rotateX, rotateY: reducedMotion ? 0 : rotateY }}
      onPointerMove={(event) => {
        if (reducedMotion || event.pointerType !== 'mouse') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const px = pointerPosition(event.clientX - bounds.left, bounds.width);
        const py = pointerPosition(event.clientY - bounds.top, bounds.height);
        x.set(-py * 7);
        y.set(px * 7);
        lightX.set((px + 1) * 50);
        lightY.set((py + 1) * 50);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
      onPointerCancel={() => { x.set(0); y.set(0); }}
    >
      {children}
      <motion.div aria-hidden="true" className="surface-light" style={{ background: light }} />
    </motion.div>
  );
}
