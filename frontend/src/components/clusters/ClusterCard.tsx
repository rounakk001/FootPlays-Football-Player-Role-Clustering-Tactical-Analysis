import Link from "next/link"
import type { ClusterSummary } from "@/types"
import { clusterColor, clusterColorLight } from "@/lib/utils"
import { Users, TrendingUp, ChevronRight } from "lucide-react"

interface ClusterCardProps {
  cluster: ClusterSummary
}

export function ClusterCard({ cluster }: ClusterCardProps) {
  const color = clusterColor(cluster.id)
  const bgColor = clusterColorLight(cluster.id)

  return (
    <Link
      href={`/cluster/${cluster.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ color, backgroundColor: bgColor }}
          >
            Cluster {cluster.id}
          </span>
          <h3 className="mt-1.5 text-base font-semibold text-gray-900">
            {cluster.name}
          </h3>
        </div>
        <ChevronRight
          size={18}
          className="text-gray-400 transition group-hover:text-gray-600"
        />
      </div>

      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
        {cluster.description}
      </p>

      <div className="mt-4 flex gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <Users size={13} />
          {cluster.player_count} players
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp size={13} />
          Avg CA {cluster.avg_ca}
        </span>
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-400 mb-1.5">Top attributes</p>
        <div className="flex flex-wrap gap-1">
          {cluster.top_attributes.slice(0, 5).map((a) => (
            <span
              key={a.attr}
              className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700"
            >
              {a.attr}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
