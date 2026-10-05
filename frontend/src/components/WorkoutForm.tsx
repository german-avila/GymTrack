import { useEffect, useState } from "react";
import type { Routine } from "../types/Routine";
import type { Workout } from "../types/Workout";
import {
  createWorkout,
  updateWorkout
} from "../services/workoutService";

type WorkoutFormProps = {
  routines: Routine[];
  editingWorkout: Workout | null;
  onWorkoutSaved: () => void;
  onCancelEdit: () => void;
};

function WorkoutForm({
  routines,
  editingWorkout,
  onWorkoutSaved,
  onCancelEdit
}: WorkoutFormProps) {
  const [routineId, setRoutineId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingWorkout) {
      setRoutineId(
        editingWorkout.routineId === null
          ? ""
          : String(editingWorkout.routineId)
      );

      setNotes(editingWorkout.notes ?? "");
    } else {
      setRoutineId("");
      setNotes("");
    }
  }, [editingWorkout]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    const selectedRoutineId =
      routineId === "" ? null : Number(routineId);

    try {
      if (editingWorkout) {
        await updateWorkout(
          editingWorkout.id,
          selectedRoutineId,
          notes
        );
      } else {
        await createWorkout(
          selectedRoutineId,
          notes
        );
      }

      setRoutineId("");
      setNotes("");

      onWorkoutSaved();
    } catch (error) {
      console.error(error);

      setError(
        editingWorkout
          ? "No se pudo actualizar el entrenamiento"
          : "No se pudo crear el entrenamiento"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="exercise-form" onSubmit={handleSubmit}>
      <h2>
        {editingWorkout
          ? "Editar entrenamiento"
          : "Nuevo entrenamiento"}
      </h2>

      <div className="form-group">
        <label htmlFor="routine">Rutina</label>

        <select
          id="routine"
          value={routineId}
          onChange={(event) =>
            setRoutineId(event.target.value)
          }
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
          onChange={(event) =>
            setNotes(event.target.value)
          }
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
          ? "Guardando..."
          : editingWorkout
            ? "Guardar cambios"
            : "Crear entrenamiento"}
      </button>

      {editingWorkout && (
        <button
          className="secondary-button"
          type="button"
          onClick={onCancelEdit}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

export default WorkoutForm;