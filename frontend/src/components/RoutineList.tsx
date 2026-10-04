import type { Routine } from "../types/Routine";

type RoutineListProps = {
  routines: Routine[];
  onDeleteRoutine: (id: number) => void;
  onEditRoutine: (routine: Routine) => void;
  onManageExercises: (routine: Routine) => void;
};

function RoutineList({
  routines,
  onDeleteRoutine,
  onEditRoutine,
  onManageExercises
}: RoutineListProps) {
  return (
    <ul className="routine-list">
      {routines.map((routine) => (
        <li className="routine-item" key={routine.id}>
          <strong>{routine.name}</strong>

          {routine.description && (
            <p>{routine.description}</p>
          )}

          <button
            className="primary-button"
            onClick={() => onManageExercises(routine)}
            >
            Gestionar ejercicios
          </button>

          <button
            className="secondary-button"
            onClick={() => onEditRoutine(routine)}
          >
            Editar
          </button>

          <button
            className="danger-button"
            onClick={() => onDeleteRoutine(routine.id)}
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}

export default RoutineList;