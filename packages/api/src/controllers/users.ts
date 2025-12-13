/**
 * Controller for user-related routes.
 *
 * @author Sean MacDougall
 */

import {Router} from 'express'

import {requireAuth} from '@/middleware/auth.middleware'
import {prisma} from '@/prisma'

export const users = Router()

// get the currently authenticated user's information
users.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({where: {id: req.user}})
  return res.json({user})
})
