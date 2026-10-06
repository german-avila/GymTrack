import {
  useEffect,
  useState
} from "react";

import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";
import type { Workout } from "../types/Workout";

import {
  getExercises
} from "../services/exerciseService";

import {
  getRoutines
} from "../services/routineService";

import {
  getWorkouts
} from "../services/workoutService";

function HomePage() {
  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [routines, setRoutines] =
    useState<Routine[]>([]);

  const [workouts, setWorkouts] =
    useState<Workout[]>([]);

  const [error, setError] =
    useState<string | null>(null);

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

      setError(
        "No se pudo cargar el resumen."
      );
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const latestWorkout =
    workouts.length > 0
      ? workouts[0]
      : null;

  return (
    <main className="page-content">
      <header className="page-hero">
        <div>
          <span className="page-kicker">
            GymTrack
          </span>

          <h1>
            Tu entrenamiento,
            <br />
            en números.
          </h1>

          <p>
            Registra sesiones, organiza tus
            rutinas y comprueba cómo progresas.
          </p>
        </div>

        <div className="hero-mark">
          GT
        </div>
      </header>

      {error && (
        <p className="page-error">
          {error}
        </p>
      )}

      <section className="home-metrics">
        <div className="home-metric">
          <strong>
            {exercises.length}
          </strong>

          <span>
            ejercicios
          </span>
        </div>

        <div className="home-metric">
          <strong>
            {routines.length}
          </strong>

          <span>
            rutinas
          </span>
        </div>

        <div className="home-metric">
          <strong>
            {workouts.length}
          </strong>

          <span>
            sesiones
          </span>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span>
              Actividad reciente
            </span>

            <h2>
              Último entrenamiento
            </h2>
          </div>
        </div>

        {latestWorkout ? (
          <article className="latest-session">
            <div className="latest-session-date">
              <strong>
                {new Date(
                  latestWorkout.performedAt
                ).toLocaleDateString(
                  "es-ES",
                  {
                    day: "2-digit"
                  }
                )}
              </strong>

              <span>
                {new Date(
                  latestWorkout.performedAt
                ).toLocaleDateString(
                  "es-ES",
                  {
                    month: "short"
                  }
                )}
              </span>
            </div>

            <div className="latest-session-main">
              <h3>
                {latestWorkout.routineId ===
                null
                  ? "Entrenamiento libre"
                  : `Rutina ${latestWorkout.routineId}`}
              </h3>

              <p>
                {new Date(
                  latestWorkout.performedAt
                ).toLocaleTimeString(
                  "es-ES",
                  {
                    hour: "2-digit",
                    minute: "2-digit"
                  }
                )}
              </p>
            </div>

            <div className="latest-session-status">
              {latestWorkout.status ===
              "active"
                ? "En curso"
                : "Completado"}
            </div>

            {latestWorkout.notes && (
              <p className="latest-session-notes">
                {latestWorkout.notes}
              </p>
            )}
          </article>
        ) : (
          <div className="empty-state">
            <p>
              Todavía no hay entrenamientos
              registrados.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;