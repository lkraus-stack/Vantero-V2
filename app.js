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
const modelLabel = document.querySelector(".prompt-select-label");
const promptTextarea = document.querySelector(".prompt-textarea");
const promptSend = document.querySelector("[data-prompt-send]");
const promptCount = document.querySelector(".prompt-count");

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

  modelOptions.forEach((option) => {
    option.addEventListener("click", () => {
      modelOptions.forEach((btn) => btn.classList.remove("is-active"));
      option.classList.add("is-active");
      if (modelLabel && option.dataset.label) {
        modelLabel.textContent = option.dataset.label;
      }
      closeMenu();
    });
  });
}

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
  const redirectToRegister = () => {
    const prompt = promptTextarea.value.trim();
    if (!prompt) {
      promptTextarea.focus();
      return;
    }

    const label = modelLabel ? modelLabel.textContent.trim() : "Automatische Auswahl";
    const model = label === "Automatische Auswahl" ? "auto" : "manual";
    const url = new URL("https://app.vantero.chat/register");
    url.searchParams.set("prompt", prompt);
    url.searchParams.set("model", model);
    window.location.href = url.toString();
  };

  promptSend.addEventListener("click", redirectToRegister);
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
