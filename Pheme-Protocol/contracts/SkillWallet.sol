// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SkillWallet - Soulbound NFT for PHEME
/// @notice A non-transferable NFT that represents a user's on-chain reputation
/// @dev Each address can mint only one Skill Wallet, and tokens cannot be transferred
contract SkillWallet is ERC721Enumerable, Ownable {
    /// @notice Mapping to track which addresses have minted a Skill Wallet
    mapping(address => bool) public hasMinted;
    
    /// @notice Counter for token IDs
    uint256 public nextTokenId;

    /// @notice Emitted when a new Skill Wallet is minted
    /// @param to The address that received the Skill Wallet
    /// @param tokenId The ID of the minted Skill Wallet
    event SkillWalletMinted(address indexed to, uint256 indexed tokenId);

    /// @notice Constructor initializes the contract with name and symbol
    /// @dev Sets the contract deployer as the owner
    constructor() ERC721("Skill Wallet", "SKILL") Ownable() {}

    /// @notice Mint a soulbound Skill Wallet NFT
    /// @dev Reverts if the caller already owns a Skill Wallet
    /// @return tokenId The ID of the newly minted Skill Wallet
    function mint() external returns (uint256 tokenId) {
        require(!hasMinted[msg.sender], "Already minted");
        tokenId = ++nextTokenId;
        _safeMint(msg.sender, tokenId);
        hasMinted[msg.sender] = true;
        emit SkillWalletMinted(msg.sender, tokenId);
    }

    /// @notice Check if an address has minted a Skill Wallet
    /// @param account The address to check
    /// @return bool True if the address has minted a Skill Wallet
    function hasMintedWallet(address account) external view returns (bool) {
        return hasMinted[account];
    }

    /// @notice Override transfer functions to make token soulbound
    /// @dev Prevents transfers between non-zero addresses
    /// @param from The address sending the token
    /// @param to The address receiving the token
    /// @param tokenId The ID of the token being transferred
    /// @param batchSize The number of tokens being transferred
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "Soulbound: non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
} 