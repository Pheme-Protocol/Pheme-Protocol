// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/// @title SkillWallet - Soulbound NFT for PHEME
/// @notice Each address can mint only one Skill Wallet
contract SkillWallet is ERC721Enumerable {
    mapping(address => bool) public hasMinted;
    uint256 public nextTokenId;

    event SkillWalletMinted(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("Skill Wallet", "SKILL") {}

    /// @notice Mint a soulbound Skill Wallet NFT
    /// @dev Reverts if the caller already owns a Skill Wallet
    function mint() external {
        require(!hasMinted[msg.sender], "Already minted");
        uint256 tokenId = ++nextTokenId;
        _safeMint(msg.sender, tokenId);
        hasMinted[msg.sender] = true;
        emit SkillWalletMinted(msg.sender, tokenId);
    }

    /// @notice Override transfer functions to make token soulbound
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
        require(from == address(0) || to == address(0), "Soulbound: non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
} 