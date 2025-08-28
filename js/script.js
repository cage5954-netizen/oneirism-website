document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loading-screen");
  const main = document.querySelector("main");

  if (main) main.classList.add("fade-in");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 600);
  }

  initPage();
  enableSPANavigation();
  enableScrollSectionHighlighting();
});

/* ------------------------------
   Reveal-on-scroll animation
------------------------------ */
function revealElements() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  });

  document.querySelectorAll(".highlight-card, .stage, .gallery-cta-banner, .character-card")
    .forEach(el => {
      el.classList.add("hidden");
      observer.observe(el);
    });
}

/* ------------------------------
   Music Toggle / Trailer Pause
------------------------------ */
function initMusicControls() {
  const music = document.getElementById("bg-music");
  const toggle = document.getElementById("music-toggle");
  const trailer = document.getElementById("trailer-video");

  if (music && toggle) {
    let muted = true;
    music.volume = 0.5;
    music.muted = true;

    toggle.addEventListener("click", () => {
      muted = !muted;
      music.muted = muted;
      toggle.innerHTML = muted
        ? '<i class="fas fa-volume-mute"></i>'
        : '<i class="fas fa-volume-up"></i>';

      if (music.paused) {
        music.play().catch(() => {});
      }
    });
  }

  if (music && trailer) {
    trailer.addEventListener("play", () => {
      if (!music.paused) music.pause();
    });
    trailer.addEventListener("pause", () => {
      if (!music.muted && music.paused) {
        music.play().catch(() => {});
      }
    });
  }
}

/* ------------------------------
   Single Page App Navigation
------------------------------ */
function enableSPANavigation() {
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");

      if (!href.endsWith(".html")) return;

      e.preventDefault();
      fetch(href)
        .then(res => res.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const newMain = doc.querySelector("main");
          const currentMain = document.querySelector("main");

          if (newMain && currentMain) {
            newMain.classList.add("fade-in");
            currentMain.replaceWith(newMain);
            document.title = doc.title;
            history.pushState(null, "", href);

            initPage();
          }
        });
    });
  });
}

/* ------------------------------
   Browser Back/Forward Support
------------------------------ */
window.addEventListener("popstate", () => {
  fetch(location.pathname)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const newMain = doc.querySelector("main");
      const currentMain = document.querySelector("main");

      if (newMain && currentMain) {
        newMain.classList.add("fade-in");
        currentMain.replaceWith(newMain);
        document.title = doc.title;

        initPage();
      }
    });
});

/* ------------------------------
   Page Init Hook
------------------------------ */
function initPage() {
  const main = document.querySelector("main");
  if (main) main.classList.add("fade-in");

  revealElements();
  enableScrollSectionHighlighting();
  initMusicControls();

  // 🔥 Reinject .hero content for characters.html (SPA fix)
  const isCharacterPage = location.pathname.endsWith("characters.html");
  const heroSection = document.querySelector(".hero.hero-characters");

  if (isCharacterPage && heroSection) {
    heroSection.innerHTML = `
      <div class="hero-overlay">
        <h1 class="glow-text">THE WANDERERS</h1>
        <h2>THEIR ROLES ARE UNCLEAR.</h2>
        <h3>BUT THEY’RE NOT GONE.</h3>
      </div>
    `;
  }
}

/* ------------------------------
   Scroll Highlight for Sections
------------------------------ */
function enableScrollSectionHighlighting() {
  const sectionLinks = document.querySelectorAll(".section-nav a");
  const sections = Array.from(sectionLinks).map(link =>
    document.querySelector(link.getAttribute("href"))
  );

  if (sections.length === 0) return;

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (scrollY >= top) {
        current = section.getAttribute("id");
      }
    });

    sectionLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}
