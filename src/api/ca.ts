import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { proxyFetch } from './client';
import type { FC, FCProfileResponse, FCsResponse } from '../types';

const QK = {
  fcs: ['ca', 'fcs'] as const,
  fc: (lodestoneId: string) => ['ca', 'fc', lodestoneId] as const,
};

export function useFCs(): UseQueryResult<FCsResponse, Error> {
  return useQuery({
    queryKey: QK.fcs,
    queryFn: () => proxyFetch<FCsResponse>('/fcs'),
  });
}

export function useFC(lodestoneId: string | undefined): UseQueryResult<FCProfileResponse, Error> {
  return useQuery({
    queryKey: QK.fc(lodestoneId ?? ''),
    queryFn: () => proxyFetch<FCProfileResponse>(`/fc/${lodestoneId}`),
    enabled: Boolean(lodestoneId),
  });
}

export function findFCByLodestoneId(
  data: FCsResponse | undefined,
  lodestoneId: string | undefined,
): FC | undefined {
  if (!data || !lodestoneId) return undefined;
  return data.fcs.find((fc) => fc.lodestoneId === lodestoneId);
}
