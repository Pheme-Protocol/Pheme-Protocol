import { Controller, Post, Body } from '@nestjs/common';
import { ethers } from 'ethers';
import SkillWalletAbi from '../../artifacts/contracts/SkillWallet.sol/SkillWallet.json';

const SKILL_WALLET_ADDRESS = process.env.SKILL_WALLET_ADDRESS!; // Set this in your .env

@Controller('skill-wallet')
export class SkillWalletController {
  provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
  contract = new ethers.Contract(SKILL_WALLET_ADDRESS, SkillWalletAbi.abi, this.wallet);

  @Post('mint')
  async mint(@Body() body: { userAddress: string }) {
    const { userAddress } = body;
    try {
      const balance = await this.contract.balanceOf(userAddress);
      if (balance.gt(0)) {
        return { success: false, error: 'Already minted.' };
      }
      // Use a relayer or meta-tx if you want to pay gas for the user, or instruct frontend to send tx
      const tx = await this.contract.connect(this.wallet).mint({ gasLimit: 300_000 });
      const receipt = await tx.wait();
      const event = receipt.events?.find((e: any) => e.event === 'SkillWalletMinted');
      const tokenId = event?.args?.tokenId?.toString();
      return { success: true, tokenId };
    } catch (e: any) {
      if (e.message?.includes('Already minted')) {
        return { success: false, error: 'Already minted.' };
      }
      return { success: false, error: 'Mint failed. Please try again.' };
    }
  }
} 