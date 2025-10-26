# 🏛️ Gandhinagar Samaj Directory

A modern React application to search and manage Gandhinagar Samaj community member directory with data from Google Sheets.

## ✨ Features

- 🔍 **Advanced Search**: Search by name, village, and current address
- 📊 **Google Sheets Integration**: Automatically loads data from Google Sheets API
- ➕ **Add Members**: Add new community members directly to Google Sheets
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Real-time Filtering**: Instant search results as you type
- 📄 **Pagination**: Browse through records 30 at a time
- ✅ **Form Validation**: Comprehensive validation for all input fields
- 🎨 **Modern UI**: Clean and intuitive user interface

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/gandhinagar-samaj-directory.git
cd gandhinagar-samaj-directory
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Google Sheets API credentials
   - **For Add Member feature**: Follow [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md) to set up write access

4. Run the development server:
```bash
npm run dev
```

5. Open your browser at `http://localhost:5173`

## 📦 Repository Setup

This project is Git-ready! See [PUSH_TO_GITHUB.md](./PUSH_TO_GITHUB.md) for instructions on:
- Pushing to GitHub
- Setting up GitHub Pages
- Deploying your app

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables (configured in `.env`):

- `VITE_GOOGLE_SHEETS_API_KEY`: Your Google Sheets API key (for reading data)
- `VITE_SPREADSHEET_ID`: The ID of your Google Spreadsheet
- `VITE_SHEET_ID`: The specific sheet ID within the spreadsheet
- `VITE_GOOGLE_SCRIPT_WEB_APP_URL`: Google Apps Script Web App URL (for adding members)

**Important**: To enable the "Add Member" feature, you need to set up a Google Apps Script Web App. See [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md) for detailed instructions.

**Security Note**: Never commit the `.env` file to version control. Use `.env.example` as a template.

## 📖 Usage

### Search Features

The application provides three search filters that work together:

1. **Name**: Search for members by their full or partial name
2. **Village**: Filter by hometown/native village
3. **Current Address**: Find members by their current location

All searches are:
- Case-insensitive
- Real-time (results update as you type)
- Combined with AND logic (all filters must match)

### Add Member Feature

To add a new community member:

1. Click the **"Add New Member"** button
2. Fill in the required fields:
   - Name (required)
   - Mobile (required, 10 digits, must start with 6-9)
   - Village (required)
   - Current Address (required)
3. Optionally add family members (up to 5):
   - Name, Age, Business/Job for each member
4. Add any remarks if needed
5. Click **"Add Member"** to submit

**Note**: The Add Member feature requires Google Apps Script Web App setup. See [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md) for setup instructions.

### Pagination

Browse through records efficiently:
- 30 records per page
- Navigate using Previous/Next buttons
- Jump to specific pages
- See total record count and current page range

## 🛠️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📦 Deployment

Deploy to your favorite platform:

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use the `gh-pages` package

## 🔒 Security

- ✅ **Snyk Security Scans**: All code is scanned for security vulnerabilities
- ✅ **Environment Variables**: Sensitive data stored in environment variables
- ✅ **No Hardcoded Secrets**: API keys loaded from `.env` file
- ✅ **Git Ignore**: `.env` file excluded from version control

## 🧪 Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Google Sheets API** - Data Source
- **CSS3** - Styling

## 📄 License

This project is for the Gandhinagar Samaj community.

---

For detailed usage instructions, see [HOW_TO_USE.md](./HOW_TO_USE.md)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# gandhinagar-samaj-directory
