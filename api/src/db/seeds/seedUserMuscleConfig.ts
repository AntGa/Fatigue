import { db } from "../db.js";
import {
  userMuscleConfig,
  defaultMuscleGroups,
  defaultMuscleConfig,
} from "../schema/index.js";

// Inserts one user_muscle_config row per muscle group for a new user,
// using the system defaults from defaultMuscleConfig.
// Called from the better-auth databaseHooks.user.create.after hook.
export async function seedUserMuscleConfig(userId: string): Promise<void> {
  const rows = defaultMuscleGroups.map((muscle) => {
    const config = defaultMuscleConfig[muscle.id];
    return {
      id: `${userId}_${muscle.id}`,
      userId,
      muscleGroupId: muscle.id,
      halfLifeHours: config.halfLifeHours,
      mrv: config.mrv,
    };
  });

  await db.insert(userMuscleConfig).values(rows);
}
