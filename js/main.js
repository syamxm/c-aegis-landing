document.querySelectorAll("[data-download]").forEach(a => { a.href = DOWNLOAD_URL; });

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
    <div class="phone-frame phone-frame--shot">
      <div class="phone-screen phone-screen--shot">
        <div class="phone-notch phone-notch--shot"></div>
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
