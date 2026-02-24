import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls, useInView, useReducedMotion } from "framer-motion";

const CONFIG = {
  brandName: "Vantero",
  brandColor: "#6366f1",
  brandColorAccent: "#8b5cf6",
  models: [
    {
      id: "claude",
      name: "Claude",
      angleDeg: 0,
      color: "#D4A574",
      iconSrc: "./assets/logo-claude.png",
      curve: { x: -20, y: -34 },
    },
    {
      id: "gpt-4",
      name: "GPT-4",
      angleDeg: 45,
      color: "#10b981",
      iconSrc: "./assets/logo-gpt5.png",
      curve: { x: 28, y: -16 },
    },
    {
      id: "gemini",
      name: "Gemini",
      angleDeg: 90,
      color: "#3b82f6",
      iconSrc: "./assets/logo-gemini.png",
      curve: { x: 24, y: 0 },
    },
    {
      id: "perplexity",
      name: "Perplexity",
      angleDeg: 135,
      color: "#22d3ee",
      iconSrc: "./assets/logo-perplexity.png",
      curve: { x: 16, y: 16 },
    },
    {
      id: "mistral",
      name: "Mistral",
      angleDeg: 180,
      color: "#f59e0b",
      iconSrc: "./assets/logo-mistral.png",
      curve: { x: 0, y: 24 },
    },
    {
      id: "llama",
      name: "Llama",
      angleDeg: 225,
      color: "#6366f1",
      iconSrc: "./assets/logo-llama.png",
      curve: { x: -18, y: 16 },
    },
    {
      id: "qwen",
      name: "Qwen",
      angleDeg: 270,
      color: "#a855f7",
      iconSrc: "./assets/logo-qwen.png",
      curve: { x: -26, y: 0 },
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      angleDeg: 315,
      color: "#38bdf8",
      iconSrc: "./assets/logo-deepseek.png",
      curve: { x: -22, y: -18 },
    },
  ],
};

const CENTER = 300;
const RADIUS = 220;
const END_FACTOR = 0.55;
const PHASE_2_DELAY = 1200;
const PHASE_2_DURATION = 3600;
const PHASE_3_DELAY = 2200;
const BACK_OUT = [0.175, 0.885, 0.32, 1.275];

const toRad = (deg) => (deg * Math.PI) / 180;

const buildLayout = (model) => {
  const angle = toRad(model.angleDeg - 90);
  const startX = Math.cos(angle) * RADIUS;
  const startY = Math.sin(angle) * RADIUS;
  const endX = startX * END_FACTOR;
  const endY = startY * END_FACTOR;
  const midX = startX * 0.6 + (model.curve?.x ?? 0);
  const midY = startY * 0.6 + (model.curve?.y ?? 0);
  const pathD = `M ${CENTER + startX} ${CENTER + startY} Q ${CENTER + midX} ${CENTER + midY} ${
    CENTER + endX
  } ${CENTER + endY}`;

  return {
    ...model,
    startX,
    startY,
    midX,
    midY,
    endX,
    endY,
    pathD,
  };
};

