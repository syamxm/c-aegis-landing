document.querySelectorAll("[data-download]").forEach(a => { a.href = DOWNLOAD_URL; });

document.getElementById("carousel").innerHTML = SHOTS.map(s => `
  <div class="shot">
    <div class="phone-frame phone-frame--shot">
      <div class="phone-screen phone-screen--shot">
        <div class="phone-notch phone-notch--shot"></div>
        <img class="phone-img" src="${s.file}" alt="${s.title}">
      </div>
    </div>
    <div class="shot-cap">${s.title}</div>
  </div>`).join("");
