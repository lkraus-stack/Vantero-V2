document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
if (header) {
  const setHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });
}

const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav]");
const faqItems = document.querySelectorAll("[data-faq]");
const modelToggle = document.querySelector("[data-model-toggle]");
const modelMenu = document.querySelector("[data-model-menu]");
const modelOptions = document.querySelectorAll("[data-model-option]");
const modelLabel = document.querySelector("[data-model-label]");
const modelMeta = document.querySelector("[data-model-meta]");
const modelIcon = document.querySelector(".prompt-select-icon img");
const modelModal = document.querySelector("[data-model-modal]");
const modelModalPanel = modelModal ? modelModal.querySelector(".overlay-panel") : null;
const modelModalList = document.querySelector("[data-model-list]");
const modelModalSearch = document.querySelector("[data-model-search]");
const modelModalCurrent = document.querySelector("[data-model-current]");
const outputFilterButtons = document.querySelectorAll("[data-output-filter]");
const capFilterButtons = document.querySelectorAll("[data-cap-filter]");
const autoConfigOpen = document.querySelector("[data-auto-config-open]");
const autoConfigModal = document.querySelector("[data-auto-config-modal]");
const autoConfigApply = document.querySelector("[data-auto-config-apply]");
const autoConfigZoneButtons = autoConfigModal
  ? autoConfigModal.querySelectorAll("[data-zone]")
  : [];
const autoConfigSizeButtons = autoConfigModal
  ? autoConfigModal.querySelectorAll("[data-size]")
  : [];
const styleToggle = document.querySelector("[data-style-toggle]");
const styleMenu = document.querySelector("[data-style-menu]");
const styleChip = document.querySelector("[data-style-chip]");
const styleCustomInput = document.querySelector("[data-style-custom]");
const styleToneButtons = styleMenu ? styleMenu.querySelectorAll("[data-style-tone]") : [];
const stylePronounButtons = styleMenu
  ? styleMenu.querySelectorAll("[data-style-pronoun]")
  : [];
const styleLengthButtons = styleMenu
  ? styleMenu.querySelectorAll("[data-style-length]")
  : [];
const attachToggle = document.querySelector("[data-attach-toggle]");
const attachMenu = document.querySelector("[data-attach-menu]");
const attachOptions = attachMenu ? attachMenu.querySelectorAll("[data-attach-action]") : [];
const fileInput = document.querySelector("[data-file-input]");
const attachmentsEl = document.querySelector("[data-attachments]");
const demoChat = document.querySelector("[data-demo-chat]");
const chatLog = document.querySelector("[data-chat-log]");
const chatCta = document.querySelector("[data-chat-cta]");
const continueLink = document.querySelector("[data-continue-link]");
const promptTextarea = document.querySelector(".prompt-textarea");
const promptSend = document.querySelector("[data-prompt-send]");
const promptCount = document.querySelector(".prompt-count");

let closeModelMenu = null;

const HERO_STATE = {
  modelMode: "auto", // auto | manual
  modelId: null,
  dataZone: "de", // de | fr | eu | world
  modelSize: "m", // s | m | l
  style: {
    tone: "friendly", // friendly | business
    pronoun: "du", // du | sie
    length: "short", // short | long
    custom: "",
  },
  attachments: [],
  filters: {
    query: "",
    output: "all", // all | text | image
    cap: "all", // all | reasoning | image-input | web
  },
};

