import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";

type RoutineExerciseManagerProps = {
  routine: Routine;
  exercises: Exercise[];
  onAddExercise: (exerciseId: number) => void;
  onRemoveExercise: (exerciseId: number) => void;
};

function RoutineExerciseManager({
  routine,
  exercises,
  onAddExercise,
  onRemoveExercise
}: RoutineExerciseManagerProps) {
  const availableExercises = exercises.filter(
    (exercise) =>
      !routine.exercises?.some(
        (routineExercise) =>
          routineExercise.id === exercise.id
      )
  );

  return (
    <section className="routine-manager">
      <div className="routine-manager-header">
        <div>
          <span className="routine-card-label">
            Gestionar rutina
          </span>

          <h3>{routine.name}</h3>

          <p>
            Añade o elimina ejercicios de esta rutina.
          </p>
        </div>

        <span className="routine-count-badge">
          {routine.exercises?.length ?? 0} ejercicios
        </span>
      </div>

      <div className="routine-manager-section">
        <h4>En la rutina</h4>

        {routine.exercises &&
        routine.exercises.length > 0 ? (
          <div className="routine-manager-list">
            {routine.exercises.map((exercise) => (
              <div
                className="routine-manager-item"
                key={exercise.id}
              >
                <div>
                  <strong>{exercise.name}</strong>

                  <p>{exercise.muscleGroup}</p>
                </div>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() =>
                    onRemoveExercise(exercise.id)
                  }
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>
              Esta rutina todavía no tiene ejercicios.
            </p>
          </div>
        )}
      </div>

      <div className="routine-manager-section">
        <h4>Añadir ejercicios</h4>

        {availableExercises.length === 0 ? (
          <div className="empty-state">
            <p>
              No hay más ejercicios disponibles para añadir.
            </p>
          </div>
        ) : (
          <div className="routine-manager-list">
            {availableExercises.map((exercise) => (
              <div
                className="routine-manager-item"
                key={exercise.id}
              >
                <div>
                  <strong>{exercise.name}</strong>

                  <p>{exercise.muscleGroup}</p>
                </div>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    onAddExercise(exercise.id)
                  }
                >
                  Añadir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RoutineExerciseManager;