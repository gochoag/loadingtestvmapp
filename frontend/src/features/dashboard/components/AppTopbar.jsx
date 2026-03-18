function AppTopbar({
  currentSection,
  user,
  onToggleSidebar,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-100/92 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white p-0 text-slate-700 transition hover:border-slate-300"
          aria-label="Abrir o cerrar menu"
          onClick={onToggleSidebar}
        >
          <span className="flex w-4 flex-col gap-1.5">
            <span className="block h-0.5 rounded-full bg-current" />
            <span className="block h-0.5 rounded-full bg-current" />
            <span className="block h-0.5 rounded-full bg-current" />
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
            {currentSection.eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            {currentSection.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            {currentSection.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-950">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={onLogout}
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}

export default AppTopbar
