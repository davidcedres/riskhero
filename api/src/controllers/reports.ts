import { PrismaClient } from '@prisma/client'
import express from 'express'
import { Request } from 'express-jwt'
import { merge } from 'lodash-es'
import { User } from '../interfaces.js'
import { validateRequest } from 'zod-express-middleware'
import { z } from 'zod'

const prismaClient = new PrismaClient()
const reports = express.Router()

reports.get('/', async (req: Request<User>, res) => {
    const session = req.auth!

    const reports = await prismaClient.report.findMany({
        where: {
            inspection: {
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
            }
        },
        include: {
            inspection: {
                include: {
                    inspector: true,
                    area: true
                }
            }
        }
    })

    res.json(reports)
})

reports.get('/:id', async (req: Request<User>, res) => {
    const session = req.auth!

    const report = await prismaClient.report.findFirstOrThrow({
        where: {
            id: Number(req.params.id),
            inspection: {
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
            }
        },
        include: {
            inspection: {
                include: {
                    inspector: true,
                    area: true
                }
            }
        }
    })

    res.json(report)
})

reports.post(
    '/',
    validateRequest({
        body: z.object({
            inspectionId: z.number(),
            conclusion: z.string()
        })
    }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        if (session.role !== 'EMPLOYEE') return res.status(401)

        await prismaClient.inspection.findFirstOrThrow({
            where: {
                id: req.body.inspectionId,
                status: {
                    not: 'CLOSED'
                },
                inspector: {
                    id: session.id
                },
                area: {
                    organizationId: session.organizationId
                }
            }
        })

        const report = await prismaClient.report.create({
            data: {
                inspectionId: req.body.inspectionId,
                conclusion: req.body.conclusion,
                createdAt: new Date()
            }
        })

        res.json(report)
    }
)

export default reports
