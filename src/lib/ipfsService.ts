import { generateMockIpfsHash, sleep } from './utils';
import { supabase } from './supabase';

export interface IPFSUploadResult {
  hash: string;
  url: string;
  size: number;
}

/**
 * Upload a file — uses Supabase Storage if configured, otherwise Pinata, otherwise mock.
 */
export async function uploadFileToIPFS(file: File): Promise<IPFSUploadResult> {
  // Try Supabase Storage first
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const filePath = `notes/${session.user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('studyvault-files')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from('studyvault-files')
        .getPublicUrl(data.path);
      return {
        hash: data.path,
        url: urlData.publicUrl,
        size: file.size,
      };
    }
  }

  // Fallback: Pinata
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
  if (apiKey && apiKey !== 'your_pinata_api_key') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify({ name: file.name }));
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: { pinata_api_key: apiKey, pinata_secret_api_key: secretKey! },
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
      return { hash: data.IpfsHash, url: `${gateway}/${data.IpfsHash}`, size: data.PinSize };
    }
  }

  // Demo mode fallback
  await sleep(1500);
  const hash = generateMockIpfsHash();
  return { hash, url: `https://gateway.pinata.cloud/ipfs/${hash}`, size: file.size };
}

export async function uploadJSONToIPFS(metadata: Record<string, unknown>): Promise<string> {
  await sleep(500);
  return generateMockIpfsHash();
}

export function ipfsHashToUrl(hash: string): string {
  if (hash.startsWith('http')) return hash;
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
  return `${gateway}/${hash}`;
}
