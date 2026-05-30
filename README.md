# 🎓 StudyVault — Learn. Share. Earn.

> The decentralized AI-powered notes sharing platform for students. Upload notes, earn SVT crypto tokens, get AI-powered summaries, and trade knowledge as NFTs.

![StudyVault Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=StudyVault+%E2%80%94+Learn.+Share.+Earn.)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🦊 **MetaMask Wallet** | Connect MetaMask, view ETH/SVT balance, sign transactions |
| 🧠 **AI Summaries** | Gemini AI auto-generates summaries, key points, difficulty rating |
| 📤 **Notes Upload** | Drag & drop PDF/PPT/DOC files, stored on IPFS |
| 🛒 **Marketplace** | Search/filter 15,847+ notes by subject, uni, rating, price |
| 👑 **NFT Minting** | Mint notes as ERC-721 NFTs with royalty support |
| 🪙 **SVT Token Rewards** | Earn tokens on uploads, downloads, ratings |
| 📊 **Dashboard** | Stats, token activity, trending notes, achievements |
| 👤 **User Profiles** | Badges, transaction history, portfolio |
| 📱 **Fully Responsive** | Works on all screen sizes |
| 🌐 **IPFS Storage** | Decentralized file storage (mock in dev) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask browser extension (optional — demo mode works without it)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/studyvault.git
cd studyvault
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your API keys in `.env.local` (see [Environment Variables](#-environment-variables) section).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Demo Login

| Field | Value |
|---|---|
| Email | `student@university.edu` |
| Password | `password123` |

---

## 📁 Folder Structure

```
studyvault/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles & design tokens
│   │   ├── login/page.tsx            # Login page
│   │   ├── signup/page.tsx           # Sign up (2-step)
│   │   ├── dashboard/page.tsx        # Main dashboard
│   │   ├── marketplace/page.tsx      # Notes marketplace
│   │   ├── upload/page.tsx           # Upload notes (4-step wizard)
│   │   ├── notes/page.tsx            # My Notes page
│   │   └── profile/page.tsx          # User profile
│   │
│   ├── components/
│   │   ├── ui/                       # Reusable UI primitives
│   │   │   ├── button.tsx            # Button (7 variants)
│   │   │   ├── badge.tsx             # Badge component
│   │   │   ├── card.tsx              # Card + CardHeader/Content/Footer
│   │   │   ├── input.tsx             # Input with icon/error support
│   │   │   ├── skeleton.tsx          # Loading skeletons
│   │   │   ├── toast.tsx             # Toast notifications
│   │   │   ├── star-rating.tsx       # Interactive star rating
│   │   │   └── empty-state.tsx       # Empty state component
│   │   │
│   │   ├── layout/                   # App shell components
│   │   │   ├── Sidebar.tsx           # Collapsible sidebar nav
│   │   │   ├── TopNav.tsx            # Top navbar + search + notifications
│   │   │   └── DashboardLayout.tsx   # Auth-protected layout wrapper
│   │   │
│   │   ├── landing/                  # Landing page sections
│   │   │   ├── LandingNav.tsx        # Transparent → glass navbar
│   │   │   ├── HeroSection.tsx       # Hero with dashboard preview
│   │   │   ├── FeaturesSection.tsx   # 8 feature cards
│   │   │   ├── HowItWorksSection.tsx # 4-step process
│   │   │   ├── TestimonialsSection.tsx # 6 testimonials + stats bar
│   │   │   └── CTAFooter.tsx         # CTA section + full footer
│   │   │
│   │   ├── dashboard/                # Dashboard widgets
│   │   │   ├── StatsCard.tsx         # Metric card with trend
│   │   │   └── TransactionList.tsx   # Token activity list
│   │   │
│   │   ├── notes/                    # Notes components
│   │   │   ├── NoteCard.tsx          # Note card with buy/view
│   │   │   └── NoteDetailModal.tsx   # Full note detail modal
│   │   │
│   │   └── wallet/
│   │       └── WalletButton.tsx      # MetaMask connect + dropdown
│   │
│   ├── store/
│   │   └── appStore.ts               # Zustand global state
│   │
│   ├── lib/
│   │   ├── utils.ts                  # Helpers, formatters, constants
│   │   ├── mockData.ts               # Demo notes, users, transactions
│   │   └── aiService.ts              # AI summary generation (Gemini)
│   │
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   │
│   └── contracts/
│       └── StudyVault.sol            # Solidity smart contracts
│
├── public/                           # Static assets
├── .env.example                      # Environment variable template
├── .env.local                        # Your local environment (gitignored)
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind + custom tokens
├── tsconfig.json                     # TypeScript config
└── README.md                         # This file
```

---

## 🔧 Environment Variables

Create `.env.local` in the project root:

```env
# ── AI ──────────────────────────────────────────────
# Google Gemini API (for note summaries)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
# OR OpenAI (alternative)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# ── Firebase (Authentication + Firestore) ───────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# ── IPFS (Pinata for file storage) ──────────────────
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud

# ── Blockchain ───────────────────────────────────────
# Deployed contract addresses (after deploying StudyVault.sol)
NEXT_PUBLIC_SVT_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_SVT_NFT_ADDRESS=0x...
NEXT_PUBLIC_REWARDS_ADDRESS=0x...
# Alchemy/Infura RPC URL
NEXT_PUBLIC_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_key
# Chain ID (1=mainnet, 11155111=sepolia testnet)
NEXT_PUBLIC_CHAIN_ID=11155111

# ── App ──────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=StudyVault
```

### Getting API Keys

| Service | How to Get |
|---|---|
| **Gemini AI** | [aistudio.google.com](https://aistudio.google.com) → Get API key |
| **Firebase** | [console.firebase.google.com](https://console.firebase.google.com) → New project → Project settings |
| **Pinata IPFS** | [app.pinata.cloud](https://app.pinata.cloud) → API Keys |
| **Alchemy** | [alchemy.com](https://alchemy.com) → Create app → View key |

---

## ⛓️ Smart Contract Deployment

### Prerequisites
```bash
npm install -g hardhat
npm install --save-dev @openzeppelin/contracts hardhat @nomicfoundation/hardhat-toolbox
```

### Deploy to Sepolia Testnet

```bash
# Initialize Hardhat in contracts folder
cd src/contracts
npx hardhat init

# Compile
npx hardhat compile

# Deploy (requires PRIVATE_KEY and SEPOLIA_RPC_URL in .env)
npx hardhat run scripts/deploy.js --network sepolia
```

### Deploy Script (`scripts/deploy.js`)

```javascript
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. Deploy SVT Token
  const SVT = await ethers.getContractFactory("StudyVaultToken");
  const svt = await SVT.deploy();
  await svt.waitForDeployment();
  console.log("SVT Token:", await svt.getAddress());

  // 2. Deploy NFT Contract
  const NFT = await ethers.getContractFactory("StudyVaultNFT");
  const nft = await NFT.deploy(await svt.getAddress());
  await nft.waitForDeployment();
  console.log("SVT NFT:", await nft.getAddress());

  // 3. Deploy Rewards Controller
  const Rewards = await ethers.getContractFactory("StudyVaultRewards");
  const rewards = await Rewards.deploy(await svt.getAddress(), await nft.getAddress());
  await rewards.waitForDeployment();
  console.log("Rewards:", await rewards.getAddress());

  // 4. Set rewards controller on SVT
  await svt.setRewardController(await rewards.getAddress());
  console.log("Reward controller set!");
}

main().catch(console.error);
```

---

## 🎨 Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| `--indigo` | `#6366f1` | Primary actions, links |
| `--violet` | `#8b5cf6` | Accents, gradients |
| `--cyan` | `#06b6d4` | Secondary accents |
| `--emerald` | `#10b981` | Success, free badges |
| `--amber` | `#f59e0b` | NFT, warnings, ratings |
| `--rose` | `#f43f5e` | Errors, destructive |

### Typography
- **Display/Headings**: Syne (700, 800)
- **Body**: DM Sans (400, 500, 600)
- **Mono**: Courier New / system mono

### Component Variants
```tsx
// Button
<Button variant="default | outline | ghost | glass | premium | nft | success" />

// Badge
<Badge variant="default | secondary | success | warning | premium | nft | token | free" />

// StatsCard
<StatsCard color="indigo | violet | emerald | amber | rose | cyan" gradient />
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom CSS Variables |
| **Animation** | Framer Motion |
| **State** | Zustand (with persistence) |
| **Web3** | Ethers.js v6 |
| **Wallet** | MetaMask (EIP-1193) |
| **Blockchain** | Ethereum / Solidity 0.8.20 |
| **Standards** | ERC-20 (SVT Token) + ERC-721 (Notes NFT) |
| **AI** | Google Gemini / OpenAI GPT-4o |
| **Storage** | IPFS via Pinata |
| **Auth/DB** | Firebase Auth + Firestore |
| **File Upload** | react-dropzone |
| **Icons** | Lucide React |
| **Toasts** | react-hot-toast |

---

## 📡 API Integration

### Enabling Real AI Summaries (Gemini)

Replace the mock in `src/lib/aiService.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function generateAISummary(fileName: string, fileContent?: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `Analyze this educational document titled "${fileName}" and provide:
  1. A 2-3 sentence summary
  2. 5 key points
  3. Difficulty level (Beginner/Intermediate/Advanced)
  4. Estimated read time in minutes
  5. Main topics covered
  
  Respond in JSON format.`;
  
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

### Enabling Real IPFS Upload (Pinata)

```typescript
import axios from 'axios';
import FormData from 'form-data';

export async function uploadToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    { headers: {
      'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
      'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
    }}
  );
  
  return data.IpfsHash;
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Project Settings → Environment Variables
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t studyvault .
docker run -p 3000:3000 --env-file .env.local studyvault
```

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Run tests (add Jest/Vitest)
npm test
```

---

## 🗺️ Roadmap

- [ ] **v1.0** — Core marketplace, wallet, upload, AI summaries ✅
- [ ] **v1.1** — Real Firebase auth + Firestore database
- [ ] **v1.2** — Real Pinata IPFS integration
- [ ] **v1.3** — Deployed smart contracts on Sepolia testnet
- [ ] **v2.0** — Mobile app (React Native)
- [ ] **v2.1** — AI chat with notes (RAG-based Q&A)
- [ ] **v2.2** — Collaborative notes + live editing
- [ ] **v2.3** — DAO governance for content moderation
- [ ] **v3.0** — Mainnet launch + token listing

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 💬 Support

- 🐦 Twitter: [@StudyVaultXYZ](https://twitter.com)
- 💬 Discord: [discord.gg/studyvault](https://discord.gg)
- 📧 Email: hello@studyvault.xyz
- 📖 Docs: [docs.studyvault.xyz](https://docs.studyvault.xyz)

---

<div align="center">
  <strong>Built with ❤️ for students everywhere</strong><br/>
  <em>Learn. Share. Earn.</em>
</div>
