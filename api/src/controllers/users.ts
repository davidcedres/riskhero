import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt'
import express from 'express'
import { z } from 'zod'
import { validateRequest } from 'zod-express-middleware'
import { User } from '../interfaces.js'
import { Request } from 'express-jwt'
import { map, omit } from 'lodash-es'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_SECRET_KEY!)

const prismaClient = new PrismaClient()
const users = express.Router()

users.get(
    '/',
    validateRequest({
        query: z.object({
            role: z.literal('EMPLOYEE').optional()
        })
    }),
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

        const organization = await prismaClient.organization.findFirstOrThrow({
            where: {
                id: session.organizationId
            }
        })

        await resend.emails.send({
            from: 'david@riskninja.io',
            to: user.email,
            subject: 'Bienvenido a Riskninja',
            html: `<p>Has sido invitado a formar parte de la organización ${organization.name}. <br><br>Para continuar, <a href="https://riskninja.io/start">haz click aquí.</a></p>`
        })

        res.json(user)
    }
)

export default users
