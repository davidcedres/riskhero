import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Set up Prisma client
const prismaClient = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/users", async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany();
  res.json(users);
});

app.post("/users", async (req: Request, res: Response) => {
  const { email, name, role } = req.body;
  const user = await prismaClient.user.create({
    data: {
      email,
      name,
      role,
    },
  });
  res.json(user);
});

app.get("/areas", async (req: Request, res: Response) => {
  const areas = await prismaClient.area.findMany();
  res.json(areas);
});

app.post("/areas", async (req: Request, res: Response) => {
  const { name } = req.body;
  const area = await prismaClient.area.create({
    data: {
      name,
    },
  });
  res.json(area);
});

app.get("/inspections", async (req: Request, res: Response) => {
  const inspections = await prismaClient.inspection.findMany();
  res.json(inspections);
});

app.post("/inspections", async (req: Request, res: Response) => {
  const { areaId, inspectorId, type, date } = req.body;
  const inspection = await prismaClient.inspection.create({
    data: {
      areaId,
      inspectorId,
      type,
      date,
    },
  });
  res.json(inspection);
});

app.get("/observations", async (req: Request, res: Response) => {
  const observations = await prismaClient.observation.findMany();
  res.json(observations);
});

app.post("/observations", async (req: Request, res: Response) => {
  const { inspectionId, conditionId, state } = req.body;
  const observation = await prismaClient.observation.create({
    data: {
      inspectionId,
      conditionId,
      state,
    },
  });
  res.json(observation);
});

app.get("/categories", async (req: Request, res: Response) => {
  const categories = await prismaClient.category.findMany();
  res.json(categories);
});

app.post("/categories", async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = await prismaClient.category.create({
    data: {
      name,
    },
  });
  res.json(category);
});

app.get("/conditions", async (req: Request, res: Response) => {
  const conditions = await prismaClient.condition.findMany();
  res.json(conditions);
});

app.post("/conditions", async (req: Request, res: Response) => {
  const { name } = req.body;
  const condition = await prismaClient.condition.create({
    data: {
      name,
    },
  });
  res.json(condition);
});

app.get("/evidences", async (req: Request, res: Response) => {
  const evidences = await prismaClient.evidence.findMany();
  res.json(evidences);
});

app.post("/evidences", async (req: Request, res: Response) => {
  const { observationId, url } = req.body;
  const evidence = await prismaClient.evidence.create({
    data: {
      observationId,
      url,
    },
  });
  res.json(evidence);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
