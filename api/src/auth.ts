import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { db } from "./db/db.js";
import * as schema from "./db/schema/index.js";
import { seedUserMuscleConfig } from "./db/seeds/seedUserMuscleConfig.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "fatigue://",
    ...(process.env.NODE_ENV === "development"
      ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"]
      : []),
  ],
  plugins: [expo()],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await seedUserMuscleConfig(user.id);
        },
      },
    },
  },
});
