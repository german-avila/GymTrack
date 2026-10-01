import express from "express";

const app = express();
const port = 3000;

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "GymTrack API is running correctly"
  });
});

app.listen(port, () => {
  console.log(`GymTrack backend running on port ${port}`);
});