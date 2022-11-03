// ** Types
export type UserLayoutType = {
  id: string | number
}

export type UsersType = {
  _id: string | number
  id: UsersType['_id']
  name?: string
  fullName: UsersType['name']
  gender?: string
  role: string
  email: string
  password: string
  phone?: string
  birthday?: string
}
