import { useMemo, useState } from 'react'
import './App.css'
import LoginScreen from './features/auth/components/LoginScreen'
import AppSidebar from './features/dashboard/components/AppSidebar'
import AppTopbar from './features/dashboard/components/AppTopbar'
import OverviewSection from './features/dashboard/components/OverviewSection'
import ProductsSection from './features/products/components/ProductsSection'
import InventorySection from './features/inventory/components/InventorySection'
import ReportsSection from './features/reports/components/ReportsSection'
import { API_URL } from './shared/config/api'
import { SECTION_META } from './shared/constants/navigation'
import { useProductMetrics } from './hooks/useProductMetrics'
import { useProducts } from './hooks/useProducts'
import { createUserFromEmail } from './utils/auth'
import { createCurrencyFormatter, formatMoney as formatCurrency } from './utils/formatters'

function App() {
  const currencyFormatter = useMemo(() => createCurrencyFormatter(), [])

  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [loginError, setLoginError] = useState('')
  const selectProductsSection = () => {
    setActiveSection('products')
  }

  const {
    products,
    form,
    editingId,
    loading,
    submitting,
    error,
    resetForm,
    onFormChange,
    onSubmit,
    onEdit,
    onDelete,
  } = useProducts({
    apiUrl: API_URL,
    user,
    onProductSaved: selectProductsSection,
  })
  const metrics = useProductMetrics(products)
  const currentSection = SECTION_META[activeSection]
  const formatMoney = (value) => formatCurrency(currencyFormatter, value)

  const onLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((previous) => ({ ...previous, [name]: value }))
  }

  const onLoginSubmit = (event) => {
    event.preventDefault()

    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setLoginError('Ingresa correo y contrasena para continuar.')
      return
    }

    setLoginError('')
    setUser(createUserFromEmail(loginForm.email))
    setSidebarOpen(true)
    setActiveSection('overview')
  }

  const onLogout = () => {
    setUser(null)
    setLoginForm({
      email: '',
      password: '',
    })
    setSidebarOpen(true)
    setActiveSection('overview')
  }

  const selectSection = (sectionId) => {
    setActiveSection(sectionId)
    if (window.innerWidth <= 900) {
      setSidebarOpen(false)
    }
  }

  if (!user) {
    return (
      <LoginScreen
        loginForm={loginForm}
        loginError={loginError}
        onLoginChange={onLoginChange}
        onLoginSubmit={onLoginSubmit}
      />
    )
  }

  return (
    <div className={`app-shell${sidebarOpen ? '' : ' sidebar-closed'}`}>
      <AppSidebar
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        user={user}
        onSelectSection={selectSection}
      />

      <button
        type="button"
        className={`sidebar-backdrop${sidebarOpen ? ' visible' : ''}`}
        aria-label="Cerrar menu"
        onClick={() => setSidebarOpen(false)}
      />

      <div className="app-layout">
        <AppTopbar
          currentSection={currentSection}
          user={user}
          onToggleSidebar={() => setSidebarOpen((previous) => !previous)}
          onLogout={onLogout}
        />

        <main className="main-content">
          {activeSection === 'overview' && (
            <OverviewSection
              metrics={metrics}
              loading={loading}
              formatMoney={formatMoney}
              onOpenProducts={selectProductsSection}
            />
          )}
          {activeSection === 'products' && (
            <ProductsSection
              editingId={editingId}
              form={form}
              products={products}
              loading={loading}
              submitting={submitting}
              error={error}
              formatMoney={formatMoney}
              onFormChange={onFormChange}
              onSubmit={onSubmit}
              onResetForm={resetForm}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
          {activeSection === 'inventory' && <InventorySection metrics={metrics} />}
          {activeSection === 'reports' && (
            <ReportsSection metrics={metrics} formatMoney={formatMoney} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
