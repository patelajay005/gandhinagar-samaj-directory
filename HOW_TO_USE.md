# Gandhinagar Samaj Directory - How to Use

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 📊 How to Load Your Google Sheet Data

Since the Google Sheet requires authentication, here are the options to get your data into the app:

### Option 1: Download as CSV (Recommended)
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1775CUAh2xcbZiWF-_9ApU0G17erA2TiT2ARaKdllLSs/edit
2. Click **File** → **Download** → **Comma Separated Values (.csv)**
3. In the app, click the "Upload CSV File" button
4. Select your downloaded CSV file
5. The data will automatically load and be searchable!

### Option 2: Make Sheet Publicly Accessible
1. Open your Google Sheet
2. Click the **Share** button (top right)
3. Under "General access", select **Anyone with the link** → **Viewer**
4. Copy the share link
5. Modify the link to CSV export format:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=YOUR_GID
   ```
6. You can then fetch this data using the Fetch API in the code

### Option 3: Use Google Sheets API
For a production app, use the Google Sheets API with an API key:
1. Enable Google Sheets API in Google Cloud Console
2. Create an API key
3. Install the API client: `npm install gapi-script`
4. Implement API calls to fetch sheet data

## 🔍 Search Features

The app provides three search filters:

- **Name**: Search for people by their name
- **Village**: Filter by village/hometown
- **Current Address**: Find people by their current location

All searches work together (AND logic) and are case-insensitive.

## 📝 CSV File Format

Your CSV should have these columns (column names can vary):
- Name
- Village
- Current Address
- Mobile Number (optional)
- Email (optional)

Example:
```csv
Name,Village,Current Address,Mobile Number,Email
Rajesh Patel,Gandhinagar,Ahmedabad Gujarat,9876543210,rajesh@example.com
Priya Shah,Kalol,Surat Gujarat,9876543211,priya@example.com
```

## 🎨 Customization

### Update Sample Data
Edit `src/App.tsx` and modify the `sampleData` array with your actual data.

### Change Styling
- Edit `src/App.css` for component-specific styles
- Edit `src/index.css` for global styles

## 🛠️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📦 Deploy

You can deploy this app to:
- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use `gh-pages` package

## 💡 Tips

1. For better CSV parsing with complex data, consider using `papaparse` library:
   ```bash
   npm install papaparse
   npm install -D @types/papaparse
   ```

2. To connect directly to Google Sheets API, you'll need to implement OAuth or use a service account.

3. The current implementation works entirely client-side, so no backend is needed!

## 🔒 Security Note

Never commit sensitive credentials (like passwords) to your code repository. Use environment variables for API keys and secrets.
