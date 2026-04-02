import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import e1rmRoute from "./routers/workouts/e1rm/e1rm.route.js";
import greetRoute from "./routers/example/greet/greet.route.js";

const app = new Hono();

app.use(logger());
app.use(cors());

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.route("/workouts/e1rm", e1rmRoute);
app.route("/example/greet", greetRoute);

const PORT = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

export type AppType = typeof app;
