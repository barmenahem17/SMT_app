import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      {/* תוכן ראשי - מתכוונן לפי מצב ה-Sidebar */}
      <main className="transition-all duration-300 mr-[280px]">
        <div className="container mx-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

