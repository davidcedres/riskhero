import { PrismaClient } from '@prisma/client'
import express from 'express'
import { Request } from 'express-jwt'
// import { validateRequest } from 'zod-express-middleware'
import { User } from '../interfaces.js'

const prismaClient = new PrismaClient()
const observations = express.Router()

observations.get(
    '/',
    // validateRequest({
    //     query: z.object({
    //         inspectionId: z.coerce.number(),
    //         state: z
    //             .union([z.literal('GOOD_ONES'), z.literal('BAD_ONES')])
    //             .optional()
    //     })
    // }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        const observations = await prismaClient.observation.findMany({
            where: {
                inspection: {
                    id: Number(req.query.inspectionId),
                    ...(session.role !== 'ADMIN' && {
                        area: {
                            organizationId: session.organizationId
                        }
                    }),
                    ...(session.role === 'EMPLOYEE' && {
                        inspector: {
                            id: session.id
                        }
                    })
                },
                ...(req.query.state === 'BAD_ONES' && {
                    state: {
                        in: ['MISSING', 'NEEDS_REPAIR', 'UNSAFE']
                    }
                })
            },
            include: {
                category: true,
                condition: true,
                evidences: true
            }
        })

        res.json(observations)
    }
)

observations.post(
    '/',
    // validateRequest({
    //     body: z.object({
    //         state: z.union([
    //             z.literal('ACCEPTABLE'),
    //             z.literal('UNSAFE'),
    //             z.literal('MISSING'),
    //             z.literal('NEEDS_REPAIR'),
    //             z.literal('SKIPPED')
    //         ]),
    //         description: z.string(),
    //         inspectionId: z.number(),
    //         categoryId: z.number(),
    //         conditionId: z.number()
    //     })
    // }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        await prismaClient.inspection.findFirstOrThrow({
            where: {
                id: req.body.inspectionId,
                area: {
                    organizationId: session.organizationId
                },
                inspector: {
                    id: session.id
                },
                status: 'OPEN'
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
    // validateRequest({
    //     body: z.object({
    //         analysis: z.string()
    //     })
    // }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        const observation = await prismaClient.observation.update({
            where: {
                id: Number(req.params.id),
                inspection: {
                    area: {
                        organizationId: session.organizationId
                    },
                    status: 'CLOSED',
                    inspector: {
                        id: session.id
                    }
                }
            },
            data: {
                analysis: req.body.analysis
            }
        })

        res.json(observation)
    }
)

export default observations
