import { apiRequest } from "./client"
import type {
  ClusterSummary,
  ClusterDetail,
  PlayersResponse,
  PlayerDetail,
  ScatterPoint,
} from "@/types"

export function getClusters(): Promise<ClusterSummary[]> {
  return apiRequest<ClusterSummary[]>("/api/clusters")
}

export function getCluster(id: number): Promise<ClusterDetail> {
  return apiRequest<ClusterDetail>(`/api/clusters/${id}`)
}

export function getPlayers(params: {
  search?: string
  cluster?: number
  min_ca?: number
  limit?: number
  offset?: number
}): Promise<PlayersResponse> {
  const qs = new URLSearchParams()
  if (params.search) qs.set("search", params.search)
  if (params.cluster !== undefined) qs.set("cluster", String(params.cluster))
  if (params.min_ca !== undefined) qs.set("min_ca", String(params.min_ca))
  if (params.limit !== undefined) qs.set("limit", String(params.limit))
  if (params.offset !== undefined) qs.set("offset", String(params.offset))
  const query = qs.toString()
  return apiRequest<PlayersResponse>(`/api/players${query ? `?${query}` : ""}`)
}

export function getScatterData(): Promise<ScatterPoint[]> {
  return apiRequest<ScatterPoint[]>("/api/players/scatter")
}

export function getPlayer(name: string): Promise<PlayerDetail> {
  return apiRequest<PlayerDetail>(`/api/players/${encodeURIComponent(name)}`)
}
