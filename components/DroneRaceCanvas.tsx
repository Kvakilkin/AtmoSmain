'use client';

import React, { useEffect, useRef } from 'react';

interface DroneState {
  x: number;
  y: number;
  roll: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
  color: string;
  trailColor: string;
  propAngle: number;
}

interface SideGate {
  id: string;
  side: 'left' | 'right';
  scrollPos: number; // 0.0 to 1.0
  color: string;
}

// Smooth cubic ease in-out
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const DroneRaceCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let isMobile = width < 768;
    let maxTrailLength = isMobile ? 12 : 22;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      isMobile = width < 768;
      maxTrailLength = isMobile ? 12 : 22;
    };

    window.addEventListener('resize', handleResize);

    // Target scroll tracking
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
      targetScrollProgress = progress;

      const deltaY = window.scrollY - lastScrollY;
      scrollVelocity = deltaY * 0.05;
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Side offsets: keep flight strictly on the side borders
    const rightSideX = () => width - (isMobile ? 36 : 72);
    const leftSideX = () => (isMobile ? 36 : 72);

    // EXACTLY 2 RACING GATES FOR MAXIMUM SMOOTHNESS AND BEAUTY
    // Gate 1: on Left at scroll 0.35 (Experience section)
    // Gate 2: on Right at scroll 0.65 (Safety section)
    const sideGates: SideGate[] = [
      { id: 'gate-1-left', side: 'left', scrollPos: 0.35, color: '#FF5500' },
      { id: 'gate-2-right', side: 'right', scrollPos: 0.65, color: '#00E5FF' },
    ];

    // Gate screen dimensions (drone sized)
    const gateW = isMobile ? 56 : 68;
    const gateH = isMobile ? 54 : 64;

    // Helper: calculate gate screen position
    const getGatePosition = (gate: SideGate, p: number) => {
      const gateX = gate.side === 'left' ? leftSideX() : rightSideX();
      // As user scrolls, gate moves smoothly up the screen
      const gateY = height * 0.42 + (gate.scrollPos - p) * height * 1.8;
      return { x: gateX, y: gateY };
    };

    // Helper: calculate Start Pad position (scrolls off top naturally)
    const getStartPadPos = (padIndex: 1 | 2, p: number) => {
      const x = rightSideX();
      const baseY = padIndex === 1 ? height * 0.22 : height * 0.35;
      const y = baseY - p * height * 2.5;
      return { x, y };
    };

    // Helper: calculate Finish Pad position (scrolls up into place near calendar/booking)
    const getFinishPadPos = (padIndex: 1 | 2, p: number) => {
      const x = rightSideX();
      const targetY = padIndex === 1 ? height * 0.52 : height * 0.65;
      const y = targetY + (1.0 - p) * height * 2.0;
      return { x, y };
    };

    // Unified spline flight trajectory for a given progress [0..1] and specific drone
    const getFlightTrack = (droneIdx: 1 | 2, s: number, time: number) => {
      const rX = rightSideX();
      const lX = leftSideX();

      // Gate positions at their arrival moment
      const g1Pos = getGatePosition(sideGates[0], currentScrollProgress);
      const g2Pos = getGatePosition(sideGates[1], currentScrollProgress);

      const curStart = getStartPadPos(droneIdx, currentScrollProgress);
      const curFinish = getFinishPadPos(droneIdx, currentScrollProgress);

      let x = curStart.x;
      let y = curStart.y;
      let roll = 0;

      if (s <= 0.08) {
        // 1. Parked on Start Pad
        x = curStart.x;
        y = curStart.y;
        roll = Math.sin(time * 0.003 + (droneIdx === 1 ? 0 : 1.5)) * 0.02;
      } else if (s > 0.08 && s <= 0.35) {
        // 2. Liftoff and fly toward Gate 1 (Left flank)
        const t = (s - 0.08) / (0.35 - 0.08);
        const ease = easeInOutCubic(t);
        // Approaches and flies directly through Gate 1 center
        x = curStart.x + (lX - curStart.x) * ease;
        y = curStart.y + (g1Pos.y - curStart.y) * ease;
        roll = -Math.sin(t * Math.PI) * 0.35; // banks left
      } else if (s > 0.35 && s <= 0.65) {
        // 3. Across from Gate 1 (Left) to Gate 2 (Right)
        const t = (s - 0.35) / (0.65 - 0.35);
        const ease = easeInOutCubic(t);
        x = lX + (rX - lX) * ease;
        y = g1Pos.y + (g2Pos.y - g1Pos.y) * ease;
        roll = Math.sin(t * Math.PI) * 0.35; // banks right
      } else if (s > 0.65 && s <= 0.90) {
        // 4. Down from Gate 2 toward Finish Pad (Right)
        const t = (s - 0.65) / (0.90 - 0.65);
        const ease = easeInOutCubic(t);
        x = rX;
        y = g2Pos.y + (curFinish.y - g2Pos.y) * ease;
        roll = -Math.sin(t * Math.PI) * 0.15;
      } else {
        // 5. Landed on Finish Pad!
        x = curFinish.x;
        y = curFinish.y;
        roll = Math.sin(time * 0.003 + (droneIdx === 1 ? 0 : 1.5)) * 0.02;
      }

      // Add gentle sine hover during active flight
      const isHovering = s <= 0.04 || s >= 0.94;
      const hoverAmp = isHovering ? 1.5 : 3.0;
      const hover = Math.sin(time * 0.0035 + (droneIdx === 1 ? 0 : 2) + s * 4) * hoverAmp;

      return { x, y: y + hover, roll };
    };

    const drone1: DroneState = {
      x: rightSideX(),
      y: height * 0.22,
      roll: 0,
      trail: [],
      color: '#FF5500',
      trailColor: 'rgba(255, 85, 0, ',
      propAngle: 0,
    };

    const drone2: DroneState = {
      x: rightSideX(),
      y: height * 0.35,
      roll: 0,
      trail: [],
      color: '#00E5FF',
      trailColor: 'rgba(0, 229, 255, ',
      propAngle: 0,
    };

    // Draw high-tech Start and Finish landing pads on the right flank
    const drawPads = (p: number) => {
      const padSize = isMobile ? 36 : 46;

      // --- START PADS ---
      if (p < 0.25) {
        const alpha = Math.max(0, Math.min(1, 1 - p * 4.5));
        const p1 = getStartPadPos(1, p);
        const p2 = getStartPadPos(2, p);

        ctx.save();
        ctx.globalAlpha = alpha;

        // Start Pad 1 (Orange)
        if (p1.y > -50 && p1.y < height + 50) {
          ctx.strokeStyle = '#FF5500';
          ctx.lineWidth = 1.5;
          ctx.fillStyle = 'rgba(255, 85, 0, 0.08)';
          ctx.shadowColor = '#FF5500';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(p1.x - padSize / 2, p1.y - padSize / 2, padSize, padSize, 6);
          ctx.fill();
          ctx.stroke();

          // Corner brackets
          const b = 6;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p1.x - padSize / 2, p1.y - padSize / 2 + b);
          ctx.lineTo(p1.x - padSize / 2, p1.y - padSize / 2);
          ctx.lineTo(p1.x - padSize / 2 + b, p1.y - padSize / 2);

          ctx.moveTo(p1.x + padSize / 2 - b, p1.y - padSize / 2);
          ctx.lineTo(p1.x + padSize / 2, p1.y - padSize / 2);
          ctx.lineTo(p1.x + padSize / 2, p1.y - padSize / 2 + b);
          ctx.stroke();
        }

        // Start Pad 2 (Cyan)
        if (p2.y > -50 && p2.y < height + 50) {
          ctx.strokeStyle = '#00E5FF';
          ctx.lineWidth = 1.5;
          ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
          ctx.shadowColor = '#00E5FF';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(p2.x - padSize / 2, p2.y - padSize / 2, padSize, padSize, 6);
          ctx.fill();
          ctx.stroke();

          // Corner brackets
          const b = 6;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p2.x - padSize / 2, p2.y - padSize / 2 + b);
          ctx.lineTo(p2.x - padSize / 2, p2.y - padSize / 2);
          ctx.lineTo(p2.x - padSize / 2 + b, p2.y - padSize / 2);

          ctx.moveTo(p2.x + padSize / 2 - b, p2.y - padSize / 2);
          ctx.lineTo(p2.x + padSize / 2, p2.y - padSize / 2);
          ctx.lineTo(p2.x + padSize / 2, p2.y - padSize / 2 + b);
          ctx.stroke();
        }

        ctx.restore();
      }

      // --- FINISH PADS ---
      if (p > 0.65) {
        const alpha = Math.max(0, Math.min(1, (p - 0.65) * 3.5));
        const f1 = getFinishPadPos(1, p);
        const f2 = getFinishPadPos(2, p);

        ctx.save();
        ctx.globalAlpha = alpha;

        // Finish Pad 1 (Orange)
        if (f1.y > -50 && f1.y < height + 50) {
          ctx.strokeStyle = '#FF5500';
          ctx.lineWidth = 1.5;
          ctx.fillStyle = 'rgba(255, 85, 0, 0.1)';
          ctx.shadowColor = '#FF5500';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.roundRect(f1.x - padSize / 2, f1.y - padSize / 2, padSize, padSize, 6);
          ctx.fill();
          ctx.stroke();

          // Checkered landing mark
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          const half = padSize / 4;
          ctx.fillRect(f1.x - half, f1.y - half, half, half);
          ctx.fillRect(f1.x, f1.y, half, half);
        }

        // Finish Pad 2 (Cyan)
        if (f2.y > -50 && f2.y < height + 50) {
          ctx.strokeStyle = '#00E5FF';
          ctx.lineWidth = 1.5;
          ctx.fillStyle = 'rgba(0, 229, 255, 0.1)';
          ctx.shadowColor = '#00E5FF';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.roundRect(f2.x - padSize / 2, f2.y - padSize / 2, padSize, padSize, 6);
          ctx.fill();
          ctx.stroke();

          // Checkered landing mark
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          const half = padSize / 4;
          ctx.fillRect(f2.x - half, f2.y - half, half, half);
          ctx.fillRect(f2.x, f2.y, half, half);
        }

        ctx.restore();
      }
    };

    // Draw FPV Racing Gate in two distinct 3D layers
    const drawGateLayer = (gate: SideGate, p: number, layer: 'BACK' | 'FRONT') => {
      const pos = getGatePosition(gate, p);

      // Skip if off-screen
      if (pos.y < -80 || pos.y > height + 80) return;

      const scrollDist = Math.abs(gate.scrollPos - p);
      const isCrossing = scrollDist < 0.05;

      ctx.save();

      if (layer === 'BACK') {
        // BACK LAYER: drawn behind the drones
        // Outer glowing arch
        ctx.strokeStyle = gate.color;
        ctx.lineWidth = isMobile ? 3 : 4;
        ctx.shadowColor = gate.color;
        ctx.shadowBlur = isCrossing ? 20 : 10;

        ctx.beginPath();
        ctx.roundRect(pos.x - gateW / 2, pos.y - gateH / 2, gateW, gateH, [gateW / 3, gateW / 3, 4, 4]);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Dark hollow center representing the aperture the drone flies inside
        ctx.fillStyle = 'rgba(10, 10, 12, 0.4)';
        ctx.beginPath();
        ctx.roundRect(pos.x - gateW / 2 + 5, pos.y - gateH / 2 + 5, gateW - 10, gateH - 10, [gateW / 3 - 3, gateW / 3 - 3, 2, 2]);
        ctx.fill();

        // Inner neon guideline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // FRONT LAYER: drawn on top of the drones (produces the genuine "inside gate" 3D depth)
        // Top front apex rim
        ctx.strokeStyle = isCrossing ? '#FFFFFF' : gate.color;
        ctx.lineWidth = isMobile ? 3 : 4;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - gateH / 2 + gateW / 3, gateW / 3, Math.PI, 0);
        ctx.stroke();

        // Corner LED status lights
        ctx.fillStyle = isCrossing ? '#FFFFFF' : gate.color;
        ctx.shadowColor = gate.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(pos.x - gateW / 2 + 6, pos.y - gateH / 2 + 6, 2.5, 0, Math.PI * 2);
        ctx.arc(pos.x + gateW / 2 - 6, pos.y - gateH / 2 + 6, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    };

    // Draw compact Drone without labels
    const drawDrone = (d: DroneState, isAlpha: boolean) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.roll);

      const scale = isMobile ? 0.65 : 0.8;
      ctx.scale(scale, scale);

      // Carbon Frame
      ctx.fillStyle = '#16161A';
      ctx.strokeStyle = '#2A2A32';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(-22, -22);
      ctx.lineTo(22, 22);
      ctx.moveTo(22, -22);
      ctx.lineTo(-22, 22);
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(-8, -14, 16, 28, 4);
      ctx.fill();
      ctx.stroke();

      // FPV Camera lens
      ctx.fillStyle = d.color;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, -14, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4 Motors with Spinning Propellers
      const motorCoords = [
        { mx: -22, my: -22 },
        { mx: 22, my: -22 },
        { mx: -22, my: 22 },
        { mx: 22, my: 22 },
      ];

      motorCoords.forEach((motor, i) => {
        ctx.fillStyle = '#222228';
        ctx.beginPath();
        ctx.arc(motor.mx, motor.my, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = d.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(motor.mx, motor.my, 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.translate(motor.mx, motor.my);
        ctx.rotate(d.propAngle * (i % 2 === 0 ? 1 : -1));

        ctx.fillStyle = isAlpha ? 'rgba(255, 85, 0, 0.35)' : 'rgba(0, 229, 255, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 12, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();
    };

    // Draw high-speed neon light trail
    const drawTrail = (trail: Array<{ x: number; y: number; alpha: number }>, trailColor: string) => {
      if (trail.length < 2) return;

      for (let i = 0; i < trail.length - 1; i++) {
        const p1 = trail[i];
        const p2 = trail[i + 1];
        const progress = i / trail.length;
        const alpha = progress * 0.55;
        const lineWidth = (1 - progress) * (isMobile ? 2.5 : 3.5) + 1;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${trailColor}${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    };

    // Main render loop
    const render = (time: number) => {
      // Ultra-smooth lerping for scroll progress
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;
      scrollVelocity *= 0.92;

      // Sequential Drone Flight:
      // Drone 1 leads at progress p1
      // Drone 2 follows right behind in slipstream at progress p2 (offset by 0.028)
      // This ensures they pass through the EXACT SAME CENTRAL APERTURE of each gate sequentially!
      const p1 = currentScrollProgress;
      const p2 = Math.max(0, currentScrollProgress - 0.028);

      const t1 = getFlightTrack(1, p1, time);
      const t2 = getFlightTrack(2, p2, time + 800);

      // Lerp Drone 1 to target
      drone1.x += (t1.x - drone1.x) * 0.15;
      drone1.y += (t1.y - drone1.y) * 0.15;
      drone1.roll += (t1.roll + scrollVelocity * 0.04 - drone1.roll) * 0.15;
      const isParked1 = p1 <= 0.03 || p1 >= 0.95;
      drone1.propAngle += (isParked1 ? 0.12 : 0.45) + Math.abs(scrollVelocity) * 0.15;

      // Lerp Drone 2 to target
      drone2.x += (t2.x - drone2.x) * 0.15;
      drone2.y += (t2.y - drone2.y) * 0.15;
      drone2.roll += (t2.roll + scrollVelocity * 0.04 - drone2.roll) * 0.15;
      const isParked2 = p2 <= 0.03 || p2 >= 0.95;
      drone2.propAngle += (isParked2 ? 0.12 : 0.45) + Math.abs(scrollVelocity) * 0.15;

      // Add to trail (only during flight)
      if (!isParked1) {
        drone1.trail.unshift({ x: drone1.x, y: drone1.y + 6, alpha: 1.0 });
      } else if (drone1.trail.length > 0) {
        drone1.trail.pop();
      }
      if (drone1.trail.length > maxTrailLength) drone1.trail.pop();

      if (!isParked2) {
        drone2.trail.unshift({ x: drone2.x, y: drone2.y + 6, alpha: 1.0 });
      } else if (drone2.trail.length > 0) {
        drone2.trail.pop();
      }
      if (drone2.trail.length > maxTrailLength) drone2.trail.pop();

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      // 1. DRAW HIGH-TECH START & FINISH PADS ON RIGHT FLANK
      drawPads(currentScrollProgress);

      // 2. DRAW GATE BACK LAYER (drawn behind the drones)
      sideGates.forEach((gate) => {
        drawGateLayer(gate, currentScrollProgress, 'BACK');
      });

      // 3. DRAW TRAILS
      drawTrail(drone1.trail, drone1.trailColor);
      drawTrail(drone2.trail, drone2.trailColor);

      // 4. DRAW DRONES (passes directly through the inside center of the gate)
      // Drone 2 drawn first (behind), then Drone 1 (leader)
      drawDrone(drone2, false);
      drawDrone(drone1, true);

      // 5. DRAW GATE FRONT LAYER (drawn in front of the drones, creating genuine 3D interior passage!)
      sideGates.forEach((gate) => {
        drawGateLayer(gate, currentScrollProgress, 'FRONT');
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ opacity: 0.95 }}
    />
  );
};
