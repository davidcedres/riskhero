import { PrismaClient } from '@prisma/client'
import { validateRequest } from 'zod-express-middleware'
import { z } from 'zod'
import express from 'express'
import { Request } from 'express-jwt'
import { User } from '../interfaces.js'

const prismaClient = new PrismaClient()
const inspections = express.Router()

inspections.get('/', async (req: Request<User>, res) => {
    const { role, organizationId, id } = req.auth!

    const wheres = {
        MANAGER: {
            area: {
                organizationId
            }
        },
        EMPLOYEE: {
            area: {
                organizationId
            },
            inspector: {
                id
            }
        }
    }

    const inspections = await prismaClient.inspection.findMany({
        where: wheres[role],
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
    const { organizationId } = req.auth!

    const inspection = await prismaClient.inspection.findFirstOrThrow({
        where: {
            id: Number(req.params.id)
        },
        include: {
            area: true,
            inspector: true
        }
    })

    // Validation
    if (inspection.area.organizationId !== organizationId) {
        return res.status(401)
    }

    // Proceed
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
        // Validation
        const { organizationId } = req.auth!

        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                id: req.body.userId
            }
        })

        const area = await prismaClient.area.findFirstOrThrow({
            where: {
                id: req.body.areaId
            }
        })

        if (user.organizationId !== organizationId) return res.status(401)
        if (area.organizationId !== organizationId) return res.status(401)

        // Proceed
        const { areaId, userId, type, date, status } = req.body

        const inspection = await prismaClient.inspection.create({
            data: {
                areaId,
                userId,
                type,
                date,
                status,
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
            status: z.union([
                // z.literal("OPEN"),
                z.literal('CLOSED'),
                z.literal('DONE')
            ])
        })
    }),
    async (req: Request<User>, res) => {
        const { organizationId } = req.auth!

        const inspection = await prismaClient.inspection.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                status: req.body.status
            }
        })

        res.json(inspection)
    }
)

export default inspections
