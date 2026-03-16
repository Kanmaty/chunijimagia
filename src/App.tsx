import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MatchingPage } from './pages/MatchingPage';
import { DeckBuilderPage } from './pages/DeckBuilderPage';
import { MultiplayerBattlePage } from './pages/MultiplayerBattlePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MatchingPage />} />
        <Route path="/deck" element={<DeckBuilderPage />} />
        <Route path="/battle/:roomId" element={<MultiplayerBattlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
