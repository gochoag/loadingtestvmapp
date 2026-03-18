import { useMemo } from 'react'
import LoginScreen from './features/auth/components/LoginScreen'
import DashboardShell from './features/dashboard/components/DashboardShell'
import DashboardSections from './features/dashboard/components/DashboardSections'
import { useProductMetrics } from './features/products/hooks/useProductMetrics'
import { useProducts } from './features/products/hooks/useProducts'
import { API_URL } from './shared/config/api'
import { SECTION_META } from './shared/constants/navigation'
import { createCurrencyFormatter, formatMoney as formatCurrency } from './utils/formatters'
import { useAuthSession } from './features/auth/hooks/useAuthSession'
import { useDashboardLayout } from './features/dashboard/hooks/useDashboardLayout'
import ToastStack from './shared/components/ToastStack'
import { useToasts } from './shared/hooks/useToasts'

function App() {
  const currencyFormatter = useMemo(() => createCurrencyFormatter(), [])
  const { toasts, pushToast, dismissToast } = useToasts()
  const {
    sidebarOpen,
    activeSection,
    onSelectSection,
    onToggleSidebar,
    onCloseSidebar,
    selectProductsSection,
    resetLayout,
  } = useDashboardLayout()
  const {
    token,
    user,
    loginForm,
    loginError,
    authLoading,
    onLoginChange,
    onLoginSubmit,
    onLogout,
  } = useAuthSession({
    apiUrl: API_URL,
    onLoginSuccess: resetLayout,
    onLogoutSuccess: resetLayout,
    onNotify: pushToast,
  })

  const productsState = useProducts({
    apiUrl: API_URL,
    user,
    token,
    onProductSaved: selectProductsSection,
    onNotify: pushToast,
  })
  const metrics = useProductMetrics(productsState.products)
  const currentSection = SECTION_META[activeSection]
  const formatMoney = (value) => formatCurrency(currencyFormatter, value)

  if (authLoading && !user) {
    return (
      <>
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-600 antialiased">
          <div className="border border-slate-200 bg-white px-6 py-5 text-sm shadow-sm">
            Verificando sesion...
          </div>
        </main>
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <LoginScreen
          loginForm={loginForm}
          loginError={loginError}
          onLoginChange={onLoginChange}
          onLoginSubmit={onLoginSubmit}
        />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    )
  }

  return (
    <>
      <DashboardShell
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        user={user}
        currentSection={currentSection}
        onSelectSection={onSelectSection}
        onToggleSidebar={onToggleSidebar}
        onCloseSidebar={onCloseSidebar}
        onLogout={onLogout}
      >
        <DashboardSections
          activeSection={activeSection}
          metrics={metrics}
          productsState={productsState}
          formatMoney={formatMoney}
          onOpenProducts={selectProductsSection}
        />
      </DashboardShell>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}

export default App
