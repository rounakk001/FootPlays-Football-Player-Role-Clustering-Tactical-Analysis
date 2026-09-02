"use client"

import { useState, useEffect } from "react"
import { getClusters, getScatterData } from "@/lib/api/football"
import type { ClusterSummary, ScatterPoint } from "@/types"
import { ClusterCard } from "@/components/clusters/ClusterCard"
import { ScatterPlot } from "@/components/ui/ScatterPlot"
import { useRouter } from "next/navigation"

export default function ExplorePage() {
  const router = useRouter()
  const [clusters, setClusters] = useState<ClusterSummary[] | null>(null)
  const [scatter, setScatter] = useState<ScatterPoint[] | null>(null)
  const [highlightCluster, setHighlightCluster] = useState<number | undefined>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getClusters(), getScatterData()])
      .then(([c, s]) => {
        setClusters(c)
        setScatter(s)
      })
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
        <p className="mt-1 text-sm text-gray-500">
          683 elite midfielders projected into 2D PCA space, coloured by tactical role.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && !scatter && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          Loading chart data…
        </div>
      )}

      {scatter && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            PCA Scatter — all midfielders
          </h2>
          <ScatterPlot
            data={scatter}
            highlightCluster={highlightCluster}
            onPlayerClick={(name) => router.push(`/players/${encodeURIComponent(name)}`)}
          />
        </div>
      )}

      {clusters && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Role archetypes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clusters.map((c) => (
              <div
                key={c.id}
                onMouseEnter={() => setHighlightCluster(c.id)}
                onMouseLeave={() => setHighlightCluster(undefined)}
              >
                <ClusterCard cluster={c} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
