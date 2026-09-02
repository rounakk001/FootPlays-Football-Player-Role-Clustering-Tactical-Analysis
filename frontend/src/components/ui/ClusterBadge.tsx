import { clusterColor, clusterColorLight } from "@/lib/utils"

interface ClusterBadgeProps {
  id: number
  name: string
  size?: "sm" | "md"
}

export function ClusterBadge({ id, name, size = "md" }: ClusterBadgeProps) {
  const color = clusterColor(id)
  const bgColor = clusterColorLight(id)
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${padding}`}
      style={{ color, backgroundColor: bgColor }}
    >
      {name}
    </span>
  )
}
