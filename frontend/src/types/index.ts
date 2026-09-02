// TypeScript types matching the FastAPI response shapes

export interface ClusterAttribute {
  attr: string
  z: number
}

export interface ClusterSummary {
  id: number
  name: string
  description: string
  player_count: number
  avg_ca: number
  avg_age: number
  top_attributes: ClusterAttribute[]
  bottom_attributes: ClusterAttribute[]
}

export interface ClusterDetail extends ClusterSummary {
  attributes: Record<string, number>
  top_players: {
    name: string
    club: string
    ca: number
    pa: number
    age: number
  }[]
}

export interface PlayerSummary {
  name: string
  club: string
  nationality: string
  age: number | null
  ca: number | null
  pa: number | null
  role_cluster: number
  cluster_name: string
  pc1: number
  pc2: number
}

export interface PlayerDetail {
  name: string
  club: string
  nationality: string
  age: number | null
  ca: number | null
  pa: number | null
  height: number | null
  weight: number | null
  role_cluster: number
  cluster_probabilities: Record<number, number>
  pc1: number | null
  pc2: number | null
  attributes: Record<string, number | null>
  similar_players: {
    name: string
    club: string
    ca: number
    role_cluster: number
  }[]
}

export interface PlayersResponse {
  total: number
  players: PlayerSummary[]
}

export interface ScatterPoint {
  name: string
  club: string
  ca: number
  role_cluster: number
  cluster_name: string
  pc1: number
  pc2: number
}
