import Link from "next/link"
import { getClusters } from "@/lib/api/football"
import { ClusterCard } from "@/components/clusters/ClusterCard"
import { ArrowRight, Brain, Database, Zap } from "lucide-react"

export const revalidate = 3600

export default async function LandingPage() {
  let clusters = null
  let error = false

  try {
    clusters = await getClusters()
  } catch {
    error = true
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 shadow-sm mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          FM24 Data · 683 Elite Midfielders · 5 Role Archetypes
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Tactical Role Clustering
          <br />
          <span className="text-gray-500">in Football</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600">
          Unsupervised machine learning applied to Football Manager 2024 data —
          discovering the five natural midfielder archetypes hidden in 36
          attribute dimensions.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition"
          >
            Explore the clusters
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/players"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Search players
          </Link>
        </div>
      </section>

      {/* Method overview */}
      <section className="py-8">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <Database size={18} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">FM24 Dataset</h3>
            <p className="mt-1.5 text-sm text-gray-500">
              1,821 raw records filtered to 683 elite midfielders (CA ≥ 120) from
              top European leagues.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
              <Brain size={18} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">PCA + GMM</h3>
            <p className="mt-1.5 text-sm text-gray-500">
              36-dimensional row-normalised attribute space reduced to 2D via PCA,
              then clustered with a Gaussian Mixture Model (k=5, selected by AIC/BIC).
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
              <Zap size={18} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Soft Assignments</h3>
            <p className="mt-1.5 text-sm text-gray-500">
              GMM provides probabilistic cluster membership — each player carries a
              probability distribution across all five roles.
            </p>
          </div>
        </div>
      </section>

      {/* Cluster grid */}
      <section className="py-8">
        <h2 className="mb-5 text-xl font-semibold text-gray-900">
          The five midfielder archetypes
        </h2>

        {error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Could not reach the backend. Make sure the API is running at{" "}
            <code className="font-mono text-xs">{process.env.NEXT_PUBLIC_API_URL}</code>.
          </div>
        )}

        {clusters && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clusters.map((c) => (
              <ClusterCard key={c.id} cluster={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
