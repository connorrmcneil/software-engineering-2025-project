/**
 * Sign-in loader to redirect authenticated users.
 *
 * @author Sean MacDougall
 */

import {redirect} from 'react-router'

// redirect if the user is already signed in
export const signinLoader = async () => {
  const token = localStorage.getItem('AuthToken')
  if (token) {
    throw redirect('/admin')
  }
  return null
}
