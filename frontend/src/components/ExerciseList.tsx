import type { Exercise } from "../types/Exercise";

type ExerciseListProps = {
  exercises: Exercise[];
  onDeleteExercise: (id: number) => void;
  onEditExercise: (exercise: Exercise) => void;
};

function ExerciseList({
  exercises,
  onDeleteExercise,
  onEditExercise
}: ExerciseListProps) {
  return (
    <ul className="exercise-list">
      {exercises.map((exercise) => (
        <li className="exercise-item" key={exercise.id}>
          <strong>{exercise.name}</strong> - {exercise.muscleGroup}

          <button
            className="secondary-button"
            onClick={() => onEditExercise(exercise)}
          >
            Editar
          </button>

          <button
            className="danger-button"
            onClick={() => onDeleteExercise(exercise.id)}
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ExerciseList;