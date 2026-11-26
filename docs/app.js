(() => {
  const REPO = "dinhdobathi1992/homebrew-zenwave";
  const RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`;

  // Install method widget tabs
  const installTabs = document.querySelectorAll("[data-install-tab]");
  const installPanels = document.querySelectorAll("[data-install-panel]");
  const heroCopyBtn = document.getElementById("hero-copy-btn");

  for (const tab of installTabs) {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-install-tab");
      for (const t of installTabs) {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      }
      for (const p of installPanels) {
        const show = p.getAttribute("data-install-panel") === target;
        p.hidden = !show;
        p.classList.toggle("is-active", show);
      }
      if (heroCopyBtn) {
        heroCopyBtn.hidden = target !== "brew";
      }
    });
  }

  // Copy buttons
  for (const btn of document.querySelectorAll("[data-copy-target]")) {
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!target) return;
      const text = target.textContent.replace(/^\$ /gm, "").trim();
      const label = btn.querySelector(".copy-label") || btn;
      try {
        await navigator.clipboard.writeText(text);
        const orig = label.textContent;
        label.textContent = "Copied ✓";
        btn.classList.add("copied");
        setTimeout(() => {
          label.textContent = orig;
          btn.classList.remove("copied");
        }, 1600);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(target);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  }

  // Interactive Screenshot Showcase
  const shotTabs = [...document.querySelectorAll("[data-shot-tab]")];
  const showcaseTrigger = document.getElementById("showcase-trigger");
  const showcaseImg = document.getElementById("showcase-img");
  const showcaseTitle = document.getElementById("showcase-title");
  const showcaseCaption = document.getElementById("showcase-caption");
  let activeShotIdx = 0;

  function selectShot(idx) {
    if (!shotTabs.length) return;
    activeShotIdx = (idx + shotTabs.length) % shotTabs.length;
    const tab = shotTabs[activeShotIdx];
    const src = tab.getAttribute("data-src");
    const caption = tab.getAttribute("data-caption") || "";
    const shortTitle = tab.textContent.trim();

    for (const t of shotTabs) {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    }
    if (showcaseImg && src) {
      showcaseImg.src = src;
      showcaseImg.alt = caption;
    }
    if (showcaseTitle) showcaseTitle.textContent = shortTitle;
    if (showcaseCaption) showcaseCaption.textContent = caption;
    if (showcaseTrigger && src) {
      showcaseTrigger.setAttribute("data-lightbox-src", src);
      showcaseTrigger.setAttribute("data-lightbox-title", caption);
    }
  }

  for (let i = 0; i < shotTabs.length; i++) {
    shotTabs[i].addEventListener("click", () => selectShot(i));
    shotTabs[i].addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        selectShot(i + 1);
        shotTabs[activeShotIdx].focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        selectShot(i - 1);
        shotTabs[activeShotIdx].focus();
      }
    });
  }

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src, title) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || "";
    if (lightboxCaption) lightboxCaption.textContent = title || "";
    lightbox.hidden = false;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = "";
  }

  for (const trigger of document.querySelectorAll("[data-lightbox-src]")) {
    trigger.addEventListener("click", () => {
      openLightbox(trigger.getAttribute("data-lightbox-src"), trigger.getAttribute("data-lightbox-title"));
    });
  }

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
  });

  // Pointer glow on Bento cards
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const card of document.querySelectorAll(".bento-card")) {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    }
  }

  // Scroll reveal animations
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    for (const el of reveals) io.observe(el);
  } else {
    for (const el of reveals) el.classList.add("is-visible");
  }

  // Live latest release version & download link
  fetch(RELEASE_API, { headers: { Accept: "application/vnd.github+json" } })
    .then((res) => (res.ok ? res.json() : null))
    .then((release) => {
      if (!release || typeof release.tag_name !== "string") return;
      const match = release.tag_name.match(/^zw-v(\d+\.\d+\.\d+)$/);
      if (!match) return;
      const ver = match[1];
      for (const id of ["nav-version", "hero-version", "download-ver", "dl-ver-inline"]) {
        const el = document.getElementById(id);
        if (el) el.textContent = `v${ver}`;
      }
      const zipAsset = Array.isArray(release.assets)
        ? release.assets.find((a) => typeof a?.name === "string" && /^ZenWave-darwin-arm64-.*\.zip$/.test(a.name))
        : null;
      const dlBtn = document.getElementById("download-btn");
      if (dlBtn && zipAsset?.browser_download_url) {
        dlBtn.href = zipAsset.browser_download_url;
      }
    })
    .catch(() => {});
})();
