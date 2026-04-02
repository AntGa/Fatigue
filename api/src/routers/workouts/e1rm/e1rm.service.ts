export function calculateE1RM(
  weight: number,
  reps: number,
  rpe: number
): number {
  const rir = 10 - rpe;
  const effectiveReps = reps + rir;
  return weight * (1 + effectiveReps / 30);
}
