import { PrismaClient } from '@prisma/client';
import express from 'express'

const prismaClient = new PrismaClient();
const users = express.Router();

users.get("/", async (req, res) => {
    const users = await prismaClient.user.findMany();
    res.json(users);
});

export default users