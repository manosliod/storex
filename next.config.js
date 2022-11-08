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

const bufferedBasicAuth = Buffer.from('console-storex:G#h42Jt*409QwerD0').toString('base64');
const authHeaders = {
  key: 'Authorization',
  value: `Basic ${bufferedBasicAuth}`
}

module.exports = (phase, { defaultConfig }) => {

  return withTM({
    env: {
      JWT_SECRET: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
      BCRYPT_SALT: '$2a$12$n4LLA0kQYyqD7V1w3wdVq.',
      API_AUTH_USERNAME: 'console-storex',
      API_AUTH_PASSWORD: 'G#h42Jt*409QwerD0',
      HEADERS: {
        headers: {
          'Authorization': authHeaders.value
        }
      }
    },
    trailingSlash: true,
    reactStrictMode: false,
    experimental: {
      esmExternals: false,
      jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
    },
    async rewrites() {
      return [
        {
          source: '/:path*/',
          destination: '/:path*/'
        },
        {
          source: '/api/users/login/',
          destination: 'http://localhost:3001/api/v1/users/login/'
        },
        {
          source: '/api/users/me/',
          destination: 'http://localhost:3001/api/v1/users/me/'
        },
        {
          source: '/api/users/',
          destination: 'http://localhost:3001/api/v1/users/'
        },
        {
          source: '/api/users/:id/',
          destination: 'http://localhost:3001/api/v1/users/:id/'
        },
        {
          source: '/api/users/store/:storeId/',
          destination: 'http://localhost:3001/api/v1/users/store/:storeId/'
        },
        {
          source: '/api/users/:id/store/:storeId/',
          destination: 'http://localhost:3001/api/v1/users/:id/store/:storeId/'
        },
        {
          source: '/api/stores/',
          destination: 'http://localhost:3001/api/v1/stores/'
        },
        {
          source: '/api/stores/:id/',
          destination: 'http://localhost:3001/api/v1/stores/:id/'
        },
        {
          source: '/api/stores/:id/user/:userId/',
          destination: 'http://localhost:3001/api/v1/stores/:id/user/:userId/'
        },
        {
          source: '/api/categories/',
          destination: 'http://localhost:3001/api/v1/categories/'
        },
        {
          source: '/api/categories/:id/',
          destination: 'http://localhost:3001/api/v1/categories/:id/'
        },
        {
          source: '/api/categories/availableUsers/store/:id/',
          destination: 'http://localhost:3001/api/v1/categories/availableUsers/store/:id/'
        },
        {
          source: '/users/view/profile/:id',
          destination: '/users/view/profile'
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

