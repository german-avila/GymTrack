CREATE TABLE routine_exercises (
    routine_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,

    PRIMARY KEY (routine_id, exercise_id),

    CONSTRAINT fk_routine
        FOREIGN KEY (routine_id)
        REFERENCES routines(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_exercise
        FOREIGN KEY (exercise_id)
        REFERENCES exercises(id)
        ON DELETE CASCADE
);