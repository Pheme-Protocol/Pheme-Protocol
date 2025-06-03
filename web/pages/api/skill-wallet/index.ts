import { NextApiRequest, NextApiResponse } from 'next';
import { getSkillWalletContract } from '../../../utils/contracts';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ message: 'Address is required' });
  }

  try {
    const contract = getSkillWalletContract();
    const hasMinted = await publicClient.readContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'hasMinted',
      args: [address as `0x${string}`],
    });

    return res.status(200).json({ hasMinted });
  } catch (error) {
    console.error('Error checking skill wallet:', error);
    return res.status(500).json({ message: 'Error checking skill wallet status' });
  }
} 