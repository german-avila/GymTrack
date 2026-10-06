import { useEffect, useState } from "react";

import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";
import type { Workout } from "../types/Workout";

import { getExercises } from "../services/exerciseService";
import { getRoutines } from "../services/routineService";
import { getWorkouts } from "../services/workoutService";

function HomePage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboardData() {
    try {
      const [
        exercisesData,
        routinesData,
        workoutsData
      ] = await Promise.all([
        getExercises(),
        getRoutines(),
        getWorkouts()
      ]);

      setExercises(exercisesData);
      setRoutines(routinesData);
      setWorkouts(workoutsData);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("No se pudo cargar el resumen.");
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const latestWorkout =
    workouts.length > 0 ? workouts[0] : null;

  return (
    <section>
      <div className="dashboard-header">
        <div>
          <span className="workout-date-label">
            Resumen
          </span>

          <h2>Inicio</h2>

          <p>
            Una vista rápida de tu actividad en GymTrack.
          </p>
        </div>
      </div>

      {error && <p>{error}</p>}

      <div className="dashboard-stats">
        <article className="stat-card">
          <span className="stat-label">
            Ejercicios
          </span>

          <strong className="stat-value">
            {exercises.length}
          </strong>

          <p>Ejercicios disponibles</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">
            Rutinas
          </span>

          <strong className="stat-value">
            {routines.length}
          </strong>

          <p>Rutinas creadas</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">
            Entrenamientos
          </span>

          <strong className="stat-value">
            {workouts.length}
          </strong>

          <p>Sesiones registradas</p>
        </article>
      </div>

      <div className="dashboard-section">
        <h3>Último entrenamiento</h3>

        {latestWorkout ? (
          <article className="latest-workout-card">
            <div>
              <span className="workout-date-label">
                Última sesión
              </span>

              <h3>
                {new Date(
                  latestWorkout.performedAt
                ).toLocaleDateString("es-ES")}
              </h3>

              <p>
                {new Date(
                  latestWorkout.performedAt
                ).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>

            <div>
              <span className="workout-badge">
                {latestWorkout.routineId === null
                  ? "Entrenamiento libre"
                  : `Rutina ${latestWorkout.routineId}`}
              </span>

              {latestWorkout.notes && (
                <p className="latest-workout-notes">
                  {latestWorkout.notes}
                </p>
              )}
            </div>
          </article>
        ) : (
          <div className="empty-state">
            <p>
              Todavía no hay entrenamientos registrados.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default HomePage;