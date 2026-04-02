export function calculateE1RM(
  weight: number,
  reps: number,
  rpe: number
): number {
  if (weight <= 0) throw new RangeError("Weight must be positive");
  if (reps <= 0) throw new RangeError("Reps must be positive");
  if (rpe < 1 || rpe > 10) throw new RangeError("RPE must be between 1 and 10");

  const rir = 10 - rpe;
  const effectiveReps = reps + rir;
  return weight * (1 + effectiveReps / 30);
}
