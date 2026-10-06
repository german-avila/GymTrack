import { useEffect, useState } from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import AlertMessage from "../components/AlertMessage";

import type { Exercise } from "../types/Exercise";
import type { ExerciseProgress } from "../types/Progress";

import { getExercises } from "../services/exerciseService";
import { getExerciseProgress } from "../services/progressService";

function ProgressPage() {
  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [
    selectedExerciseId,
    setSelectedExerciseId
  ] = useState<string>("");

  const [progress, setProgress] =
    useState<ExerciseProgress | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  async function loadExercises() {
    try {
      const data = await getExercises();

      setExercises(data);
      setError(null);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar los ejercicios."
      );
    }
  }

  async function loadProgress(
    exerciseId: number
  ) {
    try {
      const data =
        await getExerciseProgress(
          exerciseId
        );

      setProgress(data);
      setError(null);
    } catch (error) {
      console.error(error);

      setProgress(null);

      setError(
        "No se pudo cargar el progreso del ejercicio."
      );
    }
  }

  useEffect(() => {
    loadExercises();
  }, []);

  function handleExerciseChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value =
      event.target.value;

    setSelectedExerciseId(value);

    if (value === "") {
      setProgress(null);
      setError(null);

      return;
    }

    loadProgress(
      Number(value)
    );
  }

  let chartData: {
    date: string;
    weight: number;
  }[] = [];

  if (progress) {
    const bestWeightByWorkout =
      new Map<
        number,
        {
          performedAt: string;
          weight: number;
        }
      >();

    for (
      const item of progress.history
    ) {
      if (item.weight === null) {
        continue;
      }

      const weight =
        Number(item.weight);

      const currentBest =
        bestWeightByWorkout.get(
          item.workoutId
        );

      if (
        !currentBest ||
        weight > currentBest.weight
      ) {
        bestWeightByWorkout.set(
          item.workoutId,
          {
            performedAt:
              item.performedAt,
            weight
          }
        );
      }
    }

    chartData = Array.from(
      bestWeightByWorkout.values()
    )
      .sort(
        (a, b) =>
          new Date(
            a.performedAt
          ).getTime() -
          new Date(
            b.performedAt
          ).getTime()
      )
      .map((item) => ({
        date: new Date(
          item.performedAt
        ).toLocaleDateString(
          "es-ES"
        ),
        weight: item.weight
      }));
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
            Consulta tu evolución y tus
            mejores marcas por ejercicio.
          </p>
        </div>
      </div>

      {error && (
        <AlertMessage
          type="error"
          message={error}
        />
      )}

      <div className="exercise-form">
        <div className="form-group">
          <label htmlFor="progress-exercise">
            Ejercicio
          </label>

          <select
            id="progress-exercise"
            value={selectedExerciseId}
            onChange={
              handleExerciseChange
            }
          >
            <option value="">
              Selecciona un ejercicio
            </option>

            {exercises.map(
              (exercise) => (
                <option
                  key={exercise.id}
                  value={exercise.id}
                >
                  {exercise.name}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {!progress &&
        selectedExerciseId === "" && (
          <div className="empty-state">
            <p>
              Selecciona un ejercicio para
              consultar sus estadísticas.
            </p>
          </div>
        )}

      {progress && (
        <>
          <div className="dashboard-stats">
            <article className="stat-card">
              <span className="stat-label">
                Entrenamientos
              </span>

              <strong className="stat-value">
                {
                  progress.summary
                    .workoutCount
                }
              </strong>

              <p>
                Sesiones con este ejercicio
              </p>
            </article>

            <article className="stat-card">
              <span className="stat-label">
                Series
              </span>

              <strong className="stat-value">
                {
                  progress.summary
                    .setCount
                }
              </strong>

              <p>Series registradas</p>
            </article>

            <article className="stat-card">
              <span className="stat-label">
                Mejor peso
              </span>

              <strong className="stat-value">
                {progress.summary
                  .bestWeight ?? "-"}
              </strong>

              <p>kg</p>
            </article>

            <article className="stat-card">
              <span className="stat-label">
                Mejores reps
              </span>

              <strong className="stat-value">
                {progress.summary
                  .bestReps ?? "-"}
              </strong>

              <p>repeticiones</p>
            </article>
          </div>

          <div className="dashboard-section">
            <h3>Evolución del peso</h3>

            {chartData.length > 0 ? (
              <div className="progress-chart">
                <ResponsiveContainer
                  width="100%"
                  height={320}
                >
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 5
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tickMargin={10}
                    />

                    <YAxis
                      unit=" kg"
                      width={65}
                    />

                    <Tooltip
                      formatter={(
                        value
                      ) => [
                        `${value} kg`,
                        "Peso"
                      ]}
                      labelFormatter={(
                        label
                      ) =>
                        `Fecha: ${label}`
                      }
                      contentStyle={{
                        backgroundColor:
                          "#171a21",
                        border:
                          "1px solid #554822",
                        borderRadius:
                          "10px",
                        color:
                          "#f8fafc"
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="weight"
                      name="Peso"
                      stroke="#d4a72c"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#d4a72c",
                        strokeWidth: 0
                      }}
                      activeDot={{
                        r: 7,
                        fill: "#f0c75e",
                        stroke:
                          "#d4a72c",
                        strokeWidth: 2
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-state">
                <p>
                  Todavía no hay datos de
                  peso suficientes para
                  mostrar una gráfica.
                </p>
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <h3>Historial</h3>

            {progress.history.length ===
            0 ? (
              <div className="empty-state">
                <p>
                  No hay series registradas
                  para este ejercicio.
                </p>
              </div>
            ) : (
              <div className="progress-history">
                {progress.history.map(
                  (item) => (
                    <div
                      className="progress-history-row"
                      key={item.setId}
                    >
                      <div>
                        <strong>
                          {new Date(
                            item.performedAt
                          ).toLocaleDateString(
                            "es-ES"
                          )}
                        </strong>

                        <p>
                          Serie{" "}
                          {item.setNumber}
                        </p>
                      </div>

                      <div>
                        <strong>
                          {item.reps} reps
                        </strong>

                        <p>
                          {item.weight !==
                          null
                            ? `${item.weight} kg`
                            : "Sin peso"}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default ProgressPage;