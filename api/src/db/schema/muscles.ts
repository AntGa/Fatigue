import { boolean, integer, pgTable, real, text } from "drizzle-orm/pg-core";

export const muscleGroups = pgTable("muscle_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  // Recovery half-life in hours — how long until ~50% of fatigue clears.
  // Tuned per-user in user_muscle_config; these are the system defaults.
  defaultHalfLifeHours: real("default_half_life_hours").notNull(),
  // Sentinel flag for the CNS pool — treated as a muscle group everywhere
  // in the fatigue model but has no exercise muscle mapping.
  isCns: boolean("is_cns").notNull().default(false),
  // UI display order
  sortOrder: integer("sort_order").notNull(),
});

export type MuscleGroup = typeof muscleGroups.$inferSelect;
export type NewMuscleGroup = typeof muscleGroups.$inferInsert;

// ─── Seed data ───────────────────────────────────────────────────────────────
// Half-life defaults are conservative estimates — the daily check-in system
// auto-tunes these per user over time.

export const defaultMuscleGroups: NewMuscleGroup[] = [
  // CNS sentinel — depleted by heavy compounds and high-intensity runs
  {
    id: "cns",
    name: "CNS",
    defaultHalfLifeHours: 48,
    isCns: true,
    sortOrder: 0,
  },

  // Upper body
  {
    id: "chest",
    name: "Chest",
    defaultHalfLifeHours: 60,
    isCns: false,
    sortOrder: 1,
  },
  {
    id: "back",
    name: "Back",
    defaultHalfLifeHours: 72,
    isCns: false,
    sortOrder: 2,
  },
  {
    id: "shoulders",
    name: "Shoulders",
    defaultHalfLifeHours: 48,
    isCns: false,
    sortOrder: 3,
  },
  {
    id: "biceps",
    name: "Biceps",
    defaultHalfLifeHours: 48,
    isCns: false,
    sortOrder: 4,
  },
  {
    id: "triceps",
    name: "Triceps",
    defaultHalfLifeHours: 48,
    isCns: false,
    sortOrder: 5,
  },
  {
    id: "forearms",
    name: "Forearms",
    defaultHalfLifeHours: 36,
    isCns: false,
    sortOrder: 6,
  },

  // Core
  {
    id: "abs",
    name: "Abs",
    defaultHalfLifeHours: 48,
    isCns: false,
    sortOrder: 7,
  },
  {
    id: "lower_back",
    name: "Lower Back",
    defaultHalfLifeHours: 96,
    isCns: false,
    sortOrder: 8,
  },

  // Lower body
  {
    id: "quads",
    name: "Quads",
    defaultHalfLifeHours: 72,
    isCns: false,
    sortOrder: 9,
  },
  {
    id: "hamstrings",
    name: "Hamstrings",
    defaultHalfLifeHours: 72,
    isCns: false,
    sortOrder: 10,
  },
  {
    id: "glutes",
    name: "Glutes",
    defaultHalfLifeHours: 72,
    isCns: false,
    sortOrder: 11,
  },
  {
    id: "calves",
    name: "Calves",
    defaultHalfLifeHours: 48,
    isCns: false,
    sortOrder: 12,
  },
];
