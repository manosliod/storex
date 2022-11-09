// ** Types
export type UserLayoutType = {
  id: string | null | number
}

export type UsersType = {
  _id: string | number
  id: UsersType['_id']
  name?: string
  fullName: UsersType['name']
  gender?: string
  role: string
  username: string
  email: string
  password: string
  phone?: string
  birthday?: string
  address?: string
  city?: string
  phone?: string
}
