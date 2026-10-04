CREATE TABLE workout_sets (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    workout_exercise_id INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight NUMERIC(6,2),

    CONSTRAINT fk_workout_exercise
        FOREIGN KEY (workout_exercise_id)
        REFERENCES workout_exercises(id)
        ON DELETE CASCADE
);