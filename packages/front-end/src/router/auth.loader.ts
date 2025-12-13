/**
 * Authentication loader to verify user session.
 *
 * @author Sean MacDougall
 */

import {redirect} from 'react-router'

import {api} from '@/api'

type User = {
  id: string
  username: string
  name: string
}

// check the status of the user's authentication by calling the /users/me endpoint
// if successful, return the user data, otherwise redirect to the signin page
export const authLoader = async () => {
  try {
    const {data} = await api.get<{user: User}>('/users/me')
    return {user: data.user}
  } catch {
    localStorage.removeItem('AuthToken')
    throw redirect('/admin/signin')
  }
}
