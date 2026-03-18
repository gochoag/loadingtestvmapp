import AppSidebar from './AppSidebar'
import AppTopbar from './AppTopbar'

function DashboardShell({
  activeSection,
  sidebarOpen,
  user,
  currentSection,
  onSelectSection,
  onToggleSidebar,
  onCloseSidebar,
  onLogout,
  children,
}) {
  return (
    <div
      className={`min-h-screen bg-slate-100 text-slate-950 antialiased lg:grid ${
        sidebarOpen
          ? 'lg:grid-cols-[15rem_minmax(0,1fr)]'
          : 'lg:grid-cols-[5.5rem_minmax(0,1fr)]'
      }`}
    >
      <AppSidebar
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        user={user}
        onSelectSection={onSelectSection}
      />

      <button
        type="button"
        className={`fixed inset-0 z-30 border-0 bg-slate-950/35 p-0 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        aria-label="Cerrar menu"
        onClick={onCloseSidebar}
      />

      <div className="min-w-0">
        <AppTopbar
          currentSection={currentSection}
          user={user}
          onToggleSidebar={onToggleSidebar}
          onLogout={onLogout}
        />

        <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardShell
