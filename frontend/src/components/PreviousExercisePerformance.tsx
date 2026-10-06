import {
  useEffect,
  useState
} from "react";

import {
  getExerciseProgress
} from "../services/progressService";

import type {
  ExerciseProgressHistoryItem
} from "../types/Progress";

type PreviousExercisePerformanceProps = {
  exerciseId: number;
  currentWorkoutId: number;
};

function PreviousExercisePerformance({
  exerciseId,
  currentWorkoutId
}: PreviousExercisePerformanceProps) {
  const [
    previousSets,
    setPreviousSets
  ] = useState<
    ExerciseProgressHistoryItem[]
  >([]);

  const [
    previousDate,
    setPreviousDate
  ] = useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    async function loadPreviousPerformance() {
      setIsLoading(true);

      try {
        const progress =
          await getExerciseProgress(
            exerciseId
          );

        /*
          El endpoint de progreso también puede
          contener las series del workout actual.

          Las excluimos porque queremos saber
          qué ocurrió ANTES de esta sesión.
        */
        const previousHistory =
          progress.history.filter(
            (item) =>
              item.workoutId !==
              currentWorkoutId
          );

        if (
          previousHistory.length === 0
        ) {
          setPreviousSets([]);
          setPreviousDate(null);

          return;
        }

        /*
          history ya viene ordenado desde el
          backend por fecha DESC.

          Por eso el primer workout que aparece
          es la última sesión anterior.
        */
        const previousWorkoutId =
          previousHistory[0].workoutId;

        const setsFromPreviousWorkout =
          previousHistory
            .filter(
              (item) =>
                item.workoutId ===
                previousWorkoutId
            )
            .sort(
              (a, b) =>
                a.setNumber -
                b.setNumber
            );

        setPreviousSets(
          setsFromPreviousWorkout
        );

        setPreviousDate(
          previousHistory[0]
            .performedAt
        );
      } catch (error) {
        console.error(
          "Failed to load previous exercise performance:",
          error
        );

        setPreviousSets([]);
        setPreviousDate(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadPreviousPerformance();
  }, [
    exerciseId,
    currentWorkoutId
  ]);

  if (isLoading) {
    return (
      <div className="previous-performance">
        <span className="previous-performance-label">
          Última sesión
        </span>

        <p>
          Cargando referencia...
        </p>
      </div>
    );
  }

  if (
    previousSets.length === 0 ||
    !previousDate
  ) {
    return (
      <div className="previous-performance">
        <span className="previous-performance-label">
          Última sesión
        </span>

        <p>
          Aún no tienes registros anteriores
          de este ejercicio.
        </p>
      </div>
    );
  }

  const formattedDate =
    new Date(
      previousDate
    ).toLocaleDateString(
      "es-ES",
      {
        day: "numeric",
        month: "short"
      }
    );

  return (
    <div className="previous-performance">
      <div className="previous-performance-header">
        <span className="previous-performance-label">
          Última sesión
        </span>

        <span className="previous-performance-date">
          {formattedDate}
        </span>
      </div>

      <div className="previous-performance-sets">
        {previousSets.map(
          (set) => (
            <span
              key={set.setId}
              className="previous-performance-set"
            >
              {set.weight !== null
                ? `${set.weight} kg`
                : "Sin peso"}
              {" × "}
              {set.reps}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export default PreviousExercisePerformance;