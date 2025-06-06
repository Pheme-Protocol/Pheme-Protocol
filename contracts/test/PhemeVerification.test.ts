import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { PhemeVerification } from "../typechain-types/contracts/PhemeVerification";
import chaiAsPromised from "chai-as-promised";
import chai from "chai";

chai.use(chaiAsPromised);

describe("PhemeVerification", function () {
  let phemeVerification: PhemeVerification;
  let owner: SignerWithAddress;
  let verifier: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, verifier, user] = await ethers.getSigners();
    const PhemeVerification = await ethers.getContractFactory("PhemeVerification");
    phemeVerification = await PhemeVerification.deploy();
    await phemeVerification.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await phemeVerification.owner()).to.equal(owner.address);
    });
  });

  describe("Verification", function () {
    it("Should allow owner to add verifier", async function () {
      await phemeVerification.addVerifier(verifier.address);
      expect(await phemeVerification.isVerifier(verifier.address)).to.be.true;
    });

    it("Should not allow non-owner to add verifier", async function () {
      await expect(
        phemeVerification.connect(user).addVerifier(verifier.address)
      ).to.be.rejectedWith(/OwnableUnauthorizedAccount/);
    });

    it("Should allow verifier to verify a skill", async function () {
      await phemeVerification.addVerifier(verifier.address);
      const skillId = 1;
      const verificationData = "0x1234";
      
      await phemeVerification.connect(verifier).verifySkill(user.address, skillId, verificationData);
      const verification = await phemeVerification.getVerification(user.address, skillId);
      
      expect(verification.verifier).to.equal(verifier.address);
      expect(verification.data).to.equal(verificationData);
    });

    it("Should not allow non-verifier to verify skills", async function () {
      const skillId = 1;
      const verificationData = "0x1234";
      
      await expect(
        phemeVerification.connect(user).verifySkill(user.address, skillId, verificationData)
      ).to.be.rejectedWith("NotVerifier()");
    });
  });
}); 