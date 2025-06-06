import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { SkillWallet } from "../typechain-types/contracts/SkillWallet";
import chaiAsPromised from "chai-as-promised";
import chai from "chai";

chai.use(chaiAsPromised);

describe("SkillWallet", function () {
  let skillWallet: SkillWallet;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const SkillWallet = await ethers.getContractFactory("SkillWallet");
    skillWallet = await SkillWallet.deploy();
    await skillWallet.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await skillWallet.owner()).to.equal(owner.address);
    });
  });

  describe("Skill Management", function () {
    let tokenId: bigint;

    beforeEach(async function () {
      // Mint a token for the owner
      const tx = await skillWallet.mint();
      const receipt = await tx.wait();
      const event = receipt?.logs.find(log => log.fragment?.name === "SkillWalletMinted");
      if (event && event.args) {
        tokenId = event.args[1];
      } else {
        throw new Error("Failed to get token ID from mint event");
      }
    });

    it("Should allow adding a skill", async function () {
      const skillName = "Solidity";
      const skillLevel = 5n;
      
      await skillWallet.addSkill(tokenId, skillName, skillLevel);
      const skill = await skillWallet.getSkill(tokenId, 0n);
      
      expect(skill.name).to.equal(skillName);
      expect(skill.level).to.equal(skillLevel);
    });

    it("Should allow updating a skill", async function () {
      const skillName = "Solidity";
      const initialLevel = 5n;
      const newLevel = 8n;
      
      await skillWallet.addSkill(tokenId, skillName, initialLevel);
      await skillWallet.updateSkill(tokenId, 0n, newLevel);
      
      const skill = await skillWallet.getSkill(tokenId, 0n);
      expect(skill.level).to.equal(newLevel);
    });

    it("Should not allow non-owner to add skills", async function () {
      await expect(
        skillWallet.connect(user).addSkill(tokenId, "Solidity", 5n)
      ).to.be.rejectedWith("Ownable: caller is not the owner");
    });
  });
}); 