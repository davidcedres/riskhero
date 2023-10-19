import { PrismaClient } from "@prisma/client";
import { s3 } from "../s3.js";
import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";

const prismaClient = new PrismaClient();
const evidences = express.Router();

const storage = multerS3({
    s3,
    bucket: "evidences",
    acl: "public-read",
    key: function (req, file, cb) {
        // TODO: let's pray it never collides
        // gnBvowf_ViV4inQGFl0Cn.jpg
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

evidences.get("/", async (req, res) => {
    const evidences = await prismaClient.observation.findMany();
    res.json(evidences);
});

evidences.post("/", upload.single("file"), async (req, res) => {
    if (req.file === undefined) {
        return res.status(400);
    }

    const evidence = await prismaClient.evidence.create({
        data: {
            observationId: Number(req.body.observationId),
            // @ts-expect-error
            key: req.file.key,
            updatedAt: new Date(),
        },
    });

    res.json(evidence);
});

export default evidences;
