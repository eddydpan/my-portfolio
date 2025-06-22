import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimatedLayout from './AnimatedLayout';

import LandingPage from './components/LandingPage';
import AboutSection from './components/AboutSection';
import Portfolio from './components/Portfolio';
import BettaFishChessPlayerSubpage from './components/subpages/projects/BettaFishChessPlayerSubpage';
import IronManSubpage from './components/subpages/projects/IronManSubpage';

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
              <Portfolio id="portfolio" />
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
        {/* Portfolio Projects */}
        <Route
          path="/portfolio/dancing-links"
          element={
            <AnimatedLayout>
              <Portfolio />
            </AnimatedLayout>
          }
        />
        <Route
          path="/portfolio/bettafish-chess-player"
          element={
            <AnimatedLayout>
              <BettaFishChessPlayerSubpage />
            </AnimatedLayout>
          }
        />
        <Route
          path="/portfolio/iron-man"
          element={
            <AnimatedLayout>
              <IronManSubpage />
            </AnimatedLayout>
          }
        />
        <Route
          path="/portfolio/farm-nerds"
          element={
            <AnimatedLayout>
              <IronManSubpage />
            </AnimatedLayout>
          }
        />
        <Route
          path="/portfolio/pVMpkin"
          element={
            <AnimatedLayout>
              <IronManSubpage />
            </AnimatedLayout>
          }
        />
        <Route
          path="/portfolio/hms-recyclability-predictor"
          element={
            <AnimatedLayout>
              <IronManSubpage />
            </AnimatedLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
