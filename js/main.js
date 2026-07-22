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
