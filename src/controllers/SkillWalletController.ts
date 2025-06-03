import { Controller, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import SkillWalletAbi from '../../artifacts/contracts/SkillWallet.sol/SkillWallet.json';
import { RateLimit } from 'nestjs-rate-limiter';

const SKILL_WALLET_ADDRESS = process.env.SKILL_WALLET_ADDRESS!;
const MAX_RETRIES = 3;
const GAS_LIMIT = 300_000n;
const RETRY_DELAY = 1000; // 1 second

interface MintResponse {
  success: boolean;
  error?: string;
  tokenId?: string;
  transactionHash?: string;
}

interface MintBody {
  userAddress: string;
}

// Define the contract interface with all required functions
interface ISkillWallet extends ethers.BaseContract {
  mint: (options?: { gasLimit?: bigint }) => Promise<ethers.ContractTransactionResponse>;
  balanceOf: (address: string) => Promise<ethers.BigNumberish>;
  hasMintedWallet: (address: string) => Promise<boolean>;
  estimateGas: {
    mint: (options?: { from: string }) => Promise<bigint>;
  };
  connect: (signer: ethers.Signer) => ISkillWallet;
}

class MintError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'MintError';
  }
}

@Controller('skill-wallet')
export class SkillWalletController {
  private readonly provider: ethers.JsonRpcProvider;
  private readonly wallet: ethers.Wallet;
  private readonly contract: ISkillWallet;
  private readonly logger = new Logger(SkillWalletController.name);

  constructor() {
    if (!process.env.RPC_URL) {
      throw new Error('RPC_URL environment variable is not set');
    }
    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY environment variable is not set');
    }
    if (!SKILL_WALLET_ADDRESS) {
      throw new Error('SKILL_WALLET_ADDRESS environment variable is not set');
    }

    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    
    // Create contract instance with proper typing
    const contract = new ethers.Contract(
      SKILL_WALLET_ADDRESS,
      SkillWalletAbi.abi,
      this.wallet
    );
    
    // Cast to our interface
    this.contract = contract as unknown as ISkillWallet;

    this.logger.log(`Initialized SkillWalletController with contract at ${SKILL_WALLET_ADDRESS}`);
  }

  private validateAddress(address: string): void {
    if (!ethers.isAddress(address)) {
      throw new MintError('Invalid Ethereum address', 'INVALID_ADDRESS');
    }
  }

  private async checkNetwork(): Promise<void> {
    try {
      const network = await this.provider.getNetwork();
      this.logger.debug(`Connected to network: ${network.name} (${network.chainId})`);
    } catch (error) {
      throw new MintError('Failed to connect to network', 'NETWORK_ERROR', error);
    }
  }

  private async estimateGas(userAddress: string): Promise<bigint> {
    try {
      const gasEstimate = await this.contract.estimateGas.mint({ from: userAddress });
      return gasEstimate * 120n / 100n; // Add 20% buffer
    } catch (error) {
      throw new MintError('Failed to estimate gas', 'GAS_ESTIMATION_ERROR', error);
    }
  }

  private async waitForTransaction(tx: ethers.ContractTransactionResponse): Promise<ethers.ContractTransactionReceipt> {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const receipt = await tx.wait();
        if (!receipt) {
          throw new Error('Transaction receipt is null');
        }
        return receipt;
      } catch (error) {
        retries++;
        if (retries === MAX_RETRIES) {
          throw new MintError('Transaction failed to confirm', 'TRANSACTION_FAILED', error);
        }
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
    throw new MintError('Max retries exceeded', 'MAX_RETRIES_EXCEEDED');
  }

  @Post('mint')
  @RateLimit({
    points: 3, // Number of requests
    duration: 60, // Per minute
    errorMessage: 'Too many mint requests. Please try again later.'
  })
  public async mint(@Body() body: MintBody): Promise<MintResponse> {
    const { userAddress } = body;
    
    try {
      // Input validation
      this.validateAddress(userAddress);
      
      // Network check
      await this.checkNetwork();

      // Check if already minted
      const hasMinted = await this.contract.hasMintedWallet(userAddress);
      if (hasMinted) {
        throw new MintError('Already minted', 'ALREADY_MINTED');
      }

      // Estimate gas
      const gasLimit = await this.estimateGas(userAddress);

      // Execute mint transaction
      this.logger.log(`Attempting to mint Skill Wallet for ${userAddress}`);
      const tx = await this.contract.connect(this.wallet).mint({ gasLimit });
      
      // Wait for transaction confirmation
      const receipt = await this.waitForTransaction(tx);
      
      // Extract token ID from event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed?.name === 'SkillWalletMinted';
        } catch {
          return false;
        }
      });

      if (!event) {
        throw new MintError('Mint event not found in transaction receipt', 'EVENT_NOT_FOUND');
      }

      const parsedEvent = this.contract.interface.parseLog(event);
      if (!parsedEvent) {
        throw new MintError('Failed to parse mint event', 'EVENT_PARSE_ERROR');
      }

      const tokenId = parsedEvent.args.tokenId.toString();

      this.logger.log(`Successfully minted Skill Wallet for ${userAddress} with token ID ${tokenId}`);

      return {
        success: true,
        tokenId,
        transactionHash: receipt.hash
      };

    } catch (error) {
      this.logger.error(`Mint error for ${userAddress}:`, error);

      if (error instanceof MintError) {
        switch (error.code) {
          case 'ALREADY_MINTED':
            throw new HttpException(
              { success: false, error: 'You already own a Skill Wallet' },
              HttpStatus.CONFLICT
            );
          case 'INVALID_ADDRESS':
            throw new HttpException(
              { success: false, error: 'Invalid Ethereum address' },
              HttpStatus.BAD_REQUEST
            );
          case 'NETWORK_ERROR':
          case 'GAS_ESTIMATION_ERROR':
          case 'TRANSACTION_FAILED':
            throw new HttpException(
              { success: false, error: 'Network error. Please try again later' },
              HttpStatus.SERVICE_UNAVAILABLE
            );
          default:
            throw new HttpException(
              { success: false, error: 'Mint failed. Please try again' },
              HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
      }

      throw new HttpException(
        { success: false, error: 'An unexpected error occurred' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 