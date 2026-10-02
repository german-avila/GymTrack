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
    <ul>
      {exercises.map((exercise) => (
        <li key={exercise.id}>
          <strong>{exercise.name}</strong> - {exercise.muscleGroup}

          <button onClick={() => onEditExercise(exercise)}>
            Editar
          </button>

          <button onClick={() => onDeleteExercise(exercise.id)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ExerciseList;