import { PrismaClient } from '@prisma/client';
import express from 'express'

const prismaClient = new PrismaClient();
const areas = express.Router();

areas.get("/", async (req, res) => {
    const areas = await prismaClient.area.findMany({
        orderBy: {
            name: 'asc'
        }
    });
    res.json(areas);
});

export default areas