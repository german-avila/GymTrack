import { NavLink, Route, Routes } from "react-router-dom";

import "./App.css";

import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import RoutinesPage from "./pages/RoutinesPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import ProgressPage from "./pages/ProgressPage";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div>
            <h1>GymTrack</h1>
            <p>Gestiona tus entrenamientos y sigue tu progreso.</p>
          </div>

          <nav className="main-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Inicio
            </NavLink>

            <NavLink
              to="/exercises"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Ejercicios
            </NavLink>

            <NavLink
              to="/routines"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Rutinas
            </NavLink>

            <NavLink
              to="/workouts"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Entrenamientos
            </NavLink>

            <NavLink
              to="/progress"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Progreso
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;