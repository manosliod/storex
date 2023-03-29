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

  let status
  let response
  const error = {
    email: ['Something went wrong']
  }

  const bufferedBasicAuth = Buffer.from(`${process.env.API_AUTH_USERNAME}:${process.env.API_AUTH_PASSWORD}`).toString(
    'base64'
  )

  await axios
    .post(
      '/api/users/login',
      { email, password },
      {
        headers: {
          Authorization: `Basic ${bufferedBasicAuth}`
        }
      }
    )
    .then(res => {
      if (res.data.error) {
        status = res.data.error.statusCode
        response = res.data.message
      } else {
        const { user } = res.data.data

        status = 200
        response = {
          user,
          token: res.data.token
        }
      }
    })
    .catch(() => {
      status = 500
      response = { error }
    })

  return [status, response]
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
      const registerData = {
        email,
        password,
        passwordConfirm,
        name: fullName,
        fullName,
        birthday,
        phone,
        role: 'store-admin'
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

mock.onGet('/auth/me').reply(async config => {
  // @ts-ignore
  const token = config.headers.Authorization as string

  // get the decoded payload and header
  const accessToken = token.split(' ')[1]
  const decoded = jwt.decode(accessToken, { complete: true })

  let status
  let response
  if (decoded) {
    // @ts-ignore
    await axios
      .get('/api/users/me')
      .then(res => {
        if (res.data.error) {
          status = res.data.error.statusCode
          response = res.data.message
        } else {
          const userData = JSON.parse(JSON.stringify(res.data.doc))

          status = 200
          response = userData
        }
      })
      .catch(err => console.log(err))

    return [status, response]
  } else {
    return [401, { error: 'Invalid User' }]
  }
})
