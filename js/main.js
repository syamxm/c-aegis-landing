document.querySelectorAll("[data-download]").forEach(a => { a.href = DOWNLOAD_URL; a.setAttribute("download", ""); });

const caption = (file, key) => file
  .replace(/\.[^.]+$/, "")
  .replace(new RegExp(`^${key}[_-]`), "")
  .replace(/[_-]/g, " ")
  .replace(/([a-z])([A-Z])/g, "$1 $2")
  .replace(/\b\w/g, c => c.toUpperCase());

const shot = (file, key) => {
  const cap = caption(file, key);
  return `
  <figure class="shot">
    <div class="bezel bezel--phone">
      <div class="bezel-core phone-screen">
        <div class="phone-notch"></div>
        <img class="phone-img" src="${SHOTS_DIR}/${key}/${file}" alt="${cap}" loading="lazy">
      </div>
    </div>
    <figcaption class="shot-cap">${cap}</figcaption>
  </figure>`;
};

document.getElementById("shotTabs").innerHTML = SHOT_GROUPS.map(g =>
  `<button class="shot-tab${g.key === SHOT_DEFAULT ? " active" : ""}" role="tab" aria-selected="${g.key === SHOT_DEFAULT}" data-group="${g.key}">${g.label}</button>`
).join("");

document.getElementById("shotPanels").innerHTML = SHOT_GROUPS.map(g =>
  `<div class="shot-grid${g.key === SHOT_DEFAULT ? " active" : ""}" role="tabpanel" aria-label="${g.label}" data-group="${g.key}">${g.files.map(f => shot(f, g.key)).join("")}</div>`
).join("");

document.getElementById("shotTabs").addEventListener("click", e => {
  const tab = e.target.closest(".shot-tab");
  if (!tab) return;
  const key = tab.dataset.group;
  document.querySelectorAll(".shot-tab").forEach(t => {
    const on = t.dataset.group === key;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on);
  });
  document.querySelectorAll(".shot-grid").forEach(p => p.classList.toggle("active", p.dataset.group === key));
});

document.querySelectorAll(".shot-grid").forEach(rail => {
  rail.addEventListener("wheel", e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    rail.scrollLeft += e.deltaY;
  }, { passive: false });

  let startX = 0;
  let startScroll = 0;
  let dragging = false;

  rail.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse") return;
    dragging = true;
    startX = e.clientX;
    startScroll = rail.scrollLeft;
    rail.setPointerCapture(e.pointerId);
  });
  rail.addEventListener("pointermove", e => {
    if (!dragging) return;
    if (Math.abs(e.clientX - startX) > 4) rail.classList.add("is-dragging");
    rail.scrollLeft = startScroll - (e.clientX - startX);
  });
  const endDrag = () => {
    dragging = false;
    rail.classList.remove("is-dragging");
  };
  rail.addEventListener("pointerup", endDrag);
  rail.addEventListener("pointercancel", endDrag);
});

/* ---------- Demo player ---------- */
const demoVideo = document.getElementById("demoVideo");
const demoViewport = document.getElementById("demoViewport");
const demoControls = document.querySelector(".demo-controls");
const demoPlayBtn = document.getElementById("demoPlay");
const demoBigPlay = document.getElementById("demoBigPlay");
const demoRestart = document.getElementById("demoRestart");
const demoSpeedBtn = document.getElementById("demoSpeed");
const demoScrub = document.getElementById("demoScrub");
const demoTime = document.getElementById("demoTime");
const demoTabs = document.getElementById("demoTabs");
const demoList = document.getElementById("demoList");

const DEMO_SPEEDS = [1, 1.5, 2];
let demoRate = 1;
let demoGroup = DEMO_GROUPS.find(g => g.key === DEMO_DEFAULT);
let demoIndex = 0;

const posterFor = (group, clip) => `${DEMOS_DIR}/posters/${group.key}_${clip.file.replace(/\.mp4$/, "")}.jpg`;

