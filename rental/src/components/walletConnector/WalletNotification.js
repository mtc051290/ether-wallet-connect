import React from "react";
import "./walletNotification.css";

/**
 * WalletNotification Component
 * Displays elegant notifications for wallet actions
 */
const WalletNotification = ({ show, type, message, onClose }) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500); // 3.5 seconds for better readability
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fa-solid fa-check-circle";
      case "error":
        return "fa-solid fa-exclamation-circle";
      case "info":
        return "fa-solid fa-info-circle";
      case "warning":
        return "fa-solid fa-exclamation-triangle";
      default:
        return "fa-solid fa-bell";
    }
  };

  return (
    <div className={`wallet-notification wallet-notification-${type}`}>
      <div className="notification-content">
        <i className={`${getIcon()} notification-icon`}></i>
        <span className="notification-message">{message}</span>
      </div>
      <button className="notification-close" onClick={onClose}>
        <i className="fa-solid fa-times"></i>
      </button>
    </div>
  );
};

export default WalletNotification;
