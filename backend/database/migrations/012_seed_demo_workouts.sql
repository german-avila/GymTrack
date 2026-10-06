BEGIN;

DO $$
DECLARE
  push_routine_id INTEGER;
  pull_routine_id INTEGER;
  legs_routine_id INTEGER;

  workout_id INTEGER;
  workout_exercise_id INTEGER;
BEGIN

  SELECT id
  INTO push_routine_id
  FROM routines
  WHERE name = 'Push'
  LIMIT 1;

  SELECT id
  INTO pull_routine_id
  FROM routines
  WHERE name = 'Pull'
  LIMIT 1;

  SELECT id
  INTO legs_routine_id
  FROM routines
  WHERE name = 'Pierna'
  LIMIT 1;

  -- =========================================================
  -- WORKOUT 1 - PUSH
  -- 22 SEPTEMBER
  -- =========================================================

  INSERT INTO workouts (
    routine_id,
    performed_at,
    notes
  )
  VALUES (
    push_routine_id,
    '2026-09-22 18:00:00+02',
    'Buen entrenamiento. Primera sesión Push registrada.'
  )
  RETURNING id INTO workout_id;

  -- Press banca

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Press banca'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 60),
    (workout_exercise_id, 2, 8, 65),
    (workout_exercise_id, 3, 8, 65);

  -- Press inclinado

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Press inclinado con mancuernas'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 22),
    (workout_exercise_id, 2, 10, 22),
    (workout_exercise_id, 3, 8, 24);

  -- Press militar

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Press militar'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 35),
    (workout_exercise_id, 2, 8, 40),
    (workout_exercise_id, 3, 8, 40);


  -- =========================================================
  -- WORKOUT 2 - PULL
  -- 24 SEPTEMBER
  -- =========================================================

  INSERT INTO workouts (
    routine_id,
    performed_at,
    notes
  )
  VALUES (
    pull_routine_id,
    '2026-09-24 18:30:00+02',
    'Sesión Pull con buen rendimiento en remo.'
  )
  RETURNING id INTO workout_id;

  -- Jalón al pecho

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Jalón al pecho'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 12, 45),
    (workout_exercise_id, 2, 10, 50),
    (workout_exercise_id, 3, 10, 50);

  -- Remo con barra

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Remo con barra'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 50),
    (workout_exercise_id, 2, 10, 55),
    (workout_exercise_id, 3, 8, 55);

  -- Curl con barra

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Curl con barra'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 12, 20),
    (workout_exercise_id, 2, 10, 22.5),
    (workout_exercise_id, 3, 10, 22.5);


  -- =========================================================
  -- WORKOUT 3 - LEGS
  -- 26 SEPTEMBER
  -- =========================================================

  INSERT INTO workouts (
    routine_id,
    performed_at,
    notes
  )
  VALUES (
    legs_routine_id,
    '2026-09-26 11:00:00+02',
    'Sesión de pierna. Buenas sensaciones en sentadilla.'
  )
  RETURNING id INTO workout_id;

  -- Sentadilla

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Sentadilla'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 70),
    (workout_exercise_id, 2, 8, 75),
    (workout_exercise_id, 3, 8, 75);

  -- Prensa

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Prensa de piernas'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 12, 120),
    (workout_exercise_id, 2, 10, 130),
    (workout_exercise_id, 3, 10, 130);

  -- Peso muerto rumano

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Peso muerto rumano'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 60),
    (workout_exercise_id, 2, 10, 65),
    (workout_exercise_id, 3, 8, 70);


  -- =========================================================
  -- WORKOUT 4 - PUSH
  -- 29 SEPTEMBER
  -- =========================================================

  INSERT INTO workouts (
    routine_id,
    performed_at,
    notes
  )
  VALUES (
    push_routine_id,
    '2026-09-29 18:10:00+02',
    'Mejora de peso en press banca.'
  )
  RETURNING id INTO workout_id;

  -- Press banca

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Press banca'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 62.5),
    (workout_exercise_id, 2, 8, 67.5),
    (workout_exercise_id, 3, 6, 70);

  -- Press inclinado

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Press inclinado con mancuernas'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 24),
    (workout_exercise_id, 2, 9, 24),
    (workout_exercise_id, 3, 8, 26);

  -- Press militar

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Press militar'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 37.5),
    (workout_exercise_id, 2, 8, 40),
    (workout_exercise_id, 3, 6, 42.5);


  -- =========================================================
  -- WORKOUT 5 - PULL
  -- 1 OCTOBER
  -- =========================================================

  INSERT INTO workouts (
    routine_id,
    performed_at,
    notes
  )
  VALUES (
    pull_routine_id,
    '2026-10-01 18:20:00+02',
    'Mejora general en espalda y bíceps.'
  )
  RETURNING id INTO workout_id;

  -- Jalón

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Jalón al pecho'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 12, 47.5),
    (workout_exercise_id, 2, 10, 52.5),
    (workout_exercise_id, 3, 8, 55);

  -- Remo

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Remo con barra'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 55),
    (workout_exercise_id, 2, 8, 60),
    (workout_exercise_id, 3, 8, 60);

  -- Curl

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Curl con barra'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 12, 22.5),
    (workout_exercise_id, 2, 10, 25),
    (workout_exercise_id, 3, 8, 25);


  -- =========================================================
  -- WORKOUT 6 - LEGS
  -- 3 OCTOBER
  -- =========================================================

  INSERT INTO workouts (
    routine_id,
    performed_at,
    notes
  )
  VALUES (
    legs_routine_id,
    '2026-10-03 11:15:00+02',
    'Subida de cargas en sentadilla y prensa.'
  )
  RETURNING id INTO workout_id;

  -- Sentadilla

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Sentadilla'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 72.5),
    (workout_exercise_id, 2, 8, 80),
    (workout_exercise_id, 3, 6, 82.5);

  -- Prensa

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Prensa de piernas'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 12, 130),
    (workout_exercise_id, 2, 10, 140),
    (workout_exercise_id, 3, 8, 150);

  -- Peso muerto rumano

  INSERT INTO workout_exercises (
    workout_id,
    exercise_id
  )
  SELECT
    workout_id,
    id
  FROM exercises
  WHERE name = 'Peso muerto rumano'
  RETURNING id INTO workout_exercise_id;

  INSERT INTO workout_sets (
    workout_exercise_id,
    set_number,
    reps,
    weight
  )
  VALUES
    (workout_exercise_id, 1, 10, 65),
    (workout_exercise_id, 2, 8, 70),
    (workout_exercise_id, 3, 8, 75);

END $$;

COMMIT;