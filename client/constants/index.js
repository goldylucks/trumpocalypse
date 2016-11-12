let BASE_API_URL = '//localhost:3001'
if (process.env.NODE_ENV === 'production') {
  BASE_API_URL = '//trumpocalypse.io'
}
if (process.env.NODE_ENV === 'staging') {
  BASE_API_URL = '//trumpocalypse.io'
}

export const API_URL = `${BASE_API_URL}/api`
