// TEMPORARY STORAGE LAYER
// Later we can replace this with backend API calls

export const Storage = {

  get(key) {
    try {
      const data = localStorage.getItem(key)

      return data ? JSON.parse(data) : []

    } catch (error) {
      console.error("Storage GET Error:", error)
      return []
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      )

    } catch (error) {
      console.error("Storage SET Error:", error)
    }
  }

}