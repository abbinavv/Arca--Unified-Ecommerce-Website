// Minimal pass-through — each sub-portal (staff/manager/admin) has its own layout with sidebar
export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
