export const getSales = () => {
  const data = localStorage.getItem("sales")
  return data ? JSON.parse(data) : []
}

export const saveSales = (sales) => {
  localStorage.setItem("sales", JSON.stringify(sales))
}

export const addSale = (sale) => {
  const sales = getSales()
  const updated = [...sales, sale]
  saveSales(updated)
}