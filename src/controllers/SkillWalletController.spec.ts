import { SkillWalletController } from './SkillWalletController';

jest.mock('ethers', () => {
  const mContract = {
    balanceOf: jest.fn(),
    mint: jest.fn(),
    connect: function () { return this; }
  };
  return {
    ethers: {
      JsonRpcProvider: jest.fn(),
      Wallet: jest.fn(),
      Contract: jest.fn(() => mContract)
    }
  };
});

describe('SkillWalletController', () => {
  let controller: SkillWalletController;
  let contract: any;

  beforeEach(() => {
    controller = new SkillWalletController();
    contract = controller.contract;
    jest.clearAllMocks();
  });

  it('returns error if already minted', async () => {
    contract.balanceOf.mockResolvedValueOnce({ gt: () => true });
    const res = await controller.mint({ userAddress: '0x123' });
    expect(res).toEqual({ success: false, error: 'Already minted.' });
  });

  it('returns tokenId on success', async () => {
    contract.balanceOf.mockResolvedValueOnce({ gt: () => false });
    contract.mint.mockResolvedValueOnce({
      wait: async () => ({
        events: [{ event: 'SkillWalletMinted', args: { tokenId: 42 } }]
      })
    });
    const res = await controller.mint({ userAddress: '0x123' });
    expect(res).toEqual({ success: true, tokenId: 42 });
  });

  it('returns error on failure', async () => {
    contract.balanceOf.mockResolvedValueOnce({ gt: () => false });
    contract.mint.mockRejectedValueOnce(new Error('out-of-gas'));
    const res = await controller.mint({ userAddress: '0x123' });
    expect(res).toEqual({ success: false, error: 'Mint failed. Please try again.' });
  });
}); 