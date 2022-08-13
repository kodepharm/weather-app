import axios from 'axios'
import { getSession } from 'next-auth/react'
// import HttpError from './httpError'

/**
 * Create an axios instance
 */
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000,
  params: {},
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
})

/**
 * Add a request interceptor
 */
http.interceptors.request.use(async (request) => {
  const session = await getSession()

  if (session?.token && session.token.token) {
    if (request.headers) {
      request.headers.Authorization = `Bearer ${session.token.token}`
    } else {
      request.headers = {
        Authorization: `Bearer ${session.token.token}`,
      }
    }
  }

  return request
})

/**
 * Add a response interceptor
 */
http.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    // TODO: Check for unauthorized request
    return Promise.reject(error)
  }
)

/**
 * Create a http get request
 */
export async function getRequest<T = any>(
  endpoint: string,
  params?: Object
): Promise<T> {
  try {
    const response = await http.get<T>(endpoint, { params })
    return response.data
  } catch (error) {
    throw new HttpError(error)
  }
}

/**
 * Create a http post request
 */
export async function postRequest<T = any>(
  endpoint: string,
  data?: Object
): Promise<T> {
  try {
    const response = await http.post<T>(endpoint, data)
    return response.data
  } catch (error) {
    throw new HttpError(error)
  }
}

/**
 * Create a http put request
 */
export async function putRequest<T = any>(
  endpoint: string,
  data?: Object
): Promise<T> {
  try {
    const response = await http.put<T>(endpoint, data)
    return response.data
  } catch (error) {
    throw new HttpError(error)
  }
}

/**
 * Create a http delete request
 */
export async function deleteRequest<T = any>(
  endpoint: string,
  params?: Object
): Promise<T> {
  try {
    const response = await http.delete<T>(endpoint, { params })
    return response.data
  } catch (error) {
    throw new(error)
  }
}

export default http
