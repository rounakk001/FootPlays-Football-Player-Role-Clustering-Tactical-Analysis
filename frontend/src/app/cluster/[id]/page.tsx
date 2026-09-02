import { getCluster } from "@/lib/api/football"
import { clusterColor, clusterColorLight } from "@/lib/utils"
import { AttributeProfile } from "@/components/ui/AttributeBar"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, TrendingUp, CalendarDays } from "lucide-react"

export const revalidate = 3600

interface Props {
  params: { id: string }
}

export default async function ClusterDetailPage({ params }: Props) {
  const id = parseInt(params.id, 10)
  if (isNaN(id) || id < 0 || id > 4) notFound()

  let cluster
  try {
    cluster = await getCluster(id)
  } catch {
    notFound()
  }

  const color = clusterColor(id)
  const bgColor = clusterColorLight(id)

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={14} />
        Back to explore
      </Link>

      {/* Header */}
      <div>
        <span
          className="inline-block rounded-full px-3 py-1 text-sm font-medium"
          style={{ color, backgroundColor: bgColor }}
        >
          Cluster {id}
        </span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{cluster.name}</h1>
        <p className="mt-2 max-w-2xl text-gray-600">{cluster.description}</p>

        <div className="mt-5 flex flex-wrap gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Users size={15} />
            {cluster.player_count} players
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp size={15} />
            Avg CA {cluster.avg_ca}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={15} />
            Avg age {cluster.avg_age}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attribute profile */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            Attribute profile (z-scores vs. full population)
          </h2>
          <AttributeProfile attributes={cluster.attributes} clusterId={id} />
        </div>

        {/* Top players */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            Top 10 players by CA
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="pb-2 font-medium">Player</th>
                <th className="pb-2 font-medium">Club</th>
                <th className="pb-2 text-right font-medium">CA</th>
                <th className="pb-2 text-right font-medium">PA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cluster.top_players.map((p) => (
                <tr key={p.name} className="hover:bg-gray-50">
                  <td className="py-1.5">
                    <Link
                      href={`/players/${encodeURIComponent(p.name)}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-1.5 text-gray-500">{p.club}</td>
                  <td className="py-1.5 text-right font-mono">{p.ca}</td>
                  <td className="py-1.5 text-right font-mono text-gray-400">{p.pa}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <Link
              href={`/players?cluster=${id}`}
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              View all {cluster.player_count} players →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
