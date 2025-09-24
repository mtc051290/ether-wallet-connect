# 🚀 Web3 Wallet Connector

**Author:** ISDR Miguel Torres

A modern application for connecting Ethereum wallets (MetaMask) built
with the latest Web3 and frontend development technologies.

## 📋 Description

Web3 Wallet Connector is a web application that allows users to easily
connect their MetaMask wallet and access the Web3 ecosystem. The
application provides an intuitive and secure interface for managing
blockchain wallet connections.

## ✨ Key Features

- **🔒 Secure Connection**: Safe connection with MetaMask without
  compromising private keys
- **⚡ Fast & Efficient**: Instant connections with automatic
  reconnection
- **💰 SepoliaETH Balance**: Real-time balance display on the Sepolia
  test network
- **🔄 Balance Refresh**: Refresh button for manual balance updates
- **🎨 Modern Design**: Sleek Web3-style interface with visual effects
- **📱 Responsive**: Optimized for both mobile and desktop devices
- **🛡️ Advanced Error Handling**: Intelligent error management with
  specific messages
- **📋 Extra Features**: Copy address, view on Sepolia Etherscan, easy
  disconnect

## 🛠️ Technologies Used

### Frontend Framework

- **Next.js 15.5.4** - React framework with App Router
- **React 19** - User interface library
- **TypeScript** - Static typing for JavaScript

### Web3 & Blockchain

- **ethers.js 6.15.0** - Library for Ethereum interactions
- **MetaMask** - Integration with the most popular wallet

### Styling & UI

- **Tailwind CSS 3.4.16** - Utility-first CSS framework
- **FontAwesome** - UI icons
- **PostCSS** - CSS processing

### Testing & Quality

- **Jest** - Testing framework
- **React Testing Library** - React component testing
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 🚀 Installation & Usage

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask installed in the browser

### Installation Steps

1.  **Clone the repository**

    ```bash
    git clone [REPOSITORY_URL]
    cd BlockchainWallet
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run in development mode**

    ```bash
    npm run dev
    ```

4.  **Open in the browser**

        http://localhost:3000

## 📁 Project Structure

    BlockchainWallet/
    ├── src/
    │   ├── app/                 # Next.js App Router
    │   │   ├── globals.css      # Global styles
    │   │   ├── layout.tsx       # Main layout
    │   │   └── page.tsx         # Home page
    │   ├── components/          # React components
    │   │   └── WalletConnector.tsx
    │   ├── hooks/               # Custom hooks
    │   │   └── useWallet.ts     # Wallet management hook
    │   └── types/               # TypeScript definitions
    ├── __tests__/               # Automated tests
    ├── tailwind.config.js       # Tailwind configuration
    ├── next.config.js           # Next.js configuration
    └── package.json             # Dependencies & scripts

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Development server

# Production
npm run build        # Build for production
npm start            # Run production build

# Testing
npm test             # Run tests
npm run test:watch   # Watch mode tests

# Code Quality
npm run lint         # Run linting
```

## 🎯 Technical Features

### State Management

- Custom `useWallet` hook for centralized state management
- Prevention of SSR/CSR hydration errors
- Smart management of MetaMask events

### Security

- Private keys never leave MetaMask
- Validation of connections and permissions
- Secure error and state handling

### Web3 & Blockchain

- **Sepolia Network**: Automatic setup for Sepolia testnet
- **Real-time Balance**: Fetch and update SepoliaETH balance
- **Network Switching**: Auto-switch to Sepolia or add if missing
- **ethers.js Provider**: Full integration with ethers.js v6

### User Experience

- Visual feedback for all states (connecting, connected, error,
  loading balance)
- **Balance Display**: Clear balance display with SEP symbol
- **Manual Refresh**: Button to refresh balance anytime
- Copy wallet address to clipboard
- Direct links to **Sepolia Etherscan**
- **Enhanced Error Messages**: Tailored messages depending on error
  type

### Advanced Error Handling

- **Error Code 4001**: User rejected the connection
- **Error Code -32002**: Pending request in MetaMask
- **Error Code 4100**: Unauthorized method
- **Network Errors**: Issues switching to Sepolia
- **Balance Errors**: Failures fetching blockchain balance

## 🌐 Compatibility

### Supported Browsers

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Compatible Wallets

- MetaMask (main)
- Extensible to other EIP-1193 wallets

## 📊 Testing

This project includes automated tests covering:

- Wallet connection & disconnection
- Error handling
- UI states
- Copy & link functionalities

```bash
npm test  # Run all tests
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Recommended Platforms

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **GitHub Pages**

## 👨‍💻 For Recruiters

### Demonstrated Skills

**Modern Frontend**

- React 19 with advanced hooks
- Next.js App Router & SSR
- TypeScript for static typing
- Tailwind CSS for modern styling

**Web3 & Blockchain**

- MetaMask integration
- ethers.js for Ethereum interactions
- Web3 state management
- Blockchain security patterns

**Code Quality**

- Automated testing with Jest
- Clean component architecture
- Reusable custom hooks
- Robust error handling

**DevOps & Tools**

- Modern build configuration
- Automatic linting & formatting
- Scalable project structure
- Complete documentation

### Highlighted Architecture

- **Separation of Concerns**: Web3 logic isolated in custom hooks
- **Predictable State Management**: Clear states and controlled
  transitions
- **Polished User Experience**: Visual feedback and error handling
- **Maintainable Code**: TypeScript, testing, and documentation

## 📄 License

This project is under the MIT License - see [LICENSE](LICENSE) for
details.

## 🤝 Contributions

Contributions are welcome. Please:

1.  Fork the project
2.  Create a feature branch
3.  Commit your changes
4.  Push to the branch
5.  Open a Pull Request

---

**Built with ❤️ for the Web3 community**
