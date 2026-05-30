// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// ─────────────────────────────────────────────
//  StudyVault Token (SVT) — ERC-20 reward token
// ─────────────────────────────────────────────
contract StudyVaultToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;
    address public rewardController;

    event RewardControllerSet(address indexed controller);

    modifier onlyController() {
        require(msg.sender == rewardController || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() ERC20("StudyVault Token", "SVT") Ownable(msg.sender) {
        _mint(msg.sender, 10_000_000 * 10 ** 18); // 10M initial supply to treasury
    }

    function setRewardController(address _controller) external onlyOwner {
        rewardController = _controller;
        emit RewardControllerSet(_controller);
    }

    function mintReward(address to, uint256 amount) external onlyController {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}

// ─────────────────────────────────────────────
//  StudyVault Notes NFT — ERC-721
// ─────────────────────────────────────────────
contract StudyVaultNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct NoteMetadata {
        string ipfsHash;
        string title;
        string subject;
        address creator;
        uint256 price;       // in SVT (wei units)
        uint256 royaltyBps;  // basis points e.g. 500 = 5%
        uint256 mintedAt;
        uint256 downloads;
    }

    mapping(uint256 => NoteMetadata) public notes;
    mapping(address => uint256[]) public creatorNotes;
    mapping(uint256 => bool) public listed;

    StudyVaultToken public svtToken;

    event NoteMinted(uint256 indexed tokenId, address indexed creator, string ipfsHash, uint256 price);
    event NotePurchased(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event NoteDownloaded(uint256 indexed tokenId, address indexed downloader);

    constructor(address _svtToken) ERC721("StudyVault Notes", "SVN") Ownable(msg.sender) {
        svtToken = StudyVaultToken(_svtToken);
    }

    function mintNote(
        string calldata ipfsHash,
        string calldata title,
        string calldata subject,
        string calldata tokenURI_,
        uint256 price,
        uint256 royaltyBps
    ) external returns (uint256) {
        require(royaltyBps <= 1000, "Max 10% royalty");
        _tokenIds.increment();
        uint256 newId = _tokenIds.current();

        _safeMint(msg.sender, newId);
        _setTokenURI(newId, tokenURI_);

        notes[newId] = NoteMetadata({
            ipfsHash: ipfsHash,
            title: title,
            subject: subject,
            creator: msg.sender,
            price: price,
            royaltyBps: royaltyBps,
            mintedAt: block.timestamp,
            downloads: 0
        });

        creatorNotes[msg.sender].push(newId);
        listed[newId] = true;

        emit NoteMinted(newId, msg.sender, ipfsHash, price);
        return newId;
    }

    function purchaseNote(uint256 tokenId) external {
        require(_exists(tokenId), "Token does not exist");
        NoteMetadata storage note = notes[tokenId];
        address seller = ownerOf(tokenId);
        require(seller != msg.sender, "Cannot buy own note");
        require(note.price > 0, "Not for sale");

        uint256 royalty = (note.price * note.royaltyBps) / 10000;
        uint256 sellerAmount = note.price - royalty;

        // Transfer SVT from buyer
        require(svtToken.transferFrom(msg.sender, seller, sellerAmount), "Payment failed");
        if (royalty > 0) {
            require(svtToken.transferFrom(msg.sender, note.creator, royalty), "Royalty failed");
        }

        _transfer(seller, msg.sender, tokenId);
        note.downloads++;

        emit NotePurchased(tokenId, msg.sender, seller, note.price);
    }

    function recordDownload(uint256 tokenId) external {
        require(_exists(tokenId), "Token does not exist");
        notes[tokenId].downloads++;
        emit NoteDownloaded(tokenId, msg.sender);
    }

    function getCreatorNotes(address creator) external view returns (uint256[] memory) {
        return creatorNotes[creator];
    }

    function totalMinted() external view returns (uint256) {
        return _tokenIds.current();
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId <= _tokenIds.current();
    }
}

// ─────────────────────────────────────────────
//  StudyVault Rewards Controller
// ─────────────────────────────────────────────
contract StudyVaultRewards is Ownable {
    StudyVaultToken public svtToken;
    StudyVaultNFT public svtNFT;

    uint256 public uploadReward    = 50  * 10 ** 18;
    uint256 public downloadReward  = 10  * 10 ** 18;
    uint256 public ratingReward    = 5   * 10 ** 18;
    uint256 public nftMintReward   = 25  * 10 ** 18;
    uint256 public signupBonus     = 100 * 10 ** 18;

    mapping(address => bool) public hasSignupBonus;
    mapping(address => uint256) public totalEarned;
    mapping(bytes32 => bool) public rewardClaimed; // prevent double-claiming

    event RewardIssued(address indexed to, uint256 amount, string reason);
    event RewardParamsUpdated(uint256 upload, uint256 download, uint256 rating);

    constructor(address _svt, address _nft) Ownable(msg.sender) {
        svtToken = StudyVaultToken(_svt);
        svtNFT   = StudyVaultNFT(_nft);
    }

    function claimSignupBonus() external {
        require(!hasSignupBonus[msg.sender], "Already claimed");
        hasSignupBonus[msg.sender] = true;
        _issue(msg.sender, signupBonus, "signup_bonus");
    }

    function issueUploadReward(address uploader, string calldata noteId) external onlyOwner {
        bytes32 key = keccak256(abi.encodePacked("upload", uploader, noteId));
        require(!rewardClaimed[key], "Already rewarded");
        rewardClaimed[key] = true;
        _issue(uploader, uploadReward, "upload");
    }

    function issueDownloadReward(address uploader, string calldata noteId, address downloader) external onlyOwner {
        bytes32 key = keccak256(abi.encodePacked("download", downloader, noteId));
        require(!rewardClaimed[key], "Already rewarded");
        rewardClaimed[key] = true;
        _issue(uploader, downloadReward, "download_royalty");
    }

    function issueRatingReward(address uploader, string calldata noteId) external onlyOwner {
        bytes32 key = keccak256(abi.encodePacked("rating", uploader, noteId));
        require(!rewardClaimed[key], "Already rewarded");
        rewardClaimed[key] = true;
        _issue(uploader, ratingReward, "rating_bonus");
    }

    function issueNFTMintReward(address minter) external onlyOwner {
        _issue(minter, nftMintReward, "nft_mint");
    }

    function setRewardParams(uint256 _upload, uint256 _download, uint256 _rating, uint256 _nft) external onlyOwner {
        uploadReward   = _upload;
        downloadReward = _download;
        ratingReward   = _rating;
        nftMintReward  = _nft;
        emit RewardParamsUpdated(_upload, _download, _rating);
    }

    function _issue(address to, uint256 amount, string memory reason) internal {
        svtToken.mintReward(to, amount);
        totalEarned[to] += amount;
        emit RewardIssued(to, amount, reason);
    }

    function getLeaderboard(address[] calldata users) external view returns (address[] memory, uint256[] memory) {
        uint256[] memory earnings = new uint256[](users.length);
        for (uint256 i = 0; i < users.length; i++) {
            earnings[i] = totalEarned[users[i]];
        }
        return (users, earnings);
    }
}
