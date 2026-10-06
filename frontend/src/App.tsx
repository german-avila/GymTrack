import { NavLink, Route, Routes } from "react-router-dom";

import "./App.css";

import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import RoutinesPage from "./pages/RoutinesPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import ProgressPage from "./pages/ProgressPage";
import NavIcon
  from "./components/NavIcon";


function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-brand-row">
            <NavLink
              to="/"
              className="brand-link"
            >
              <div className="brand-mark">
                <span className="brand-mark-g">
                  G
                </span>

                <span className="brand-mark-t">
                  T
                </span>
              </div>

              <div className="brand-copy">
                <strong>
                  GymTrack
                </strong>

                <span>
                  TRAIN · TRACK · PROGRESS
                </span>
              </div>
            </NavLink>

            <div className="brand-product-label">
              <span className="brand-product-dot" />

              Workout tracker
            </div>
          </div>

          <nav className="main-nav">
            <NavLink
              to="/"
              end
              className={({
                isActive
              }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <NavIcon name="home" />

              <span>
                Inicio
              </span>
            </NavLink>

            <NavLink
              to="/exercises"
              className={({
                isActive
              }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <NavIcon name="exercise" />

              <span>
                Ejercicios
              </span>
            </NavLink>

            <NavLink
              to="/routines"
              className={({
                isActive
              }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <NavIcon name="routine" />

              <span>
                Rutinas
              </span>
            </NavLink>

            <NavLink
              to="/workouts"
              className={({
                isActive
              }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <NavIcon name="workout" />

              <span>
                Entrenamientos
              </span>
            </NavLink>

            <NavLink
              to="/progress"
              className={({
                isActive
              }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <NavIcon name="progress" />

              <span>
                Progreso
              </span>
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