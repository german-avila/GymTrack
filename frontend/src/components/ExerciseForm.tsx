import { useEffect, useState } from "react";
import type { Exercise } from "../types/Exercise";

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
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (editingExercise) {
    setName(editingExercise.name);
    setMuscleGroup(editingExercise.muscleGroup);
    setDescription(editingExercise.description ?? "");
  } else {
    setName("");
    setMuscleGroup("");
    setDescription("");
  }
}, [editingExercise]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim() === "" || muscleGroup.trim() === "") {
      setError("El nombre y el grupo muscular son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const url = editingExercise
        ? `http://localhost:3000/api/exercises/${editingExercise.id}`
        : "http://localhost:3000/api/exercises";

      const method = editingExercise ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          muscleGroup,
          description
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save exercise");
      }

      setName("");
      setMuscleGroup("");
      setDescription("");

      onExerciseCreated();
    } catch {
      setError("No se pudo guardar el ejercicio.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingExercise ? "Editar ejercicio" : "Añadir ejercicio"}</h2>

      <div>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="muscleGroup">Grupo muscular</label>
        <input
          id="muscleGroup"
          type="text"
          value={muscleGroup}
          onChange={(event) => setMuscleGroup(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      {error && <p>{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Guardando..."
          : editingExercise
            ? "Guardar cambios"
            : "Guardar"}
      </button>

  {editingExercise && (
  <button type="button" onClick={onCancelEdit}>
    Cancelar
  </button>
  )}

  </form>

)}

export default ExerciseForm;