document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
if (header) {
  let headerTicking = false;
  const setHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  const onHeaderScroll = () => {
    if (headerTicking) return;
    headerTicking = true;
    window.requestAnimationFrame(() => {
      setHeaderState();
      headerTicking = false;
    });
  };

  setHeaderState();
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
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
const arenaConfigOpen = document.querySelector("[data-arena-config-open]");
const arenaModal = document.querySelector("[data-arena-modal]");
const arenaApply = document.querySelector("[data-arena-apply]");
const arenaCloseButtons = arenaModal ? arenaModal.querySelectorAll("[data-arena-close]") : [];
const arenaCountButtons = arenaModal ? arenaModal.querySelectorAll("[data-arena-count]") : [];
const arenaViewButtons = arenaModal ? arenaModal.querySelectorAll("[data-arena-view]") : [];
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
const pricingSection = document.querySelector("#preise");

let closeModelMenu = null;

const HERO_STATE = {
  modelMode: "auto", // auto | manual | agent | arena | council
  modelId: null,
  dataZone: "de", // de | fr | eu | us
  modelSize: "m", // s | m | l
  arena: {
    count: 3, // 2 | 3 | 4
    view: "blind", // blind | side
  },
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
    id: "teuken-7b",
    name: "Teuken 7B",
    provider: "Teuken",
    logo: null,
    zone: "de",
    output: ["text"],
    capabilities: [],
    contextLabel: "8K",
    factorLabel: "x0.15",
  },
  {
    id: "mistral-small-24b",
    name: "Mistral Small 24B",
    provider: "Mistral",
    logo: "./assets/logo-mistral.png",
    zone: "de",
    output: ["text"],
    capabilities: [],
    contextLabel: "32K",
    factorLabel: "x0.15",
  },
  {
    id: "gpt-oss-120b",
    name: "GPT-OSS 120B",
    provider: "OpenAI",
    logo: "./assets/logo-gpt5.png",
    zone: "de",
    output: ["text"],
    capabilities: ["reasoning"],
    contextLabel: "128K",
    factorLabel: "x0.25",
  },
  {
    id: "codellama-13b",
    name: "CodeLlama 13B",
    provider: "Meta",
    logo: "./assets/logo-llama.png",
    zone: "de",
    output: ["text"],
    capabilities: ["code"],
    contextLabel: "16K",
    factorLabel: "x0.35",
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta",
    logo: "./assets/logo-llama.png",
    zone: "de",
    output: ["text"],
    capabilities: ["reasoning"],
    contextLabel: "128K",
    factorLabel: "x0.55",
  },
  {
    id: "llama-3.1-405b",
    name: "Llama 3.1 405B",
    provider: "Meta",
    logo: "./assets/logo-llama.png",
    zone: "de",
    output: ["text"],
    capabilities: ["reasoning"],
    contextLabel: "128K",
    factorLabel: "x1.20",
  },
  {
    id: "flux-1-schnell",
    name: "FLUX.1 Schnell",
    provider: "Flux",
    logo: null,
    zone: "de",
    output: ["image"],
    capabilities: [],
    contextLabel: "",
    factorLabel: "12.000 Token/Bild",
  },

  // Frankreich (Mistral)
  {
    id: "codestral",
    name: "Codestral",
    provider: "Mistral",
    logo: "./assets/logo-mistral.png",
    zone: "fr",
    output: ["text"],
    capabilities: ["code"],
    contextLabel: "32K",
    factorLabel: "x0.26",
  },
  {
    id: "magistral-small",
    name: "Magistral Small",
    provider: "Mistral",
    logo: "./assets/logo-mistral.png",
    zone: "fr",
    output: ["text"],
    capabilities: ["reasoning", "image-input", "web"],
    contextLabel: "128K",
    factorLabel: "x0.45",
  },
  {
    id: "mistral-medium-3",
    name: "Mistral Medium 3",
    provider: "Mistral",
    logo: "./assets/logo-mistral.png",
    zone: "fr",
    output: ["text"],
    capabilities: ["image-input", "web"],
    contextLabel: "128K",
    factorLabel: "x0.50",
  },
  {
    id: "magistral-medium",
    name: "Magistral Medium",
    provider: "Mistral",
    logo: "./assets/logo-mistral.png",
    zone: "fr",
    output: ["text"],
    capabilities: ["reasoning", "image-input", "web"],
    contextLabel: "128K",
    factorLabel: "x1.50",
  },
  {
    id: "mistral-large-2.1",
    name: "Mistral Large 2.1",
    provider: "Mistral",
    logo: "./assets/logo-mistral.png",
    zone: "fr",
    output: ["text"],
    capabilities: ["reasoning", "image-input", "web"],
    contextLabel: "128K",
    factorLabel: "x1.70",
  },

  // Europa (OpenAI)
  {
    id: "gpt-5-nano",
    name: "ChatGPT-5 Nano",
    provider: "OpenAI",
    logo: "./assets/logo-gpt5.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["image-input"],
    contextLabel: "400K",
    factorLabel: "x0.15",
  },
  {
    id: "gpt-5-mini",
    name: "ChatGPT-5 Mini",
    provider: "OpenAI",
    logo: "./assets/logo-gpt5.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["image-input"],
    contextLabel: "400K",
    factorLabel: "x0.60",
  },
  {
    id: "gpt-4.1",
    name: "ChatGPT-4.1",
    provider: "OpenAI",
    logo: "./assets/logo-gpt5.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["reasoning", "image-input"],
    contextLabel: "1M",
    factorLabel: "x2.00",
  },
  {
    id: "gpt-5",
    name: "ChatGPT-5",
    provider: "OpenAI",
    logo: "./assets/logo-gpt5.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["reasoning", "image-input"],
    contextLabel: "400K",
    factorLabel: "x3.00",
  },

  // Europa (Google)
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["image-input", "web"],
    contextLabel: "1M",
    factorLabel: "x0.20",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["image-input", "web"],
    contextLabel: "1M",
    factorLabel: "x0.20",
  },
  {
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["image-input", "web"],
    contextLabel: "1M",
    factorLabel: "x0.75",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["reasoning", "image-input", "web"],
    contextLabel: "1M",
    factorLabel: "x2.50",
  },
  {
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["reasoning", "image-input", "web"],
    contextLabel: "1M",
    factorLabel: "x3.00",
  },
  {
    id: "imagen-3-fast",
    name: "Imagen 3 Fast",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    zone: "eu",
    output: ["image"],
    capabilities: [],
    contextLabel: "",
    factorLabel: "7.500 Token/Bild",
  },
  {
    id: "imagen-3",
    name: "Imagen 3",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    zone: "eu",
    output: ["image"],
    capabilities: [],
    contextLabel: "",
    factorLabel: "15.000 Token/Bild",
  },
  {
    id: "imagen-4-fast",
    name: "Imagen 4 Fast",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    zone: "eu",
    output: ["image"],
    capabilities: [],
    contextLabel: "",
    factorLabel: "8.000 Token/Bild",
  },
  {
    id: "imagen-4",
    name: "Imagen 4",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    zone: "eu",
    output: ["image"],
    capabilities: [],
    contextLabel: "",
    factorLabel: "15.000 Token/Bild",
  },
  {
    id: "imagen-4-ultra",
    name: "Imagen 4 Ultra",
    provider: "Google",
    logo: "./assets/logo-gemini.png",
    zone: "eu",
    output: ["image"],
    capabilities: [],
    contextLabel: "",
    factorLabel: "22.000 Token/Bild",
  },

  // Europa (Anthropic)
  {
    id: "claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    logo: "./assets/logo-claude.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["image-input"],
    contextLabel: "200K",
    factorLabel: "x1.20",
  },
  {
    id: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    logo: "./assets/logo-claude.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["reasoning", "image-input"],
    contextLabel: "200K",
    factorLabel: "x3.00",
  },
  {
    id: "claude-opus-4.5",
    name: "Claude Opus 4.5",
    provider: "Anthropic",
    logo: "./assets/logo-claude.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["image-input"],
    contextLabel: "200K",
    factorLabel: "x5.00",
  },

  // Europa (Amazon)
  {
    id: "nova-micro",
    name: "Nova Micro",
    provider: "Amazon",
    logo: "./assets/Nova.PNG",
    zone: "eu",
    output: ["text"],
    capabilities: [],
    contextLabel: "128K",
    factorLabel: "x0.10",
  },
  {
    id: "nova-lite",
    name: "Nova Lite",
    provider: "Amazon",
    logo: "./assets/Nova.PNG",
    zone: "eu",
    output: ["text"],
    capabilities: ["image-input"],
    contextLabel: "300K",
    factorLabel: "x0.12",
  },
  {
    id: "nova-pro",
    name: "Nova Pro",
    provider: "Amazon",
    logo: "./assets/Nova.PNG",
    zone: "eu",
    output: ["text"],
    capabilities: ["reasoning", "image-input"],
    contextLabel: "300K",
    factorLabel: "x0.80",
  },
  {
    id: "nova-canvas",
    name: "Nova Canvas",
    provider: "Amazon",
    logo: "./assets/Nova.PNG",
    zone: "eu",
    output: ["image"],
    capabilities: [],
    contextLabel: "",
    factorLabel: "11.000 Token/Bild",
  },

  // Europa (DeepSeek)
  {
    id: "deepseek-v3.1",
    name: "DeepSeek V3.1",
    provider: "DeepSeek",
    logo: "./assets/logo-deepseek.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["reasoning"],
    contextLabel: "128K",
    factorLabel: "x0.30",
  },

  // Europa (Alibaba)
  {
    id: "qwen3-next-80b",
    name: "Qwen3 Next 80B",
    provider: "Alibaba",
    logo: "./assets/logo-qwen.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["reasoning"],
    contextLabel: "256K",
    factorLabel: "x0.40",
  },
  {
    id: "qwen3-vl-235b",
    name: "Qwen3 VL 235B",
    provider: "Alibaba",
    logo: "./assets/logo-qwen.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["reasoning", "image-input"],
    contextLabel: "256K",
    factorLabel: "x0.85",
  },
  {
    id: "qwen3-coder-480b",
    name: "Qwen3 Coder 480B",
    provider: "Alibaba",
    logo: "./assets/logo-qwen.png",
    zone: "eu",
    output: ["text"],
    capabilities: ["code", "reasoning"],
    contextLabel: "128K",
    factorLabel: "x2.10",
  },

  // Europa (Moonshot)
  {
    id: "kimi-k2-thinking",
    name: "Kimi K2 Thinking",
    provider: "Moonshot",
    logo: null,
    zone: "eu",
    output: ["text"],
    capabilities: ["reasoning"],
    contextLabel: "256K",
    factorLabel: "x0.90",
  },

  // USA (Perplexity)
  {
    id: "sonar",
    name: "Sonar",
    provider: "Perplexity",
    logo: "./assets/logo-perplexity.png",
    zone: "us",
    output: ["text"],
    capabilities: ["web"],
    contextLabel: "128K",
    factorLabel: "x1.30",
  },
  {
    id: "sonar-reasoning-pro",
    name: "Sonar Reasoning Pro",
    provider: "Perplexity",
    logo: "./assets/logo-perplexity.png",
    zone: "us",
    output: ["text"],
    capabilities: ["web", "reasoning"],
    contextLabel: "128K",
    factorLabel: "x2.30",
  },
  {
    id: "sonar-deep-research",
    name: "Sonar Deep Research",
    provider: "Perplexity",
    logo: "./assets/logo-perplexity.png",
    zone: "us",
    output: ["text"],
    capabilities: ["web", "reasoning"],
    contextLabel: "128K",
    factorLabel: "x2.80",
  },
  {
    id: "sonar-pro",
    name: "Sonar Pro",
    provider: "Perplexity",
    logo: "./assets/logo-perplexity.png",
    zone: "us",
    output: ["text"],
    capabilities: ["web", "reasoning"],
    contextLabel: "200K",
    factorLabel: "x3.00",
  },
];

