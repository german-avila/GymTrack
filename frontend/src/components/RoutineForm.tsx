import {
  useEffect,
  useMemo,
  useState
} from "react";

import type {
  Exercise
} from "../types/Exercise";

import type {
  Routine
} from "../types/Routine";

import {
  createRoutine,
  updateRoutine
} from "../services/routineService";

type RoutineFormProps = {
  exercises: Exercise[];
  editingRoutine: Routine | null;
  onRoutineSaved: () => void;
  onCancelEdit: () => void;
};

function RoutineForm({
  exercises,
  editingRoutine,
  onRoutineSaved,
  onCancelEdit
}: RoutineFormProps) {
  const [name, setName] =
    useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [
    selectedExerciseIds,
    setSelectedExerciseIds
  ] = useState<number[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    if (editingRoutine) {
      setName(
        editingRoutine.name
      );

      setDescription(
        editingRoutine.description ??
          ""
      );

      setSelectedExerciseIds(
        editingRoutine.exercises?.map(
          (exercise) =>
            exercise.id
        ) ?? []
      );
    } else {
      setName("");
      setDescription("");
      setSelectedExerciseIds([]);
    }

    setSearch("");
    setError(null);
  }, [editingRoutine]);

  const selectedExercises =
    useMemo(
      () =>
        selectedExerciseIds
          .map((exerciseId) =>
            exercises.find(
              (exercise) =>
                exercise.id ===
                exerciseId
            )
          )
          .filter(
            (
              exercise
            ): exercise is Exercise =>
              exercise !==
              undefined
          ),
      [
        exercises,
        selectedExerciseIds
      ]
    );

  const availableExercises =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase(
            "es-ES"
          );

      return exercises.filter(
        (exercise) => {
          const isAlreadySelected =
            selectedExerciseIds.includes(
              exercise.id
            );

          if (
            isAlreadySelected
          ) {
            return false;
          }

          if (
            normalizedSearch === ""
          ) {
            return true;
          }

          return (
            exercise.name
              .toLocaleLowerCase(
                "es-ES"
              )
              .includes(
                normalizedSearch
              ) ||
            exercise.muscleGroup
              .toLocaleLowerCase(
                "es-ES"
              )
              .includes(
                normalizedSearch
              )
          );
        }
      );
    }, [
      exercises,
      selectedExerciseIds,
      search
    ]);

  function addExercise(
    exerciseId: number
  ) {
    setSelectedExerciseIds(
      (current) => [
        ...current,
        exerciseId
      ]
    );
  }

  function removeExercise(
    exerciseId: number
  ) {
    setSelectedExerciseIds(
      (current) =>
        current.filter(
          (id) =>
            id !== exerciseId
        )
    );
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      name.trim() === ""
    ) {
      setError(
        "El nombre de la rutina es obligatorio."
      );

      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingRoutine) {
        await updateRoutine(
          editingRoutine.id,
          name,
          description,
          selectedExerciseIds
        );
      } else {
        await createRoutine(
          name,
          description,
          selectedExerciseIds
        );
      }

      onRoutineSaved();
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo guardar la rutina."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="modal-form routine-editor-form"
      onSubmit={handleSubmit}
    >
      <div className="routine-editor-fields">
        <div className="form-group">
          <label htmlFor="routineName">
            Nombre
          </label>

          <input
            id="routineName"
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            placeholder="Ej. Push"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="routineDescription">
            Descripción
          </label>

          <textarea
            id="routineDescription"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Ej. Pecho, hombro y tríceps"
            rows={3}
          />
        </div>
      </div>

      <div className="routine-editor-section">
        <div className="routine-editor-section-header">
          <div>
            <span className="page-kicker">
              Ejercicios
            </span>

            <h3>
              Ejercicios de la rutina
            </h3>
          </div>

          <span className="routine-editor-count">
            {
              selectedExerciseIds.length
            }{" "}
            {selectedExerciseIds.length ===
            1
              ? "seleccionado"
              : "seleccionados"}
          </span>
        </div>

        {selectedExercises.length ===
        0 ? (
          <div className="routine-editor-empty">
            Todavía no has añadido
            ejercicios.
          </div>
        ) : (
          <div className="routine-selected-list">
            {selectedExercises.map(
              (
                exercise,
                index
              ) => (
                <div
                  className="routine-selected-exercise"
                  key={
                    exercise.id
                  }
                >
                  <span className="routine-exercise-order">
                    {index + 1}
                  </span>

                  <div className="routine-selected-info">
                    <strong>
                      {
                        exercise.name
                      }
                    </strong>

                    <span>
                      {
                        exercise.muscleGroup
                      }
                    </span>
                  </div>

                  <button
                    type="button"
                    className="routine-remove-exercise"
                    onClick={() =>
                      removeExercise(
                        exercise.id
                      )
                    }
                  >
                    Quitar
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div className="routine-editor-section">
        <div className="routine-editor-section-header">
          <div>
            <span className="page-kicker">
              Biblioteca
            </span>

            <h3>
              Añadir ejercicios
            </h3>
          </div>
        </div>

        <input
          className="routine-exercise-search"
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Buscar por nombre o grupo muscular..."
        />

        <div className="routine-available-list">
          {availableExercises.length ===
          0 ? (
            <div className="routine-editor-empty">
              No hay ejercicios que
              coincidan.
            </div>
          ) : (
            availableExercises.map(
              (exercise) => (
                <div
                  className="routine-available-exercise"
                  key={
                    exercise.id
                  }
                >
                  <div>
                    <strong>
                      {
                        exercise.name
                      }
                    </strong>

                    <span>
                      {
                        exercise.muscleGroup
                      }
                    </span>
                  </div>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      addExercise(
                        exercise.id
                      )
                    }
                  >
                    Añadir
                  </button>
                </div>
              )
            )
          )}
        </div>
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
          onClick={
            onCancelEdit
          }
          disabled={
            isSubmitting
          }
        >
          Cancelar
        </button>

        <button
          className="primary-button"
          type="submit"
          disabled={
            isSubmitting
          }
        >
          {isSubmitting
            ? "Guardando..."
            : editingRoutine
              ? "Guardar cambios"
              : "Crear rutina"}
        </button>
      </div>
    </form>
  );
}

export default RoutineForm;