import OverviewSection from './OverviewSection'
import ProductsSection from '../../products/components/ProductsSection'
import InventorySection from '../../inventory/components/InventorySection'
import ReportsSection from '../../reports/components/ReportsSection'

function DashboardSections({
  activeSection,
  metrics,
  productsState,
  formatMoney,
  onOpenProducts,
}) {
  if (activeSection === 'overview') {
    return (
      <OverviewSection
        metrics={metrics}
        loading={productsState.loading}
        formatMoney={formatMoney}
        onOpenProducts={onOpenProducts}
      />
    )
  }

  if (activeSection === 'products') {
    return (
      <ProductsSection
        editingId={productsState.editingId}
        form={productsState.form}
        products={productsState.products}
        paginatedProducts={productsState.paginatedProducts}
        loading={productsState.loading}
        submitting={productsState.submitting}
        error={productsState.error}
        currentPage={productsState.currentPage}
        totalPages={productsState.totalPages}
        totalProducts={productsState.totalProducts}
        pageSize={productsState.pageSize}
        formatMoney={formatMoney}
        onFormChange={productsState.onFormChange}
        onSubmit={productsState.onSubmit}
        onResetForm={productsState.resetForm}
        onEdit={productsState.onEdit}
        onDelete={productsState.onDelete}
        onPageChange={productsState.onPageChange}
      />
    )
  }

  if (activeSection === 'inventory') {
    return <InventorySection metrics={metrics} />
  }

  return <ReportsSection metrics={metrics} formatMoney={formatMoney} />
}

export default DashboardSections
