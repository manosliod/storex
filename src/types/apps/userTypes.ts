// ** Types
export type UserLayoutType = {
  id: string | undefined
}

export type UsersType = {
  _id: string | number
  id: UsersType['_id']
  name?: string | null
  fullName: UsersType['name']
  role: string
  email: string
  password: string
  phone?: string | null
  birthdate?: string | null
}
