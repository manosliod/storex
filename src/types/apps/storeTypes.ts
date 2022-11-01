// ** Types
export type UserLayoutType = {
  id: string | undefined
}

export type StoresType = {
  _id: string | number
  id: StoresType['_id']
  name?: string
  officialName?: string
  storeLogo?: string
  storeType?: string
  address?: string
  city?: string
  country?: string
}
