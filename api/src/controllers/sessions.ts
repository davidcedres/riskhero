import { compareSync } from 'bcrypt'
import { PrismaClient } from '@prisma/client'
// import { validateRequest } from 'zod-express-middleware'
import express from 'express'
import jwt from 'jsonwebtoken'

import { makeError } from '../makeError.js'
import { omit } from 'lodash-es'

const prismaClient = new PrismaClient()
const sessions = express.Router()

sessions.post(
    '/',
    // validateRequest({
    //     body: z.object({
    //         email: z.string().email(),
    //         password: z.string()
    //     })
    // }),
    async (req, res) => {
        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                email: req.body.email
            }
        })

        if (!compareSync(req.body.password, user.password))
            return res.status(401).json(makeError('Password', 'Incorrect'))

        res.json({
            jwt: jwt.sign(user, process.env.SECRET!),
            user: omit(user, 'password')
        })
    }
)

export default sessions
