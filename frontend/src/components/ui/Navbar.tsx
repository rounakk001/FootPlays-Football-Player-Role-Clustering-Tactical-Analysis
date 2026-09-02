import Link from "next/link"
import { BarChart2, Users, Search } from "lucide-react"

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="text-lg">⚽</span>
          <span>Role Dashboard</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/explore"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <BarChart2 size={15} />
            Explore
          </Link>
          <Link
            href="/players"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Users size={15} />
            Players
          </Link>
        </nav>
      </div>
    </header>
  )
}
