import type React from "react"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Add authentication check here
  // Uncomment when auth is implemented:
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) redirect('/login')

  return <>{children}</>
}
