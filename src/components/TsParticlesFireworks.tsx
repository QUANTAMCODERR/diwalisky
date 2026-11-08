"use client";

import { useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";

import { loadFireworksPreset } from "@tsparticles/preset-fireworks";
import { loadInteractivityPlugin } from "@tsparticles/plugin-interactivity";
import { loadExternalPushInteraction } from "@tsparticles/interaction-external-push";

const initializeParticles = async (engine: Engine) => {
  await loadFireworksPreset(engine);
  await loadInteractivityPlugin(engine);
  await loadExternalPushInteraction(engine);
};

export default function TsParticlesFireworks() {
  const options = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: 1,
      },

      autoPlay: true,
      fpsLimit: 60,
      detectRetina: true,
      pauseOnBlur: true,

      background: {
        color: "transparent",
      },

      particles: {
        number: {
          value: 0,
        },

        paint: {
          fill: {
            enable: true,
            color: {
              value: [
                "#ff3838",
                "#ffd700",
                "#00e5ff",
                "#ff4dff",
                "#7cff6b",
                "#ffffff",
              ],
            },
          },
        },

        shape: {
          type: "circle",
        },

        opacity: {
          value: {
            min: 0.3,
            max: 1,
          },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0,
            sync: false,
          },
        },

        size: {
          value: {
            min: 1,
            max: 4,
          },
        },

        life: {
          duration: {
            value: 2.5,
          },
        },

        move: {
          enable: true,
          direction: "none",
          speed: {
            min: 3,
            max: 9,
          },
          decay: 0.04,
          gravity: {
            enable: true,
            acceleration: 5,
          },
          outModes: {
            default: "destroy",
          },
        },
      },

      interactivity: {
        detectsOn: "window",
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
        },
        modes: {
          push: {
            quantity: 90,
          },
        },
      },
    }),
    [],
  );

  return (
    <ParticlesProvider init={initializeParticles}>
      <Particles id="diwalisky-fireworks" options={options} />
    </ParticlesProvider>
  );
}
