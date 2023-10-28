import { PrismaClient } from '@prisma/client'
import { validateRequest } from 'zod-express-middleware'
import { z } from 'zod'
import express from 'express'
import { Request } from 'express-jwt'
import { User } from '../interfaces.js'

const prismaClient = new PrismaClient()
const inspections = express.Router()

inspections.get('/', async (req: Request<User>, res) => {
    const session = req.auth!

    const inspections = await prismaClient.inspection.findMany({
        where: {
            area: {
                organizationId: session.organizationId
            },
            ...(session.role === 'EMPLOYEE' && {
                inspector: { id: session.id }
            })
        },
        include: {
            area: true,
            inspector: true
        },
        orderBy: {
            date: 'asc'
        }
    })

    res.json(inspections)
})

inspections.get('/:id', async (req: Request<User>, res) => {
    const session = req.auth!

    const inspection = await prismaClient.inspection.findFirstOrThrow({
        where: {
            id: Number(req.params.id),
            area: {
                organizationId: session.organizationId
            },
            ...(session.role === 'EMPLOYEE' && {
                inspector: {
                    id: session.id
                }
            })
        },
        include: {
            area: true,
            inspector: true
        }
    })

    res.json(inspection)
})

inspections.post(
    '/',
    validateRequest({
        body: z.object({
            areaId: z.number(),
            userId: z.number(),
            type: z.union([z.literal('ANNOUNCED'), z.literal('UNANNOUNCED')]),
            date: z.coerce.date(),
            status: z.union([
                z.literal('OPEN'),
                z.literal('CLOSED'),
                z.literal('DONE')
            ])
        })
    }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        if (session.role !== 'MANAGER') return res.status(401)

        await prismaClient.organization.findFirstOrThrow({
            where: {
                id: session.organizationId,
                areas: {
                    some: {
                        id: req.body.areaId
                    }
                },
                users: {
                    some: {
                        id: req.body.userId,
                        role: 'EMPLOYEE'
                    }
                }
            }
        })

        const inspection = await prismaClient.inspection.create({
            data: {
                areaId: req.body.areaId,
                userId: req.body.userId,
                type: req.body.type,
                date: req.body.date,
                status: req.body.status,
                updatedAt: new Date()
            }
        })

        res.json(inspection)
    }
)

inspections.patch(
    '/:id',
    validateRequest({
        body: z.object({
            status: z.union([z.literal('CLOSED'), z.literal('DONE')])
        })
    }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        const inspection = await prismaClient.inspection.update({
            where: {
                id: Number(req.params.id),
                area: {
                    organizationId: session.organizationId
                },
                inspector: {
                    id: session.id
                }
            },
            data: {
                status: req.body.status,
                updatedAt: new Date()
            }
        })

        res.json(inspection)
    }
)

export default inspections
