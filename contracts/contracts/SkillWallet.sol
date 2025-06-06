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

    /// @notice Structure to store skill information
    struct Skill {
        string name;
        uint256 level;
        uint256 timestamp;
    }

    /// @notice Mapping to store skills: tokenId => skillId => Skill
    mapping(uint256 => mapping(uint256 => Skill)) public skills;
    
    /// @notice Counter for skills per token
    mapping(uint256 => uint256) public skillCount;

    /// @notice Emitted when a new Skill Wallet is minted
    /// @param to The address that received the Skill Wallet
    /// @param tokenId The ID of the minted Skill Wallet
    event SkillWalletMinted(address indexed to, uint256 indexed tokenId);

    /// @notice Emitted when a skill is added or updated
    /// @param tokenId The ID of the Skill Wallet
    /// @param skillId The ID of the skill
    /// @param name The name of the skill
    /// @param level The level of the skill
    event SkillUpdated(uint256 indexed tokenId, uint256 indexed skillId, string name, uint256 level);

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

    /// @notice Add a new skill to a Skill Wallet
    /// @param tokenId The ID of the Skill Wallet
    /// @param name The name of the skill
    /// @param level The level of the skill
    function addSkill(uint256 tokenId, string memory name, uint256 level) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        
        uint256 skillId = skillCount[tokenId]++;
        skills[tokenId][skillId] = Skill({
            name: name,
            level: level,
            timestamp: block.timestamp
        });
        
        emit SkillUpdated(tokenId, skillId, name, level);
    }

    /// @notice Update an existing skill in a Skill Wallet
    /// @param tokenId The ID of the Skill Wallet
    /// @param skillId The ID of the skill to update
    /// @param newLevel The new level of the skill
    function updateSkill(uint256 tokenId, uint256 skillId, uint256 newLevel) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(skillId < skillCount[tokenId], "Skill does not exist");
        
        skills[tokenId][skillId].level = newLevel;
        skills[tokenId][skillId].timestamp = block.timestamp;
        
        emit SkillUpdated(tokenId, skillId, skills[tokenId][skillId].name, newLevel);
    }

    /// @notice Get a skill from a Skill Wallet
    /// @param tokenId The ID of the Skill Wallet
    /// @param skillId The ID of the skill
    /// @return The skill information
    function getSkill(uint256 tokenId, uint256 skillId) external view returns (Skill memory) {
        require(_exists(tokenId), "Token does not exist");
        require(skillId < skillCount[tokenId], "Skill does not exist");
        return skills[tokenId][skillId];
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