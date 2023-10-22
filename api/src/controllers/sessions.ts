import { PrismaClient } from '@prisma/client'
import { compareSync } from 'bcrypt'
import express from 'express'
import { z } from 'zod'
import { validateRequest } from 'zod-express-middleware'
import jwt from 'jsonwebtoken'

const prismaClient = new PrismaClient()
const sessions = express.Router()

sessions.post(
    '/',
    validateRequest({
        body: z.object({
            email: z.string().email(),
            password: z.string()
        })
    }),
    async (req, res) => {
        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                email: req.body.email
            }
        })

        if (!compareSync(req.body.password, user.password))
            return res.status(401).send()

        res.json({ jwt: jwt.sign(user, process.env.SECRET!) })
    }
)

export default sessions
