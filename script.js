"use strict";

const DATA_URL = "data/champions-roster.json";
const STORAGE_KEY = "pokemon-champions-tracker.owned.v1";
const TYPE_LABELS = {
  normal: "一般", fighting: "格鬥", flying: "飛行", poison: "毒", ground: "地面", rock: "岩石",
  bug: "蟲", ghost: "幽靈", steel: "鋼", fire: "火", water: "水", grass: "草",
  electric: "電", psychic: "超能力", ice: "冰", dragon: "龍", dark: "惡", fairy: "妖精",
};

const app = document.querySelector("#app");
let roster = [];
let ownedKeys = loadOwnedKeys();

function loadOwnedKeys() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved.filter((key) => typeof key === "string") : []);
  } catch {
    return new Set();
  }
}

function saveOwnedKeys() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ownedKeys]));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatVersion(value) {
  const version = String(value || "").trim();
  if (!version) return "";
  return version.toLowerCase().startsWith("ver") ? version : `Ver ${version}`;
}

function cardMarkup(entry, index) {
  const key = String(entry.key || entry.slug || `${entry.dexNumber}-${index}`);
  const isOwned = ownedKeys.has(key);
  const name = entry.displayName || entry.nameZh || entry.name || "未知寶可夢";
  const image = entry.image || entry.imageUrl || "";
  const fallbackImage = entry.fallbackImage || entry.fallbackImageUrl || "";

  return `
    <article class="pokemon-card${isOwned ? " is-owned" : ""}" data-key="${escapeHtml(key)}" data-name="${escapeHtml(name.toLocaleLowerCase("zh-Hant"))}" data-types="${escapeHtml((entry.types || []).join(" "))}">
      <span class="roster-number" aria-hidden="true">#${index + 1}</span>
      <button
        class="owned-toggle"
        type="button"
        aria-label="${escapeHtml(isOwned ? `取消標記 ${name}` : `標記已擁有 ${name}`)}"
        aria-pressed="${isOwned}"
        title="${isOwned ? "取消已擁有" : "標記為已擁有"}"
      >
        <span aria-hidden="true">${isOwned ? "✓" : ""}</span>
      </button>
      <div class="card-content">
        <div class="image-stage">
          <img
            src="${escapeHtml(image)}"
            data-fallback="${escapeHtml(fallbackImage)}"
            alt="${escapeHtml(name)}"
            loading="lazy"
            decoding="async"
          />
        </div>
        <strong>${escapeHtml(name)}</strong>
      </div>
    </article>`;
}

