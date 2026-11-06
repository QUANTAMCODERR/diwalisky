
"use client";

import { useEffect, useRef, useState } from "react";

type ExplosionStyle = "sphere" | "ring" | "double";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  hue: number;
  size: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  hue: number;
  style: ExplosionStyle;
}

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let particles: Particle[] = [];
    let rockets: Rocket[] = [];
    let animationId: number;
    let lastAutoLaunch = 0;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create explosion with different styles
    const createFireworks = (
      x: number,
      y: number,
      hue: number,
      style: ExplosionStyle
    ) => {
      const count = 100;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;

        let speed: number;

        if (style === "ring") {
          speed = 4;
        } else if (style === "double") {
          speed = i % 2 === 0 ? 5 : 2.5;
        } else {
          speed = Math.random() * 5 + 1;
        }

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          hue,
          size: Math.random() * 2 + 1,
        });
      }
    };

    // Create rocket
    const launchRocket = (
      x: number,
      targetY: number
    ) => {
      const styles: ExplosionStyle[] = [
        "sphere",
        "ring",
        "double",
      ];

      rockets.push({
        x,
        y: window.innerHeight,
        targetY,
        speed: Math.random() * 3 + 6,
        hue: Math.random() * 360,
        style: styles[Math.floor(Math.random() * styles.length)],
      });
    };

    // Manual launch
    const handleClick = (event: MouseEvent) => {
      launchRocket(event.clientX, event.clientY);
    };

    window.addEventListener("click", handleClick);

    const animate = (time: number) => {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      // Automatic fireworks
      if (autoMode && time - lastAutoLaunch > 900) {
        const x = Math.random() * window.innerWidth;
        const targetY = Math.random() * window.innerHeight * 0.55 + 50;

        launchRocket(x, targetY);
        lastAutoLaunch = time;
      }

      // Rocket animation
      rockets = rockets.filter((rocket) => {
        rocket.y -= rocket.speed;

        ctx.beginPath();
        ctx.moveTo(rocket.x, rocket.y + 20);
        ctx.lineTo(rocket.x, rocket.y);

        ctx.strokeStyle = `hsl(${rocket.hue}, 100%, 70%)`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${rocket.hue}, 100%, 60%)`;
        ctx.stroke();

        if (rocket.y <= rocket.targetY) {
          createFireworks(
            rocket.x,
            rocket.y,
            rocket.hue,
            rocket.style
          );

          return false;
        }

        return true;
      });

      // Particle animation
      particles = particles.filter(
        (particle) => particle.alpha > 0.02
      );

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vy += 0.045;

        particle.vx *= 0.99;
        particle.vy *= 0.99;

        particle.alpha -= 0.012;

        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `hsla(
          ${particle.hue},
          100%,
          60%,
          ${particle.alpha}
        )`;

        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${particle.hue}, 100%, 60%)`;

        ctx.fill();
      });

      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleClick);
    };
  }, [autoMode]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[1]"
      />

      {/* Auto Mode Control */}
      <div className="fixed right-6 top-6 z-50">
        <button
          onClick={(event) => {
            event.stopPropagation();
            setAutoMode((previous) => !previous);
          }}
          className={`rounded-full border px-5 py-3 text-sm
            font-semibold backdrop-blur-md transition-all
            ${
              autoMode
                ? "border-purple-400 bg-purple-600 text-white"
                : "border-white/20 bg-white/10 text-white hover:bg-white/20"
            }`}
        >
          {autoMode ? "⏸ Stop Auto Show" : "▶ Auto Show"}
        </button>
      </div>
    </>
  );
}
