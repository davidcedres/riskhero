import { PrismaClient } from '@prisma/client'
import express from 'express'
import { Request } from 'express-jwt'
import { z } from 'zod'
import { validateRequest } from 'zod-express-middleware'
import { User } from '../interfaces.js'

const prismaClient = new PrismaClient()
const observations = express.Router()

observations.get(
    '/',
    validateRequest({
        query: z.object({
            inspectionId: z.number()
        })
    }),
    async (req, res) => {
        // @ts-expect-error
        const session = req.auth! as User

        const inspection = await prismaClient.inspection.findFirstOrThrow({
            where: {
                id: req.query.inspectionId
            },
            include: {
                area: true
            }
        })

        if (inspection.area.organizationId !== session.organizationId)
            return res.status(401)

        const observations = await prismaClient.observation.findMany({
            where: {
                inspectionId: req.query.inspectionId
            },
            include: {
                category: true,
                condition: true
            }
        })

        res.json(observations)
    }
)

observations.post(
    '/',
    validateRequest({
        body: z.object({
            state: z.union([
                z.literal('ACCEPTABLE'),
                z.literal('UNSAFE'),
                z.literal('MISSING'),
                z.literal('NEEDS_REPAIR'),
                z.literal('SKIPPED')
            ]),
            description: z.string(),
            inspectionId: z.number(),
            categoryId: z.number(),
            conditionId: z.number()
        })
    }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        if (session.role !== 'EMPLOYEE') return res.status(401)

        await prismaClient.inspection.findFirstOrThrow({
            where: {
                id: req.body.inspectionId,
                area: {
                    organizationId: session.organizationId
                }
            },
            include: {
                area: true
            }
        })

        const observation = await prismaClient.observation.create({
            data: { ...req.body, updatedAt: new Date() }
        })

        res.json(observation)
    }
)

observations.patch(
    '/:id',
    validateRequest({
        body: z.object({
            analysis: z.string()
        })
    }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        await prismaClient.observation.findFirstOrThrow({
            where: {
                id: Number(req.params.id),
                inspection: {
                    area: {
                        organizationId: session.organizationId
                    },
                    status: 'CLOSED'
                }
            },
            include: {
                inspection: {
                    include: {
                        area: true
                    }
                }
            }
        })

        const observation = await prismaClient.observation.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                analysis: req.body.analysis
            }
        })

        res.json(observation)
    }
)

export default observations
