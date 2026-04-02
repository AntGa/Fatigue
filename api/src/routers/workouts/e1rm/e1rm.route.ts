import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { calculateE1RM } from "./e1rm.service.js";

const workouts = new Hono();

const e1rmSchema = z.object({
  weight: z.number().positive(),
  reps: z.number().int().positive(),
  rpe: z.number().min(1).max(10),
});

workouts.post("/", zValidator("json", e1rmSchema), (c) => {
  const { weight, reps, rpe } = c.req.valid("json");
  const e1rm = calculateE1RM(weight, reps, rpe);
  return c.json({ e1rm });
});

export default workouts;
