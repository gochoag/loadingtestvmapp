function LoginScreen({
  loginForm,
  loginError,
  onLoginChange,
  onLoginSubmit,
}) {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 antialiased lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <section className="flex min-h-screen items-center border-b border-slate-200 bg-white px-6 py-8 sm:px-10 lg:border-r lg:border-b-0 lg:px-14 xl:px-18">
        <div className="w-full max-w-md space-y-7">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Acceso
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Inicia sesion y entra al panel.
            </h1>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">
              Una vista clara para catalogo, inventario y reportes, con acceso
              rapido y sin pasos extras.
            </p>
          </div>

          <form className="space-y-5" onSubmit={onLoginSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Correo</span>
              <input
                name="email"
                type="email"
                value={loginForm.email}
                onChange={onLoginChange}
                placeholder="admin@empresa.com"
                autoComplete="email"
                className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Contrasena</span>
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={onLoginChange}
                placeholder="Ingresa tu contrasena"
                autoComplete="current-password"
                className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            {loginError && (
              <p className="text-sm font-medium text-rose-600">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Entrar al sistema
            </button>
          </form>

          <div className="grid gap-3 border-t border-slate-200 pt-5 text-sm text-slate-600 sm:grid-cols-3">
          
          </div>
        </div>
      </section>

      <section className="hidden min-h-screen flex-col justify-between bg-gradient-to-br from-sky-950 via-blue-900 to-slate-900 px-12 py-8 text-white lg:flex xl:px-16">
        <div className="space-y-5">
          <span className="inline-flex items-center border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
            Loading Test
          </span>
          <div className="space-y-4">
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-white">
              Operacion comercial con una interfaz mas sobria y enfocada.
            </h2>
            <p className="max-w-xl text-base leading-7 text-sky-100/78">
              El panel fue pensado para que login, navegacion y acciones clave
              convivan en una experiencia compacta y profesional.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-t border-white/15 pt-4">
            <p className="text-3xl font-semibold text-white">4</p>
            <p className="mt-1 text-sm text-sky-100/76">modulos principales</p>
          </div>
          <div className="border-t border-white/15 pt-4">
            <p className="text-3xl font-semibold text-white">24/7</p>
            <p className="mt-1 text-sm text-sky-100/76">operacion siempre disponible</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginScreen
