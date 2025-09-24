import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useWallet } from "../../hooks/useWallet";
import WalletNotification from "./WalletNotification";
import "./walletConnector.css";
import "./walletNotification.css";

/**
 * WalletConnector Component
 * Handles wallet connection, display of address and balance, and disconnection
 * Integrates with the existing rental project design
 */
const WalletConnector = () => {
  const {
    account,
    balance,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    formatAddress,
    formatBalance,
    isMetaMaskInstalled,
  } = useWallet();

  const [showModal, setShowModal] = React.useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = React.useState(false);
  const [notification, setNotification] = React.useState({
    show: false,
    type: "",
    message: "",
  });

  /**
   * Show notification
   */
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  /**
   * Hide notification
   */
  const hideNotification = () => {
    setNotification({ show: false, type: "", message: "" });
  };

  /**
   * Handle copy address to clipboard
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setShowCopyFeedback(true);
      showNotification("success", "Address copied to clipboard!");
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
      showNotification("error", "Failed to copy address");
    }
  };

  /**
   * Handle disconnect wallet
   */
  const handleDisconnect = () => {
    // Clear any existing notifications and feedback
    setShowCopyFeedback(false);
    hideNotification();
    // Then disconnect
    disconnectWallet();
  };

  /**
   * Open Etherscan for the current address
   */
  const openEtherscan = () => {
    window.open(`https://etherscan.io/address/${account}`, "_blank");
  };

  /**
   * Handle connect button click
   */
  const handleConnect = async () => {
    if (!isMetaMaskInstalled()) {
      setShowModal(true);
      return;
    }

    try {
      await connectWallet();
    } catch (err) {
      // Handle specific error cases with toast notifications
      if (err.code === 4001) {
        showNotification("error", "Connection rejected by user");
      } else if (err.code === -32002) {
        showNotification("warning", "Connection request already pending");
      } else if (err.code === -32603) {
        showNotification(
          "error",
          "Internal JSON-RPC error. Please check your MetaMask connection."
        );
      } else {
        showNotification(
          "error",
          "Failed to connect wallet. Please try again."
        );
      }
    }
  };

  /**
   * Render connection button or connected state
   */
  if (isConnected) {
    return (
      <div className="wallet-connected">
        <div className="wallet-address-container">
          <span className="wallet-address" title={account}>
            {formatAddress(account)}
          </span>
          <div className="wallet-actions">
            <button
              className="action-btn copy-btn"
              onClick={copyToClipboard}
              title="Copy address"
            >
              <i className="fa-regular fa-copy"></i>
            </button>
            <button
              className="action-btn etherscan-btn"
              onClick={openEtherscan}
              title="View on Etherscan"
            >
              <i className="fa-solid fa-external-link-alt"></i>
            </button>
            {/* Copy feedback */}
            {showCopyFeedback && (
              <div className="copy-feedback">Address copied to clipboard!</div>
            )}
          </div>
        </div>
        {balance && (
          <div className="wallet-balance">{formatBalance(balance)}</div>
        )}
        <Button
          variant="outline-light"
          size="sm"
          onClick={handleDisconnect}
          className="disconnect-btn"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="primary"
        className="btn-primary connect-wallet-btn"
        onClick={handleConnect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Connecting...
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>

      {/* MetaMask installation modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white border-0">
          <Modal.Title className="d-flex align-items-center">
            <i className="fa-brands fa-ethereum me-2 text-warning"></i>
            MetaMask Required
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white text-center p-4">
          <div className="metamask-modal-content">
            <div className="metamask-icon-container mb-4">
              <i className="fa-brands fa-ethereum metamask-icon"></i>
            </div>
            <h5 className="mb-3">Web3 Wallet Not Detected</h5>
            <p className="gray-50 mb-4">
              To connect your wallet and access Web3 features, you need to have
              MetaMask installed in your browser.
            </p>
            <div className="d-grid gap-2 metamask-buttons-container">
              <Button
                variant="primary"
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="metamask-install-btn"
              >
                <i className="fa-solid fa-download me-2"></i>
                Install MetaMask
              </Button>
              <Button
                variant="outline-light"
                onClick={() => setShowModal(false)}
                className="metamask-cancel-btn"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Wallet Notifications */}
      <WalletNotification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={hideNotification}
      />
    </>
  );
};

export default WalletConnector;
