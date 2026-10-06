import ExercisePicker from "./ExercisePicker";

import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";

type RoutineExerciseManagerProps = {
  routine: Routine;
  exercises: Exercise[];
  onAddExercise: (
    exerciseId: number
  ) => void;
  onRemoveExercise: (
    exerciseId: number
  ) => void;
};

function RoutineExerciseManager({
  routine,
  exercises,
  onAddExercise,
  onRemoveExercise
}: RoutineExerciseManagerProps) {
  const routineExercises =
    routine.exercises ?? [];

  const routineExerciseIds =
    routineExercises.map(
      (exercise) => exercise.id
    );

  return (
    <section className="routine-exercise-manager">
      <div className="routine-manager-header">
        <div>
          <span className="section-eyebrow">
            Gestionar rutina
          </span>

          <h2>
            {routine.name}
          </h2>
        </div>
      </div>

      <ExercisePicker
        exercises={exercises}
        excludedExerciseIds={
          routineExerciseIds
        }
        onSelectExercise={
          onAddExercise
        }
        buttonText="Añadir a la rutina"
      />

      <div className="routine-current-exercises">
        <h3>
          Ejercicios de la rutina
        </h3>

        {routineExercises.length === 0 ? (
          <div className="empty-state">
            <p>
              Esta rutina todavía no
              tiene ejercicios.
            </p>
          </div>
        ) : (
          <div className="routine-exercise-list">
            {routineExercises.map(
              (exercise) => (
                <div
                  className="routine-exercise-item"
                  key={exercise.id}
                >
                  <div>
                    <strong>
                      {exercise.name}
                    </strong>

                    <span>
                      {
                        exercise.muscleGroup
                      }
                    </span>
                  </div>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() =>
                      onRemoveExercise(
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
    </section>
  );
}

export default RoutineExerciseManager;