import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { SkillWallet } from "../typechain-types/contracts/SkillWallet";

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
    it("Should allow adding a skill", async function () {
      const skillName = "Solidity";
      const skillLevel = 5;
      
      await skillWallet.addSkill(skillName, skillLevel);
      const skill = await skillWallet.getSkill(0);
      
      expect(skill.name).to.equal(skillName);
      expect(skill.level).to.equal(skillLevel);
    });

    it("Should allow updating a skill", async function () {
      const skillName = "Solidity";
      const initialLevel = 5;
      const newLevel = 8;
      
      await skillWallet.addSkill(skillName, initialLevel);
      await skillWallet.updateSkill(0, newLevel);
      
      const skill = await skillWallet.getSkill(0);
      expect(skill.level).to.equal(newLevel);
    });

    it("Should not allow non-owner to add skills", async function () {
      await expect(
        skillWallet.connect(user).addSkill("Solidity", 5)
      ).to.be.rejectedWith("Ownable: caller is not the owner");
    });
  });
}); 