function render() {
  const ownedCount = roster.reduce((count, entry, index) => {
    const key = String(entry.key || entry.slug || `${entry.dexNumber}-${index}`);
    return count + Number(ownedKeys.has(key));
  }, 0);
  const percentage = roster.length ? Math.round((ownedCount / roster.length) * 100) : 0;
  const metadata = window.rosterMetadata || {};
  const availableTypes = Object.entries(TYPE_LABELS).filter(([type]) => roster.some(entry => entry.types?.includes(type)));
  const selectedTypes = new Set();
  let typeMode = "or";

  app.innerHTML = `
    <section class="hero-panel">
      <div class="hero-inner">
        <div>
          <p class="eyebrow">MY CHAMPIONS COLLECTION</p>
          <h1>Champions 圖鑑</h1>
          <p class="hero-copy">點擊每張卡片右上角的圓圈，記錄你已擁有的寶可夢。紀錄只會保存在目前瀏覽器。</p>
        </div>
        <div class="release-badge" aria-label="目前資料版本">
          <strong>賽制：${escapeHtml(metadata.ruleset || "M-C")}</strong>
          <span>${escapeHtml(formatVersion(metadata.version || "1.2.0"))}</span>
        </div>
      </div>
    </section>

    <section class="collection-panel" aria-labelledby="collection-title">
      <div class="collection-progress-row">
        <div class="collection-summary">
          <div>
            <p class="summary-label" id="collection-title">已擁有</p>
            <p class="summary-count"><strong id="owned-count">${ownedCount}／${roster.length}</strong></p>
          </div>
        </div>
        <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${roster.length}" aria-valuenow="${ownedCount}" aria-label="收藏進度">
          <span id="progress-bar" style="width: ${percentage}%"></span>
        </div>
      </div>
      <div class="collection-filter-row">
        <label class="collection-search">
          <span class="search-icon" aria-hidden="true"></span>
          <span class="visually-hidden">搜尋名稱</span>
          <input id="roster-search" type="search" placeholder="輸入寶可夢名稱" autocomplete="off" />
        </label>
        <button class="collection-filter-toggle" type="button" aria-expanded="false">篩選</button>
        <div class="collection-filter-panel" hidden>
          <div class="filter-heading">
            <span class="filter-label">屬性</span>
            <div class="logic-toggle" aria-label="屬性篩選邏輯">
              <button type="button" data-type-mode="or" class="active" aria-pressed="true">OR 任一</button>
              <button type="button" data-type-mode="and" aria-pressed="false">AND 全部</button>
            </div>
          </div>
          <div class="filter-chips" data-type-filter>
            <button type="button" class="filter-chip active" data-value="all" aria-pressed="true">全部</button>
            ${availableTypes.map(([value, label]) => `<button type="button" class="filter-chip" data-value="${value}" aria-pressed="false">${escapeHtml(label)}</button>`).join("")}
          </div>
        </div>
      </div>
    </section>
    <section class="roster-panel" aria-label="Champions 寶可夢名單">
      <div class="pokemon-grid">
        ${roster.map(cardMarkup).join("")}
      </div>
      <p class="no-results" id="no-results" hidden>找不到符合條件的寶可夢。</p>
    </section>`;

  const searchInput = document.querySelector("#roster-search");
  const filterToggle = document.querySelector(".collection-filter-toggle");
  const filterPanel = document.querySelector(".collection-filter-panel");
  const cards = [...document.querySelectorAll(".pokemon-card")];
  const applyFilters = () => {
    const query = searchInput.value.trim().toLocaleLowerCase("zh-Hant");
    let visibleCount = 0;
    cards.forEach(card => {
      const matchesName = !query || card.dataset.name.includes(query);
      const cardTypes = card.dataset.types.split(" ").filter(Boolean);
      const matchesType = selectedTypes.size === 0 || (typeMode === "and"
        ? [...selectedTypes].every(type => cardTypes.includes(type))
        : [...selectedTypes].some(type => cardTypes.includes(type)));
      const visible = matchesName && matchesType;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    document.querySelector("#no-results").hidden = visibleCount !== 0;
  };
  searchInput.addEventListener("input", applyFilters);
  filterToggle.addEventListener("click", () => {
    const open = filterToggle.getAttribute("aria-expanded") !== "true";
    filterToggle.setAttribute("aria-expanded", String(open));
    filterPanel.hidden = !open;
  });
  filterPanel.addEventListener("click", (event) => {
    const modeButton = event.target.closest("[data-type-mode]");
    if (modeButton) {
      typeMode = modeButton.dataset.typeMode;
      filterPanel.querySelectorAll("[data-type-mode]").forEach((button) => {
        const active = button === modeButton;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      applyFilters();
      return;
    }
    const chip = event.target.closest("[data-type-filter] .filter-chip");
    if (!chip) return;
    const value = chip.dataset.value;
    if (value === "all") selectedTypes.clear();
    else if (selectedTypes.has(value)) selectedTypes.delete(value);
    else selectedTypes.add(value);
    filterPanel.querySelectorAll("[data-type-filter] .filter-chip").forEach((button) => {
      const active = button.dataset.value === "all" ? selectedTypes.size === 0 : selectedTypes.has(button.dataset.value);
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    filterToggle.textContent = `篩選${selectedTypes.size ? ` · ${selectedTypes.size}` : ""}`;
    applyFilters();
  });
}

function updateSummary() {
  const ownedCount = roster.reduce((count, entry, index) => {
    const key = String(entry.key || entry.slug || `${entry.dexNumber}-${index}`);
    return count + Number(ownedKeys.has(key));
  }, 0);
  const percentage = roster.length ? Math.round((ownedCount / roster.length) * 100) : 0;
  document.querySelector("#owned-count").textContent = `${ownedCount}／${roster.length}`;
  document.querySelector("#progress-bar").style.width = `${percentage}%`;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", ownedCount);
}

function toggleOwned(button) {
  const card = button.closest(".pokemon-card");
  const key = card.dataset.key;
  const name = card.querySelector("strong").textContent;
  const nextOwned = !ownedKeys.has(key);

  if (nextOwned) ownedKeys.add(key);
  else ownedKeys.delete(key);

  card.classList.toggle("is-owned", nextOwned);
  button.setAttribute("aria-pressed", String(nextOwned));
  button.setAttribute("aria-label", nextOwned ? `取消標記 ${name}` : `標記已擁有 ${name}`);
  button.title = nextOwned ? "取消已擁有" : "標記為已擁有";
  button.firstElementChild.textContent = nextOwned ? "✓" : "";
  saveOwnedKeys();
  updateSummary();
}

app.addEventListener("click", (event) => {
  const button = event.target.closest(".owned-toggle");
  if (button) toggleOwned(button);
});

app.addEventListener(
  "error",
  (event) => {
    const image = event.target.closest?.(".pokemon-card img");
    if (!image) return;

    const fallback = image.dataset.fallback;
    if (fallback && image.dataset.fallbackTried !== "true") {
      image.dataset.fallbackTried = "true";
      image.src = fallback;
      return;
    }

    image.closest(".image-stage").classList.add("image-missing");
    image.remove();
  },
  true,
);

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    roster = Array.isArray(payload) ? payload : payload.pokemon || payload.entries || [];
    window.rosterMetadata = Array.isArray(payload)
      ? {}
      : payload.metadata || payload.meta || {
          version: payload.version,
          ruleset: payload.ruleset,
        };

    if (!roster.length) throw new Error("名單為空");

    const validKeys = new Set(
      roster.map((entry, index) => String(entry.key || entry.slug || `${entry.dexNumber}-${index}`)),
    );
    ownedKeys = new Set([...ownedKeys].filter((key) => validKeys.has(key)));
    saveOwnedKeys();
    render();
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <section class="error-card">
        <h1>無法載入名單</h1>
        <p>請確認網站是透過本機伺服器或靜態網站服務開啟，而不是直接雙擊 HTML 檔案。</p>
        <button type="button" onclick="location.reload()">重新載入</button>
      </section>`;
  }
}

init();
