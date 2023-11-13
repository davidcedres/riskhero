import { PrismaClient } from '@prisma/client'
import express from 'express'
import { Request } from 'express-jwt'

import { User } from '../interfaces.js'
// import { z } from 'zod'

const prismaClient = new PrismaClient()
const areas = express.Router()

areas.get('/', async (req: Request<User>, res) => {
    const session = req.auth!

    if (session.role !== 'MANAGER') return res.status(401)

    const areas = await prismaClient.area.findMany({
        where: {
            organizationId: session.organizationId
        },
        orderBy: {
            name: 'asc'
        }
    })

    res.json(areas)
})

areas.post(
    '/',
    // validateRequest({
    //     body: z.object({
    //         name: z.string()
    //     })
    // }),
    async (req: Request<User>, res) => {
        const session = req.auth!

        if (session.role !== 'MANAGER') return res.status(401)

        const area = await prismaClient.area.create({
            data: {
                name: req.body.name,
                organizationId: session.organizationId,
                updatedAt: new Date()
            }
        })

        return res.json(area)
    }
)

export default areas
