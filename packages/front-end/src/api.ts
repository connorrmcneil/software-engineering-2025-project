/**
 * API client setup using Axios.
 *
 * @author Sean MacDougall
 */

import axios from 'axios'

// create an API client with base URL from environment variables
export const api = axios.create({
  baseURL: `${window.env?.API_URL ?? ''}/api`
})

// add a request interceptor to include the auth token in headers
api.interceptors.request.use(config => {
  const token = localStorage.getItem('AuthToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
