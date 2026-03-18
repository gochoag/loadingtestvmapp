import { useCallback, useState } from 'react'

const MOBILE_BREAKPOINT = 900

export function useDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')

  const onSelectSection = useCallback((sectionId) => {
    setActiveSection(sectionId)

    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      setSidebarOpen(false)
    }
  }, [])

  const onToggleSidebar = useCallback(() => {
    setSidebarOpen((previous) => !previous)
  }, [])

  const onCloseSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const selectProductsSection = useCallback(() => {
    setActiveSection('products')
  }, [])

  const resetLayout = useCallback(() => {
    setSidebarOpen(true)
    setActiveSection('overview')
  }, [])

  return {
    sidebarOpen,
    activeSection,
    onSelectSection,
    onToggleSidebar,
    onCloseSidebar,
    selectProductsSection,
    resetLayout,
  }
}
