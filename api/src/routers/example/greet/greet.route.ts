import { Hono } from "hono";
import { greet } from "./greet.service.js";

const greetRouter = new Hono();

greetRouter.get("/:name", (c) => {
  const message = greet(c.req.param("name"));
  return c.json({ message });
});

export default greetRouter;
