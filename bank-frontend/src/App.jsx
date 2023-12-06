import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/Home';
import LoginPage from './pages/Login';
import MainMenuPage from './pages/MainMenu';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/home" element={<MainMenuPage/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App
