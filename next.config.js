const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
])

module.exports = (phase, { defaultConfig }) => {

  return withTM({
    env: {
      JWT_SECRET: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
      BCRYPT_SALT: '$2a$12$n4LLA0kQYyqD7V1w3wdVq.',
      API_AUTH_USERNAME: 'console-storex',
      API_AUTH_PASSWORD: 'G#h42Jt*409QwerD0',
      HEADERS: {}
    },
    trailingSlash: true,
    reactStrictMode: false,
    experimental: {
      esmExternals: false,
      jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
    },
    async headers() {
      const bufferedBasicAuth = Buffer.from(`${this.env.API_AUTH_USERNAME}:${this.env.API_AUTH_PASSWORD}`).toString('base64');
      const authHeaders = {
        key: 'Authorization',
        value: `Basic ${bufferedBasicAuth}`
      }
      this.env.HEADERS = {
        headers: {
          'Authorization': authHeaders.value
        }
      }
      return [
        {
          source: '/api/:path*',
          headers: Array(authHeaders)
        }
      ]
    },
    async rewrites() {
      return [
        // {
        //   source: '/api/:path*',
        //   destination: 'http://api.storex.local:81/api/:path*'
        // },
        {
          source: '/api/users/login',
          destination: 'http://api.storex.local:81/api/v1/users/login'
        },
        {
          source: '/api/users/me',
          destination: 'http://api.storex.local:81/api/v1/users/me'
        },
        {
          source: '/api/users/list',
          destination: 'http://api.storex.local:81/api/v1/users'
        },
        {
          source: '/api/users/:id',
          destination: 'http://api.storex.local:81/api/v1/users/:id'
        }
      ]
    },
    webpack: config => {
      config.resolve.alias = {
        ...config.resolve.alias,
        apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
      }

      return config
    }
  })
}

