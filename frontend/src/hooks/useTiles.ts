import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { TileDetail, SearchResult, TileObservation, TileObservationsResponse, TemporalAnalysis } from '@/types/api';

export function useTile(tileId: string | undefined) {
  return useQuery<TileDetail>({
    queryKey: ['tile', tileId],
    queryFn: () => api.get<TileDetail>(`/tiles/${tileId}`),
    enabled: Boolean(tileId),
    staleTime: 60000,
  });
}

export function useTileObservations(tileId: string | undefined) {
  return useQuery<TileObservation[]>({
    queryKey: ['tile-observations', tileId],
    queryFn: async ({ signal }) => (await api.get<TileObservationsResponse>(`/tiles/${tileId}/observations`, undefined, signal)).observations,
    enabled: Boolean(tileId),
    staleTime: 30000,
  });
}

export function useTemporalAnalysis(tileId: string | undefined, fromDate?: string | null, toDate?: string | null, enabled = true) {
  return useQuery<TemporalAnalysis>({
    queryKey: ['temporal-analysis', tileId, fromDate ?? 'all', toDate ?? 'all'],
    queryFn: ({ signal }) => api.get<TemporalAnalysis>(`/tiles/${tileId}/analysis`, { from_date: fromDate, to_date: toDate }, signal),
    enabled: Boolean(enabled && tileId && fromDate && toDate && fromDate < toDate),
    staleTime: 30000,
  });
}

export function useSimilarTiles(tileId: string | undefined, k = 12) {
  return useQuery<SearchResult[]>({
    queryKey: ['tile-similar', tileId, k],
    queryFn: () => api.get<SearchResult[]>(`/tiles/${tileId}/similar`, { k }),
    enabled: Boolean(tileId),
    staleTime: 60000,
  });
}

export function useSimilarTilesByVector(vectorId: number | null | undefined, k = 12) {
  return useQuery<SearchResult[], Error>({
    queryKey: ['similar-tiles-vector', vectorId, k],
    queryFn: () => api.get<SearchResult[]>(`/vectors/${vectorId}/similar`, { k }),
    enabled: vectorId !== null && vectorId !== undefined,
  });
}
