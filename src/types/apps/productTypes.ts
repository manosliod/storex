// ** Types
export type ProductLayoutType = {
  id: string | null | number
}

export type ProductsType = {
  _id: number | string
  id: ProductsType['_id']
  name?: string
  serialNumber?: string
  barcode?: string
  productType?: string
  price?: string
  quantity?: string
  store?: string | number
}
