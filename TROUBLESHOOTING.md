# 🔧 Troubleshooting: Making Your Google Sheet Accessible

## The Issue

The app is showing "Failed to load data from Google Sheets" because the spreadsheet is not publicly accessible.

## ✅ Solution: Make Your Google Sheet Public

### Step 1: Open Your Google Sheet
1. Go to: https://docs.google.com/spreadsheets/d/1775CUAh2xcbZiWF-_9ApU0G17erA2TiT2ARaKdllLSs/edit

### Step 2: Share the Sheet Publicly
1. Click the **Share** button (top-right corner)
2. Under "General access", click the dropdown
3. Select **Anyone with the link**
4. Set permissions to **Viewer**
5. Click **Done**

### Step 3: Verify Access
1. Open this link in an incognito/private browser window:
   ```
   https://docs.google.com/spreadsheets/d/1775CUAh2xcbZiWF-_9ApU0G17erA2TiT2ARaKdllLSs/edit
   ```
2. You should be able to view it without signing in

### Step 4: Refresh the App
1. Go back to the app at http://localhost:5173
2. Click the **Retry Loading** button
3. Data should now load successfully! 🎉

## 🔒 Security Note

Making the sheet public means anyone with the link can view it. If this is sensitive data:

### Option 1: Keep it Private and Use CSV Upload
1. Download the sheet as CSV: **File** → **Download** → **CSV**
2. Use the "Upload CSV File" button in the app
3. No need to make the sheet public

### Option 2: Use Google Sheets API with OAuth (Advanced)
This requires implementing OAuth authentication, which is more complex but keeps data private.

## 📊 Alternative: Direct CSV Link

If you make the sheet public, you can also use this direct CSV export URL:
```
https://docs.google.com/spreadsheets/d/1775CUAh2xcbZiWF-_9ApU0G17erA2TiT2ARaKdllLSs/export?format=csv&gid=1833505822
```

## ❓ Still Having Issues?

### Error: "API key not valid"
- Check that your `.env` file exists and contains:
  ```
  VITE_GOOGLE_SHEETS_API_KEY=AIzaSyBVdUjKAsMG-Mf_SMTSkP_n6Vi9PNxVm1w
  ```
- Restart the dev server: Stop and run `npm run dev` again

### Error: "Sheet not found"
- Verify the spreadsheet ID in `.env` matches your sheet
- Check that the sheet tab exists (gid=1833505822)

### Error: "Quota exceeded"
- Google Sheets API has usage limits
- Wait a few minutes and try again
- Use CSV upload as temporary solution

## 🚀 Quick Test

Test if the Google Sheets API is working:
1. Open browser console (F12)
2. Paste this:
```javascript
fetch('https://sheets.googleapis.com/v4/spreadsheets/1775CUAh2xcbZiWF-_9ApU0G17erA2TiT2ARaKdllLSs?key=AIzaSyBVdUjKAsMG-Mf_SMTSkP_n6Vi9PNxVm1w')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
```
3. If you see sheet data, the API works!
4. If you see an error about permissions, make the sheet public

---

**Need Help?** The app will work with sample data or CSV upload while you resolve this! 📤
