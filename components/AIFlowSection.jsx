import React, { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const CONFIG = {
  brandName: "Vantero",
  models: [
    { id: "claude", name: "Claude", angleDeg: 0, color: "#D4A574", iconSrc: "./assets/logo-claude.png" },
    { id: "gpt-4", name: "GPT-4", angleDeg: 45, color: "#10b981", iconSrc: "./assets/logo-gpt5.png" },
    { id: "gemini", name: "Gemini", angleDeg: 90, color: "#3b82f6", iconSrc: "./assets/logo-gemini.png" },
    { id: "perplexity", name: "Perplexity", angleDeg: 135, color: "#22d3ee", iconSrc: "./assets/logo-perplexity.png" },
    { id: "mistral", name: "Mistral", angleDeg: 180, color: "#f59e0b", iconSrc: "./assets/logo-mistral.png" },
    { id: "llama", name: "Llama", angleDeg: 225, color: "#6366f1", iconSrc: "./assets/logo-llama.png" },
    { id: "qwen", name: "Qwen", angleDeg: 270, color: "#a855f7", iconSrc: "./assets/logo-qwen.png" },
    { id: "deepseek", name: "DeepSeek", angleDeg: 315, color: "#38bdf8", iconSrc: "./assets/logo-deepseek.png" },
  ],
};

const CENTER = 300;
const RADIUS = 180;
const STREAM_DURATION = 6.5;
const STAGGER = STREAM_DURATION / CONFIG.models.length;

const toRad = (deg) => (deg * Math.PI) / 180;

const buildLayout = (model, index) => {
  const angle = toRad(model.angleDeg - 90);
  const startX = Math.cos(angle) * RADIUS;
  const startY = Math.sin(angle) * RADIUS;
  const pathD = `M ${CENTER + startX} ${CENTER + startY} L ${CENTER} ${CENTER}`;

  return { ...model, index, startX, startY, pathD };
};

export default function AIFlowSection() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { amount: 0.28 });
  const reduceMotion = useReducedMotion();
  const shouldAnimate = inView && !reduceMotion;
  const models = useMemo(() => CONFIG.models.map((m, i) => buildLayout(m, i)), []);

  const streamVariant = {
    animate: (model) => ({
      x: [model.startX, model.startX * 0.5, model.startX * 0.15, 0],
      y: [model.startY, model.startY * 0.5, model.startY * 0.15, 0],
      scale: [1, 0.85, 0.68, 0.5],
      opacity: [1, 1, 0.8, 0],
      transition: {
        duration: STREAM_DURATION,
        repeat: Infinity,
        repeatType: "loop",
        delay: model.index * STAGGER,
        ease: "linear",
        times: [0, 0.5, 0.82, 1],
      },
    }),
  };

  const staticVariant = {
    static: (model) => ({
      x: model.startX,
      y: model.startY,
      scale: 1,
      opacity: 1,
    }),
  };

  return (
    <section
      ref={containerRef}
      aria-label="Vantero Plattform Übersicht"
      className="ai-flow-section"
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
                  {models.map((model) => (
                    <path key={model.id} id={`ai-flow-path-${model.id}`} d={model.pathD} />
                  ))}
                </defs>

                <g className="ai-flow-lines">
                  {models.map((model) => (
                    <path key={model.id} className="ai-flow-line" d={model.pathD} />
                  ))}
                </g>

                {shouldAnimate ? (
                  <g className="ai-flow-particles">
                    {models.map((model, mi) => (
                      <circle key={`${model.id}-p-0`} className="ai-flow-particle" r={1.8}>
                        <animateMotion
                          dur={`${STREAM_DURATION}s`}
                          repeatCount="indefinite"
                          begin={`${mi * STAGGER}s`}
                        >
                          <mpath href={`#ai-flow-path-${model.id}`} />
                        </animateMotion>
                      </circle>
                    ))}
                  </g>
                ) : null}
              </svg>

              <div className="ai-flow-center-wrap">
                <span className="ai-flow-halo" aria-hidden="true" />
                <div className="ai-flow-center">
                  <img
                    className="ai-flow-center-logo"
                    src="./assets/vantero-logo.png"
                    alt={`${CONFIG.brandName} Logo`}
                    loading="eager"
                    decoding="async"
                    width="62"
                    height="62"
                  />
                </div>
              </div>

              {models.map((model) => (
                <div key={model.id} className="ai-flow-logo-wrap">
                  <motion.div
                    className="ai-flow-logo"
                    custom={model}
                    initial={{ x: model.startX, y: model.startY, scale: 1, opacity: 1 }}
                    animate={shouldAnimate ? "animate" : "static"}
                    variants={{ ...streamVariant, ...staticVariant }}
                    aria-label={`${model.name} Logo`}
                    role="img"
                  >
                    <div className="ai-flow-logo-inner">
                      <div className="ai-flow-logo-card" style={{ "--logo-color": model.color }}>
                        <img
                          src={model.iconSrc}
                          alt={`${model.name} Logo`}
                          loading="lazy"
                          decoding="async"
                          width="32"
                          height="32"
                        />
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