const MODEL_CATALOG = [
  {
    id: "gpt-4.1",
    name: "ChatGPT-4.1",
    provider: "OpenAI",
    logo: "./assets/logo-gpt5.png",
    output: ["text"],
    capabilities: ["reasoning"],
  },
  {
    id: "gpt-5",
    name: "ChatGPT-5",
    provider: "OpenAI",
    logo: "./assets/logo-gpt5.png",
    output: ["text"],
    capabilities: ["reasoning", "image-input", "web"],
  },
  {
    id: "gpt-5-mini",
    name: "ChatGPT-5 Mini",
    provider: "OpenAI",
    logo: "./assets/logo-gpt5.png",
    output: ["text"],
    capabilities: ["reasoning", "image-input"],
  },
  {
    id: "gpt-5-nano",
    name: "ChatGPT-5 Nano",
    provider: "OpenAI",
    logo: "./assets/logo-gpt5.png",
    output: ["text"],
    capabilities: ["reasoning"],
  },
  {
    id: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    logo: "./assets/logo-claude.png",
    output: ["text"],
    capabilities: ["reasoning", "image-input"],
  },
  {
    id: "claude-opus-4.5",
    name: "Claude Opus 4.5",
    provider: "Anthropic",
    logo: "./assets/logo-claude.png",
    output: ["text"],
    capabilities: ["reasoning", "image-input"],
  },
  {
    id: "claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    logo: "./assets/logo-claude.png",
    output: ["text"],
    capabilities: ["reasoning"],
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    output: ["text"],
    capabilities: ["image-input", "web"],
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    output: ["text"],
    capabilities: ["reasoning", "image-input", "web"],
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    output: ["text"],
    capabilities: ["image-input"],
  },
  {
    id: "imagen-3-fast",
    name: "Imagen 3 Fast",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    output: ["image"],
    capabilities: [],
  },
  {
    id: "imagen-3",
    name: "Imagen 3",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    output: ["image"],
    capabilities: [],
  },
  {
    id: "imagen-4-fast",
    name: "Imagen 4 Fast",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    output: ["image"],
    capabilities: [],
  },
  {
    id: "imagen-4",
    name: "Imagen 4",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    output: ["image"],
    capabilities: [],
  },
  {
    id: "imagen-4-ultra",
    name: "Imagen 4 Ultra",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    output: ["image"],
    capabilities: [],
  },
  {
    id: "mistral-small",
    name: "Mistral Small",
    provider: "Mistral",
    logo: "./assets/logo-mistral.png",
    output: ["text"],
    capabilities: ["reasoning"],
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium",
    provider: "Mistral",
    logo: "./assets/logo-mistral.png",
    output: ["text"],
    capabilities: ["reasoning"],
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    logo: "./assets/logo-mistral.png",
    output: ["text"],
    capabilities: ["reasoning", "web"],
  },
  {
    id: "codestral",
    name: "Codestral",
    provider: "Mistral",
    logo: "./assets/logo-mistral.png",
    output: ["text"],
    capabilities: ["reasoning"],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    logo: "./assets/logo-deepseek.png",
    output: ["text"],
    capabilities: ["reasoning"],
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta",
    logo: "./assets/logo-llama.png",
    output: ["text"],
    capabilities: ["reasoning"],
  },
  {
    id: "qwen",
    name: "Qwen",
    provider: "Alibaba",
    logo: "./assets/logo-qwen.png",
    output: ["text"],
    capabilities: ["reasoning"],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    provider: "Perplexity",
    logo: "./assets/logo-perplexity.png",
    output: ["text"],
    capabilities: ["web"],
  },
  {
    id: "nova-micro",
    name: "Nova Micro",
    provider: "Amazon",
    logo: null,
    output: ["text"],
    capabilities: [],
  },
  {
    id: "nova-lite",
    name: "Nova Lite",
    provider: "Amazon",
    logo: null,
    output: ["text"],
    capabilities: ["image-input"],
  },
];

const PROVIDER_ORDER = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Mistral",
  "DeepSeek",
  "Meta",
  "Alibaba",
  "Perplexity",
  "Amazon",
];

const getModelById = (id) => MODEL_CATALOG.find((model) => model.id === id) ?? null;

const initialModelIconSrc = modelIcon?.getAttribute("src") ?? null;

