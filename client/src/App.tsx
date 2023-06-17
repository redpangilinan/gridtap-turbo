import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HelmetTags from './components/HelmetTags';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Rankings from './pages/Rankings';

const App = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-gray-300'>
      <BrowserRouter>
        <HelmetTags />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/rankings' element={<Rankings />} />
          <Route path='/play' element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
