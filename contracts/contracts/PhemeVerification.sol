// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PhemeVerification is Ownable {
    event VerificationCreated(address indexed user, string skillId, uint256 timestamp);
    
    error EmptySkillId();
    error SkillIdTooLong();
    
    uint256 public constant MAX_SKILL_ID_LENGTH = 100;

    constructor() Ownable(msg.sender) {}

    function createVerification(string memory skillId) external {
        if (bytes(skillId).length == 0) revert EmptySkillId();
        if (bytes(skillId).length > MAX_SKILL_ID_LENGTH) revert SkillIdTooLong();
        
        emit VerificationCreated(msg.sender, skillId, block.timestamp);
    }
} 