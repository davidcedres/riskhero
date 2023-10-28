import { PrismaClient } from '@prisma/client'
import express from 'express'

const prismaClient = new PrismaClient()
const categories = express.Router()

// this is a sistem resource, not owned by a particular entity
// everybody should be able to access it
categories.get('/', async (req, res) => {
    const categories = await prismaClient.category.findMany({
        include: {
            conditions: true
        }
    })

    res.json(categories)
})

export default categories
