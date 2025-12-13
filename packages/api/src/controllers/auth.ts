/**
 * Controller for authentication routes.
 *
 * @author Sean MacDougall
 */

import {compare} from 'bcryptjs'
import {Router} from 'express'
import {sign} from 'jsonwebtoken'

import {prisma} from '@/prisma'

export const auth = Router()

// authenticate the user by username and password, returning a JWT signed token
auth.post('/', async (req, res) => {
  const {username, password} = req.body

  // find the requested user by username
  const user = await prisma.user.findUnique({where: {username}, select: {id: true, password: true}})
  // if the requested user does not exist or the password does not match, return 401 (unauthorized)
  if (!user || !(await compare(password, user.password))) {
    return res.status(401).json({error: 'Invalid username or password'})
  }

  // create a signed JWT token valid for 7 days
  const token = sign({sub: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'})
  return res.json({token})
})
