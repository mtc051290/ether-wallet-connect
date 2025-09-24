import { useState, useEffect, useCallback } from "react";
import { formatEther, BrowserProvider } from "ethers";

/**
 * Custom hook for managing wallet connection and Web3 interactions
 * Provides wallet connection, balance fetching, and error handling
 */
export const useWallet = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState(null);

  /**
   * Check if MetaMask is installed
   */
  const isMetaMaskInstalled = useCallback(() => {
    return (
      typeof window !== "undefined" && typeof window.ethereum !== "undefined"
    );
  }, []);

  /**
   * Format wallet address for display (0x1234...5678)
   */
  const formatAddress = useCallback((address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  /**
   * Format balance for display (with ETH suffix)
   */
  const formatBalance = useCallback((balance) => {
    if (!balance) return "0.00";
    const balanceNumber = parseFloat(balance);
    return `${balanceNumber.toFixed(4)} ETH`;
  }, []);

  /**
   * Get wallet balance
   */
  const getBalance = useCallback(async (address, currentProvider) => {
    try {
      if (!currentProvider || !address) return;

      const balance = await currentProvider.getBalance(address);
      const formattedBalance = formatEther(balance);
      setBalance(formattedBalance);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance");
    }
  }, []);

  /**
   * Connect to MetaMask wallet
   */
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError(
        "MetaMask is not installed. Please install MetaMask to continue."
      );
      return;
    }

    setIsConnecting(true);
    setError("");

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        const web3Provider = new BrowserProvider(window.ethereum);

        setAccount(account);
        setProvider(web3Provider);
        setIsConnected(true);

        // Fetch balance
        await getBalance(account, web3Provider);

        // Store connection state
        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletAccount", account);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setIsConnecting(false);
      // Re-throw the error so the component can handle it with toast notifications
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, getBalance]);

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(() => {
    setAccount("");
    setBalance("");
    setIsConnected(false);
    setProvider(null);
    setError("");

    // Clear stored state
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAccount");
  }, []);

  /**
   * Handle account change
   */
  const handleAccountsChanged = useCallback(
    (accounts) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else if (accounts[0] !== account) {
        // User switched accounts
        setAccount(accounts[0]);
        if (provider) {
          getBalance(accounts[0], provider);
        }
        localStorage.setItem("walletAccount", accounts[0]);
      }
    },
    [account, provider, disconnectWallet, getBalance]
  );

  /**
   * Handle chain change
   */
  const handleChainChanged = useCallback(() => {
    // Reload balance when chain changes
    if (account && provider) {
      getBalance(account, provider);
    }
  }, [account, provider, getBalance]);

  /**
   * Check for existing connection on component mount
   */
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const wasConnected = localStorage.getItem("walletConnected");
        const storedAccount = localStorage.getItem("walletAccount");

        if (wasConnected && storedAccount) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0 && accounts.includes(storedAccount)) {
            const web3Provider = new BrowserProvider(window.ethereum);
            setAccount(storedAccount);
            setProvider(web3Provider);
            setIsConnected(true);

            // Fetch balance
            await getBalance(storedAccount, web3Provider);
          } else {
            // Stored account is no longer available
            disconnectWallet();
          }
        }
      } catch (err) {
        console.error("Error checking connection:", err);
        disconnectWallet();
      }
    };

    checkConnection();
  }, [isMetaMaskInstalled, getBalance, disconnectWallet]);

  /**
   * Set up event listeners for MetaMask
   */
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Cleanup event listeners
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged, isMetaMaskInstalled]);

  return {
    account,
    balance,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    formatAddress,
    formatBalance,
    isMetaMaskInstalled,
  };
};
