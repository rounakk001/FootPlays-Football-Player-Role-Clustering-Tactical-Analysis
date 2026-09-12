export const CLUSTER_COLORS: Record<number, string> = {
  0: "#3b82f6", // blue
  1: "#f97316", // orange
  2: "#22c55e", // green
  3: "#ef4444", // red
  4: "#a855f7", // purple
}

export const CLUSTER_COLORS_LIGHT: Record<number, string> = {
  0: "#dbeafe",
  1: "#ffedd5",
  2: "#dcfce7",
  3: "#fee2e2",
  4: "#f3e8ff",
}

export function clusterColor(id: number): string {
  return CLUSTER_COLORS[id] ?? "#6b7280"
}

export function clusterColorLight(id: number): string {
  return CLUSTER_COLORS_LIGHT[id] ?? "#f3f4f6"
}

export function formatZ(z: number): string {
  const sign = z >= 0 ? "+" : ""
  return `${sign}${z.toFixed(2)}`
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}
