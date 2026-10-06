import {
  useEffect,
  useState
} from "react";

import {
  getExerciseProgress
} from "../services/progressService";

import type {
  WorkoutSet
} from "../types/Workout";

type ExercisePRStatusProps = {
  exerciseId: number;
  currentWorkoutId: number;
  currentSets: WorkoutSet[];
};

type HistoricalRecords = {
  bestWeight: number | null;
  bestEstimatedOneRepMax: number | null;
};

function ExercisePRStatus({
  exerciseId,
  currentWorkoutId,
  currentSets
}: ExercisePRStatusProps) {
  const [
    historicalRecords,
    setHistoricalRecords
  ] = useState<HistoricalRecords>({
    bestWeight: null,
    bestEstimatedOneRepMax: null
  });

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    async function loadHistoricalRecords() {
      setIsLoading(true);

      try {
        const progress =
          await getExerciseProgress(
            exerciseId
          );

        /*
          Quitamos las series del entrenamiento
          actual.

          Queremos comparar el rendimiento de hoy
          contra lo que existía ANTES de empezar
          esta sesión.
        */
        const previousSets =
          progress.history.filter(
            (item) =>
              item.workoutId !==
              currentWorkoutId
          );

        let bestWeight:
          number | null = null;

        let bestEstimatedOneRepMax:
          number | null = null;

        for (const set of previousSets) {
          if (set.weight === null) {
            continue;
          }

          const weight =
            Number(set.weight);

          if (Number.isNaN(weight)) {
            continue;
          }

          if (
            bestWeight === null ||
            weight > bestWeight
          ) {
            bestWeight = weight;
          }

          const estimatedOneRepMax =
            calculateEstimatedOneRepMax(
              weight,
              set.reps
            );

          if (
            bestEstimatedOneRepMax === null ||
            estimatedOneRepMax >
              bestEstimatedOneRepMax
          ) {
            bestEstimatedOneRepMax =
              estimatedOneRepMax;
          }
        }

        setHistoricalRecords({
          bestWeight,
          bestEstimatedOneRepMax
        });
      } catch (error) {
        console.error(
          "Failed to load exercise PRs:",
          error
        );

        setHistoricalRecords({
          bestWeight: null,
          bestEstimatedOneRepMax: null
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadHistoricalRecords();
  }, [
    exerciseId,
    currentWorkoutId
  ]);

  if (
    isLoading ||
    currentSets.length === 0
  ) {
    return null;
  }

  const weightedSets =
    currentSets.filter(
      (set) =>
        set.weight !== null
    );

  if (weightedSets.length === 0) {
    return null;
  }

  const currentBestWeight =
    Math.max(
      ...weightedSets.map(
        (set) =>
          Number(set.weight)
      )
    );

  const currentBestEstimatedOneRepMax =
    Math.max(
      ...weightedSets.map(
        (set) =>
          calculateEstimatedOneRepMax(
            Number(set.weight),
            set.reps
          )
      )
    );

  /*
    Si nunca se había registrado peso para este
    ejercicio, la primera sesión establece el
    récord inicial.
  */
  const hasWeightPR =
    historicalRecords.bestWeight === null
      ? currentBestWeight > 0
      : currentBestWeight >
        historicalRecords.bestWeight;

  const hasEstimatedOneRepMaxPR =
    historicalRecords
      .bestEstimatedOneRepMax === null
      ? currentBestEstimatedOneRepMax > 0
      : currentBestEstimatedOneRepMax >
        historicalRecords
          .bestEstimatedOneRepMax;

  if (
    !hasWeightPR &&
    !hasEstimatedOneRepMaxPR
  ) {
    return null;
  }

  return (
    <div className="exercise-pr-status">
      {hasWeightPR && (
        <span className="pr-badge">
          🏆 PR de peso ·{" "}
          {formatNumber(
            currentBestWeight
          )}{" "}
          kg
        </span>
      )}

      {hasEstimatedOneRepMaxPR && (
        <span className="pr-badge">
          🏆 PR estimado ·{" "}
          {formatNumber(
            currentBestEstimatedOneRepMax
          )}{" "}
          kg
        </span>
      )}
    </div>
  );
}

function calculateEstimatedOneRepMax(
  weight: number,
  reps: number
) {
  /*
    Fórmula de Epley:

    1RM = peso × (1 + reps / 30)
  */
  return (
    weight *
    (1 + reps / 30)
  );
}

function formatNumber(
  value: number
) {
  return new Intl.NumberFormat(
    "es-ES",
    {
      maximumFractionDigits: 1
    }
  ).format(value);
}

export default ExercisePRStatus;