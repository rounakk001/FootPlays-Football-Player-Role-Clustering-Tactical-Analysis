"use client"

import { useState, useEffect, useCallback } from "react"
import { getPlayers } from "@/lib/api/football"
import type { PlayersResponse, PlayerSummary } from "@/types"
import { ClusterBadge } from "@/components/ui/ClusterBadge"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { clusterColor } from "@/lib/utils"

const CLUSTER_NAMES: Record<number, string> = {
  0: "Deep-Lying Playmaker",
  1: "Creative Playmaker",
  2: "Defensive Anchor",
  3: "Box-to-Box",
  4: "Attacking Playmaker",
}

const PAGE_SIZE = 50

export default function PlayersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [data, setData] = useState<PlayersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const search = searchParams.get("search") ?? ""
  const clusterParam = searchParams.get("cluster")
  const cluster = clusterParam !== null ? parseInt(clusterParam, 10) : undefined
  const page = parseInt(searchParams.get("page") ?? "0", 10)

  const [searchInput, setSearchInput] = useState(search)

  function setParam(key: string, value: string | null) {
    const p = new URLSearchParams(searchParams.toString())
    if (value === null) {
      p.delete(key)
    } else {
      p.set(key, value)
    }
    p.delete("page") // reset pagination on filter change
    router.replace(`/players?${p.toString()}`)
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    getPlayers({
      search: search || undefined,
      cluster,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [search, cluster, page])

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0

  function goPage(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(p))
    router.replace(`/players?${params.toString()}`)
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setParam("search", searchInput || null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Players</h1>
        <p className="mt-1 text-sm text-gray-500">
          683 elite midfielders from Football Manager 2024, sorted by Current Ability.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search player name…"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-gray-400 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setParam("cluster", null)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              cluster === undefined
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            All
          </button>
          {Object.entries(CLUSTER_NAMES).map(([id, name]) => {
            const cid = Number(id)
            const active = cluster === cid
            return (
              <button
                key={id}
                onClick={() =>
                  setParam("cluster", active ? null : id)
                }
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  active ? "border-current font-medium" : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }`}
                style={active ? { color: clusterColor(cid), borderColor: clusterColor(cid), background: "white" } : {}}
              >
                {name}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">Player</th>
              <th className="px-4 py-3 font-medium">Club</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 text-right font-medium">Age</th>
              <th className="px-4 py-3 text-right font-medium">CA</th>
              <th className="px-4 py-3 text-right font-medium">PA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              data?.players.map((p) => (
                <tr key={p.name} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/players/${encodeURIComponent(p.name)}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{p.club}</td>
                  <td className="px-4 py-2.5">
                    <ClusterBadge
                      id={p.role_cluster}
                      name={p.cluster_name}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-500">{p.age}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold">{p.ca}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-gray-400">{p.pa}</td>
                </tr>
              ))}

            {!loading && data?.players.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No players found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, data.total)} of {data.total}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 0}
              onClick={() => goPage(page - 1)}
              className="rounded border border-gray-300 p-1.5 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => goPage(page + 1)}
              className="rounded border border-gray-300 p-1.5 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
