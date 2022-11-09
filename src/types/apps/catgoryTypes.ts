// ** Types
export type CategoriesLayoutType = {
  id: string | null | number
}

export type CategoriesType = {
  _id: string | number
  id: CategoriesType['_id']
  name: string
  subcategories: [string | number]
  store: string | number
}
