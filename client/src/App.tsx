import { Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tokenData } from './api/users';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Rankings from './pages/Rankings';

const App = () => {
  const { data: token } = useQuery({
    queryKey: ['cookies'],
    queryFn: tokenData,
    staleTime: 300000,
  });

  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-gray-300'>
      <Navbar auth={token} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login auth={token} />} />
        <Route path='/register' element={<Register auth={token} />} />
        <Route path='/rankings' element={<Rankings />} />
        <Route path='/play' element={<Game />} />
      </Routes>
    </div>
  );
};

export default App;