export default function AIFlowSection() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { amount: 0.3, once: true });
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState("idle");

  const logoControls = useAnimationControls();
  const centerControls = useAnimationControls();
  const models = useMemo(() => CONFIG.models.map(buildLayout), []);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setPhase("reduced");
      logoControls.set("static");
      centerControls.set("static");
      return;
    }

    let isCancelled = false;
    const timers = [];

    setPhase("phase1");
    logoControls.start("enter");

    timers.push(
      window.setTimeout(() => {
        if (isCancelled) return;
        setPhase("phase2");
        logoControls.start("flow");
      }, PHASE_2_DELAY)
    );

    timers.push(
      window.setTimeout(() => {
        if (isCancelled) return;
        setPhase("phase3");
        centerControls.start("reveal");
      }, PHASE_2_DELAY + PHASE_3_DELAY)
    );

    timers.push(
      window.setTimeout(() => {
        if (isCancelled) return;
        setPhase("phase4");
        logoControls.start("stream");
        centerControls.start("idle");
      }, PHASE_2_DELAY + PHASE_2_DURATION)
    );

    return () => {
      isCancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [inView, reduceMotion, logoControls, centerControls]);

  const logoVariants = {
    hidden: (model) => ({
      x: model.startX,
      y: model.startY,
      scale: 0,
      opacity: 0,
    }),
    enter: (model) => ({
      x: model.startX,
      y: model.startY,
      scale: 1,
      opacity: 1,
      transition: {
        delay: model.index * 0.15,
        duration: 0.65,
        ease: BACK_OUT,
      },
    }),
    flow: (model) => ({
      x: [model.startX, model.midX, model.endX],
      y: [model.startY, model.midY, model.endY],
      scale: 0.68,
      transition: {
        duration: PHASE_2_DURATION / 1000,
        ease: "easeInOut",
      },
    }),
    stream: (model) => ({
      x: [model.startX, model.midX, model.endX, model.endX, model.startX],
      y: [model.startY, model.midY, model.endY, model.endY, model.startY],
      scale: [1, 0.82, 0.62, 0.6, 1],
      opacity: [0, 1, 1, 0, 0],
      transition: {
        duration: 8.2,
        repeat: Infinity,
        repeatType: "loop",
        delay: model.streamDelay,
        ease: "easeInOut",
        times: [0, 0.5, 0.78, 0.86, 1],
      },
    }),
    static: (model) => ({
      x: model.startX,
      y: model.startY,
      scale: 1,
      opacity: 1,
    }),
  };

  const centerVariants = {
    hidden: { scale: 0, opacity: 0 },
    reveal: {
      scale: [0, 1.18, 1.05],
      opacity: 1,
      transition: { duration: 0.7, ease: BACK_OUT },
    },
    idle: {
      scale: 1.05,
      opacity: 1,
    },
    static: {
      scale: 1.05,
      opacity: 1,
    },
  };

  return (
    <section
      ref={containerRef}
      aria-label="Vantero Plattform Übersicht"
      className="ai-flow-section"
      data-phase={phase}
      data-reduced-motion={reduceMotion ? "true" : "false"}
    >
      <div className="container">
        <div className="ai-flow-layout">
          <div className="ai-flow-visual">
            <div className="ai-flow-canvas">
              <div className="ai-flow-nebula" aria-hidden="true" />
              <svg
                className="ai-flow-svg"
                viewBox="0 0 600 600"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  {models
                    .filter((model) => !model.isPlaceholder)
                    .map((model) => (
                      <path key={model.id} id={`ai-flow-path-${model.id}`} d={model.pathD} />
                    ))}
                </defs>

                <g className="ai-flow-lines">
                  {models
                    .filter((model) => !model.isPlaceholder)
                    .map((model) => (
                      <path key={model.id} className="ai-flow-line" d={model.pathD} />
                    ))}
                </g>

                <g className="ai-flow-energy">
                  {models
                    .filter((model) => !model.isPlaceholder)
                    .map((model) => (
                      <path
                        key={`${model.id}-energy`}
                        className="ai-flow-line ai-flow-line-energy"
                        d={model.pathD}
                      />
                    ))}
                </g>

                <g className="ai-flow-tails">
                  {models
                    .filter((model) => !model.isPlaceholder)
                    .map((model) => (
                      <path
                        key={`${model.id}-tail`}
                        className="ai-flow-line ai-flow-line-tail"
                        d={model.pathD}
                      />
                    ))}
                </g>

                <g className="ai-flow-particles">
                  {models
                    .filter((model) => !model.isPlaceholder)
                    .flatMap((model, modelIndex) => {
                      const particles = [
                        { radius: 2.1, dur: 4.8, begin: 0.4 },
                        { radius: 1.4, dur: 6.2, begin: 2.0 },
                      ];
                      return particles.map((particle, idx) => (
                        <circle
                          key={`${model.id}-particle-${idx}`}
                          className="ai-flow-particle"
                          r={particle.radius}
                        >
                          <animateMotion
                            dur={`${particle.dur}s`}
                            repeatCount="indefinite"
                            begin={`${particle.begin + modelIndex * 0.4}s`}
                          >
                            <mpath href={`#ai-flow-path-${model.id}`} />
                          </animateMotion>
                        </circle>
                      ));
                    })}
                </g>

                <g className="ai-flow-burst-particles">
                  {models
                    .filter((model) => !model.isPlaceholder)
                    .flatMap((model, modelIndex) => {
                      const bursts = [
                        { radius: 2.4, dur: 2.2, begin: 0.1 },
                        { radius: 1.8, dur: 2.6, begin: 0.5 },
                      ];
                      return bursts.map((burst, idx) => (
                        <circle
                          key={`${model.id}-burst-${idx}`}
                          className="ai-flow-particle ai-flow-burst-particle"
                          r={burst.radius}
                        >
                          <animateMotion
                            dur={`${burst.dur}s`}
                            repeatCount="indefinite"
                            begin={`${burst.begin + modelIndex * 0.3}s`}
                          >
                            <mpath href={`#ai-flow-path-${model.id}`} />
                          </animateMotion>
                        </circle>
                      ));
                    })}
                </g>
              </svg>

              <div className="ai-flow-center-wrap">
                <span className="ai-flow-burst" aria-hidden="true" />
                <span className="ai-flow-halo" aria-hidden="true" />
                <motion.div
                  className="ai-flow-center"
                  initial="hidden"
                  animate={centerControls}
                  variants={centerVariants}
                >
                  <img
                    className="ai-flow-center-logo"
                    src="./assets/vantero-logo.png"
                    alt={`${CONFIG.brandName} Logo`}
                    loading="eager"
                    decoding="async"
                  />
                  <span className="sr-only">{CONFIG.brandName}</span>
                </motion.div>
              </div>

              {models.map((model, index) => (
                <div key={model.id} className="ai-flow-logo-wrap">
                  <motion.div
                    className="ai-flow-logo"
                    custom={{ ...model, index, streamDelay: index * 0.45 }}
                    initial="hidden"
                    animate={logoControls}
                    variants={logoVariants}
                    style={{
                      "--orbit-radius": `${5 + (index % 4) * 1.8}px`,
                      "--orbit-duration": `${7 + (index % 5) * 0.6}s`,
                      "--orbit-delay": `${index * 0.35}s`,
                      "--pulse-delay": `${index * 0.12}s`,
                    }}
                    aria-label={`${model.name} Logo`}
                    role="img"
                  >
                    <div className="ai-flow-logo-orbit">
                      <div className="ai-flow-logo-card" style={{ "--logo-color": model.color }}>
                        {model.iconSrc ? (
                          <img src={model.iconSrc} alt={`${model.name} Logo`} loading="lazy" />
                        ) : null}
                      </div>
                      <span className="ai-flow-logo-label">{model.name}</span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
