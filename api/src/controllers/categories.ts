import { PrismaClient } from "@prisma/client";
import express from "express";

const prismaClient = new PrismaClient();
const categories = express.Router();

categories.get("/", async (req, res) => {
    const categories = await prismaClient.category.findMany({
        include: {
            conditions: true,
        },
    });

    res.json(categories);
});

export default categories;
