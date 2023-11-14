import { PrismaClient } from '@prisma/client'
import { Queue, Worker } from 'bullmq'
import express from 'express'
import { Request } from 'express-jwt'
import { nanoid } from 'nanoid'
import puppeteer, { Browser } from 'puppeteer'

import { User } from '../interfaces.js'
import { minioClient, s3 } from '../s3.js'

const prismaClient = new PrismaClient()
const reports = express.Router()

const queue = new Queue('reports', {
    connection: {
        host: process.env.REDISHOST,
        port: Number(process.env.REDISPORT),
        username: process.env.REDISUSER,
        password: process.env.REDISPASSWORD
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    }
})

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
                status: 'DONE', // previous action
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

        queue.add('generate-pdf', {
            reportId: report.id
        })

        res.status(200).send()
    }
)

new Worker('reports', async (job) => {
    console.log('job to be executed ', job.name)

    const reportId = job.data.reportId

    let browser: Browser | null = null
    let error = false

    try {
        browser = await puppeteer.connect({
            browserWSEndpoint:
                'wss://chrome.browserless.io?token=65d1263e-b3e4-4864-a7a6-f9f9ec247d55'
        })

        const page = await browser.newPage()

        await page.goto('https://riskninja.io/start', {
            waitUntil: 'networkidle0'
        })

        await page.type('input[name="email"]', 'admin@riskninja.io')
        await page.type('input[name="password"]', 'Password.123')
        await page.click('button[type="submit"]')
        await page.waitForNetworkIdle()

        await page.goto('https://riskninja.io/reports/' + reportId, {
            waitUntil: 'networkidle0'
        })

        const pdf = await page.pdf({
            margin: {
                left: 32,
                top: 32,
                right: 32,
                bottom: 32
            },
            printBackground: true
        })

        const key = `${nanoid()}.pdf`

        await s3.putObject({
            Bucket: 'reports',
            Key: key,
            Body: pdf,
            ContentType: 'application/pdf'
        })

        const url = await minioClient.presignedGetObject('reports', key)

        await prismaClient.report.update({
            where: {
                id: reportId
            },
            data: {
                url
            }
        })
    } catch (e) {
        error = true
        console.log('job failed')
    } finally {
        if (browser) browser.close()
    }

    // make the job fail
    if (error) throw new Error()
})

export default reports
