# Pokémon Champions 收藏紀錄

獨立的純前端收藏紀錄工具。網站不需要後端或資料庫，收藏狀態會保存在每位使用者自己的瀏覽器 `localStorage` 中。

## 本機預覽

瀏覽器通常不允許直接以 `file://` 讀取 JSON，因此請在此資料夾啟動任一靜態檔案伺服器：

```powershell
python -m http.server 8080
```

接著開啟 `http://localhost:8080`。

也可以使用：

```powershell
npx serve .
```

## 部署

整個資料夾都是靜態檔案，可以直接部署至 GitHub Pages、Cloudflare Pages、Netlify、Vercel 或一般網頁空間，不需設定建置命令。

- 建置命令：留空
- 輸出目錄：專案根目錄（`.`）
- Node.js：不需要

## 專案結構

```text
.
├─ index.html
├─ style.css
├─ script.js
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

名單資料整理自 52Poké，部分資料生成流程參考 Project Pokémon 的公開研究成果。Pokémon 名稱、角色及圖像的相關權利屬 Nintendo、Game Freak、Creatures 與 The Pokémon Company 等權利人所有；本專案為非官方粉絲工具。公開部署前，請自行確認第三方資料及圖片的授權與標示要求。
