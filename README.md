# Pokémon Champions 圖鑑

《Pokémon Champions》可用寶可夢圖鑑與收藏紀錄工具。網站不需要後端或資料庫，點擊卡片右上角的圓圈即可標記已擁有的寶可夢，收藏狀態會保存在每位使用者自己的瀏覽器 `localStorage` 中。

## 功能

- 收錄目前賽制與版本可使用的寶可夢及特殊型態
- 可依中文名稱搜尋，並依屬性篩選名單
- 使用本地 Champions 版寶可夢圖示，避免依賴外部圖片服務
- 依圖鑑順序排列，長名稱會自動換行
- 在桌面與手機版皆可使用的響應式版面
- 收藏紀錄保存在瀏覽器，不會上傳至伺服器

## 專案結構

```text
.
├─ index.html
├─ style.css
├─ script.js
├─ .nojekyll
├─ data/
│  └─ champions-roster.json
└─ assets/
   └─ champions/
      └─ *.png
```

`data/champions-roster.json` 是顯示名單；`assets/champions/` 是已下載的 Champions 版寶可夢圖片。網站執行時不會讀取原本的 Pokedex 專案。

## 更新資料

目前同步與清理流程仍保留在私人 Pokedex 專案。完成同步後，把新的 `data/champions-roster.json` 與 `assets/champions/` 複製到這個專案，再重新部署即可。請維持 JSON 中的 `key` 穩定，才能讓既有使用者的收藏紀錄在更新後繼續生效。

## 資料與權利說明

可用名單與 Champions 圖示參考 [52Poké Champions 寶可夢列表](https://wiki.52poke.com/wiki/宝可梦列表（Champions）) 與 [GameWith Champions 寶可夢列表](https://gamewith.ai/pokemon-champions/zh-hant/pokemon)，並以 [Project Pokémon champout](https://github.com/projectpokemon/champout) 核對版本。

Pokémon 名稱、角色及圖像的相關權利屬 Nintendo、Game Freak、Creatures 與 The Pokémon Company 等權利人所有；本專案為非官方粉絲工具。公開部署前，請自行確認第三方資料及圖片的授權與標示要求。
