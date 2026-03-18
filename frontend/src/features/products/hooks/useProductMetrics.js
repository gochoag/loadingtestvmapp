import { useMemo } from 'react'

export function useProductMetrics(products) {
  return useMemo(() => {
    const totalProducts = products.length
    const totalUnits = products.reduce(
      (accumulator, product) => accumulator + Number(product.stock || 0),
      0,
    )
    const totalValue = products.reduce(
      (accumulator, product) =>
        accumulator + Number(product.stock || 0) * Number(product.price || 0),
      0,
    )
    const lowStock = products.filter((product) => Number(product.stock) <= 5)
    const topProducts = [...products]
      .sort((first, second) => Number(second.stock) - Number(first.stock))
      .slice(0, 5)
    const stableProducts = products.filter((product) => Number(product.stock) > 5)
    const outOfStockProducts = products.filter((product) => Number(product.stock) === 0)
    const averagePrice =
      totalProducts === 0
        ? 0
        : products.reduce(
            (accumulator, product) => accumulator + Number(product.price || 0),
            0,
          ) / totalProducts
    const averageCoverage = totalProducts === 0 ? 0 : Math.round(totalUnits / totalProducts)

    return {
      totalProducts,
      totalUnits,
      totalValue,
      lowStock,
      topProducts,
      stableProducts,
      outOfStockProducts,
      averagePrice,
      averageCoverage,
    }
  }, [products])
}
