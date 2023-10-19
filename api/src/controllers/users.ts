import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";
import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

const prismaClient = new PrismaClient();
const users = express.Router();

users.get("/", async (req, res) => {
    const users = await prismaClient.user.findMany({
        include: {
            organization: true,
        },
    });
    res.json(users);
});

users.post(
    "/",
    validateRequest({
        body: z.object({
            email: z.string().email(),
            password: z.string(),
            name: z.string(),
            role: z.union([z.literal("MANAGER"), z.literal("EMPLOYEE")]),
            organizationId: z.number(),
        }),
    }),
    async (req, res) => {
        const user = await prismaClient.user.create({
            data: {
                email: req.body.email,
                password: hashSync(
                    req.body.password,
                    Number(process.env.SALT!)
                ),
                name: req.body.name,
                role: req.body.role,
                organizationId: req.body.organizationId,
                updatedAt: new Date(),
            },
        });

        res.json(user);
    }
);

export default users;
