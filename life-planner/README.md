# Life Planner

An AI-assisted life planning application designed to help you organize your financial information, estate planning documents, and create a comprehensive action plan for your loved ones.

## Features

### 🏦 Financial Planning
- **Personal Information** - Basic details and financial goals (short-term, mid-term, long-term)
- **Income & Expenses** - Track all income sources and monthly expenses
- **Assets & Liabilities** - Manage savings, investments, property, loans, and debts
- **Savings Goals** - Set and track specific savings targets
- **Risk Management** - Document insurance policies and emergency fund
- **Retirement Planning** - Plan for retirement with savings goals and income estimates
- **Tax Planning** - Record tax strategies and deductions
- **Action Plan** - Create specific financial action items and review schedule

### 📜 Estate & Life Planning
- **Last Will and Testament** - Document executor, guardianship, and asset distribution
- **Revocable Living Trust** - Manage trust details, trustees, and beneficiaries
- **Power of Attorney** - Financial and healthcare POA, plus digital asset management
- **Healthcare Directives** - Living will, DNR orders, and end-of-life preferences
- **Beneficiary Designations** - Track beneficiaries on accounts (overrides will)
- **Letter of Intent** - Funeral wishes, personal messages, and special instructions
- **Personal Care Needs** - Daily living assistance and medical equipment
- **Legal & Advocacy** - Guardianship, disability benefits, and legal protections
- **Quality of Life** - Transportation, mobility aids, and home accessibility

### 👨‍👩‍👧‍👦 Next of Kin Action Plan
Create a step-by-step guide for your loved ones with:
- Ordered action steps
- Organization/agency contact information
- Required documents
- Detailed instructions
- Phone, email, website, and address for each step

### 🤖 AI Assistant
- Context-aware help throughout the application
- Support for multiple AI providers:
  - **Anthropic Claude**
  - **OpenAI GPT**
  - **xAI Grok**
  - **Google Gemini**
- Get suggestions, ask questions, and receive guidance

### 💾 Data Management
- **Local Storage** - All data stored in browser's IndexedDB
- **Export Options** - JSON backup and PDF report generation
- **Import/Restore** - Restore from previous JSON backups
- **Auto-save** - Automatic saving as you type
- **Privacy First** - Data never leaves your device

