/**
 * Middleware to handle authentication using JWTs.
 *
 * @author Sean MacDougall
 */

import type {NextFunction, Request, Response} from 'express'
import type {JwtPayload} from 'jsonwebtoken'

import jwt from 'jsonwebtoken'

// override Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: string | undefined
    }
  }
}

// helper function to send unauthorized response
const unauthorized = (res: Response) => res.status(401).json({message: 'Unauthorized'})

// middleware to verify JWT and authenticate user
// if an auth token is present and valid, the user's ID is attached to req.user
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res)
  }

  const token = authHeader.split(' ')[1]!

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
    req.user = decoded.sub
    next()
  } catch (err) {
    return unauthorized(res)
  }
}
