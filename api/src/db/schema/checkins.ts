import {
  integer,
  pgTable,
  real,
  text,
  timestamp,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth.js";

// ─── daily_check_ins ──────────────────────────────────────────────────────────
// Morning check-in — one row per user per day.
// Drives the fatigue auto-tuning system:
//   1. At submission, the model computes predicted fatigue from decay formula
//   2. feel score is compared against the prediction
//   3. half_life_hours in user_muscle_config is nudged based on the delta
//
// Sleep multiplier applied to recovery that day:
//   good sleep (7–9h) → 1.2× recovery rate
//   poor sleep (<6h)  → 0.7× recovery rate

export const dailyCheckIns = pgTable(
  "daily_check_ins",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // Date only — no time component. One check-in per day enforced by unique constraint.
    date: date("date").notNull(),
    // Sleep hours — e.g. 7.5. Used to compute sleep multiplier for recovery.
    sleepHours: real("sleep_hours").notNull(),
    // Subjective feel score 1–5.
    //   1 = wrecked, 2 = still tired, 3 = neutral, 4 = good, 5 = fresh
    feelScore: integer("feel_score").notNull(),
    notes: text("notes"),
    // Actual submission timestamp — date is the day it represents, loggedAt is when they tapped submit.
    loggedAt: timestamp("logged_at").notNull(),
  },
  (t) => [unique().on(t.userId, t.date)]
);

export type DailyCheckIn = typeof dailyCheckIns.$inferSelect;
export type NewDailyCheckIn = typeof dailyCheckIns.$inferInsert;
