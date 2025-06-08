import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";

describe("SkillWallet", function () {
  let skillWallet: any;
  let owner: any, user: any, other: any;

  beforeEach(async () => {
    [owner, user, other] = await ethers.getSigners();
    const SkillWallet = await ethers.getContractFactory("SkillWallet");
    skillWallet = await SkillWallet.deploy();
    await skillWallet.deployed();
  });

  it("allows a user to mint once", async () => {
    await expect(skillWallet.connect(user).mint())
      .to.emit(skillWallet, "SkillWalletMinted")
      .withArgs(await user.getAddress(), 1);

    expect(await skillWallet.hasMinted(await user.getAddress())).to.be.true;
    expect(await skillWallet.balanceOf(await user.getAddress())).to.equal(1);
  });

  it("prevents double minting", async () => {
    await skillWallet.connect(user).mint();
    await expect(skillWallet.connect(user).mint()).to.be.revertedWith("Already minted");
  });

  it("prevents transfer (soulbound)", async () => {
    await skillWallet.connect(user).mint();
    await expect(
      skillWallet.connect(user).transferFrom(await user.getAddress(), await other.getAddress(), 1)
    ).to.be.revertedWith("Soulbound: non-transferable");
  });
}); 