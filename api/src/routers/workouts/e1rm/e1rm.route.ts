import { Hono } from "hono";
import { calculateE1RM } from "./e1rm.service.js";

const workouts = new Hono();

workouts.post("/e1rm", async (c) => {
  const { weight, reps, rpe } = await c.req.json<{
    weight: number;
    reps: number;
    rpe: number;
  }>();

  const e1rm = calculateE1RM(weight, reps, rpe);
  return c.json({ e1rm });
});

export default workouts;
