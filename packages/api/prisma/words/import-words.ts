/**
 * Script to import words into the database.
 *
 * @author Sean MacDougall
 */

import fs from 'fs'
import path from 'path'
import {nanoid} from 'nanoid'

import {Month, PrismaClient} from '@/prisma/client'

export const words: {mikmaq: string; english: string; startMonth: Month}[] = [
  {mikmaq: "Ni'n", english: 'I (personal pronoun)', startMonth: 'September'},
  {mikmaq: "Ki'l", english: 'You', startMonth: 'September'},
  {mikmaq: 'Teluisi', english: 'My name is', startMonth: 'September'},
  {mikmaq: 'Aqq', english: 'And', startMonth: 'October'},
  {mikmaq: 'Mijisi', english: 'Eat', startMonth: 'October'},
  {mikmaq: 'Wiktm', english: 'I like the taste of it', startMonth: 'October'},
  {mikmaq: 'Kesalk', english: 'I love', startMonth: 'November'},
  {mikmaq: "L'tu", english: 'Make it', startMonth: 'November'},
  {mikmaq: 'Eliey', english: 'I am going', startMonth: 'November'},
  {mikmaq: 'Nemitu', english: 'I see it', startMonth: 'December'},
  {mikmaq: 'Kesatm', english: 'I like', startMonth: 'December'},
  {mikmaq: 'Wejiey', english: 'I am coming from', startMonth: 'December'},
  {mikmaq: "Ta'ta", english: 'Dad', startMonth: 'January'},
  {mikmaq: "Kiju'", english: 'Mother / Grandmother', startMonth: 'January'},
  {mikmaq: 'Nekm', english: 'Him or her', startMonth: 'January'},
  {mikmaq: "Ala'tu", english: 'I have it', startMonth: 'February'},
  {mikmaq: 'Ula', english: 'Look at this', startMonth: 'February'},
  {mikmaq: 'Kesalul', english: 'I love you', startMonth: 'February'},
  {mikmaq: "Welta'si", english: 'I am happy', startMonth: 'March'},
  {mikmaq: 'Wen', english: 'Who', startMonth: 'March'},
  {mikmaq: 'Net', english: 'who is it', startMonth: 'March'}
]

export async function importWords() {
  const prisma = new PrismaClient()

  await prisma.word.deleteMany()

  const publicDir = `${process.cwd()}/public`

  if (fs.existsSync(publicDir)) {
    for (const file of fs.readdirSync(publicDir)) {
      fs.unlinkSync(path.join(publicDir, file))
    }
  } else {
    fs.mkdirSync(publicDir, {recursive: true})
  }

  for (const word of words) {
    const {mikmaq, english, startMonth} = word

    const image = `${__dirname}/images/${mikmaq.toLowerCase()}.png`
    const audio = `${__dirname}/audio/${mikmaq.toLowerCase()}.mp3`

    const imagePath = `${nanoid()}${path.extname(image)}`
    const audioPath = `${nanoid()}${path.extname(audio)}`

    fs.copyFileSync(image, `${publicDir}/${imagePath}`)
    fs.copyFileSync(audio, `${publicDir}/${audioPath}`)

    const {id: userId} = await prisma.user.findUniqueOrThrow({where: {username: 'admin'}})

    await prisma.word.create({
      data: {mikmaq, english, startMonth, imagePath, audioPath, userId}
    })
  }

  console.log('Words imported')
}