const PROVIDER_ORDER = [
  "OpenAI",
  "Google",
  "Anthropic",
  "Amazon",
  "DeepSeek",
  "Mistral",
  "Meta",
  "Alibaba",
  "Moonshot",
  "Perplexity",
  "Teuken",
  "Flux",
];

const getModelById = (id) => MODEL_CATALOG.find((model) => model.id === id) ?? null;

const initialModelIconSrc = modelIcon?.getAttribute("src") ?? null;

const ZONE_ORDER = ["de", "fr", "eu", "us"];

const ZONE_UI = {
  de: {
    flag: "🇩🇪",
    label: "DEUTSCHLAND",
    title: "Alles bleibt in Deutschland.",
    desc: "Datenverarbeitung ausschließlich auf Servern in Deutschland - maximale Datensouveränität.",
  },
  fr: {
    flag: "🇫🇷",
    label: "FRANKREICH",
    title: "Top-Modelle aus Frankreich.",
    desc: "Mistral verarbeitet alle Anfragen nur vorübergehend in seinen französischen Rechenzentren – ohne Speicherung oder Weiterverwendung.",
  },
  eu: {
    flag: "🇪🇺",
    label: "EUROPA",
    title:
      "Die leistungsstärksten KI-Modelle weltweit - sicher gehostet in europäischen Cloud-Regionen.",
    desc: "Alle Anfragen werden ausschließlich innerhalb der EU verarbeitet, keine Datenübertragung außerhalb Europas.",
  },
  us: {
    flag: "🇺🇸",
    label: "USA",
    title: "US-Cloud mit GDPR-Compliance.",
    desc: "Datenverarbeitung in US-Rechenzentren mit GDPR-konformen Datenschutzvereinbarungen (EU-Standardvertragsklauseln).",
  },
};

