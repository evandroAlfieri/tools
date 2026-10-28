# Travel Expense Manager

A complete, build-free business travel reimbursement tool. All application code, PDF libraries, receipt OCR workers, and the English OCR model are included. There are no API keys, subscriptions, backend services, or npm installation steps required.

## Deploy on GitHub Pages

1. Extract `travel-expense-manager.zip`. You will get a folder named `travel-expense-manager`.
2. Upload that entire folder to your repository's main branch. Upload the extracted files, not the ZIP. Keep `vendor/` and its subfolders intact.
3. In your repository, open **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, then **Save**. If your default branch has another name, select that branch instead.
4. Wait for the Pages deployment to finish. Open the Pages URL shown by GitHub, followed by `travel-expense-manager/`. For example: `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/travel-expense-manager/`.

If you prefer the tool at your repository's main Pages URL, upload the **contents** of the extracted folder to the repository root instead. In that case, `index.html`, `app.js`, `core.js`, `style.css`, and `vendor/` must sit directly in the repository root, and no extra `travel-expense-manager/` suffix is needed in the URL.

GitHub Pages branch publishing supports the repository root or `/docs` as its publishing folder. Do not try to select `/travel-expense-manager` as the source folder. Select `/(root)` and visit the nested URL instead.

Deployment reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Move your existing trips

Your trip records and original receipts are stored in your browser, separately for each website origin. They are not inside this download and do not automatically move to GitHub Pages.

1. Open the original tool: https://travel-expense-manager.steadywhale34.chatgpt.site
2. Choose **Back up all trips** and save the downloaded JSON backup privately.
3. Open your new GitHub Pages tool in the browser where you want to use it.
4. Choose **Restore a backup** and select that JSON file. Trips are imported as new copies.

Publish only the application files. Keep trip backup JSONs and your personal receipts out of the GitHub repository. Export a backup periodically and before clearing browser data or changing devices. On narrow screens, the backup buttons are in the desktop sidebar; use a wider browser window to back up or restore.

## Use the tool

- Create a trip and bulk upload PDFs, scans, or receipt photos.
- Review extracted merchants, dates, amounts, currencies, and category allocations against the originals.
- Categories: **Meals & Drinks**, **Transport**, **Accommodation**, and **Other**.
- Split mixed receipts, exclude expenses, and resolve possible duplicates.
- Enter your trip's Amex exchange rate as **EUR per one foreign currency unit**. Euro expenses stay unchanged.
- Export one PDF for each of the four categories, a complete trip summary, CSV expense data, or all reports in a ZIP.
- Category PDFs start with the breakdown and euro total, then include the original receipt pages or images. Long breakdowns continue on further pages before the receipts.

OCR suggests values and requires review. The bundled OCR model is English. For image formats your browser cannot decode, such as some HEIC or TIFF files, convert to JPG or PNG first. Password-protected PDFs must be unlocked before use. Maximum upload size is 30 MB per file.

## Files and customization

- `index.html`: initial page structure and dialogs.
- `app.js`: interface, local storage, OCR, receipt editing, backup/restore, and PDF/CSV/ZIP exports.
- `core.js`: categories, extraction heuristics, validation, duplicate checks, currency conversion, and totals.
- `style.css`: interface styling and responsive layout.
- `vendor/`: bundled PDF and OCR runtime files, worker scripts, model, and PDF font assets. These files are required.
- `licenses/` and `THIRD_PARTY_NOTICES.md`: dependency license information.

All asset and module paths are relative, so the tool works at a domain root or under a repository subpath. Older Meals and Drinks allocations are automatically combined into Meals & Drinks when existing trips or old backups are loaded.

To run locally, serve this directory over HTTP rather than double-clicking `index.html`. For example, if Python is installed, run `python -m http.server 8000` from this directory and open `http://localhost:8000/`. Hosted usage should use HTTPS.

This is the same static application as the deployed tool, with the merged category update. There are no real receipts, trip records, credentials, or hosting account metadata in this package.
