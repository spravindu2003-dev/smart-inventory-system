import { Storage } from "../storage/storage"

const SALES_KEY = "sales"

export const SalesService = {

  getAllSales() {
    return Storage.get(SALES_KEY)
  },

  saveSales(sales) {
    Storage.set(SALES_KEY, sales)
  },

  addSale(sale) {
    const sales =
      Storage.get(SALES_KEY)

    sales.push(sale)

    Storage.set(
      SALES_KEY,
      sales
    )
  }

}