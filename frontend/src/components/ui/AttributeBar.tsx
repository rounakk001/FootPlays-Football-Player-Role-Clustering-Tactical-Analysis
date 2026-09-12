"use client"

import { clusterColor } from "@/lib/utils"

interface AttributeBarProps {
  attr: string
  z: number
  maxAbs?: number
}

export function AttributeBar({ attr, z, maxAbs = 1.5 }: AttributeBarProps) {
  const pct = Math.min(Math.abs(z) / maxAbs, 1) * 100
  const positive = z >= 0

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-10 shrink-0 text-right font-mono text-xs text-gray-500">
        {attr}
      </span>
      <div className="relative flex h-5 flex-1 items-center rounded bg-gray-100">
        {positive ? (
          <div
            className="ml-auto h-full rounded-r"
            style={{
              width: `${pct / 2}%`,
              marginLeft: "50%",
              backgroundColor: "#22c55e",
              opacity: 0.8,
            }}
          />
        ) : (
          <div
            className="h-full rounded-l"
            style={{
              width: `${pct / 2}%`,
              marginRight: "50%",
              marginLeft: `${50 - pct / 2}%`,
              backgroundColor: "#ef4444",
              opacity: 0.8,
            }}
          />
        )}
        {/* Center line */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-gray-300" />
      </div>
      <span
        className={`w-12 shrink-0 text-left font-mono text-xs font-medium ${
          positive ? "text-green-700" : "text-red-700"
        }`}
      >
        {z >= 0 ? "+" : ""}
        {z.toFixed(2)}
      </span>
    </div>
  )
}

interface AttributeProfileProps {
  attributes: Record<string, number>
  clusterId?: number
  topN?: number
}

export function AttributeProfile({
  attributes,
  clusterId,
  topN,
}: AttributeProfileProps) {
  const sorted = Object.entries(attributes).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
  const displayed = topN ? sorted.slice(0, topN) : sorted
  const maxAbs = Math.max(...sorted.map(([, z]) => Math.abs(z)), 0.1)

  return (
    <div className="space-y-1.5">
      {displayed.map(([attr, z]) => (
        <AttributeBar key={attr} attr={attr} z={z} maxAbs={maxAbs} />
      ))}
    </div>
  )
}
