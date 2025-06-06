// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PhemeVerification is Ownable {
    event VerificationCreated(address indexed user, uint256 skillId, bytes verificationData, uint256 timestamp);
    event VerifierAdded(address indexed verifier);
    
    error EmptySkillId();
    error SkillIdTooLong();
    error NotVerifier();
    
    uint256 public constant MAX_SKILL_ID_LENGTH = 100;

    // Mapping to track verifiers
    mapping(address => bool) public isVerifier;
    
    // Mapping to store verifications: user => skillId => Verification
    mapping(address => mapping(uint256 => Verification)) public verifications;

    struct Verification {
        address verifier;
        bytes data;
        uint256 timestamp;
    }

    constructor() {}

    function addVerifier(address verifier) external onlyOwner {
        isVerifier[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function verifySkill(address user, uint256 skillId, bytes memory verificationData) external {
        if (!isVerifier[msg.sender]) revert NotVerifier();
        
        verifications[user][skillId] = Verification({
            verifier: msg.sender,
            data: verificationData,
            timestamp: block.timestamp
        });
        
        emit VerificationCreated(user, skillId, verificationData, block.timestamp);
    }

    function getVerification(address user, uint256 skillId) external view returns (Verification memory) {
        return verifications[user][skillId];
    }
} 