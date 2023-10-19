import { PrismaClient } from "@prisma/client";
import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

const prismaClient = new PrismaClient();
const observations = express.Router();

observations.get("/", async (req, res) => {
    const observations = await prismaClient.observation.findMany();
    res.json(observations);
});

observations.post(
    "/",
    validateRequest({
        body: z.object({
            state: z.union([
                z.literal("ACCEPTABLE"),
                z.literal("UNSAFE"),
                z.literal("MISSING"),
                z.literal("NEEDS_REPAIR"),
                z.literal("SKIPPED"),
            ]),
            description: z.string(),
            inspectionId: z.number(),
            categoryId: z.number(),
            conditionId: z.number(),
        }),
    }),
    async (req, res) => {
        const observation = await prismaClient.observation.create({
            data: { ...req.body, updatedAt: new Date() },
        });
        res.json(observation);
    }
);

export default observations;
