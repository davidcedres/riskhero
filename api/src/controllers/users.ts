import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt'
import express from 'express'
import { Request } from 'express-jwt'
import jwt from 'jsonwebtoken'
import { map, omit } from 'lodash-es'
import { nanoid } from 'nanoid'
import { Resend } from 'resend'

// import { validateRequest } from 'zod-express-middleware'
import { User } from '../interfaces.js'
import { FRONTEND_URL } from '../utils.js'

const resend = new Resend(process.env.RESEND_SECRET_KEY!)

const prismaClient = new PrismaClient()
const users = express.Router()

users.get(
    '/',
    // validateRequest({
    //     query: z.object({
    //         role: z.literal('EMPLOYEE').optional()
    //     })
    // }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        if (session.role !== 'MANAGER') return res.status(401)

        const users = await prismaClient.user.findMany({
            where: {
                organizationId: session.organizationId,
                ...(req.query?.role === 'EMPLOYEE' && { role: 'EMPLOYEE' })
            }
        })

        const usersWithoutPassword = map(users, (user) =>
            omit(user, 'password')
        )

        res.json(usersWithoutPassword)
    }
)

users.post(
    '/',
    // validateRequest({
    //     body: z.object({
    //         email: z.string().email(),
    //         name: z.string()
    //     })
    // }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        if (session.role !== 'MANAGER') return res.status(401)

        const user = await prismaClient.user.create({
            data: {
                email: req.body.email,
                password: nanoid(),
                name: req.body.name,
                role: 'EMPLOYEE',
                organizationId: session.organizationId,
                updatedAt: new Date()
            }
        })

        const organization = await prismaClient.organization.findFirstOrThrow({
            where: {
                id: session.organizationId
            }
        })

        const token = jwt.sign(user, process.env.SECRET!, {
            expiresIn: '3 days'
        })

        await resend.emails.send({
            from: 'david@riskninja.io',
            to: user.email,
            subject: 'Bienvenido a Riskninja',
            html: `<p>Has sido invitado a formar parte de la organización ${organization.name}. <br><br>Para continuar, <a href="${FRONTEND_URL}/start?token=${token}">haz click aquí.</a></p>`
        })

        res.json(user)
    }
)

users.patch(
    '/me',
    // validateRequest({
    //     body: z.object({
    //         password: z.string()
    //     })
    // }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        await prismaClient.user.update({
            where: {
                id: session.id
            },
            data: {
                password: hashSync(req.body.password, Number(process.env.SALT!))
            }
        })

        res.status(200).send()
    }
)

export default users
