import { getPlayer } from "@/lib/api/football"
import { clusterColor, clusterColorLight } from "@/lib/utils"
import { AttributeProfile } from "@/components/ui/AttributeBar"
import { ClusterBadge } from "@/components/ui/ClusterBadge"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Users, Flag, Activity } from "lucide-react"

export const revalidate = 3600

const CLUSTER_NAMES: Record<number, string> = {
  0: "Deep-Lying Playmaker",
  1: "Creative Playmaker",
  2: "Defensive Anchor",
  3: "Box-to-Box",
  4: "Attacking Playmaker",
}

interface Props {
  params: { name: string }
}

export default async function PlayerDetailPage({ params }: Props) {
  const decodedName = decodeURIComponent(params.name)

  let player
  try {
    player = await getPlayer(decodedName)
  } catch {
    notFound()
  }

  const clusterName = CLUSTER_NAMES[player.role_cluster]

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/players"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={14} />
        Back to players
      </Link>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users size={15} className="text-gray-400" />
              {player.club}
            </span>
            <span className="flex items-center gap-1">
              <Flag size={15} className="text-gray-400" />
              {player.nationality}
            </span>
            <span className="flex items-center gap-1">
              <User size={15} className="text-gray-400" />
              {player.age} yrs • {player.height}cm • {player.weight}kg
            </span>
            <span className="flex items-center gap-1 font-mono font-medium">
              <Activity size={15} className="text-gray-400" />
              CA: {player.ca} / PA: {player.pa}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <ClusterBadge id={player.role_cluster} name={clusterName} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Attributes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">
              Player attribute profile (z-scores)
            </h2>
            <AttributeProfile attributes={player.attributes as Record<string, number>} />
          </div>
        </div>

        {/* Right Column: Roles & Similar */}
        <div className="space-y-6">
          {/* Role Probabilities */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">
              Role Match Probabilities
            </h2>
            <div className="space-y-3">
              {Object.entries(player.cluster_probabilities)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([clusterId, prob]) => {
                  const id = Number(clusterId)
                  const p = prob as number
                  return (
                    <div key={id}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-medium text-gray-700">{CLUSTER_NAMES[id]}</span>
                        <span className="text-gray-500">{(p * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${p * 100}%`,
                            backgroundColor: clusterColor(id),
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Similar Players */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">
              Similar Midfielders
            </h2>
            <p className="mb-3 text-xs text-gray-500">Based on PCA distance</p>
            <div className="space-y-2.5">
              {player.similar_players.map((sp) => (
                <Link
                  key={sp.name}
                  href={`/players/${encodeURIComponent(sp.name)}`}
                  className="group block rounded border border-gray-100 p-2 hover:border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 group-hover:underline text-sm">
                      {sp.name}
                    </span>
                    <span className="font-mono text-xs text-gray-500">{sp.ca}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{sp.club}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
