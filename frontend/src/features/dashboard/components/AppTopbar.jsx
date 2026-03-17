function AppTopbar({
  currentSection,
  user,
  onToggleSidebar,
  onLogout,
}) {
  return (
    <header className="topbar">
      <div className="topbar-main">
        <button
          type="button"
          className="menu-button"
          aria-label="Abrir o cerrar menu"
          onClick={onToggleSidebar}
        >
          <span />
          <span />
          <span />
        </button>
        <div>
          <span className="eyebrow">{currentSection.eyebrow}</span>
          <h1>{currentSection.title}</h1>
          <p>{currentSection.subtitle}</p>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="user-pill">
          <span>{user.name}</span>
          <small>Sesion activa</small>
        </div>
        <button type="button" className="secondary" onClick={onLogout}>
          Salir
        </button>
      </div>
    </header>
  )
}

export default AppTopbar
