import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-800 text-gray-300'>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/play' element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
