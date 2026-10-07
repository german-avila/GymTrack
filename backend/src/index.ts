import "dotenv/config";

import { app } from "./app.js";
import { pool } from "./database/db.js";

const port = Number(process.env.PORT) || 3000;

try {
  const result = await pool.query("SELECT NOW()");

  console.log(
    "Database connected:",
    result.rows[0]
  );
} catch (error) {
  console.error(
    "Database connection failed:",
    error
  );
}

app.listen(port, () => {
  console.log(
    `GymTrack backend running on port ${port}`
  );
});