(() => {
  const REPO = "dinhdobathi1992/homebrew-zenwave";
  const RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`;

  // Copy buttons
  for (const btn of document.querySelectorAll("[data-copy-target]")) {
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!target) return;
      const text = target.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = orig;
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

  // Live latest release version & download link
  fetch(RELEASE_API, { headers: { Accept: "application/vnd.github+json" } })
    .then((res) => (res.ok ? res.json() : null))
    .then((release) => {
      if (!release || typeof release.tag_name !== "string") return;
      const match = release.tag_name.match(/^zw-v(\d+\.\d+\.\d+)$/);
      if (!match) return;
      const ver = match[1];
      const navVer = document.getElementById("nav-version");
      const dlVer = document.getElementById("download-ver");
      if (navVer) navVer.textContent = `v${ver}`;
      if (dlVer) dlVer.textContent = `v${ver}`;

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
