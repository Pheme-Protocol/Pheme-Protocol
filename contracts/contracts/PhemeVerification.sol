// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PhemeVerification is Ownable {
    event VerificationCreated(address indexed user, uint256 skillId, bytes verificationData, uint256 blockNumber);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    
    error EmptySkillId();
    error SkillIdTooLong();
    error NotVerifier();
    error InvalidAddress();
    error DuplicateVerification();
    
    uint256 public constant MAX_SKILL_ID_LENGTH = 100;

    // Mapping to track verifiers
    mapping(address => bool) public isVerifier;
    
    // Mapping to store verifications: user => skillId => Verification
    mapping(address => mapping(uint256 => Verification)) public verifications;

    struct Verification {
        address verifier;
        bytes data;
        uint256 blockNumber;
    }

    constructor() {
        _transferOwnership(msg.sender);
    }

    function addVerifier(address verifier) external onlyOwner {
        if (verifier == address(0)) revert InvalidAddress();
        if (isVerifier[verifier]) revert DuplicateVerification();
        
        isVerifier[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyOwner {
        if (verifier == address(0)) revert InvalidAddress();
        if (!isVerifier[verifier]) revert NotVerifier();
        
        isVerifier[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    function verifySkill(address user, uint256 skillId, bytes memory verificationData) external {
        if (!isVerifier[msg.sender]) revert NotVerifier();
        if (user == address(0)) revert InvalidAddress();
        if (skillId == 0) revert EmptySkillId();
        if (skillId > MAX_SKILL_ID_LENGTH) revert SkillIdTooLong();
        
        verifications[user][skillId] = Verification({
            verifier: msg.sender,
            data: verificationData,
            blockNumber: block.number
        });
        
        emit VerificationCreated(user, skillId, verificationData, block.number);
    }

    function getVerification(address user, uint256 skillId) external view returns (Verification memory) {
        return verifications[user][skillId];
    }
} 