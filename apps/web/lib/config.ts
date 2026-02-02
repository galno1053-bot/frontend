export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  solanaRpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
  solanaProgramId: process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID ?? "",
  evmEscrowAddress: process.env.NEXT_PUBLIC_EVM_ESCROW_ADDRESS ?? "",
  evmRpcUrl: process.env.NEXT_PUBLIC_EVM_RPC_URL ?? ""
};
