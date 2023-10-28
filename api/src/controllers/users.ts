import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt'
import express from 'express'
import { z } from 'zod'
import { validateRequest } from 'zod-express-middleware'
import { User } from '../interfaces.js'
import { Request } from 'express-jwt'
import { map, omit } from 'lodash-es'

const prismaClient = new PrismaClient()
const users = express.Router()

users.get('/', async (req: Request<User>, res) => {
    const session = req.auth!

    if (session.role !== 'MANAGER') return res.status(401)

    const users = await prismaClient.user.findMany({
        where: {
            organizationId: session.organizationId,
            role: 'EMPLOYEE'
        }
    })

    const usersWithoutPassword = map(users, (user) => omit(user, 'password'))

    res.json(usersWithoutPassword)
})

users.post(
    '/',
    validateRequest({
        body: z.object({
            email: z.string().email(),
            password: z.string(),
            name: z.string()
        })
    }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        if (session.role !== 'MANAGER') return res.status(401)

        const user = await prismaClient.user.create({
            data: {
                email: req.body.email,
                password: hashSync(
                    req.body.password,
                    Number(process.env.SALT!)
                ),
                name: req.body.name,
                role: 'EMPLOYEE',
                organizationId: session.organizationId,
                updatedAt: new Date()
            }
        })

        res.json(user)
    }
)

export default users
