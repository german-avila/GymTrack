CREATE TABLE workouts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    routine_id INTEGER,
    performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,

    CONSTRAINT fk_workout_routine
        FOREIGN KEY (routine_id)
        REFERENCES routines(id)
        ON DELETE SET NULL
);