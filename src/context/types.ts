import { AxiosResponse } from 'axios'

export type ErrCallbackType = (err: { [key: string]: AxiosResponse }) => void

export type LoginParams = {
  email: string
  password: string
}

export type RegisterParams = {
  email: string
  password: string
  passwordConfirm: string
  fullName: string
  birthday: string
  phone: string
}

export type UserDataType = {
  _id?: string | null
  id?: UserDataType['_id']
  name?: string | null
  fullName: UserDataType['name']
  role: string
  email: string
  password: string
  phone?: string | null
  birthdate?: string | null

  // avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: UserDataType | null
  setUser: (value: UserDataType | null) => void
  setIsInitialized: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  setUsers: (data: UserDataType[]) => void
}