const updateModelUI = () => {
  if (!modelLabel) return;

  const mode = HERO_STATE.modelMode;
  const specialLabel =
    {
      agent: "Agent-Modus",
      arena: "Arena-Modus",
      council: "Council-Modus",
    }[mode] ?? null;

  if (mode === "auto") {
    modelLabel.textContent = "Automatische Auswahl";
  } else if (mode === "manual") {
    const selected = getModelById(HERO_STATE.modelId);
    modelLabel.textContent = selected?.name ?? "Eigenes Modell";
    if (modelIcon && selected?.logo) {
      modelIcon.src = selected.logo;
      modelIcon.alt = selected.provider;
    }
  } else if (specialLabel) {
    modelLabel.textContent = specialLabel;
  } else {
    modelLabel.textContent = "Automatische Auswahl";
  }

  if (modelIcon && initialModelIconSrc && mode !== "manual") {
    modelIcon.src = initialModelIconSrc;
    modelIcon.alt = "Vantero";
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
        us: "USA",
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
    { de: "Deutschland", fr: "Frankreich", eu: "Europa", us: "USA" }[
      HERO_STATE.dataZone
    ] ?? "Deutschland";
  const sizeLabel = { s: "Klein", m: "Mittel", l: "Groß" }[HERO_STATE.modelSize] ?? "Mittel";
  const modelText = (() => {
    if (HERO_STATE.modelMode === "auto") return "Automatisch";
    if (HERO_STATE.modelMode === "manual") {
      return getModelById(HERO_STATE.modelId)?.name ?? "Eigenes Modell";
    }
    if (HERO_STATE.modelMode === "agent") return "Agent-Modus";
    if (HERO_STATE.modelMode === "council") return "Council-Modus";
    if (HERO_STATE.modelMode === "arena") {
      const count = HERO_STATE.arena?.count ?? 3;
      const view = HERO_STATE.arena?.view ?? "blind";
      const viewLabel = view === "side" ? "Side-by-Side" : "Battle (blind)";
      return `Arena (${count}) · ${viewLabel}`;
    }
    return "Automatisch";
  })();
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
  url.searchParams.set("model", HERO_STATE.modelMode);
  if (HERO_STATE.modelMode === "manual" && HERO_STATE.modelId) {
    url.searchParams.set("modelId", HERO_STATE.modelId);
  }
  if (HERO_STATE.modelMode === "arena") {
    url.searchParams.set("arenaCount", String(HERO_STATE.arena?.count ?? 3));
    url.searchParams.set("arenaView", HERO_STATE.arena?.view ?? "blind");
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

const ARENA_DRAFT = {
  count: HERO_STATE.arena.count,
  view: HERO_STATE.arena.view,
};

const syncArenaUI = () => {
  arenaCountButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.arenaCount === String(ARENA_DRAFT.count));
  });
  arenaViewButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.arenaView === ARENA_DRAFT.view);
  });
};