const updateModelUI = () => {
  if (!modelLabel) return;

  if (HERO_STATE.modelMode === "auto") {
    modelLabel.textContent = "Automatische Auswahl";
    if (modelIcon && initialModelIconSrc) {
      modelIcon.src = initialModelIconSrc;
      modelIcon.alt = "Vantero";
    }
  } else {
    const selected = getModelById(HERO_STATE.modelId);
    modelLabel.textContent = selected?.name ?? "Eigenes Modell";
    if (modelIcon) {
      if (selected?.logo) {
        modelIcon.src = selected.logo;
        modelIcon.alt = selected.provider;
      } else if (initialModelIconSrc) {
        modelIcon.src = initialModelIconSrc;
        modelIcon.alt = "Vantero";
      }
    }
  }

  if (modelModalCurrent) {
    modelModalCurrent.textContent = modelLabel.textContent.trim();
  }

  if (modelMeta) {
    const zoneLabel =
      {
        de: "Deutschland",
        fr: "Frankreich",
        eu: "Europa",
        world: "Weltweit",
      }[HERO_STATE.dataZone] ?? "Deutschland";

    const sizeLabel =
      { s: "Klein", m: "Mittel", l: "Groß" }[HERO_STATE.modelSize] ?? "Mittel";

    modelMeta.textContent = `${zoneLabel} · ${sizeLabel}`;
  }

  modelOptions.forEach((btn) => btn.classList.remove("is-active"));
  const active = Array.from(modelOptions).find(
    (btn) => btn.dataset.modelMode === HERO_STATE.modelMode
  );
  if (active) active.classList.add("is-active");
};

const STYLE_LABELS = {
  tone: { friendly: "Freundlich", business: "Geschäftlich" },
  pronoun: { du: "Du", sie: "Sie" },
  length: { short: "Kurz", long: "Lang" },
};

const updateStyleUI = () => {
  const tone = STYLE_LABELS.tone[HERO_STATE.style.tone] ?? "Freundlich";
  const pronoun = STYLE_LABELS.pronoun[HERO_STATE.style.pronoun] ?? "Du";
  const length = STYLE_LABELS.length[HERO_STATE.style.length] ?? "Kurz";
  const custom = (HERO_STATE.style.custom ?? "").trim();
  const customPreview = custom
    ? ` · ${custom.length > 28 ? `${custom.slice(0, 28)}…` : custom}`
    : "";

  if (styleChip) {
    styleChip.textContent = `${tone} · ${pronoun} · ${length}${customPreview}`;
  }

  styleToneButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.styleTone === HERO_STATE.style.tone);
  });

  stylePronounButtons.forEach((btn) => {
    btn.classList.toggle(
      "is-active",
      btn.dataset.stylePronoun === HERO_STATE.style.pronoun
    );
  });

  styleLengthButtons.forEach((btn) => {
    btn.classList.toggle(
      "is-active",
      btn.dataset.styleLength === HERO_STATE.style.length
    );
  });

  if (styleCustomInput && styleCustomInput.value !== HERO_STATE.style.custom) {
    styleCustomInput.value = HERO_STATE.style.custom ?? "";
  }
};

const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const renderAttachments = () => {
  if (!attachmentsEl) return;
  if (!Array.isArray(HERO_STATE.attachments) || HERO_STATE.attachments.length === 0) {
    attachmentsEl.innerHTML = "";
    return;
  }

  attachmentsEl.innerHTML = HERO_STATE.attachments
    .map((att) => {
      const icon = att.kind === "file" ? "📎" : "🔗";
      return `
        <span class="attachment-chip" data-attachment-id="${att.id}">
          <span class="attachment-chip-name">${icon} ${att.label}</span>
          <button
            class="attachment-chip-remove"
            type="button"
            aria-label="Anhang entfernen"
            data-attachment-remove
          >
            ×
          </button>
        </span>
      `;
    })
    .join("");
};

const getSafeText = (value) => String(value ?? "");

const scrollChatToBottom = () => {
  if (!chatLog) return;
  chatLog.scrollTop = chatLog.scrollHeight;
};

