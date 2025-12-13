/**
 * Controller for word-related routes.
 *
 * @author Sean MacDougall
 */

import fs from 'fs'
import path from 'path'
import {Router} from 'express'
import multer from 'multer'
import {nanoid} from 'nanoid'
import z from 'zod'

import {requireAuth} from '@/middleware/auth.middleware'
import {prisma} from '@/prisma'
import {Month} from '@/prisma/client'

export const words = Router()

words.get('/', async (_req, res) => {
  const words = await prisma.word.findMany()
  return res.json({words})
})

// Ensure the upload directory exists
fs.mkdirSync('public', {recursive: true})

// Configure multer to store everything in /public
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'public'),
  filename: (_req, file, cb) => cb(null, `${nanoid()}${path.extname(file.originalname)}`)
})

const upload = multer({storage}).fields([
  {name: 'image', maxCount: 1},
  {name: 'audio', maxCount: 1}
])

type Uploaded = {
  image?: Express.Multer.File[]
  audio?: Express.Multer.File[]
}

const createWordSchema = z.object({
  mikmaq: z.string(),
  english: z.string(),
  startMonth: z.enum(Month)
})

const getFiles = (req: Express.Request) => {
  const files = req.files as Uploaded | undefined
  const imagePath = files?.image?.[0]?.filename
  const audioPath = files?.audio?.[0]?.filename
  return {imagePath, audioPath}
}

// this route requires an auth token to be present in the Authorization header
words.post('/', requireAuth, upload, async (req, res) => {
  const {data, error} = createWordSchema.safeParse(req.body)
  if (!data) {
    return res.status(400).json({error})
  }

  const {mikmaq, english, startMonth} = data

  const {imagePath, audioPath} = getFiles(req)
  if (!imagePath || !audioPath) {
    return res.status(400).json({error: 'Missing required uploaded files'})
  }

  const newWord = await prisma.word.create({
    data: {mikmaq, english, startMonth, imagePath, audioPath, userId: req.user!}
  })
  return res.status(201).json(newWord)
})

words.patch('/:wordId', requireAuth, upload, async (req, res) => {
  const {wordId} = req.params
  const {data, error} = createWordSchema.partial().safeParse(req.body)
  if (!data) {
    return res.status(400).json({error})
  }

  const {imagePath, audioPath} = getFiles(req)

  if (imagePath) {
    const {imagePath: oldImagePath} = await prisma.word.findUniqueOrThrow({
      where: {id: wordId},
      select: {imagePath: true}
    })
    fs.rmSync(path.join('public', oldImagePath))
  }

  if (audioPath) {
    const {audioPath: oldAudioPath} = await prisma.word.findUniqueOrThrow({
      where: {id: wordId},
      select: {audioPath: true}
    })
    fs.rmSync(path.join('public', oldAudioPath))
  }

  const word = await prisma.word.update({where: {id: wordId}, data: {...data, imagePath, audioPath}})
  return res.json({word})
})

words.delete('/:wordId', requireAuth, async (req, res) => {
  const {wordId} = req.params
  const word = await prisma.word.delete({where: {id: wordId}})
  console.log(word)
  fs.rmSync(path.join('public', word.imagePath))
  fs.rmSync(path.join('public', word.audioPath))

  return res.json({word})
})
