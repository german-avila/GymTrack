ALTER TABLE workouts
ADD COLUMN status TEXT NOT NULL DEFAULT 'completed';

ALTER TABLE workouts
ADD COLUMN started_at TIMESTAMPTZ;

ALTER TABLE workouts
ADD COLUMN ended_at TIMESTAMPTZ;

ALTER TABLE workouts
ADD CONSTRAINT chk_workouts_status
CHECK (
  status IN (
    'active',
    'completed'
  )
);