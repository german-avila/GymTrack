import { useState } from "react";
import type { Routine } from "../types/Routine";
import { createWorkout } from "../services/workoutService";

type WorkoutFormProps = {
  routines: Routine[];
  onWorkoutCreated: () => void;
};

function WorkoutForm({
  routines,
  onWorkoutCreated
}: WorkoutFormProps) {
  const [routineId, setRoutineId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const selectedRoutineId =
        routineId === "" ? null : Number(routineId);

      await createWorkout(
        selectedRoutineId,
        notes
      );

      setRoutineId("");
      setNotes("");

      onWorkoutCreated();
    } catch (error) {
      console.error(error);
      setError("No se pudo crear el entrenamiento");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="exercise-form" onSubmit={handleSubmit}>
      <h2>Nuevo entrenamiento</h2>

      <div className="form-group">
        <label htmlFor="routine">Rutina</label>

        <select
          id="routine"
          value={routineId}
          onChange={(event) => setRoutineId(event.target.value)}
        >
          <option value="">
            Entrenamiento libre
          </option>

          {routines.map((routine) => (
            <option
              key={routine.id}
              value={routine.id}
            >
              {routine.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notas</label>

        <textarea
          id="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="¿Cómo ha ido el entrenamiento?"
        />
      </div>

      {error && <p>{error}</p>}

      <button
        className="primary-button"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Creando..."
          : "Crear entrenamiento"}
      </button>
    </form>
  );
}

export default WorkoutForm;