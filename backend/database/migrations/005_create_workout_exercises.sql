CREATE TABLE workout_exercises (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,

    CONSTRAINT fk_workout
        FOREIGN KEY (workout_id)
        REFERENCES workouts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_exercise
        FOREIGN KEY (exercise_id)
        REFERENCES exercises(id)
        ON DELETE RESTRICT
);