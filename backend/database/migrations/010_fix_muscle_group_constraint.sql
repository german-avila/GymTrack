ALTER TABLE exercises
DROP CONSTRAINT IF EXISTS chk_exercises_muscle_group;

ALTER TABLE exercises
ADD CONSTRAINT chk_exercises_muscle_group
CHECK (
  muscle_group IN (
    'Pecho',
    'Espalda',
    'Hombros',
    'Bíceps',
    'Tríceps',
    'Cuádriceps',
    'Isquiotibiales',
    'Glúteos',
    'Gemelos',
    'Core',
    'Antebrazos'
  )
);