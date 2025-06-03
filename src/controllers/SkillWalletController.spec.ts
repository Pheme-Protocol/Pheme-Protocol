import { SkillWalletController } from './SkillWalletController';
import { ethers } from 'ethers';

jest.mock('ethers', () => {
  const mContract = {
    balanceOf: jest.fn(),
    mint: jest.fn(),
    connect: function () { return this; }
  };
  return {
    JsonRpcProvider: jest.fn(),
    Wallet: jest.fn(),
    Contract: jest.fn(() => mContract)
  };
});

describe('SkillWalletController', () => {
  let controller: SkillWalletController;
  let mockContract: any;

  beforeEach(() => {
    controller = new SkillWalletController();
    mockContract = (ethers.Contract as jest.Mock).mock.results[0].value;
    jest.clearAllMocks();
  });

  it('returns error if already minted', async () => {
    mockContract.balanceOf.mockResolvedValueOnce({ gt: () => true });
    const res = await controller.mint({ userAddress: '0x123' });
    expect(res).toEqual({ success: false, error: 'Already minted.' });
  });

  it('returns tokenId on success', async () => {
    mockContract.balanceOf.mockResolvedValueOnce({ gt: () => false });
    mockContract.mint.mockResolvedValueOnce({
      wait: async () => ({
        events: [{ event: 'SkillWalletMinted', args: { tokenId: 42 } }]
      })
    });
    const res = await controller.mint({ userAddress: '0x123' });
    expect(res).toEqual({ success: true, tokenId: 42 });
  });

  it('returns error on failure', async () => {
    mockContract.balanceOf.mockResolvedValueOnce({ gt: () => false });
    mockContract.mint.mockRejectedValueOnce(new Error('out-of-gas'));
    const res = await controller.mint({ userAddress: '0x123' });
    expect(res).toEqual({ success: false, error: 'Mint failed. Please try again.' });
  });
}); 