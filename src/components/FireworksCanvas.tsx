"use client";

import { useEffect, useRef, useState } from "react";

type ExplosionStyle =
  | "peony"
  | "chrysanthemum"
  | "willow"
  | "ring"
  | "palm"
  | "brocade";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
  gravity: number;
  drag: number;
  trail: { x: number; y: number }[];
  style: ExplosionStyle;
  secondaryBurst: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  speed: number;
  hue: number;
  trail: { x: number; y: number }[];
  style: ExplosionStyle;
  doubleBlast: boolean;
}

interface BlastGlow {
  x: number;
  y: number;
  hue: number;
  life: number;
  maxLife: number;
}

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [finaleMode, setFinaleMode] = useState(false);
  const finaleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });

    if (!canvas || !ctx) return;
    // Explosion sound effects
    const normalBoom = new Audio("/sounds/Boom1.mp3");
    const doubleBoom = new Audio("/sounds/Boom2.mp3");

    normalBoom.preload = "auto";
    doubleBoom.preload = "auto";

    const playBlastSound = (isDouble: boolean) => {
      const sound = (isDouble ? doubleBoom : normalBoom).cloneNode(
        true,
      ) as HTMLAudioElement;

      sound.volume = 0.7;

      sound.play().catch(() => {});
    };
    let particles: Particle[] = [];
    let rockets: Rocket[] = [];
    let blastGlows: BlastGlow[] = [];
    let animationId = 0;
    // let autoStep = 0;
    // let nextAutoTime = 0;

    // const autoPattern = [3, 2, 3, 2, 3, 1];
    let lastFinale = 0;
    let previousTime = 0;

    const styles: ExplosionStyle[] = [
      "peony",
      "chrysanthemum",
      "willow",
      "ring",
      "palm",
      "brocade",
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
    };

    resize();
    window.addEventListener("resize", resize);

    const createSecondaryBurst = (x: number, y: number, hue: number) => {
      const count = 22;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 1.2 + Math.random() * 1.5;
        const life = 35 + Math.random() * 20;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          hue: hue + (Math.random() - 0.5) * 35,
          size: Math.random() * 1.2 + 0.8,
          gravity: 0.035,
          drag: 0.985,
          trail: [],
          style: "peony",
          secondaryBurst: false,
        });
      }
    };

    // Different explosion patterns
    const explode = (
      x: number,
      y: number,
      hue: number,
      style: ExplosionStyle,
      doubleBlast: boolean = false,
    ) => {
      playBlastSound(doubleBlast);
      const count =
        style === "chrysanthemum"
          ? 140
          : style === "palm"
            ? 120
            : style === "willow"
              ? 120
              : style === "brocade"
                ? 130
                : 110;

      // Remove older particles when particle limit is reached
      if (particles.length > 900) {
        particles = particles.slice(-500);
      }

      blastGlows.push({
        x,
        y,
        hue,
        life: 70,
        maxLife: 70,
      });

      for (let i = 0; i < count; i++) {
        const branchCount = 7;

        // Different angles for different fireworks
        let angle = (Math.PI * 2 * i) / count;

        if (style === "peony") {
          angle += (Math.random() - 0.5) * 0.12;
        }

        if (style === "chrysanthemum") {
          angle += (Math.random() - 0.5) * 0.035;
        }

        if (style === "ring") {
          angle += (Math.random() - 0.5) * 0.015;
        }

        if (style === "palm") {
          const branchAngle = (Math.PI * 2 * (i % branchCount)) / branchCount;
          angle = branchAngle + (Math.random() - 0.5) * 0.35;
        }

        if (style === "willow" || style === "brocade") {
          angle += (Math.random() - 0.5) * 0.18;
        }

        // Smaller and smoother explosion radius
        let speed = 1.7 + Math.random() * 0.8;

        if (style === "ring") {
          speed = 2.0 + Math.random() * 0.3;
        }

        if (style === "palm") {
          speed = 2.0 + Math.random() * 0.4;
        }

        if (style === "willow") {
          speed = 1.4 + Math.random() * 0.7;
        }

        if (style === "brocade") {
          speed = 1.6 + Math.random() * 0.7;
        }

        const life =
          style === "willow" || style === "brocade"
            ? 145 + Math.random() * 35
            : 100 + Math.random() * 25;

        const particleHue =
          style === "willow" || style === "brocade"
            ? 42 + Math.random() * 15
            : hue + (Math.random() - 0.5) * 35;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          hue: particleHue,
          size: Math.random() * 1.4 + 1,
          gravity:
            style === "willow" ? 0.065 : style === "brocade" ? 0.045 : 0.025,
          drag: style === "willow" ? 0.99 : 0.993,
          trail: [],
          style,
          secondaryBurst: doubleBlast && i % 10 === 0,
        });
      }
    };

    // Launch rocket
    let rocketLaunchCount = 0;

    // Launch rocket
    const launchRocket = (x: number, targetY: number) => {
      if (rockets.length >= 12) return;

      rocketLaunchCount++;

      rockets.push({
        x,
        y: window.innerHeight,
        targetY: Math.max(60, targetY),
        vx: (Math.random() - 0.5) * 0.6,
        speed: 6 + Math.random() * 1.5,
        hue: Math.random() * 360,
        trail: [],
        style: styles[Math.floor(Math.random() * styles.length)],

        // Every third rocket gets a double blast
        doubleBlast: rocketLaunchCount % 3 === 0,
      });
    };

    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      if ((event.target as HTMLElement).closest("button")) return;

      launchRocket(event.clientX, event.clientY);
    };

    window.addEventListener("pointerdown", handlePointer);

    // Animation loop
    const animate = (time: number) => {
      const dt = Math.min((time - (previousTime || time)) / 16.67, 1.5);

      previousTime = time;

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      // Large smooth circular explosion glow
      blastGlows = blastGlows.filter((glow) => glow.life > 0);

      blastGlows.forEach((glow) => {
        const progress = glow.life / glow.maxLife;

        // Large expanding glow radius
        const radius = 150 * (1.2 - progress * 0.2);

        const gradient = ctx.createRadialGradient(
          glow.x,
          glow.y,
          0,
          glow.x,
          glow.y,
          radius,
        );

        // Bright white center
        gradient.addColorStop(0, `rgba(255,255,255,${progress * 0.4})`);

        // Main colored glow
        gradient.addColorStop(
          0.2,
          `hsla(${glow.hue},100%,85%,${progress * 0.32})`,
        );

        gradient.addColorStop(
          0.5,
          `hsla(${glow.hue},100%,65%,${progress * 0.18})`,
        );

        gradient.addColorStop(
          0.8,
          `hsla(${glow.hue},100%,55%,${progress * 0.08})`,
        );

        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, radius, 0, Math.PI * 2);
        ctx.fill();

        glow.life -= dt;
      });

      // Automatic fireworks sequence
      // if (autoRef.current) {
      //   if (nextAutoTime === 0) {
      //     nextAutoTime = time;
      //   }

      //   if (time >= nextAutoTime) {
      //     const rocketCount = autoPattern[autoStep];

      //     // Launch 3 rockets from different locations
      //     if (rocketCount === 3) {
      //       const positions =
      //         autoStep === 0
      //           ? [width * 0.15, width * 0.5, width * 0.85]
      //           : [width * 0.25, width * 0.65, width * 0.95];

      //       positions.forEach((x) => {
      //         launchRocket(x, 80 + Math.random() * height * 0.45);
      //       });
      //     } else {
      //       // Launch one rocket
      //       launchRocket(
      //         70 + Math.random() * (width - 140),
      //         80 + Math.random() * height * 0.45,
      //       );
      //     }

      //     // Move to next pattern
      //     autoStep = (autoStep + 1) % autoPattern.length;

      //     // Timing between launches
      //     nextAutoTime = time + (rocketCount === 2 ? 1200 : 600);
      //   }
      // }

      // Grand Finale
      if (finaleRef.current && time - lastFinale > 650) {
        launchRocket(
          50 + Math.random() * (width - 100),
          70 + Math.random() * height * 0.48,
        );

        lastFinale = time;
      }

      // Rocket trails and animation
      rockets = rockets.filter((rocket) => {
        rocket.trail.unshift({
          x: rocket.x,
          y: rocket.y,
        });

        if (rocket.trail.length > 6) {
          rocket.trail.pop();
        }

        // Draw smooth glowing rocket trail
        for (let i = 1; i < rocket.trail.length; i++) {
          const current = rocket.trail[i];
          const previous = rocket.trail[i - 1];

          const alpha = 1 - i / rocket.trail.length;

          ctx.beginPath();
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(current.x, current.y);

          ctx.strokeStyle = `hsla(${rocket.hue},100%,75%,${alpha})`;
          ctx.lineWidth = 4 * alpha + 0.5;
          ctx.shadowBlur = 2;
          ctx.shadowColor = `hsl(${rocket.hue},100%,70%)`;
          ctx.stroke();
        }

        rocket.x += rocket.vx * dt;
        rocket.y -= rocket.speed * dt;

        // Bright rocket head
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${rocket.hue},100%,70%)`;
        ctx.fill();

        if (rocket.y <= rocket.targetY) {
          explode(
            rocket.x,
            rocket.y,
            rocket.hue,
            rocket.style,
            rocket.doubleBlast,
          );
          return false;
        }

        return true;
      });

      // Particle physics and trails
      particles = particles.filter((p) => p.life > 0);

      particles.forEach((p, index) => {
        p.trail.unshift({ x: p.x, y: p.y });

        if (p.trail.length > 3) {
          p.trail.pop();
        }

        // Smooth particle movement
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        p.vy += p.gravity * dt;

        p.vx *= Math.pow(p.drag, dt);
        p.vy *= Math.pow(p.drag, dt);

        p.life -= dt;
        // Trigger secondary mini explosion
        if (p.secondaryBurst && p.life < p.maxLife * 0.55) {
          p.secondaryBurst = false;

          createSecondaryBurst(p.x, p.y, p.hue);
        }

        const progress = Math.max(0, p.life / p.maxLife);
        const fade = Math.pow(progress, 0.8);

        // Draw particle tail
        for (let i = 1; i < p.trail.length; i++) {
          const current = p.trail[i];
          const previous = p.trail[i - 1];

          const trailAlpha = fade * (1 - i / p.trail.length);

          ctx.beginPath();
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(current.x, current.y);

          ctx.strokeStyle = `hsla(${p.hue},100%,75%,${trailAlpha})`;
          ctx.lineWidth = p.size * trailAlpha + 0.5;

          ctx.shadowBlur = 0;
          ctx.stroke();
        }

        // Glowing particle head
        // Optimized glowing particle head
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.2, p.size * fade), 0, Math.PI * 2);

        ctx.fillStyle = `hsla(${p.hue},100%,90%,${fade})`;

        // Glow only on selected particles for better performance
        ctx.shadowBlur = index % 5 === 0 ? 3 * fade : 0;
        ctx.shadowColor = `hsl(${p.hue},100%,65%)`;

        ctx.fill();
      });

      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePointer);
    };
  }, []);

  // Keep the two modes mutually exclusive
  // const toggleAuto = () => {
  //   const next = !autoMode;

  //   autoRef.current = next;
  //   setAutoMode(next);

  //   if (next) {
  //     finaleRef.current = false;
  //     setFinaleMode(false);
  //   }
  // };

  const toggleFinale = () => {
    const next = !finaleMode;

    finaleRef.current = next;
    setFinaleMode(next);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[1]"
      />

      <div className="fixed right-4 top-4 z-50 flex flex-col gap-3 sm:right-6 sm:top-6">
        <button
          onClick={toggleFinale}
          className="rounded-full border border-yellow-400/40
              bg-yellow-500/15 px-4 py-3 text-sm font-semibold
              text-yellow-300 backdrop-blur-md transition
              hover:bg-yellow-500/25 sm:px-5"
        >
          {finaleMode ? "✦ Stop Finale" : "✦ Grand Finale"}
        </button>
      </div>
    </>
  );
}
