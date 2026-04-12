import "dotenv/config";
import { db } from "../db.js";
import { user } from "../schema/auth.js";
import { muscleGroups, defaultMuscleGroups } from "../schema/muscles.js";
import { seedUserMuscleConfig } from "./seedUserMuscleConfig.js";

async function seed() {
  console.log("Seeding muscle_groups...");
  await db
    .insert(muscleGroups)
    .values(defaultMuscleGroups)
    .onConflictDoNothing();
  console.log(`  inserted ${defaultMuscleGroups.length} muscle groups`);

  console.log("Backfilling user_muscle_config for existing users...");
  const existingUsers = await db.select({ id: user.id }).from(user);
  for (const u of existingUsers) {
    await seedUserMuscleConfig(u.id);
    console.log(`  seeded config for user ${u.id}`);
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