const appendBubble = (role, text, metaText = "") => {
  if (!chatLog) return null;
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role}`;
  bubble.textContent = getSafeText(text);
  if (metaText) {
    const meta = document.createElement("div");
    meta.className = "chat-meta";
    meta.textContent = getSafeText(metaText);
    bubble.appendChild(meta);
  }
  chatLog.appendChild(bubble);
  scrollChatToBottom();
  return bubble;
};

const appendTyping = () => {
  if (!chatLog) return null;
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble ai typing";
  bubble.innerHTML = `
    <span>Vantero</span>
    <span class="typing-dots" aria-hidden="true">
      <span></span><span></span><span></span>
    </span>
  `;
  chatLog.appendChild(bubble);
  scrollChatToBottom();
  return bubble;
};

const buildChatMeta = () => {
  const zoneLabel =
    { de: "Deutschland", fr: "Frankreich", eu: "Europa", world: "Weltweit" }[
      HERO_STATE.dataZone
    ] ?? "Deutschland";
  const sizeLabel = { s: "Klein", m: "Mittel", l: "Groß" }[HERO_STATE.modelSize] ?? "Mittel";
  const modelText =
    HERO_STATE.modelMode === "auto"
      ? "Automatisch"
      : getModelById(HERO_STATE.modelId)?.name ?? "Eigenes Modell";
  return `${modelText} · ${zoneLabel} · ${sizeLabel}`;
};

const generateDemoAnswer = (prompt) => {
  const tone = HERO_STATE.style.tone;
  const pronoun = HERO_STATE.style.pronoun;
  const length = HERO_STATE.style.length;
  const custom = (HERO_STATE.style.custom ?? "").trim();
  const selected = HERO_STATE.modelMode === "manual" ? getModelById(HERO_STATE.modelId) : null;
  const isImageModel = selected?.output?.includes("image");

  const greet =
    pronoun === "sie"
      ? tone === "business"
        ? "Gerne."
        : "Sehr gern."
      : tone === "business"
        ? "Klar."
        : "Sehr gerne!";

  const youWord = pronoun === "sie" ? "Sie" : "du";
  const yourWord = pronoun === "sie" ? "Ihr" : "dein";

  const attachments = HERO_STATE.attachments ?? [];
  const attachmentLine =
    attachments.length > 0
      ? `Ich sehe ${attachments.length} Anhang/Anhänge (${attachments
          .slice(0, 3)
          .map((a) => a.label)
          .join(", ")}${attachments.length > 3 ? ", …" : ""}).`
      : "";

  const styleHint = custom ? `Stil-Hinweis: ${custom}.` : "";

  if (isImageModel) {
    const base = `${greet} Ich würde daraus Bildvarianten erzeugen.`;
    const imgPrompt = `Bild-Prompt (Beispiel):\n"${prompt}"\n- Stil: ${tone === "business" ? "clean, professional" : "vibrant, friendly"}\n- Format: 16:9, high detail`;
    return length === "long"
      ? [base, attachmentLine, styleHint, "", imgPrompt, "", `Möchten ${youWord} eher fotorealistisch oder illustrativ?`]
          .filter(Boolean)
          .join("\n")
      : [base, attachmentLine, styleHint, `Soll es eher fotorealistisch oder illustrativ sein?`]
          .filter(Boolean)
          .join(" ");
  }

  const shortAnswer = [
    greet,
    attachmentLine,
    styleHint,
    `Hier ist eine schnelle Antwort auf ${yourWord} Prompt:`,
    `"${prompt.length > 120 ? `${prompt.slice(0, 120)}…` : prompt}"`,
    `Wenn ${youWord} möchtest, kann ich das als klare 3‑Schritte‑To‑Do strukturieren.`,
  ]
    .filter(Boolean)
    .join("\n");

  const longAnswer = [
    greet,
    attachmentLine,
    styleHint,
    "",
    `Ich habe ${yourWord} Anfrage so verstanden:`,
    `- Ziel: ein verwertbares Ergebnis liefern`,
    `- Kontext: innerhalb der gewählten Datenzone`,
    "",
    `Vorschlag (3 Schritte):`,
    `1) Zielbild & Anforderungen klären`,
    `2) Inhalt/Struktur erzeugen (inkl. Varianten)`,
    `3) Feinschliff + Ausgabeformat`,
    "",
    `Nächste Frage: Was ist ${yourWord} gewünschtes Format (z.B. Landingpage-Text, E‑Mail, Konzept, Code)?`,
  ]
    .filter(Boolean)
    .join("\n");

  return length === "long" ? longAnswer : shortAnswer;
};

const updateContinueLink = (prompt) => {
  if (!continueLink) return;
  const url = new URL(continueLink.getAttribute("href") || "https://app.vantero.chat/register");
  url.searchParams.set("prompt", prompt);
  url.searchParams.set("model", HERO_STATE.modelMode === "auto" ? "auto" : "manual");
  if (HERO_STATE.modelMode === "manual" && HERO_STATE.modelId) {
    url.searchParams.set("modelId", HERO_STATE.modelId);
  }
  url.searchParams.set("zone", HERO_STATE.dataZone);
  url.searchParams.set("size", HERO_STATE.modelSize);
  url.searchParams.set("tone", HERO_STATE.style.tone);
  url.searchParams.set("pronoun", HERO_STATE.style.pronoun);
  url.searchParams.set("length", HERO_STATE.style.length);
  if ((HERO_STATE.style.custom ?? "").trim()) {
    url.searchParams.set("style", HERO_STATE.style.custom.trim());
  }
  continueLink.setAttribute("href", url.toString());
};

const overlayState = {
  lastFocus: null,
};

const openOverlay = (overlay) => {
  if (!overlay) return;
  overlayState.lastFocus = document.activeElement;
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("overlay-open");

  const panel = overlay.querySelector(".overlay-panel");
  if (panel) {
    panel.focus({ preventScroll: true });
  }
};

const closeOverlay = (overlay) => {
  if (!overlay) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("overlay-open");

  if (overlayState.lastFocus && typeof overlayState.lastFocus.focus === "function") {
    overlayState.lastFocus.focus({ preventScroll: true });
  }
  overlayState.lastFocus = null;
};

const AUTO_CONFIG_DRAFT = {
  dataZone: HERO_STATE.dataZone,
  modelSize: HERO_STATE.modelSize,
};

const syncAutoConfigUI = () => {
  autoConfigZoneButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.zone === AUTO_CONFIG_DRAFT.dataZone);
  });

  autoConfigSizeButtons.forEach((btn) => {
    btn.classList.toggle(
      "is-active",
      btn.dataset.size === AUTO_CONFIG_DRAFT.modelSize
    );
  });
};

const openAutoConfig = () => {
  if (!autoConfigModal) return;
  AUTO_CONFIG_DRAFT.dataZone = HERO_STATE.dataZone;
  AUTO_CONFIG_DRAFT.modelSize = HERO_STATE.modelSize;
  syncAutoConfigUI();
  openOverlay(autoConfigModal);
};

const iconSvg = {
  reasoning: () => `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 4h6v3h3v6h-3v3H9v-3H6V7h3V4z" />
      <path d="M9 10h6" />
      <path d="M12 7v10" />
    </svg>
  `,
  imageInput: () => `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="6.5" width="15" height="11" rx="2" />
      <path d="M7.5 14l2.5-2.5 3.2 3.2 2.3-2.3 2.5 2.6" />
      <path d="M9 9.2h.01" />
    </svg>
  `,
  web: () => `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c2.8 3 2.8 13 0 16" />
    </svg>
  `,
};

const renderModelRow = (model) => {
  const isSelected = HERO_STATE.modelMode === "manual" && HERO_STATE.modelId === model.id;
  const hasImageOutput = model.output.includes("image");

  const logoHtml = model.logo
    ? `<img src="${model.logo}" alt="${model.provider}" loading="lazy" />`
    : `<span class="model-logo-fallback">${model.provider.slice(0, 1)}</span>`;

  const caps = [
    model.capabilities.includes("reasoning")
      ? `<span class="cap-icon" title="Reasoning">${iconSvg.reasoning()}</span>`
      : "",
    model.capabilities.includes("image-input")
      ? `<span class="cap-icon" title="Bild-Input">${iconSvg.imageInput()}</span>`
      : "",
    model.capabilities.includes("web")
      ? `<span class="cap-icon" title="Websuche">${iconSvg.web()}</span>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <button class="model-row ${isSelected ? "is-selected" : ""}" type="button" data-model-id="${model.id}">
      <span class="model-row-left">
        <span class="model-row-logo">${logoHtml}</span>
        <span class="model-row-title">
          <span class="model-row-name">${model.name}</span>
          ${hasImageOutput ? `<span class="model-badge">BILD</span>` : ""}
        </span>
      </span>
      <span class="model-row-right">${caps}</span>
    </button>
  `;
};

const getFilteredModels = () => {
  const query = HERO_STATE.filters.query.trim().toLowerCase();
  const output = HERO_STATE.filters.output;
  const cap = HERO_STATE.filters.cap;

  return MODEL_CATALOG.filter((model) => {
    if (output !== "all" && !model.output.includes(output)) return false;
    if (cap !== "all" && !model.capabilities.includes(cap)) return false;

    if (!query) return true;
    return (
      model.name.toLowerCase().includes(query) ||
      model.provider.toLowerCase().includes(query)
    );
  });
};

const groupByProvider = (models) => {
  const groups = new Map();
  models.forEach((model) => {
    if (!groups.has(model.provider)) groups.set(model.provider, []);
    groups.get(model.provider).push(model);
  });
  return groups;
};

const renderModelList = () => {
  if (!modelModalList) return;
  const models = getFilteredModels();
  const groups = groupByProvider(models);

  const orderedProviders = PROVIDER_ORDER.filter((provider) => groups.has(provider));
  const html = orderedProviders
    .map((provider) => {
      const items = groups.get(provider) ?? [];
      return `
        <section class="provider-section" data-provider="${provider}">
          <p class="provider-label">${provider}</p>
          ${items.map(renderModelRow).join("")}
        </section>
      `;
    })
    .join("");

  modelModalList.innerHTML =
    html ||
    `<p class="model-empty">Keine Modelle gefunden. Bitte Filter anpassen.</p>`;
};

if (navToggle && navLinks) {
  const closeNav = () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.setAttribute("aria-expanded", "false");

  navToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    navLinks.classList.toggle("open");
    navToggle.setAttribute(
      "aria-expanded",
      navLinks.classList.contains("open") ? "true" : "false"
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeNav();
    }
  });
}

faqItems.forEach((item) => {
  item.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    faqItems.forEach((btn) => btn.classList.remove("active"));
    if (!isActive) {
      item.classList.add("active");
    }
  });
});

if (modelToggle && modelMenu) {
  const closeMenu = () => {
    modelMenu.classList.remove("open");
    modelToggle.classList.remove("active");
    modelToggle.setAttribute("aria-expanded", "false");
  };

  closeModelMenu = closeMenu;

  modelToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    modelMenu.classList.toggle("open");
    modelToggle.classList.toggle("active");
    modelToggle.setAttribute(
      "aria-expanded",
      modelMenu.classList.contains("open") ? "true" : "false"
    );
  });

  document.addEventListener("click", (event) => {
    if (
      modelMenu.classList.contains("open") &&
      !modelMenu.contains(event.target) &&
      !modelToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  const openModelPicker = () => {
    if (!modelModal) return;
    updateModelUI();
    renderModelList();
    openOverlay(modelModal);

    if (modelModalSearch) {
      modelModalSearch.value = HERO_STATE.filters.query;
      modelModalSearch.focus({ preventScroll: true });
    }
  };

  modelOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const mode = option.dataset.modelMode;

      if (mode === "auto") {
        HERO_STATE.modelMode = "auto";
        HERO_STATE.modelId = null;
        updateModelUI();
        renderModelList();
        closeMenu();
        return;
      }

      if (mode === "manual" && option.hasAttribute("data-model-modal-open")) {
        closeMenu();
        openModelPicker();
        return;
      }

      if (modelLabel && option.dataset.label) {
        modelLabel.textContent = option.dataset.label;
      }
      closeMenu();
    });
  });
}

if (modelModal) {
  modelModal.querySelectorAll("[data-model-modal-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeOverlay(modelModal));
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (autoConfigModal?.classList.contains("open")) {
    closeOverlay(autoConfigModal);
    return;
  }
  if (modelModal?.classList.contains("open")) {
    closeOverlay(modelModal);
  }
});

if (modelModalSearch) {
  modelModalSearch.addEventListener("input", () => {
    HERO_STATE.filters.query = modelModalSearch.value ?? "";
    renderModelList();
  });
}

outputFilterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    outputFilterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    HERO_STATE.filters.output = btn.dataset.outputFilter ?? "all";
    renderModelList();
  });
});

capFilterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    capFilterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    HERO_STATE.filters.cap = btn.dataset.capFilter ?? "all";
    renderModelList();
  });
});

if (modelModalList) {
  modelModalList.addEventListener("click", (event) => {
    const row = event.target.closest("[data-model-id]");
    if (!row) return;

    HERO_STATE.modelMode = "manual";
    HERO_STATE.modelId = row.dataset.modelId ?? null;
    updateModelUI();
    renderModelList();
    closeOverlay(modelModal);
  });
}

if (autoConfigOpen) {
  autoConfigOpen.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeModelMenu?.();
    openAutoConfig();
  });
}

if (autoConfigModal) {
  autoConfigModal.querySelectorAll("[data-auto-config-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeOverlay(autoConfigModal));
  });
}

autoConfigZoneButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    AUTO_CONFIG_DRAFT.dataZone = btn.dataset.zone ?? "de";
    syncAutoConfigUI();
  });
});

autoConfigSizeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    AUTO_CONFIG_DRAFT.modelSize = btn.dataset.size ?? "m";
    syncAutoConfigUI();
  });
});

if (autoConfigApply) {
  autoConfigApply.addEventListener("click", () => {
    HERO_STATE.dataZone = AUTO_CONFIG_DRAFT.dataZone;
    HERO_STATE.modelSize = AUTO_CONFIG_DRAFT.modelSize;
    updateModelUI();
    closeOverlay(autoConfigModal);
  });
}

if (styleToggle && styleMenu) {
  const closeStyleMenu = () => {
    styleMenu.classList.remove("open");
    styleToggle.classList.remove("active");
    styleToggle.setAttribute("aria-expanded", "false");
  };

  styleToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const nextOpen = !styleMenu.classList.contains("open");
    if (nextOpen) {
      styleMenu.classList.add("open");
      styleToggle.classList.add("active");
      styleToggle.setAttribute("aria-expanded", "true");
      updateStyleUI();
    } else {
      closeStyleMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!styleMenu.classList.contains("open")) return;
    if (styleMenu.contains(event.target) || styleToggle.contains(event.target)) return;
    closeStyleMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeStyleMenu();
  });
}

styleToneButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    HERO_STATE.style.tone = btn.dataset.styleTone ?? "friendly";
    updateStyleUI();
  });
});

stylePronounButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    HERO_STATE.style.pronoun = btn.dataset.stylePronoun ?? "du";
    updateStyleUI();
  });
});

styleLengthButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    HERO_STATE.style.length = btn.dataset.styleLength ?? "short";
    updateStyleUI();
  });
});

if (styleCustomInput) {
  styleCustomInput.addEventListener("input", () => {
    HERO_STATE.style.custom = styleCustomInput.value ?? "";
    updateStyleUI();
  });
}

if (attachToggle && attachMenu) {
  const closeAttachMenu = () => {
    attachMenu.classList.remove("open");
    attachToggle.classList.remove("active");
    attachToggle.setAttribute("aria-expanded", "false");
  };

  attachToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const nextOpen = !attachMenu.classList.contains("open");
    if (nextOpen) {
      attachMenu.classList.add("open");
      attachToggle.classList.add("active");
      attachToggle.setAttribute("aria-expanded", "true");
    } else {
      closeAttachMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!attachMenu.classList.contains("open")) return;
    if (attachMenu.contains(event.target) || attachToggle.contains(event.target)) return;
    closeAttachMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAttachMenu();
  });

  attachOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.attachAction;
      if (action === "files") {
        fileInput?.click();
        closeAttachMenu();
        return;
      }

      const labelMap = {
        gdrive: "Google Drive",
        microsoft: "Microsoft",
        gdocs: "Google Docs",
      };

      const label = labelMap[action] ?? "Anhang";
      HERO_STATE.attachments.push({ id: makeId(), kind: "provider", label });
      renderAttachments();
      closeAttachMenu();
    });
  });
}

if (fileInput) {
  fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files ?? []);
    files.forEach((file) => {
      HERO_STATE.attachments.push({ id: makeId(), kind: "file", label: file.name });
    });
    renderAttachments();
    fileInput.value = "";
  });
}

if (attachmentsEl) {
  attachmentsEl.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("[data-attachment-remove]");
    if (!removeBtn) return;
    const chip = removeBtn.closest("[data-attachment-id]");
    if (!chip) return;
    const id = chip.getAttribute("data-attachment-id");
    HERO_STATE.attachments = HERO_STATE.attachments.filter((att) => att.id !== id);
    renderAttachments();
  });
}

updateModelUI();
updateStyleUI();
renderAttachments();
renderModelList();

const MAX_PROMPT_CHARS = 8000;
const numberFormatter = new Intl.NumberFormat("de-DE");
const formatNumber = (value) => numberFormatter.format(value);

const updatePromptUI = () => {
  if (!promptTextarea) return;

  const value = promptTextarea.value ?? "";
  const trimmed = value.trim();
  const count = Math.min(value.length, MAX_PROMPT_CHARS);

  if (promptCount) {
    promptCount.textContent = `${formatNumber(count)} / ${formatNumber(MAX_PROMPT_CHARS)}`;
  }

  if (promptSend) {
    const disabled = trimmed.length === 0;
    promptSend.disabled = disabled;
    promptSend.setAttribute("aria-disabled", disabled ? "true" : "false");
  }
};

if (promptTextarea) {
  promptTextarea.setAttribute("maxlength", String(MAX_PROMPT_CHARS));
  promptTextarea.addEventListener("input", updatePromptUI);
  updatePromptUI();
}

if (promptSend && promptTextarea) {
  let isBusy = false;

  const sendDemo = () => {
    if (isBusy) return;
    const prompt = promptTextarea.value.trim();
    if (!prompt) {
      promptTextarea.focus();
      return;
    }

    isBusy = true;
    promptSend.disabled = true;

    if (demoChat) {
      demoChat.hidden = false;
    }

    appendBubble("user", prompt);

    const typing = appendTyping();
    const meta = buildChatMeta();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduceMotion ? 120 : 650 + Math.round(Math.random() * 450);

    window.setTimeout(() => {
      typing?.remove?.();
      appendBubble("ai", generateDemoAnswer(prompt), meta);

      if (chatCta) {
        chatCta.hidden = false;
      }
      updateContinueLink(prompt);

      // Composer zurücksetzen (wie in der App pro Nachricht)
      promptTextarea.value = "";
      HERO_STATE.attachments = [];
      renderAttachments();
      updatePromptUI();

      isBusy = false;
      promptTextarea.focus();
    }, delay);
  };

  promptSend.addEventListener("click", sendDemo);

  promptTextarea.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.isComposing) return;
    event.preventDefault();
    sendDemo();
  });
}

const setupScrollReveals = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  const addReveal = (el, delay = 0) => {
    if (!el || el.classList.contains("reveal")) return;
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", `${delay}ms`);
    observer.observe(el);
  };

  Array.from(document.querySelectorAll(".hero-content > *")).forEach((el, i) => {
    addReveal(el, i * 70);
  });

  document.querySelectorAll(".section-header").forEach((el) => addReveal(el, 0));

  document.querySelectorAll(".split").forEach((split) => {
    Array.from(split.children).forEach((child, i) => addReveal(child, i * 90));
  });

  document.querySelectorAll(".grid").forEach((grid) => {
    grid.querySelectorAll(".card, .price-card").forEach((el, i) => addReveal(el, i * 70));
  });

  document.querySelectorAll(".media-card").forEach((el) => addReveal(el, 60));
  document.querySelectorAll(".badge").forEach((el, i) => addReveal(el, i * 60));
  document.querySelectorAll(".faq-item").forEach((el, i) => addReveal(el, i * 50));
  document.querySelectorAll(".cta-card").forEach((el) => addReveal(el, 0));
};

setupScrollReveals();
