export const MUSCLE_GROUPS = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Cuádriceps",
  "Isquiotibiales",
  "Glúteos",
  "Gemelos",
  "Core",
  "Antebrazos"
] as const;

export function isValidMuscleGroup(
  muscleGroup: string
): boolean {
  return MUSCLE_GROUPS.includes(
    muscleGroup as typeof MUSCLE_GROUPS[number]
  );
}