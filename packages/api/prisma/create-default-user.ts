/**
 * Script to create the default admin user.
 *
 * @author Sean MacDougall
 */

import {hash} from 'bcryptjs'

import {PrismaClient} from '@/prisma/client'

const defaultUser = {
  username: 'admin',
  name: 'Admin User',
  password: await hash('admin', 10)
}

export async function createDefaultUser() {
  const prisma = new PrismaClient()

  await prisma.word.deleteMany()
  await prisma.user.deleteMany()
  await prisma.user.create({data: defaultUser})

  await prisma.user.findUnique({where: {username: 'admin'}})
  console.log('✅ Added default user into the database')
  console.log(JSON.stringify({name: 'Admin User', username: 'admin', password: 'admin'}))
  await prisma.$disconnect()
}
