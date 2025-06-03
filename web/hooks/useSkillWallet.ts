import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export const useSkillWallet = () => {
  const { address } = useAccount();

  const { data: hasMinted, isLoading } = useQuery({
    queryKey: ['skillWallet', address],
    queryFn: async () => {
      if (!address) return false;
      const response = await fetch(`/api/skill-wallet?address=${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch skill wallet status');
      }
      const data = await response.json();
      return data.hasMinted;
    },
    enabled: !!address,
  });

  return {
    hasMinted,
    isLoading,
  };
}; 