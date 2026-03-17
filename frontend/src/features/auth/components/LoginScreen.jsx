function LoginScreen({
  loginForm,
  loginError,
  onLoginChange,
  onLoginSubmit,
}) {
  return (
    <main className="login-shell">
      <section className="login-hero">
        <span className="eyebrow">Acceso</span>
        <h1>Login y panel principal en una sola experiencia.</h1>
        <p>
          Inicia sesion para entrar al dashboard con header superior, sidebar
          lateral y contenido central sin footer.
        </p>
        <div className="login-points">
          <article>
            <strong>01</strong>
            <span>Ingreso rapido al sistema</span>
          </article>
          <article>
            <strong>02</strong>
            <span>Navegacion lateral con hamburguesa</span>
          </article>
          <article>
            <strong>03</strong>
            <span>Gestion centralizada de productos</span>
          </article>
        </div>
      </section>

      <section className="login-card">
        <div className="login-card-header">
          <span className="eyebrow">Bienvenido</span>
          <h2>Ingresa al panel</h2>
          <p>Usa cualquier correo y contrasena para continuar.</p>
        </div>

        <form className="form" onSubmit={onLoginSubmit}>
          <label>
            Correo
            <input
              name="email"
              type="email"
              value={loginForm.email}
              onChange={onLoginChange}
              placeholder="admin@empresa.com"
            />
          </label>
          <label>
            Contrasena
            <input
              name="password"
              type="password"
              value={loginForm.password}
              onChange={onLoginChange}
              placeholder="Ingresa tu contrasena"
            />
          </label>
          {loginError && <p className="error">{loginError}</p>}
          <button type="submit" className="login-submit">
            Entrar al sistema
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginScreen
