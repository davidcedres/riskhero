import { PrismaClient } from "@prisma/client";
import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

const prismaClient = new PrismaClient();
const observations = express.Router();

observations.get("/", async (req, res) => {
    const { inspectionId } = req.query;

    const observations = await prismaClient.observation.findMany({
        where: {
            inspectionId: Number(inspectionId),
        },
        include: {
            category: true,
            condition: true,
        },
    });

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

observations.patch(
    "/:id",
    validateRequest({
        body: z.object({
            analysis: z.string(),
        }),
    }),
    async (req, res) => {
        // const observation = await prismaClient.observation.findFirstOrThrow({
        //     where: {
        //         id: 15,
        //     },
        //     include: {
        //         inspection: true,
        //     },
        // });

        // NOT FOUND
        // if (observation === null) return res.status(404);

        // NOT ALLOWED
        // if (observation.inspection.status === "CLOSED") return res.status(401);

        const observation = await prismaClient.observation.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                analysis: req.body.analysis,
            },
        });

        res.json(observation);
    }
);

export default observations;
