const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
  try {
    console.log("Starting Skill Wallet check...");
    console.log("Environment variables loaded:", process.env);
    
    // Get the contract address from the deployment
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    console.log("Contract address:", contractAddress);
    
    // Create a wallet instance from the private key
    const privateKey = process.env.PRIVATE_KEY;
    console.log("Private key found:", privateKey ? "Yes" : "No");
    if (!privateKey) {
      throw new Error("Please set your PRIVATE_KEY in the .env file");
    }
    
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log("Connected wallet address:", wallet.address);
    
    // Get the contract ABI
    const SkillWallet = await ethers.getContractFactory("SkillWallet");
    const skillWallet = SkillWallet.attach(contractAddress).connect(wallet);
    console.log("Connected to SkillWallet contract");
    
    console.log("\nChecking wallet status...");
    const hasMinted = await skillWallet.hasMintedWallet(wallet.address);
    console.log("Has minted wallet:", hasMinted);
    
    // Get the token ID if minted
    if (hasMinted) {
      try {
        const tokenId = await skillWallet.tokenOfOwnerByIndex(wallet.address, 0);
        console.log("Token ID:", tokenId.toString());
      } catch (error) {
        console.log("Error getting token ID:", error.message);
      }
    }
    
    // Get total supply
    const totalSupply = await skillWallet.totalSupply();
    console.log("\nTotal Skill Wallets minted:", totalSupply.toString());
    
  } catch (error) {
    console.error("Error in main:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  }); 