import { PrismaClient } from "@prisma/client";
import express from "express";
import { merge } from "lodash-es";

const prismaClient = new PrismaClient();
const reports = express.Router();

reports.get("/", async (req, res) => {
    const reports = await prismaClient.report.findMany({
        include: {
            inspection: {
                include: {
                    inspector: true,
                    area: true,
                },
            },
        },
    });
    res.json(reports);
});

reports.get("/:id", async (req, res) => {
    const report = await prismaClient.report.findFirstOrThrow({
        where: {
            id: Number(req.params.id),
        },
        include: {
            inspection: {
                include: {
                    inspector: true,
                    area: true,
                },
            },
        },
    });

    res.json(report);
});

reports.post("/", async (req, res) => {
    const report = await prismaClient.report.create({
        data: merge(req.body, { createdAt: new Date() }),
    });

    res.json(report);
});

export default reports;
