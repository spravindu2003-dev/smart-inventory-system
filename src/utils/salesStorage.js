// src/utils/salesStorage.js

export const getSales = () => {
  try {
    const data = localStorage.getItem("sales")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveSales = (sales) => {
  localStorage.setItem("sales", JSON.stringify(sales))
}

export const addSale = (sale) => {
  const old = getSales()
  const updated = [...old, sale]
  saveSales(updated)
  return updated
}