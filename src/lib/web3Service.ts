import { sleep } from './utils';

export interface MintNFTParams {
  ipfsHash: string;
  title: string;
  subject: string;
  metadataURI: string;
  price: bigint;
  royaltyBps: number;
}

export interface MintResult {
  tokenId: string;
  txHash: string;
  contractAddress: string;
}

/**
 * Connect to MetaMask and return provider + signer.
 * Falls back to demo mode if MetaMask is not installed.
 */
export async function getProvider() {
  if (typeof window === 'undefined') return null;
  const eth = (window as any).ethereum;
  if (!eth) return null;
  const { ethers } = await import('ethers');
  return new ethers.BrowserProvider(eth);
}

export async function requestAccounts(): Promise<string[]> {
  const provider = await getProvider();
  if (!provider) {
    // Demo mode
    return ['0x742d35Cc6634C0532925a3b8D4C9C2B1234567890'];
  }
  return provider.send('eth_requestAccounts', []);
}

/**
 * Mint a note as an NFT.
 * In demo mode (no contract address), simulates the transaction.
 */
export async function mintNoteNFT(params: MintNFTParams): Promise<MintResult> {
  const contractAddress = process.env.NEXT_PUBLIC_SVT_NFT_ADDRESS;

  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    // Demo mode
    await sleep(2000);
    const tokenId = String(Math.floor(Math.random() * 10000));
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return {
      tokenId,
      txHash,
      contractAddress: '0xDEMO...CONTRACT',
    };
  }

  const provider = await getProvider();
  if (!provider) throw new Error('No provider available');

  const signer = await provider.getSigner();
  const { ethers } = await import('ethers');

  const abi = [
    'function mintNote(string ipfsHash, string title, string subject, string tokenURI, uint256 price, uint256 royaltyBps) returns (uint256)',
  ];

  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.mintNote(
    params.ipfsHash,
    params.title,
    params.subject,
    params.metadataURI,
    params.price,
    params.royaltyBps
  );
  const receipt = await tx.wait();

  const tokenId = receipt.logs[0]?.topics[3]
    ? BigInt(receipt.logs[0].topics[3]).toString()
    : String(Date.now());

  return {
    tokenId,
    txHash: receipt.hash,
    contractAddress,
  };
}

/**
 * Claim signup bonus tokens from the rewards contract.
 */
export async function claimSignupBonus(): Promise<string> {
  const contractAddress = process.env.NEXT_PUBLIC_REWARDS_ADDRESS;

  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    await sleep(1000);
    return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  const provider = await getProvider();
  if (!provider) throw new Error('No provider');
  const signer = await provider.getSigner();
  const { ethers } = await import('ethers');

  const abi = ['function claimSignupBonus() external'];
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.claimSignupBonus();
  const receipt = await tx.wait();
  return receipt.hash;
}

/**
 * Get SVT token balance for an address.
 */
export async function getSVTBalance(address: string): Promise<string> {
  const contractAddress = process.env.NEXT_PUBLIC_SVT_TOKEN_ADDRESS;

  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return '1250';
  }

  const provider = await getProvider();
  if (!provider) return '0';
  const { ethers } = await import('ethers');

  const abi = ['function balanceOf(address) view returns (uint256)'];
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance, 18);
}

export function shortenTxHash(hash: string): string {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

export function etherscanUrl(hash: string, type: 'tx' | 'address' = 'tx'): string {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '11155111';
  const subdomain = chainId === '1' ? '' : 'sepolia.';
  return `https://${subdomain}etherscan.io/${type}/${hash}`;
}
