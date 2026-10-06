BEGIN;

INSERT INTO routines (
  name,
  description
)
VALUES
  (
    'Push',
    'Rutina de empuje centrada en pecho, hombros y tríceps.'
  ),
  (
    'Pull',
    'Rutina de tirón centrada en espalda y bíceps.'
  ),
  (
    'Pierna',
    'Rutina completa de tren inferior.'
  );

-- =========================
-- PUSH
-- =========================

INSERT INTO routine_exercises (
  routine_id,
  exercise_id
)
SELECT
  r.id,
  e.id
FROM routines r
JOIN exercises e
  ON e.name IN (
    'Press banca',
    'Press inclinado con mancuernas',
    'Press militar',
    'Elevaciones laterales',
    'Extensión de tríceps en polea'
  )
WHERE r.name = 'Push';

-- =========================
-- PULL
-- =========================

INSERT INTO routine_exercises (
  routine_id,
  exercise_id
)
SELECT
  r.id,
  e.id
FROM routines r
JOIN exercises e
  ON e.name IN (
    'Dominadas',
    'Jalón al pecho',
    'Remo con barra',
    'Curl con barra',
    'Curl martillo'
  )
WHERE r.name = 'Pull';

-- =========================
-- LEGS
-- =========================

INSERT INTO routine_exercises (
  routine_id,
  exercise_id
)
SELECT
  r.id,
  e.id
FROM routines r
JOIN exercises e
  ON e.name IN (
    'Sentadilla',
    'Prensa de piernas',
    'Peso muerto rumano',
    'Curl femoral sentado',
    'Elevación de gemelos de pie'
  )
WHERE r.name = 'Pierna';

COMMIT;