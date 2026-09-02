"use client"

import { useState, useEffect, useRef } from "react"
import type { ScatterPoint } from "@/types"
import { CLUSTER_COLORS } from "@/lib/utils"

interface ScatterPlotProps {
  data: ScatterPoint[]
  selectedPlayer?: string
  highlightCluster?: number
  onPlayerClick?: (name: string) => void
}

const CLUSTER_NAMES: Record<number, string> = {
  0: "Deep-Lying Playmaker",
  1: "Creative Playmaker",
  2: "Defensive Anchor",
  3: "Box-to-Box",
  4: "Attacking Playmaker",
}

export function ScatterPlot({
  data,
  selectedPlayer,
  highlightCluster,
  onPlayerClick,
}: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    player: ScatterPoint
  } | null>(null)

  const W = 700
  const H = 500
  const MARGIN = { top: 20, right: 20, bottom: 40, left: 50 }

  const xs = data.map((d) => d.pc1)
  const ys = data.map((d) => d.pc2)
  const xMin = Math.min(...xs) - 0.5
  const xMax = Math.max(...xs) + 0.5
  const yMin = Math.min(...ys) - 0.5
  const yMax = Math.max(...ys) + 0.5

  const innerW = W - MARGIN.left - MARGIN.right
  const innerH = H - MARGIN.top - MARGIN.bottom

  function scaleX(v: number) {
    return ((v - xMin) / (xMax - xMin)) * innerW
  }
  function scaleY(v: number) {
    return innerH - ((v - yMin) / (yMax - yMin)) * innerH
  }

  const byCluster = Array.from({ length: 5 }, (_, i) =>
    data.filter((d) => d.role_cluster === i)
  )

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxHeight: "500px" }}
        onMouseLeave={() => setTooltip(null)}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const xv = xMin + t * (xMax - xMin)
            const yv = yMin + t * (yMax - yMin)
            return (
              <g key={t}>
                <line
                  x1={scaleX(xv)}
                  x2={scaleX(xv)}
                  y1={0}
                  y2={innerH}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
                <line
                  x1={0}
                  x2={innerW}
                  y1={scaleY(yv)}
                  y2={scaleY(yv)}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
              </g>
            )
          })}

          {/* Axis labels */}
          <text
            x={innerW / 2}
            y={innerH + 32}
            textAnchor="middle"
            fontSize={12}
            fill="#6b7280"
          >
            PC1
          </text>
          <text
            x={-32}
            y={innerH / 2}
            textAnchor="middle"
            fontSize={12}
            fill="#6b7280"
            transform={`rotate(-90, -32, ${innerH / 2})`}
          >
            PC2
          </text>

          {/* Points per cluster */}
          {byCluster.map((pts, clusterId) =>
            pts.map((d) => {
              const isSelected = d.name === selectedPlayer
              const dimmed =
                highlightCluster !== undefined &&
                d.role_cluster !== highlightCluster

              return (
                <circle
                  key={d.name}
                  cx={scaleX(d.pc1)}
                  cy={scaleY(d.pc2)}
                  r={isSelected ? 10 : 5}
                  fill={
                    isSelected
                      ? "#facc15"
                      : CLUSTER_COLORS[clusterId] ?? "#6b7280"
                  }
                  opacity={dimmed ? 0.15 : isSelected ? 1 : 0.75}
                  stroke={isSelected ? "#78350f" : "white"}
                  strokeWidth={isSelected ? 2 : 0.5}
                  className="cursor-pointer transition-all"
                  onMouseEnter={(e) => {
                    const rect = svgRef.current?.getBoundingClientRect()
                    if (!rect) return
                    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, player: d })
                  }}
                  onClick={() => onPlayerClick?.(d.name)}
                />
              )
            })
          )}
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-gray-200 bg-white px-3 py-2 shadow-lg text-sm"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <p className="font-semibold text-gray-900">{tooltip.player.name}</p>
          <p className="text-gray-500">{tooltip.player.club}</p>
          <p className="text-gray-600">
            {CLUSTER_NAMES[tooltip.player.role_cluster]} · CA {tooltip.player.ca}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 px-1">
        {Object.entries(CLUSTER_NAMES).map(([id, name]) => (
          <div key={id} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CLUSTER_COLORS[Number(id)] }}
            />
            {name}
          </div>
        ))}
      </div>
    </div>
  )
}
