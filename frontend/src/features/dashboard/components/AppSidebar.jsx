import { NAVIGATION_ITEMS } from '../../../shared/constants/navigation'

function AppSidebar({ activeSection, sidebarOpen, user, onSelectSection }) {
  const collapsed = !sidebarOpen

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-full ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-900 text-sm font-semibold tracking-[0.28em] text-white">
          LT
        </div>
        <div className={`${collapsed ? 'lg:hidden' : ''}`}>
          <strong className="block text-sm font-semibold text-slate-950">
            Loading Test
          </strong>
          <span className="block text-xs text-slate-500">Control panel</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Navegacion principal">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${
              activeSection === item.id
                ? 'border-sky-200 bg-sky-50 text-sky-800'
                : 'border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950'
            } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
            onClick={() => onSelectSection(item.id)}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-[11px] font-semibold tracking-[0.16em] ${
                activeSection === item.id
                  ? 'bg-sky-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {item.shortLabel}
            </span>
            <span className={`${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-200 px-4 py-4">
        <p className={`truncate text-sm font-semibold text-slate-950 ${collapsed ? 'lg:hidden' : ''}`}>
          {user.name}
        </p>
        <p className={`truncate text-xs text-slate-500 ${collapsed ? 'lg:hidden' : ''}`}>
          {user.email}
        </p>
        <div
          className={`hidden h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700 ${
            collapsed ? 'lg:flex' : ''
          }`}
        >
          {user.name.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </aside>
  )
}

export default AppSidebar
