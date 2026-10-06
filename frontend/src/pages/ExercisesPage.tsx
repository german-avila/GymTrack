import {
  useEffect,
  useState
} from "react";

import AlertMessage
  from "../components/AlertMessage";

import ExerciseForm
  from "../components/ExerciseForm";

import ExerciseList
  from "../components/ExerciseList";

import FormModal
  from "../components/FormModal";

import type {
  Exercise
} from "../types/Exercise";

import {
  deleteExercise as deleteExerciseRequest,
  getExercises
} from "../services/exerciseService";

function ExercisesPage() {
  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [
    editingExercise,
    setEditingExercise
  ] = useState<Exercise | null>(null);

  const [
    isFormOpen,
    setIsFormOpen
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  async function loadExercises() {
    try {
      const data =
        await getExercises();

      setExercises(data);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar los ejercicios."
      );

      setSuccess(null);
    }
  }

  useEffect(() => {
    loadExercises();
  }, []);

  function startCreatingExercise() {
    setEditingExercise(null);
    setIsFormOpen(true);

    setError(null);
    setSuccess(null);
  }

  function startEditingExercise(
    exercise: Exercise
  ) {
    setEditingExercise(exercise);
    setIsFormOpen(true);

    setError(null);
    setSuccess(null);
  }

  function closeExerciseForm() {
    setEditingExercise(null);
    setIsFormOpen(false);
  }

  async function handleExerciseSaved() {
    try {
      const wasEditing =
        editingExercise !== null;

      closeExerciseForm();

      await loadExercises();

      setError(null);

      setSuccess(
        wasEditing
          ? "Ejercicio actualizado correctamente."
          : "Ejercicio creado correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "El ejercicio se guardó, pero no se pudo actualizar la lista."
      );

      setSuccess(null);
    }
  }

  async function deleteExercise(
    exerciseId: number
  ) {
    try {
      await deleteExerciseRequest(
        exerciseId
      );

      if (
        editingExercise?.id ===
        exerciseId
      ) {
        closeExerciseForm();
      }

      await loadExercises();

      setError(null);

      setSuccess(
        "Ejercicio eliminado correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar el ejercicio."
      );

      setSuccess(null);
    }
  }

  return (
    <main className="page-content">
      <header className="page-header">
        <div>
          <span className="page-kicker">
            Biblioteca
          </span>

          <h1>
            Ejercicios
          </h1>

          <p>
            Tu catálogo de movimientos para
            crear rutinas y registrar sesiones.
          </p>
        </div>

        <div className="page-header-actions">
          <div className="page-counter">
            <strong>
              {exercises.length}
            </strong>

            <span>
              disponibles
            </span>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={
              startCreatingExercise
            }
          >
            + Nuevo ejercicio
          </button>
        </div>
      </header>

      {error && (
        <AlertMessage
          type="error"
          message={error}
        />
      )}

      {success && (
        <AlertMessage
          type="success"
          message={success}
        />
      )}

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span>
              Catálogo
            </span>

            <h2>
              Todos los ejercicios
            </h2>
          </div>
        </div>

        <ExerciseList
          exercises={exercises}
          onEditExercise={
            startEditingExercise
          }
          onDeleteExercise={
            deleteExercise
          }
        />
      </section>

      {isFormOpen && (
        <FormModal
          eyebrow={
            editingExercise
              ? "Edición"
              : "Nuevo ejercicio"
          }
          title={
            editingExercise
              ? "Editar ejercicio"
              : "Crear ejercicio"
          }
          onClose={
            closeExerciseForm
          }
        >
          <ExerciseForm
            editingExercise={
              editingExercise
            }
            onExerciseCreated={
              handleExerciseSaved
            }
            onCancelEdit={
              closeExerciseForm
            }
          />
        </FormModal>
      )}
    </main>
  );
}

export default ExercisesPage;