const openArenaConfig = () => {
  if (!arenaModal) return;
  ARENA_DRAFT.count = HERO_STATE.arena.count;
  ARENA_DRAFT.view = HERO_STATE.arena.view;
  syncArenaUI();
  openOverlay(arenaModal);
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
  code: () => `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 8l-3 4 3 4" />
      <path d="M14 8l3 4-3 4" />
    </svg>
  `,
};

const renderModelRow = (model) => {
  const isSelected = HERO_STATE.modelMode === "manual" && HERO_STATE.modelId === model.id;
  const hasImageOutput = model.output.includes("image");
  const context = model.contextLabel ?? "";
  const factor = model.factorLabel ?? "";

  const logoHtml = model.logo
    ? `<img src="${model.logo}" alt="${model.provider}" loading="lazy" decoding="async" />`
    : `<span class="model-logo-fallback">${model.provider.slice(0, 1)}</span>`;

  const caps = [
    model.capabilities.includes("code")
      ? `<span class="cap-icon" title="Code">${iconSvg.code()}</span>`
      : "",
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
      <span class="model-row-model">
        <span class="model-row-logo">${logoHtml}</span>
        <span class="model-row-title">
          <span class="model-row-name">${model.name}</span>
          ${hasImageOutput ? `<span class="model-badge">BILD</span>` : ""}
        </span>
      </span>
      <span class="model-row-caps">${caps}</span>
      <span class="model-row-context">${context}</span>
      <span class="model-row-factor">${factor}</span>
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
  const zoneMap = new Map();
  models.forEach((model) => {
    const zone = model.zone ?? "eu";
    if (!zoneMap.has(zone)) zoneMap.set(zone, []);
    zoneMap.get(zone).push(model);
  });

  const html = ZONE_ORDER.filter((zone) => zoneMap.has(zone))
    .map((zone) => {
      const zoneModels = zoneMap.get(zone) ?? [];
      const zoneUi = ZONE_UI[zone] ?? null;
      const providerGroups = groupByProvider(zoneModels);
      const orderedProviders = PROVIDER_ORDER.filter((p) => providerGroups.has(p));

      const providerHtml = orderedProviders
        .map((provider) => {
          const items = providerGroups.get(provider) ?? [];
          const textItems = items.filter((m) => m.output.includes("text"));
          const imageItems = items.filter((m) => m.output.includes("image"));
          const subLabel =
            textItems.length > 0 && imageItems.length > 0
              ? `<p class="provider-sub-label">Bildgenerierung</p>`
              : "";

          return `
            <section class="provider-section" data-provider="${provider}">
              <p class="provider-label">${provider}</p>
              ${textItems.map(renderModelRow).join("")}
              ${imageItems.length ? subLabel + imageItems.map(renderModelRow).join("") : ""}
            </section>
          `;
        })
        .join("");

      return `
        <section class="zone-section" data-zone="${zone}">
          ${
            zoneUi
              ? `
            <div class="zone-header">
              <p class="zone-kicker"><span class="zone-flag">${zoneUi.flag}</span> DATENZONE: ${zoneUi.label}</p>
              <p class="zone-title">${zoneUi.title}</p>
              <p class="zone-desc">${zoneUi.desc}</p>
            </div>
          `
              : ""
          }
          ${providerHtml}
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

      if (mode === "arena") {
        closeMenu();
        openArenaConfig();
        return;
      }

      if (mode === "agent" || mode === "council") {
        HERO_STATE.modelMode = mode;
        HERO_STATE.modelId = null;
        updateModelUI();
        renderModelList();
        closeMenu();
        return;
      }

      if (modelLabel && option.dataset.label) {
        HERO_STATE.modelMode = mode || "auto";
        HERO_STATE.modelId = null;
        updateModelUI();
        renderModelList();
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
  if (arenaModal?.classList.contains("open")) {
    closeOverlay(arenaModal);
    return;
  }
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

if (arenaConfigOpen) {
  arenaConfigOpen.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeModelMenu?.();
    openArenaConfig();
  });
}

if (arenaModal) {
  arenaCloseButtons.forEach((btn) => btn.addEventListener("click", () => closeOverlay(arenaModal)));
}

arenaCountButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    ARENA_DRAFT.count = Number(btn.dataset.arenaCount ?? 3);
    syncArenaUI();
  });
});

arenaViewButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    ARENA_DRAFT.view = btn.dataset.arenaView ?? "blind";
    syncArenaUI();
  });
});

if (arenaApply) {
  arenaApply.addEventListener("click", () => {
    HERO_STATE.arena.count = ARENA_DRAFT.count;
    HERO_STATE.arena.view = ARENA_DRAFT.view;
    HERO_STATE.modelMode = "arena";
    HERO_STATE.modelId = null;
    updateModelUI();
    renderModelList();
    closeOverlay(arenaModal);
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

const setupPricingBilling = () => {
  if (!pricingSection) return;

  const billingOptions = Array.from(pricingSection.querySelectorAll("[data-billing-option]"));
  if (billingOptions.length === 0) return;

  const priceValues = Array.from(
    pricingSection.querySelectorAll("[data-price-monthly][data-price-yearly]")
  );
  const priceMetas = Array.from(
    pricingSection.querySelectorAll("[data-meta-monthly][data-meta-yearly]")
  );

  const setBilling = (mode) => {
    const activeMode = mode === "yearly" ? "yearly" : "monthly";
    pricingSection.setAttribute("data-billing", activeMode);

    billingOptions.forEach((btn) => {
      const isActive = btn.getAttribute("data-billing-option") === activeMode;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    priceValues.forEach((el) => {
      const nextValue = activeMode === "yearly" ? el.dataset.priceYearly : el.dataset.priceMonthly;
      if (nextValue) {
        el.textContent = nextValue;
      }
    });

    priceMetas.forEach((el) => {
      const nextMeta = activeMode === "yearly" ? el.dataset.metaYearly : el.dataset.metaMonthly;
      if (nextMeta) {
        el.textContent = nextMeta;
      }
    });
  };

  billingOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-billing-option");
      setBilling(mode);
    });
  });

  setBilling("monthly");
};

const setupAmbientParallax = () => {
  const root = document.documentElement;
  const noReducedMotion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const largeViewport = window.matchMedia("(min-width: 960px)");

  let enabled = false;
  let rafId = 0;
  let lastFrameTs = 0;
  let lastAmbient = null;
  let lastPanther = null;
  const minFrameMs = 28;

  const resetVars = () => {
    root.style.setProperty("--ambient-parallax-y", "0px");
    root.style.setProperty("--hero-panther-shift", "0px");
    lastAmbient = "0px";
    lastPanther = "0px";
  };

  const render = (timestamp) => {
    rafId = 0;
    if (!enabled) return;

    if (timestamp - lastFrameTs < minFrameMs) {
      rafId = window.requestAnimationFrame(render);
      return;
    }
    lastFrameTs = timestamp;

    const scrollY = window.scrollY || 0;
    const ambientShift = Math.max(-12, Math.min(12, scrollY * -0.012));
    const pantherShift = Math.max(-16, Math.min(16, scrollY * -0.03));
    const ambientValue = `${ambientShift.toFixed(2)}px`;
    const pantherValue = `${pantherShift.toFixed(2)}px`;

    if (ambientValue !== lastAmbient) {
      root.style.setProperty("--ambient-parallax-y", ambientValue);
      lastAmbient = ambientValue;
    }
    if (pantherValue !== lastPanther) {
      root.style.setProperty("--hero-panther-shift", pantherValue);
      lastPanther = pantherValue;
    }
  };

  const requestRender = () => {
    if (!enabled || rafId) return;
    rafId = window.requestAnimationFrame(render);
  };

  const onScroll = () => requestRender();

  const setEnabled = (nextEnabled) => {
    if (nextEnabled === enabled) return;
    enabled = nextEnabled;

    if (enabled) {
      window.addEventListener("scroll", onScroll, { passive: true });
      requestRender();
      return;
    }

    window.removeEventListener("scroll", onScroll);
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    lastFrameTs = 0;
    resetVars();
  };

  const syncMode = () => setEnabled(noReducedMotion.matches && largeViewport.matches);

  const bindMediaChange = (queryList, handler) => {
    if (typeof queryList.addEventListener === "function") {
      queryList.addEventListener("change", handler);
      return;
    }
    if (typeof queryList.addListener === "function") {
      queryList.addListener(handler);
    }
  };

  bindMediaChange(noReducedMotion, syncMode);
  bindMediaChange(largeViewport, syncMode);
  syncMode();
};

const setupScrollReveals = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;
  if (!("IntersectionObserver" in window)) return;

  const cappedDelay = (index, step = 55, maxSteps = 6) =>
    Math.min(Math.max(index, 0), maxSteps) * step;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.24, rootMargin: "0px 0px -6% 0px" }
  );

  const addReveal = (el, delay = 0) => {
    if (!el || el.classList.contains("reveal")) return;
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", `${delay}ms`);
    observer.observe(el);
  };

  Array.from(document.querySelectorAll(".hero-content > *")).forEach((el, i) => {
    addReveal(el, cappedDelay(i, 60, 5));
  });

  document.querySelectorAll(".section-header").forEach((el) => addReveal(el, 0));

  document.querySelectorAll(".split").forEach((split) => {
    Array.from(split.children).forEach((child, i) => addReveal(child, cappedDelay(i, 80, 2)));
  });

  document.querySelectorAll(".grid").forEach((grid) => {
    const items = Array.from(
      grid.querySelectorAll(":scope > .card, :scope > .price-card, :scope > .app-feature-card")
    );
    items.forEach((el, i) => addReveal(el, cappedDelay(i, 50, 6)));
  });

  document.querySelectorAll(".media-card").forEach((el) => addReveal(el, 60));
  document.querySelectorAll(".badge").forEach((el, i) => addReveal(el, cappedDelay(i, 46, 4)));
  document.querySelectorAll(".faq-item").forEach((el, i) => addReveal(el, cappedDelay(i, 44, 4)));
  document.querySelectorAll(".cta-card").forEach((el) => addReveal(el, 0));
};

setupAnchorFlow();
setupAmbientParallax();
setupScrollReveals();
setupPricingBilling();

// ── Models section: interactive preview ──
const setupModelsPreview = () => {
  const section = document.querySelector("#models");
  if (!section) return;

  const cards = Array.from(section.querySelectorAll("[data-model-card][data-model-id]"));
  if (cards.length === 0) return;

  const previewKicker = section.querySelector("[data-model-preview-kicker]");
  const previewTitle = section.querySelector("[data-model-preview-title]");
  const previewDesc = section.querySelector("[data-model-preview-desc]");
  const previewPills = section.querySelector("[data-model-preview-pills]");

  const parsePills = (value) =>
    String(value ?? "")
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

  const getCardData = (card) => {
    const titleEl = card.querySelector(".model-card-title");
    const descEl = card.querySelector(".model-card-desc");

    return {
      id: card.getAttribute("data-model-id") ?? "",
      kicker: card.getAttribute("data-model-kicker") ?? "",
      title: titleEl ? titleEl.textContent.trim() : "",
      desc: descEl ? descEl.textContent.trim() : "",
      pills: parsePills(card.getAttribute("data-model-pills")),
    };
  };

  const setActive = (targetId) => {
    const nextCard = cards.find((c) => c.getAttribute("data-model-id") === targetId);
    if (!nextCard) return;

    cards.forEach((card) => {
      card.classList.remove("is-active");
      card.setAttribute("aria-pressed", "false");
    });

    nextCard.classList.add("is-active");
    nextCard.setAttribute("aria-pressed", "true");

    const data = getCardData(nextCard);
    if (previewKicker) previewKicker.textContent = data.kicker || "Model";
    if (previewTitle) previewTitle.textContent = data.title || "Model";
    if (previewDesc) previewDesc.textContent = data.desc || "";

    if (previewPills) {
      previewPills.innerHTML = "";
      data.pills.slice(0, 6).forEach((pill) => {
        const el = document.createElement("span");
        el.className = "models-pill";
        el.textContent = pill;
        previewPills.appendChild(el);
      });
    }
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-model-id");
      if (!id) return;
      setActive(id);
    });
  });

  const initial =
    cards.find((c) => c.getAttribute("aria-pressed") === "true") ??
    cards.find((c) => c.classList.contains("is-active")) ??
    cards[0];

  const initialId = initial?.getAttribute("data-model-id");
  if (initialId) setActive(initialId);
};

setupModelsPreview();
