import {
  useEffect,
  useState
} from "react";

import type {
  Exercise
} from "../types/Exercise";

import {
  MUSCLE_GROUPS
} from "../constants/muscleGroups";

import {
  createExercise,
  updateExercise
} from "../services/exerciseService";

type ExerciseFormProps = {
  onExerciseCreated: () => void;
  editingExercise: Exercise | null;
  onCancelEdit: () => void;
};

function ExerciseForm({
  onExerciseCreated,
  editingExercise,
  onCancelEdit
}: ExerciseFormProps) {
  const [name, setName] =
    useState("");

  const [
    muscleGroup,
    setMuscleGroup
  ] = useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (editingExercise) {
      setName(
        editingExercise.name
      );

      setMuscleGroup(
        editingExercise.muscleGroup
      );

      setDescription(
        editingExercise.description ??
          ""
      );
    } else {
      setName("");
      setMuscleGroup("");
      setDescription("");
    }

    setError(null);
  }, [editingExercise]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      name.trim() === "" ||
      muscleGroup === ""
    ) {
      setError(
        "El nombre y el grupo muscular son obligatorios."
      );

      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingExercise) {
        await updateExercise(
          editingExercise.id,
          name,
          muscleGroup,
          description
        );
      } else {
        await createExercise(
          name,
          muscleGroup,
          description
        );
      }

      onExerciseCreated();
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo guardar el ejercicio."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="modal-form"
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label htmlFor="name">
          Nombre
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(
              event.target.value
            )
          }
          placeholder="Ej. Press banca"
          autoFocus
        />
      </div>

      <div className="form-group">
        <label htmlFor="muscleGroup">
          Grupo muscular
        </label>

        <select
          id="muscleGroup"
          value={muscleGroup}
          onChange={(event) =>
            setMuscleGroup(
              event.target.value
            )
          }
        >
          <option value="">
            Selecciona un grupo muscular
          </option>

          {MUSCLE_GROUPS.map(
            (group) => (
              <option
                key={group}
                value={group}
              >
                {group}
              </option>
            )
          )}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Descripción
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          placeholder="Descripción opcional del ejercicio"
          rows={4}
        />
      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <div className="modal-form-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={onCancelEdit}
          disabled={isSubmitting}
        >
          Cancelar
        </button>

        <button
          className="primary-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Guardando..."
            : editingExercise
              ? "Guardar cambios"
              : "Crear ejercicio"}
        </button>
      </div>
    </form>
  );
}

export default ExerciseForm;