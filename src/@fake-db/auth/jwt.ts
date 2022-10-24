// ** JWT import
import jwt from 'jsonwebtoken'

// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Types
import { UserDataType } from 'src/context/types'

// ** Password Security import
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import axios from 'axios'

const users: UserDataType[] = []

// ! These two secrets should be in .env file and not in any other file
const jwtConfig = {
  secret: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
  refreshTokenSecret: '7c4c1c50-3230-45bf-9eae-c9b2e401c767'
}

mock.onPost('/jwt/set/users').reply(request => {
  if (users.length > 0) {
    while (users.length > 0) {
      users.pop()
    }
  }
  users.push(...JSON.parse(request.data))

  return [200, 'success']
})

mock.onPost('/jwt/login').reply(async request => {
  const { email, password } = JSON.parse(request.data)

  let error = {
    email: ['Something went wrong']
  }

  const cryptPass = await bcrypt.hash(password, <string>process.env.BCRYPT_SALT)
  const hashedPassword = crypto.createHash('md5').update(cryptPass).digest('hex')

  const user = users.find(u => u.email === email && u.password === hashedPassword)

  if (user) {
    const accessToken = jwt.sign({ id: user._id }, jwtConfig.secret)

    const response = {
      accessToken
    }

    return [200, response]
  } else {
    error = {
      email: ['email or Password is Invalid']
    }

    return [400, { error }]
  }
})

mock.onPost('/jwt/register').reply(async request => {
  if (request.data.length > 0) {
    const { email, password, passwordConfirm, fullName, birthday, phone } = JSON.parse(request.data)
    const isEmailAlreadyInUse = users.find(user => user.email === email)

    // const isUsernameAlreadyInUse = users.find(user => user.username === username)
    const error = {
      email: isEmailAlreadyInUse ? 'This email is already in use.' : null

      // username: isUsernameAlreadyInUse ? 'This username is already in use.' : null
    }

    if (
      // !error.username &&
      !error.email
    ) {
      const { length } = users
      let lastIndex = ''
      if (length) {
        lastIndex = <string>users[length - 1].id
      }

      const registerData = {
        email,
        password,
        passwordConfirm,
        name: fullName,
        fullName,
        birthday,
        phone,
        role: 'user'
      }

      let axiosError
      await axios
        .post('/api/v1/users/signup', registerData)
        .then(res => {
          if (res.data.error) {
            axiosError = res.data.message
          }
        })
        .catch(error => {
          axiosError = error.response.data.message
        })
      if (axiosError !== undefined) return [500, { message: axiosError }]

      delete registerData.name
      delete registerData.passwordConfirm

      const cryptPass = await bcrypt.hash(registerData.password, <string>process.env.BCRYPT_SALT)
      registerData.password = crypto.createHash('md5').update(cryptPass).digest('hex')
      const userData = {
        _id: 'temporary_register_id',
        ...registerData
      }

      users.push(userData)

      const accessToken = jwt.sign({ id: userData._id }, jwtConfig.secret)

      const user = { ...userData }
      delete user.password

      const response = { accessToken }

      return [200, response]
    }

    return [500, { error }]
  } else {
    return [401, { error: 'Invalid Data' }]
  }
})

mock.onGet('/auth/me').reply(config => {
  // @ts-ignore
  const token = config.headers.Authorization as string

  // get the decoded payload and header
  const decoded = jwt.decode(token, { complete: true })

  if (decoded) {
    // @ts-ignore
    const { id: userId } = decoded.payload

    const userData = JSON.parse(JSON.stringify(users.find((u: UserDataType) => u._id === userId)))

    delete userData.password

    return [200, { userData }]
  } else {
    return [401, { error: { error: 'Invalid User' } }]
  }
})
