import { ethers } from "hardhat";

async function main() {
  console.log("Deploying SkillWallet contract...");

  const SkillWallet = await ethers.getContractFactory("SkillWallet");
  const skillWallet = await SkillWallet.deploy();

  await skillWallet.waitForDeployment();

  const address = await skillWallet.getAddress();
  console.log(`SkillWallet deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 