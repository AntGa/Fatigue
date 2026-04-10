import {
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { muscleGroups } from "./muscles.js";
import { user } from "./auth.js";

// ─── user_muscle_config ───────────────────────────────────────────────────────
// One row per user per muscle group, seeded with defaults on signup.
// This is the single source of truth for fatigue model parameters —
// no fallback join to muscle_groups needed.

export const userMuscleConfig = pgTable(
  "user_muscle_config",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    muscleGroupId: text("muscle_group_id")
      .notNull()
      .references(() => muscleGroups.id),
    // Time in hours for fatigue to halve. Auto-tuned by the check-in system.
    halfLifeHours: real("half_life_hours").notNull(),
    // Maximum recoverable volume — weekly hard sets this pool represents.
    // One set costs 1/mrv of the pool at RPE 8 baseline.
    mrv: real("mrv").notNull(),
  },
  (t) => [unique().on(t.userId, t.muscleGroupId)]
);

export type UserMuscleConfig = typeof userMuscleConfig.$inferSelect;
export type NewUserMuscleConfig = typeof userMuscleConfig.$inferInsert;

// ─── fatigue_events ───────────────────────────────────────────────────────────
// Append-only log of fatigue level per muscle at a point in time.
// Never updated — new rows are inserted on every recalculation.
// The auto-tuning system compares predicted levels against check-in feel scores
// using this history to adjust half_life_hours over time.

export const fatigueEventSource = pgEnum("fatigue_event_source", [
  "workout", // depleted by a set
  "run", // depleted by a run
  "decay", // scheduled decay snapshot (no activity)
  "checkin", // recalculated after morning check-in
]);

export const fatigueEvents = pgTable("fatigue_events", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  muscleGroupId: text("muscle_group_id")
    .notNull()
    .references(() => muscleGroups.id),
  // Fatigue level 0–1. 0 = fully fresh, 1 = at MRV.
  fatigueLevel: real("fatigue_level").notNull(),
  // For checkin events: what the decay model predicted before the user reported
  // their feel score. Used to calculate the tuning delta.
  predictedLevel: real("predicted_level"),
  source: fatigueEventSource("source").notNull(),
  loggedAt: timestamp("logged_at").notNull(),
});

export type FatigueEvent = typeof fatigueEvents.$inferSelect;
export type NewFatigueEvent = typeof fatigueEvents.$inferInsert;
