# Quick Start Guide

## Running the Application

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173
```

## Application Features

### 📊 Data Source
The app automatically loads data from your Google Sheet:
- **Sheet ID**: 1775CUAh2xcbZiWF-_9ApU0G17erA2TiT2ARaKdllLSs
- **Configured via**: `.env` file
- **Fallback**: Upload CSV manually if Google Sheets API fails

### 🔍 Search Capabilities

All three search filters can be used simultaneously:

1. **Name Search**
   - Search by first name, last name, or full name
   - Case-insensitive
   - Partial matching supported

2. **Village Filter**
   - Find people from specific villages
   - Matches exact or partial village names

3. **Current Address Search**
   - Search by city, state, or full address
   - Useful for finding people in specific locations

### 📤 Manual CSV Upload

If you need to load different data:

1. Prepare CSV with columns: Name, Village, Current Address, Mobile Number, Email
2. Click "Upload CSV File" button
3. Select your CSV file
4. Data loads automatically

## 🔒 Security Features

✅ **Environment Variables**: Sensitive API keys stored in `.env`
✅ **Snyk Security**: Code scanned for vulnerabilities
✅ **No Hardcoded Secrets**: All credentials externalized
✅ **Git Protection**: `.env` excluded from version control

## 🛠️ Troubleshooting

### Issue: Data not loading from Google Sheets

**Solution 1**: Check your API key in `.env` file
```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
```

**Solution 2**: Verify Google Sheet is accessible
- Open the sheet URL
- Ensure you have view permissions
- Check that the sheet is not private

**Solution 3**: Use CSV upload as alternative
- Download sheet as CSV
- Upload via the app interface

### Issue: Search not working

**Check**: Ensure data is loaded (see result count)
**Try**: Clear all filters and start fresh
**Verify**: Check spelling and try partial matches

### Issue: Build errors

```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install

# Clear cache
npm run build -- --force
```

## 📱 Mobile Access

The application is fully responsive:
- Access from any device
- Touch-friendly interface
- Optimized table scrolling on mobile

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Netlify

1. Build the app: `npm run build`
2. Drag `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Important: Set Environment Variables

When deploying, add these environment variables in your hosting platform:
- `VITE_GOOGLE_SHEETS_API_KEY`
- `VITE_SPREADSHEET_ID`
- `VITE_SHEET_ID`

## 📞 Support

For issues or questions:
1. Check the main README.md
2. Review HOW_TO_USE.md for detailed instructions
3. Contact your system administrator

---

**Last Updated**: October 2025
**Version**: 1.0.0
