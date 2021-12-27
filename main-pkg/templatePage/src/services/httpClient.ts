import axios from 'axios'

import { credentials } from './Services'

const axiostInstance = axios.create({
  baseURL: credentials.apiServer,
  headers: {
    Authorization: `Bearer ${credentials.apiAccessToken}`,
  },
})

export default axiostInstance
