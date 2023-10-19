import { PrismaClient } from "@prisma/client";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import express from "express";

const prismaClient = new PrismaClient();
const inspections = express.Router();

inspections.get("/", async (req, res) => {
    const inspections = await prismaClient.inspection.findMany({
        include: {
            area: true,
            inspector: true,
        },
        orderBy: {
            date: "asc",
        },
    });

    res.json(inspections);
});

inspections.post(
    "/",
    validateRequest({
        body: z.object({
            areaId: z.number(),
            userId: z.number(),
            type: z.union([z.literal("ANNOUNCED"), z.literal("UNANNOUNCED")]),
            date: z.coerce.date(),
            status: z.union([
                z.literal("OPEN"),
                z.literal("CLOSED"),
                z.literal("DONE"),
            ]),
        }),
    }),
    async (req, res) => {
        const { areaId, userId, type, date, status } = req.body;

        const inspection = await prismaClient.inspection.create({
            data: {
                areaId,
                userId,
                type,
                date,
                status,
                updatedAt: new Date(),
            },
        });

        res.json(inspection);
    }
);

inspections.patch(
    "/:id",
    validateRequest({
        body: z.object({
            status: z.union([
                // z.literal("OPEN"),
                z.literal("CLOSED"),
                z.literal("DONE"),
            ]),
        }),
    }),
    async (req, res) => {
        const inspection = await prismaClient.inspection.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                status: req.body.status,
            },
        });

        res.json(inspection);
    }
);

export default inspections;
