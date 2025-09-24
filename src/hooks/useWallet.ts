"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { WalletState } from "@/types/wallet";

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    isConnecting: false,
    error: null,
    balance: null,
    isLoadingBalance: false,
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return (
      typeof window !== "undefined" && Boolean(window.ethereum?.isMetaMask)
    );
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setWalletState((prev) => ({
        ...prev,
        error:
          "MetaMask is not installed. Please install MetaMask to continue.",
      }));
      return;
    }

    setWalletState((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      // Request account access
      const accounts = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setWalletState((prev) => ({
          ...prev,
          isConnected: true,
          address: accounts[0],
          isConnecting: false,
          error: null,
        }));

        // Get balance after successful connection
        await getBalance(accounts[0]);
      }
    } catch (error: any) {
      let errorMessage = "Failed to connect wallet";

      // Enhanced error handling
      switch (error.code) {
        case 4001:
          errorMessage =
            "Connection rejected. Please approve the request in MetaMask to continue.";
          break;
        case -32002:
          errorMessage =
            "Connection request is already pending. Please check MetaMask and approve the request.";
          break;
        case -32603:
          errorMessage = "Internal error occurred. Please try again.";
          break;
        case 4100:
          errorMessage =
            "The requested account and/or method has not been authorized by the user.";
          break;
        case 4200:
          errorMessage =
            "The requested method is not supported by this Ethereum provider.";
          break;
        case 4900:
          errorMessage = "The provider is disconnected from all chains.";
          break;
        case 4901:
          errorMessage =
            "The provider is disconnected from the specified chain.";
          break;
        default:
          if (error.message) {
            errorMessage = `Connection failed: ${error.message}`;
          }
      }

      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
    }
  }, [isMetaMaskInstalled]);

  // Get balance for Sepolia network
  const getBalance = useCallback(
    async (address: string) => {
      if (!address || !isMetaMaskInstalled()) return null;

      try {
        setWalletState((prev) => ({ ...prev, isLoadingBalance: true }));

        // Create provider for Sepolia network
        const provider = new ethers.BrowserProvider(window.ethereum!);

        // Switch to Sepolia network if not already connected
        try {
          await window.ethereum!.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }], // Sepolia chainId
          });
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum!.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia Test Network",
                  nativeCurrency: {
                    name: "SepoliaETH",
                    symbol: "SEP",
                    decimals: 18,
                  },
                  rpcUrls: ["https://sepolia.infura.io/v3/"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
                },
              ],
            });
          }
        }

        // Get balance
        const balance = await provider.getBalance(address);
        const balanceInEth = ethers.formatEther(balance);

        setWalletState((prev) => ({
          ...prev,
          balance: balanceInEth,
          isLoadingBalance: false,
        }));

        return balanceInEth;
      } catch (error: any) {
        console.error("Error fetching balance:", error);
        setWalletState((prev) => ({
          ...prev,
          balance: null,
          isLoadingBalance: false,
          error: `Failed to fetch balance: ${error.message || "Unknown error"}`,
        }));
        return null;
      }
    },
    [isMetaMaskInstalled]
  );

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (walletState.address) {
      await getBalance(walletState.address);
    }
  }, [walletState.address, getBalance]);

  // Format balance for display
  const formatBalance = useCallback((balance: string) => {
    if (!balance) return "0.0000";
    const num = parseFloat(balance);
    return num.toFixed(4);
  }, []);

  // Check if wallet is already connected (only checks, doesn't auto-connect)
  const checkConnection = useCallback(async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      // Only check if accounts are already connected (eth_accounts doesn't trigger connection prompt)
      const accounts = await window.ethereum!.request({
        method: "eth_accounts",
      });

      // Only set as connected if there are accounts AND user has previously connected
      if (accounts.length > 0) {
        setWalletState((prev) => ({
          ...prev,
          isConnected: true,
          address: accounts[0],
          error: null,
        }));

        // Get balance for existing connection
        await getBalance(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      // Don't set error for connection check failure
    }
  }, [isMetaMaskInstalled, getBalance]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      isConnecting: false,
      error: null,
      balance: null,
      isLoadingBalance: false,
    });
  }, []);

  // Handle account changes
  const handleAccountsChanged = useCallback(
    async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletState((prev) => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
          error: null,
        }));

        // Get balance for new account
        await getBalance(accounts[0]);
      }
    },
    [disconnectWallet, getBalance]
  );

  // Set up event listeners
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    // Check initial connection
    checkConnection();

    // Listen for account changes
    window.ethereum!.on("accountsChanged", handleAccountsChanged);

    // Cleanup
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [isMetaMaskInstalled, checkConnection, handleAccountsChanged]);

  // Format address for display
  const formatAddress = useCallback((address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    formatBalance,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    formatAddress,
  };
};