### ♿ Accessibility
- Large, readable fonts (18px base)
- High contrast design
- Simple, intuitive navigation
- Touch-friendly controls (44px minimum)
- Clear visual hierarchy

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd life-planner
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure AI providers:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to the URL shown (typically http://localhost:5173)

## Configuration

### AI Provider Setup

You can configure AI providers in two ways:

#### Option 1: Environment Variables (Recommended for development)

Create a `.env` file in the project root:

```env
# Anthropic Claude
VITE_ANTHROPIC_API_KEY="sk-ant-..."
VITE_ANTHROPIC_API_MODEL="claude-sonnet-4-5-20251001"

# Google Gemini
VITE_GOOGLE_API_KEY="..."
VITE_GEMINI_API_MODEL="gemini-2.0-flash-exp"

# OpenAI GPT
VITE_OPENAI_API_KEY="sk-proj-..."
VITE_OPENAI_API_MODEL="gpt-4o-mini"

# xAI Grok
VITE_XAI_API_KEY="xai-..."
VITE_XAI_API_MODEL="grok-beta"
```

#### Option 2: In-App Configuration

1. Go to **Settings** → **AI Assistant**
2. Select your provider
3. Enter your API key and model
4. Click **Save AI Configuration**

## Building for Production

Build the application:

```bash
npm run build
```

The built files will be in the `dist` directory. You can serve them with any static file server or deploy to:
- Netlify
- Vercel
- GitHub Pages
- Any web hosting service

To preview the production build locally:

```bash
npm run preview
```

## Usage Guide

### First Time Setup

1. **Dashboard** - Start here to see an overview
2. **Financial Planning** - Begin entering your financial information
3. **Estate Planning** - Document your legal documents and wishes
4. **Next of Kin Plan** - Create action steps for your family
5. **Settings** - Configure AI assistant and create backups

### Data Entry Tips

- Use the **AI Assistant** (blue button in bottom right) for help at any time
- Click section navigation buttons to jump between topics
- All data auto-saves as you type (2-second delay)
- Use the **+** buttons to add multiple items (income, expenses, assets, etc.)
- Reorder Next of Kin steps with up/down arrows

### Backup & Export

**Create Regular Backups:**
1. Go to **Settings** → **Backup & Export**
2. Click **Create Backup**
3. Save the JSON file somewhere safe (cloud storage, external drive)

**Generate Reports:**
1. Go to **Settings** → **Backup & Export**
2. Click **Export as PDF** for a formatted report
3. Click **Export as JSON** for a data backup

**Restore from Backup:**
1. Go to **Settings** → **Backup & Export**
2. Click **Import from JSON**
3. Select your backup file
4. Confirm the restore (this replaces current data)

## Security & Privacy

### Data Storage
- All data is stored **locally** in your browser's IndexedDB
- No data is sent to any server (except AI providers when you use the assistant)
- Your data stays on your device

### API Keys
- API keys are stored in your browser's localStorage
- Keys are only used to communicate directly with AI providers
- Never share your API keys with anyone

### Best Practices
1. **Create regular backups** and store them securely
2. **Don't share backup files** - they contain all your personal information
3. **Use strong passwords** if you enable encryption (future feature)
4. **Clear browser data carefully** - this will delete your stored information

## Technology Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Database:** Dexie.js (IndexedDB wrapper)
- **Routing:** React Router
- **PDF Generation:** jsPDF
- **Encryption:** crypto-js
- **Icons:** Lucide React

## Project Structure

```
life-planner/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── AIAssistant.tsx
│   │   ├── FormField.tsx
│   │   └── Layout.tsx
│   ├── pages/           # Main application pages
│   │   ├── Dashboard.tsx
│   │   ├── FinancialPlanning.tsx
│   │   ├── EstatePlanning.tsx
│   │   ├── NextOfKinPlan.tsx
│   │   └── Settings.tsx
│   ├── lib/             # Utilities and services
│   │   ├── ai-service.ts      # AI provider integration
│   │   ├── database.ts        # IndexedDB operations
│   │   ├── encryption.ts      # Data encryption utilities
│   │   ├── export.ts          # PDF and JSON export
│   │   └── utils.ts           # Helper functions
│   ├── store/           # State management
│   │   └── useStore.ts
│   ├── types/           # TypeScript definitions
│   │   └── index.ts
│   ├── hooks/           # Custom React hooks
│   │   └── useAutoSave.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Troubleshooting

### Application won't load
- Clear browser cache and reload
- Check browser console for errors
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)

### Data is missing
- Check if you accidentally cleared browser data
- Restore from a backup if available
- Data is stored per browser - switching browsers will show empty data

### AI Assistant not working
- Verify your API key is correct in Settings
- Check you have internet connection
- Ensure you have API credits with your provider
- Try a different AI provider

### Export/Import issues
- Ensure you're using valid JSON files for import
- Check file size - very large files may take time to process
- Try exporting again if download fails

## Future Enhancements

Potential features for future versions:
- [ ] Password protection and encryption
- [ ] Multi-user support
- [ ] Document attachment storage
- [ ] Reminder notifications
- [ ] Mobile app version
- [ ] Cloud sync (optional)
- [ ] Pre-filled templates
- [ ] Collaborative planning

## Contributing

This is a personal life planning tool. If you find bugs or have suggestions, please create an issue in the repository.

## License

MIT License - See LICENSE file for details

## Disclaimer

**Important:** This application is designed to help you organize your life planning information. It is NOT:
- A substitute for professional legal advice
- A substitute for professional financial advice
- A legally binding document itself

Always consult with qualified attorneys, financial advisors, and other professionals before making important life planning decisions. This tool is meant to help you prepare information to discuss with professionals.

## Support

For questions, issues, or feedback:
- Create an issue in the GitHub repository
- Refer to this README for documentation
- Check the browser console for error messages

---

**Built with ❤️ to help you plan for the future and protect your loved ones.**
