'use client';
import { useState } from 'react';
import { Crown, Zap, Shield, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { showToast } from '@/components/ui/toast';
import { useAppStore } from '@/store/appStore';
import { mintNoteNFT } from '@/lib/web3Service';
import { uploadJSONToIPFS } from '@/lib/ipfsService';
import { Note } from '@/types';
import { cn } from '@/lib/utils';

interface MintNFTModalProps {
  note: Note;
  onClose: () => void;
  onSuccess?: (tokenId: string, txHash: string) => void;
}

const ROYALTY_OPTIONS = [
  { bps: 250, label: '2.5%', desc: 'Standard' },
  { bps: 500, label: '5%', desc: 'Recommended' },
  { bps: 1000, label: '10%', desc: 'Maximum' },
];

export function MintNFTModal({ note, onClose, onSuccess }: MintNFTModalProps) {
  const { wallet, updateTokenBalance } = useAppStore();
  const [royaltyBps, setRoyaltyBps] = useState(500);
  const [price, setPrice] = useState(note.price || 50);
  const [minting, setMinting] = useState(false);
  const [mintedToken, setMintedToken] = useState<{ tokenId: string; txHash: string } | null>(null);

  const handleMint = async () => {
    if (!wallet.isConnected) {
      showToast.warning('Please connect your wallet first');
      return;
    }
    setMinting(true);
    try {
      // Upload NFT metadata to IPFS
      const metadata = {
        name: note.title,
        description: note.description,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${note.id}`,
        attributes: [
          { trait_type: 'Subject', value: note.subject },
          { trait_type: 'University', value: note.university },
          { trait_type: 'File Type', value: note.fileType.toUpperCase() },
          { trait_type: 'Rating', value: note.rating.toString() },
          { trait_type: 'Downloads', value: note.downloads.toString() },
        ],
        external_url: `https://studyvault.xyz/notes/${note.id}`,
        studyvault: { ipfsHash: note.ipfsHash, aiSummary: note.aiSummary },
      };

      const metadataURI = await uploadJSONToIPFS(metadata);

      const result = await mintNoteNFT({
        ipfsHash: note.ipfsHash,
        title: note.title,
        subject: note.subject,
        metadataURI: `ipfs://${metadataURI}`,
        price: BigInt(price) * BigInt(10 ** 18),
        royaltyBps,
      });

      setMintedToken(result);
      updateTokenBalance(25); // NFT mint bonus
      showToast.token(25, 'NFT Mint bonus earned!');
      onSuccess?.(result.tokenId, result.txHash);
    } catch (error: any) {
      showToast.error(error.message || 'Minting failed');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/80 text-gray-500">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900">Mint as NFT</h2>
              <p className="text-xs text-gray-500">ERC-721 on Ethereum</p>
            </div>
          </div>
          <div className="bg-white/70 rounded-xl p-3 mt-3">
            <p className="text-sm font-semibold text-gray-800 truncate">{note.title}</p>
            <p className="text-xs text-gray-400">{note.subject} · {note.university}</p>
          </div>
        </div>

        {mintedToken ? (
          <div className="p-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-2">NFT Minted!</h3>
            <p className="text-sm text-gray-500 mb-4">Your note is now tokenized on the Ethereum blockchain.</p>
            <div className="bg-amber-50 rounded-xl p-4 mb-4 text-left space-y-2">
              <div className="flex justify-between text-xs"><span className="text-gray-400">Token ID</span><span className="font-mono font-bold text-amber-700">#{mintedToken.tokenId}</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-400">Tx Hash</span><span className="font-mono text-indigo-600">{mintedToken.txHash.slice(0, 20)}...</span></div>
            </div>
            <div className="flex gap-3">
              <a href={`https://sepolia.etherscan.io/tx/${mintedToken.txHash}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full gap-2"><ExternalLink className="w-4 h-4" /> View on Etherscan</Button>
              </a>
              <Button onClick={onClose} className="flex-1">Done</Button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Listing Price (SVT)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={10} max={500} step={5} value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-center min-w-[80px]">
                  <span className="font-display font-bold text-amber-700">🪙 {price}</span>
                </div>
              </div>
            </div>

            {/* Royalty */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Resale Royalty</label>
              <div className="grid grid-cols-3 gap-2">
                {ROYALTY_OPTIONS.map(opt => (
                  <button
                    key={opt.bps}
                    onClick={() => setRoyaltyBps(opt.bps)}
                    className={cn(
                      'p-3 rounded-xl border-2 text-center transition-all',
                      royaltyBps === opt.bps
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-gray-100 bg-gray-50 hover:border-amber-200'
                    )}
                  >
                    <div className="font-display font-bold text-sm text-gray-900">{opt.label}</div>
                    <div className="text-xs text-gray-400">{opt.desc}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">You earn {ROYALTY_OPTIONS.find(o => o.bps === royaltyBps)?.label} of every future resale automatically.</p>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 space-y-2">
              {[
                { icon: Crown, text: 'Blockchain-verified ownership proof' },
                { icon: Zap, text: '+25 SVT mint bonus reward' },
                { icon: Shield, text: `${ROYALTY_OPTIONS.find(o => o.bps === royaltyBps)?.label} royalty on every resale forever` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-amber-800">
                  <Icon className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {!wallet.isConnected && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-red-600">⚠️ Connect your wallet to mint NFTs</p>
              </div>
            )}

            <Button
              variant="amber"
              className="w-full gap-2 h-12 text-base"
              onClick={handleMint}
              isLoading={minting}
              disabled={!wallet.isConnected}
            >
              <Crown className="w-5 h-5" />
              {minting ? 'Minting on Ethereum...' : `Mint NFT for ${price} SVT`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
