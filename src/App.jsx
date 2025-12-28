import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimatedLayout from './AnimatedLayout';

import LandingPage from './components/LandingPage';
import AboutSection from './components/AboutSection';
import Projects from './components/Projects';
import ProjectSubpage from './components/ProjectSubpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AnimatedLayout>
              <LandingPage />
              <AboutSection id="about" />
              <Projects id="projects" />
            </AnimatedLayout>
          }
        />
        <Route
          path="/about"
          element={
            <AnimatedLayout>
              <AboutSection />
            </AnimatedLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <AnimatedLayout>
              <Projects />
            </AnimatedLayout>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <AnimatedLayout>
              <ProjectSubpage />
            </AnimatedLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
