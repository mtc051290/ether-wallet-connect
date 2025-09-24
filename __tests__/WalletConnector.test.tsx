import { render, screen } from "@testing-library/react";
import { WalletConnector } from "@/components/WalletConnector";
import "@testing-library/jest-dom";

// Mock the useWallet hook with default values
const mockUseWallet = jest.fn();

jest.mock("@/hooks/useWallet", () => ({
  useWallet: () => mockUseWallet(),
}));

// Mock FontAwesome icons
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon }: any) => (
    <div data-testid="font-awesome-icon">{icon.iconName || "icon"}</div>
  ),
}));

describe("WalletConnector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders connect wallet button when not connected", () => {
    mockUseWallet.mockReturnValue({
      isConnected: false,
      address: null,
      isConnecting: false,
      error: null,
      balance: null,
      isLoadingBalance: false,
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      refreshBalance: jest.fn(),
      formatBalance: jest.fn(),
      isMetaMaskInstalled: true,
      formatAddress: jest.fn(
        (addr: string) => `${addr?.slice(0, 6)}...${addr?.slice(-4)}`
      ),
    });

    render(<WalletConnector />);

    expect(screen.getByText("Connect Your Wallet")).toBeInTheDocument();
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
    expect(
      screen.getByText(/Connect your MetaMask wallet/)
    ).toBeInTheDocument();
  });

  it("shows connecting state when connecting", () => {
    mockUseWallet.mockReturnValue({
      isConnected: false,
      address: null,
      isConnecting: true,
      error: null,
      balance: null,
      isLoadingBalance: false,
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      refreshBalance: jest.fn(),
      formatBalance: jest.fn(),
      isMetaMaskInstalled: true,
      formatAddress: jest.fn(),
    });

    render(<WalletConnector />);

    expect(
      screen.getByRole("heading", { name: "Connecting..." })
    ).toBeInTheDocument();
  });

  it("shows connected state when wallet is connected", () => {
    const mockAddress = "0x1234567890123456789012345678901234567890";

    mockUseWallet.mockReturnValue({
      isConnected: true,
      address: mockAddress,
      isConnecting: false,
      error: null,
      balance: "1.2345",
      isLoadingBalance: false,
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      refreshBalance: jest.fn(),
      formatBalance: jest.fn(() => "1.2345"),
      isMetaMaskInstalled: true,
      formatAddress: jest.fn(() => "0x1234...7890"),
    });

    render(<WalletConnector />);

    expect(screen.getByText("Wallet Connected")).toBeInTheDocument();
    expect(screen.getByText("0x1234...7890")).toBeInTheDocument();
    expect(screen.getByText("1.2345 SEP")).toBeInTheDocument();
    expect(screen.getByText("SepoliaETH Balance")).toBeInTheDocument();
    expect(screen.getByText("Disconnect Wallet")).toBeInTheDocument();
  });

  it("shows error state when there is an error", () => {
    mockUseWallet.mockReturnValue({
      isConnected: false,
      address: null,
      isConnecting: false,
      error: "Connection failed",
      balance: null,
      isLoadingBalance: false,
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      refreshBalance: jest.fn(),
      formatBalance: jest.fn(),
      isMetaMaskInstalled: true,
      formatAddress: jest.fn(),
    });

    render(<WalletConnector />);

    expect(screen.getByText("Connection Failed")).toBeInTheDocument();
    expect(screen.getByText("Connection failed")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("shows MetaMask not installed message when MetaMask is not available", () => {
    mockUseWallet.mockReturnValue({
      isConnected: false,
      address: null,
      isConnecting: false,
      error: null,
      balance: null,
      isLoadingBalance: false,
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      refreshBalance: jest.fn(),
      formatBalance: jest.fn(),
      isMetaMaskInstalled: false,
      formatAddress: jest.fn(),
    });

    render(<WalletConnector />);

    expect(screen.getByText("MetaMask Required")).toBeInTheDocument();
    expect(screen.getByText(/Install MetaMask to connect/)).toBeInTheDocument();
    expect(screen.getByText("Install MetaMask")).toBeInTheDocument();
  });

  it("shows loading state when balance is being fetched", () => {
    const mockAddress = "0x1234567890123456789012345678901234567890";

    mockUseWallet.mockReturnValue({
      isConnected: true,
      address: mockAddress,
      isConnecting: false,
      error: null,
      balance: null,
      isLoadingBalance: true,
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      refreshBalance: jest.fn(),
      formatBalance: jest.fn(),
      isMetaMaskInstalled: true,
      formatAddress: jest.fn(() => "0x1234...7890"),
    });

    render(<WalletConnector />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByText("SepoliaETH Balance")).toBeInTheDocument();
  });
});
