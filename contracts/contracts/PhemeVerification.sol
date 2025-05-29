// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PhemeVerification is Ownable {
    event VerificationCreated(address indexed user, string skillId, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function createVerification(string memory skillId) external {
        emit VerificationCreated(msg.sender, skillId, block.timestamp);
    }
} 