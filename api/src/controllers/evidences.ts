import { PrismaClient } from '@prisma/client'
import express from 'express'
import { Request } from 'express-jwt'

import { User } from '../interfaces.js'
import { fileUpload, minioClient } from '../s3.js'

const prismaClient = new PrismaClient()
const evidences = express.Router()

evidences.post(
    '/',
    fileUpload.single('file'),
    async (req: Request<User>, res) => {
        const session = req.auth!

        if (req.file === undefined) {
            return res.status(400)
        }

        // @ts-expect-error -- multer is dumb as hell
        const key = req.file.key as string

        await prismaClient.observation.findFirstOrThrow({
            where: {
                id: Number(req.body.observationId),
                inspection: {
                    inspector: {
                        id: session.id
                    }
                }
            }
        })

        const evidence = await prismaClient.evidence.create({
            data: {
                observationId: Number(req.body.observationId),
                key,
                url: await minioClient.presignedGetObject('evidences', key),
                updatedAt: new Date()
            }
        })

        res.json(evidence)
    }
)

export default evidences
