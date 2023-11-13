import { PrismaClient } from '@prisma/client'
import express from 'express'
import { Request } from 'express-jwt'
import { nanoid } from 'nanoid'
import puppeteer from 'puppeteer'

import { User } from '../interfaces.js'
import { minioClient, s3 } from '../s3.js'

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
    // validateRequest({
    //     body: z.object({
    //         inspectionId: z.number(),
    //         conclusion: z.string()
    //     })
    // }),
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

        const browser = await puppeteer.connect({
            browserWSEndpoint:
                'wss://chrome.browserless.io?token=65d1263e-b3e4-4864-a7a6-f9f9ec247d55'
        })

        const page = await browser.newPage()
        await page.goto('https://riskninja.io/start')
        await page.type('input[type="email"]', 'admin@riskninja.io')
        await page.type('input[type="password"]', 'Password.123')
        await page.goto('https://riskninja.io/reports/' + report.id, {
            waitUntil: 'networkidle0'
        })
        const pdf = await page.pdf()

        const key = `${nanoid()}.pdf`
        await s3.putObject({
            Bucket: 'reports',
            Key: key,
            Body: pdf,
            ContentType: 'application/pdf'
        })

        await prismaClient.report.update({
            where: {
                id: report.id
            },
            data: {
                url: await minioClient.presignedGetObject('reports', key)
            }
        })

        res.json(report)
    }
)

export default reports
