import { NAVIGATION_ITEMS } from '../../../shared/constants/navigation'

function AppSidebar({ activeSection, sidebarOpen, user, onSelectSection }) {
  return (
    <aside className={`sidebar${sidebarOpen ? ' is-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark">LT</div>
        <div className="brand-copy">
          <strong>Loading Test</strong>
          <span>Frontend admin</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Navegacion principal">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${activeSection === item.id ? ' active' : ''}`}
            onClick={() => onSelectSection(item.id)}
          >
            <span className="nav-badge">{item.shortLabel}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <strong>{user.name}</strong>
        <span>{user.email}</span>
      </div>
    </aside>
  )
}

export default AppSidebar
