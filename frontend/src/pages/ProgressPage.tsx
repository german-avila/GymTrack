import { useEffect, useState } from "react";

import type { Exercise } from "../types/Exercise";
import type { ExerciseProgress } from "../types/Progress";

import { getExercises } from "../services/exerciseService";
import { getExerciseProgress } from "../services/progressService";

function ProgressPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] =
    useState<string>("");

  const [progress, setProgress] =
    useState<ExerciseProgress | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function loadExercises() {
    try {
      const data = await getExercises();
      setExercises(data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los ejercicios.");
    }
  }

  async function loadProgress(exerciseId: number) {
    try {
      const data = await getExerciseProgress(exerciseId);

      setProgress(data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("No se pudo cargar el progreso.");
    }
  }

  useEffect(() => {
    loadExercises();
  }, []);

  function handleExerciseChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = event.target.value;

    setSelectedExerciseId(value);

    if (value === "") {
      setProgress(null);
      return;
    }

    loadProgress(Number(value));
  }

  return (
    <section>
      <div className="dashboard-header">
        <div>
          <span className="workout-date-label">
            Estadísticas
          </span>

          <h2>Progreso</h2>

          <p>
            Consulta tu evolución por ejercicio.
          </p>
        </div>
      </div>

      <div className="exercise-form">
        <div className="form-group">
          <label htmlFor="progress-exercise">
            Ejercicio
          </label>

          <select
            id="progress-exercise"
            value={selectedExerciseId}
            onChange={handleExerciseChange}
          >
            <option value="">
              Selecciona un ejercicio
            </option>

            {exercises.map((exercise) => (
              <option
                key={exercise.id}
                value={exercise.id}
              >
                {exercise.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p>{error}</p>}

      {progress && (
        <>
          <div className="dashboard-stats">
            <article className="stat-card">
              <span className="stat-label">
                Entrenamientos
              </span>

              <strong className="stat-value">
                {progress.summary.workoutCount}
              </strong>

              <p>Sesiones con este ejercicio</p>
            </article>

            <article className="stat-card">
              <span className="stat-label">
                Series
              </span>

              <strong className="stat-value">
                {progress.summary.setCount}
              </strong>

              <p>Series registradas</p>
            </article>

            <article className="stat-card">
              <span className="stat-label">
                Mejor peso
              </span>

              <strong className="stat-value">
                {progress.summary.bestWeight ?? "-"}
              </strong>

              <p>kg</p>
            </article>

            <article className="stat-card">
              <span className="stat-label">
                Mejores reps
              </span>

              <strong className="stat-value">
                {progress.summary.bestReps ?? "-"}
              </strong>

              <p>repeticiones</p>
            </article>
          </div>

          <div className="dashboard-section">
            <h3>Historial</h3>

            {progress.history.length === 0 ? (
              <div className="empty-state">
                <p>
                  No hay series registradas para este ejercicio.
                </p>
              </div>
            ) : (
              <div className="progress-history">
                {progress.history.map((item) => (
                  <div
                    className="progress-history-row"
                    key={item.setId}
                  >
                    <div>
                      <strong>
                        {new Date(
                          item.performedAt
                        ).toLocaleDateString("es-ES")}
                      </strong>

                      <p>
                        Serie {item.setNumber}
                      </p>
                    </div>

                    <div>
                      <strong>
                        {item.reps} reps
                      </strong>

                      <p>
                        {item.weight !== null
                          ? `${item.weight} kg`
                          : "Sin peso"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default ProgressPage;