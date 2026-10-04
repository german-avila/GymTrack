import { useEffect, useState } from "react";
import type { Routine } from "../types/Routine";
import {
  createRoutine,
  updateRoutine
} from "../services/routineService";

type RoutineFormProps = {
  onRoutineSaved: () => void;
  editingRoutine: Routine | null;
  onCancelEdit: () => void;
};

function RoutineForm({
  onRoutineSaved,
  editingRoutine,
  onCancelEdit
}: RoutineFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingRoutine) {
      setName(editingRoutine.name);
      setDescription(editingRoutine.description ?? "");
    } else {
      setName("");
      setDescription("");
    }
  }, [editingRoutine]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim() === "") {
      setError("El nombre de la rutina es obligatorio.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingRoutine) {
        await updateRoutine(
          editingRoutine.id,
          name,
          description
        );
      } else {
        await createRoutine(
          name,
          description
        );
      }

      setName("");
      setDescription("");

      onRoutineSaved();
    } catch {
      setError("No se pudo guardar la rutina.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="routine-form" onSubmit={handleSubmit}>
      <h2>
        {editingRoutine ? "Editar rutina" : "Añadir rutina"}
      </h2>

      <div className="form-group">
        <label htmlFor="routineName">Nombre</label>
        <input
          id="routineName"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="routineDescription">Descripción</label>
        <textarea
          id="routineDescription"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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
          : editingRoutine
            ? "Guardar cambios"
            : "Guardar"}
      </button>

      {editingRoutine && (
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

export default RoutineForm;