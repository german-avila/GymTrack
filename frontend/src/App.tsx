import { Link, Route, Routes } from "react-router-dom";

import "./App.css";

import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import RoutinesPage from "./pages/RoutinesPage";
import WorkoutsPage from "./pages/WorkoutsPage";

function App() {
  return (
    <main>
      <h1>GymTrack</h1>
      <p>Gestiona tus entrenamientos y sigue tu progreso.</p>

      <nav>
        <Link to="/">Inicio</Link>{" "}
        <Link to="/exercises">Ejercicios</Link>{" "}
        <Link to="/routines">Rutinas</Link>{" "}
        <Link to="/workouts">Entrenamientos</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/routines" element={<RoutinesPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
      </Routes>
    </main>
  );
}

export default App;