import { Storage } from "../storage/storage"

const PRODUCT_KEY = "products"

export const ProductService = {

  getAllProducts() {
    return Storage.get(PRODUCT_KEY)
  },

  saveProducts(products) {
    Storage.set(PRODUCT_KEY, products)
  },

  addProduct(product) {
    const products =
      Storage.get(PRODUCT_KEY)

    products.push(product)

    Storage.set(
      PRODUCT_KEY,
      products
    )
  }

}