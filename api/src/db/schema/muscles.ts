import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

export const muscleGroups = pgTable("muscle_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  // Sentinel flag for the CNS pool — treated as a muscle group everywhere
  // in the fatigue model but has no exercise muscle mapping.
  isCns: boolean("is_cns").notNull().default(false),
  // UI display order
  sortOrder: integer("sort_order").notNull(),
});

export type MuscleGroup = typeof muscleGroups.$inferSelect;
export type NewMuscleGroup = typeof muscleGroups.$inferInsert;

// ─── Seed data ───────────────────────────────────────────────────────────────

export const defaultMuscleGroups: NewMuscleGroup[] = [
  { id: "cns", name: "CNS", isCns: true, sortOrder: 0 },
  { id: "chest", name: "Chest", isCns: false, sortOrder: 1 },
  { id: "back", name: "Back", isCns: false, sortOrder: 2 },
  { id: "shoulders", name: "Shoulders", isCns: false, sortOrder: 3 },
  { id: "biceps", name: "Biceps", isCns: false, sortOrder: 4 },
  { id: "triceps", name: "Triceps", isCns: false, sortOrder: 5 },
  { id: "forearms", name: "Forearms", isCns: false, sortOrder: 6 },
  { id: "abs", name: "Abs", isCns: false, sortOrder: 7 },
  { id: "lower_back", name: "Lower Back", isCns: false, sortOrder: 8 },
  { id: "quads", name: "Quads", isCns: false, sortOrder: 9 },
  { id: "hamstrings", name: "Hamstrings", isCns: false, sortOrder: 10 },
  { id: "glutes", name: "Glutes", isCns: false, sortOrder: 11 },
  { id: "calves", name: "Calves", isCns: false, sortOrder: 12 },
];

// Default config seeded into user_muscle_config on signup.
// halfLifeHours: time in hours for fatigue to halve (exponential decay).
// mrv: maximum recoverable volume — weekly hard sets the pool represents.
export const defaultMuscleConfig: Record<
  string,
  { halfLifeHours: number; mrv: number }
> = {
  cns: { halfLifeHours: 48, mrv: 0 }, // CNS has no set-count MRV
  chest: { halfLifeHours: 60, mrv: 14 },
  back: { halfLifeHours: 72, mrv: 20 },
  shoulders: { halfLifeHours: 48, mrv: 16 },
  biceps: { halfLifeHours: 48, mrv: 16 },
  triceps: { halfLifeHours: 48, mrv: 14 },
  forearms: { halfLifeHours: 36, mrv: 18 },
  abs: { halfLifeHours: 48, mrv: 16 },
  lower_back: { halfLifeHours: 96, mrv: 10 },
  quads: { halfLifeHours: 72, mrv: 18 },
  hamstrings: { halfLifeHours: 72, mrv: 16 },
  glutes: { halfLifeHours: 72, mrv: 18 },
  calves: { halfLifeHours: 48, mrv: 18 },
};