const fmtTime = s => {
  if (!isFinite(s)) s = 0;
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

const setDemoPlayState = playing => {
  demoViewport.classList.toggle("is-playing", playing);
  demoControls.classList.toggle("is-playing", playing);
  demoPlayBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
};

const renderDemoList = () => {
  demoList.innerHTML = demoGroup.clips.map((c, i) => `
    <button class="demo-item${i === demoIndex ? " active" : ""}" role="tab" aria-selected="${i === demoIndex}" data-index="${i}">
      <span class="demo-item-num">${String(i + 1).padStart(2, "0")}</span>
      <span>
        <span class="demo-item-title">${c.title}</span>
        <span class="demo-item-desc">${c.desc}</span>
      </span>
      <span class="demo-item-dur">${c.dur}</span>
    </button>`
  ).join("");
};

let demoLoaded = false;

const loadDemoClip = (index, { autoplay = false } = {}) => {
  demoLoaded = true;
  demoIndex = index;
  const clip = demoGroup.clips[index];
  demoVideo.pause();
  demoVideo.poster = posterFor(demoGroup, clip);
  demoVideo.src = `${DEMOS_DIR}/${demoGroup.key}/${clip.file}`;
  demoVideo.playbackRate = demoRate;
  demoScrub.value = 0;
  demoScrub.style.setProperty("--fill", "0%");
  demoTime.textContent = `0:00 / ${clip.dur}`;
  setDemoPlayState(false);
  renderDemoList();
  if (autoplay) demoVideo.play();
};

const toggleDemoPlay = () => {
  if (demoVideo.paused) demoVideo.play();
  else demoVideo.pause();
};

demoTabs.innerHTML = DEMO_GROUPS.map(g =>
  `<button class="shot-tab${g.key === DEMO_DEFAULT ? " active" : ""}" role="tab" aria-selected="${g.key === DEMO_DEFAULT}" data-group="${g.key}">${g.label}</button>`
).join("");

demoTabs.addEventListener("click", e => {
  const tab = e.target.closest(".shot-tab");
  if (!tab || tab.dataset.group === demoGroup.key) return;
  demoTabs.querySelectorAll(".shot-tab").forEach(t => {
    const on = t.dataset.group === tab.dataset.group;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on);
  });
  demoGroup = DEMO_GROUPS.find(g => g.key === tab.dataset.group);
  loadDemoClip(0);
});

demoList.addEventListener("click", e => {
  const item = e.target.closest(".demo-item");
  if (!item) return;
  const wasPlaying = !demoVideo.paused;
  loadDemoClip(Number(item.dataset.index), { autoplay: wasPlaying });
});

demoPlayBtn.addEventListener("click", toggleDemoPlay);
demoBigPlay.addEventListener("click", e => {
  e.stopPropagation();
  toggleDemoPlay();
});

demoRestart.addEventListener("click", () => {
  demoVideo.currentTime = 0;
  demoScrub.value = 0;
  demoScrub.style.setProperty("--fill", "0%");
});

demoSpeedBtn.addEventListener("click", () => {
  demoRate = DEMO_SPEEDS[(DEMO_SPEEDS.indexOf(demoRate) + 1) % DEMO_SPEEDS.length];
  demoVideo.playbackRate = demoRate;
  demoSpeedBtn.textContent = `${demoRate}×`;
  demoSpeedBtn.setAttribute("aria-label", `Playback speed ${demoRate}x`);
});

demoVideo.addEventListener("play", () => setDemoPlayState(true));
demoVideo.addEventListener("pause", () => setDemoPlayState(false));
demoVideo.addEventListener("timeupdate", () => {
  if (!demoVideo.duration) return;
  const pct = (demoVideo.currentTime / demoVideo.duration) * 100;
  demoScrub.value = Math.round(pct * 10);
  demoScrub.style.setProperty("--fill", `${pct}%`);
  demoTime.textContent = `${fmtTime(demoVideo.currentTime)} / ${fmtTime(demoVideo.duration)}`;
});

demoScrub.addEventListener("input", () => {
  if (!demoVideo.duration) return;
  const pct = demoScrub.value / 1000;
  demoVideo.currentTime = pct * demoVideo.duration;
  demoScrub.style.setProperty("--fill", `${pct * 100}%`);
});

demoViewport.addEventListener("click", toggleDemoPlay);
demoViewport.addEventListener("keydown", e => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    toggleDemoPlay();
  } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 5 : -5;
    demoVideo.currentTime = Math.min(Math.max(demoVideo.currentTime + step, 0), demoVideo.duration || 0);
  }
});

renderDemoList();
demoTime.textContent = `0:00 / ${demoGroup.clips[0].dur}`;
const demoLazyObserver = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  demoLazyObserver.disconnect();
  if (!demoLoaded) loadDemoClip(demoIndex);
}, { rootMargin: "200px" });
demoLazyObserver.observe(document.querySelector(".demos"));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const navIsland = document.getElementById("navIsland");
const navSentinel = document.createElement("div");
navSentinel.style.cssText = "position:absolute;top:0;height:80px;width:1px;";
document.body.prepend(navSentinel);
new IntersectionObserver(([entry]) => {
  navIsland.classList.toggle("is-scrolled", !entry.isIntersecting);
}).observe(navSentinel);

const burger = document.getElementById("navBurger");
const overlay = document.getElementById("navOverlay");

const setMenu = open => {
  burger.classList.toggle("is-open", open);
  overlay.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
  overlay.setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";
};

burger.addEventListener("click", () => setMenu(!overlay.classList.contains("is-open")));
overlay.addEventListener("click", () => setMenu(false));

const canMagnet = window.matchMedia("(pointer: fine)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canMagnet) {
  document.querySelectorAll(".btn-pill").forEach(btn => {
    btn.addEventListener("pointermove", e => {
      const r = btn.getBoundingClientRect();
      const mx = (e.clientX - (r.left + r.width / 2)) * 0.3;
      const my = (e.clientY - (r.top + r.height / 2)) * 0.3;
      btn.style.transform = `translate(${mx}px, ${my}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });
}
