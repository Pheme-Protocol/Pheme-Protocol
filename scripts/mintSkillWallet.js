const { ethers } = require("hardhat");
const path = require('path');
const fs = require('fs');

// Debug: Print current working directory and check if .env.local exists
console.log("Current working directory:", process.cwd());
const envPath = path.join(process.cwd(), '.env.local');
console.log("Looking for .env.local file at:", envPath);
console.log(".env.local file exists:", fs.existsSync(envPath));

require('dotenv').config({ path: '.env.local' });

async function main() {
  // Debug: Print all environment variables
  console.log("Environment variables:", {
    PRIVATE_KEY: process.env.PRIVATE_KEY ? "Present" : "Missing",
    NODE_ENV: process.env.NODE_ENV,
    // Don't print the actual private key for security
  });
  
  // Get the contract address from the deployment
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  
  // Create a wallet instance from the private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Please set your PRIVATE_KEY in the .env.local file");
  }
  
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet(privateKey, provider);
  
  // Get the contract ABI
  const SkillWallet = await ethers.getContractFactory("SkillWallet");
  const skillWallet = SkillWallet.attach(contractAddress).connect(wallet);
  
  console.log("Checking if wallet has already minted...");
  const hasMinted = await skillWallet.hasMintedWallet(wallet.address);
  
  if (hasMinted) {
    console.log("You have already minted a Skill Wallet!");
    return;
  }
  
  console.log("Minting your Skill Wallet...");
  const tx = await skillWallet.mint();
  await tx.wait();
  
  console.log("Successfully minted your Skill Wallet!");
  console.log("Transaction hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 