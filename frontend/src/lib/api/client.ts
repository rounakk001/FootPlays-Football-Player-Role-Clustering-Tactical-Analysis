const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  if (typeof window !== "undefined") {
    console.warn("NEXT_PUBLIC_API_URL is not set")
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  })

  if (!res.ok) {
    let message = `Request failed: ${res.status}`
    try {
      const err = await res.json()
      message = err.detail ?? err.message ?? message
    } catch {
      // non-JSON error body
    }
    throw new Error(message)
  }

  return res.json() as Promise<T>
}
