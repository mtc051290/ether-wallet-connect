"use client";

import { WalletConnector } from "@/components/WalletConnector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import {
  faShieldAlt,
  faCode,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <main className="container mx-auto px-6 py-12 min-h-screen flex flex-col relative z-10">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mb-8">
            <FontAwesomeIcon
              icon={faEthereum}
              className="text-4xl text-white"
            />
          </div>

          <h1 className="hero-title">Web3 Wallet Connector</h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-2">
            Connect your Ethereum wallet and start exploring Web3 applications
          </p>
        </header>

        {/* Main Wallet Connection Component */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <WalletConnector />
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400">
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <p className="mb-2">
              Built with Next.js, TypeScript, Tailwind CSS, and ethers.js by
              <a
                href="https://github.com/mtc051290"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {" "}
                Miguel Torres
              </a>
            </p>
            <p className="text-gray-500 text-sm">
              Make sure you have MetaMask installed to connect your wallet
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
