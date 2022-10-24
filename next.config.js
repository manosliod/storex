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

module.exports = withTM({
  env: {
    BCRYPT_SALT: '$2a$12$n4LLA0kQYyqD7V1w3wdVq.'
  },
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
    jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  async rewrites() {
    return [
      // {
      //   source: '/api/:path*',
      //   destination: 'http://api.storex.local:81/api/:path*'
      // },
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
