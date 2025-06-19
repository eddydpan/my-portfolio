import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutSection from './components/AboutSection';
import Portfolio from './components/Portfolio';
import Subpage from './components/Subpage';
import BettaFishChessPlayerSubpage from './components/subpages/BettaFishChessPlayerSubpage';
import IronManSubpage from './components/subpages/IronManSubpage';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <LandingPage />
                <AboutSection id="about" />
                <Portfolio id="portfolio" />
              </>
            }
          />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<Subpage />} />
          <Route path="/portfolio/bettafish-chess-player" element={<BettaFishChessPlayerSubpage />} />
          <Route path="/portfolio/iron-man" element={<IronManSubpage />} />
        </Routes>
      </div>
    </Router>
  );
}
