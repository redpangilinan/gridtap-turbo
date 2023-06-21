import { Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserTokens, refreshUserTokens } from './api/users';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Rankings from './pages/Rankings';
import Profile from './pages/Profile';

const App = () => {
  const { data: token, refetch } = useQuery({
    queryKey: ['auth'],
    queryFn: getUserTokens,
    staleTime: 300000,
    retry: false,
    onError: () => {
      refreshUserTokens()
        .then(() => {
          refetch();
        })
        .catch((error) => {
          console.error('Failed to refresh tokens:', error);
        });
    },
  });

  return (
    <div className='flex flex-col min-h-screen bg-neutral-900 text-neutral-300'>
      <Navbar auth={token} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login auth={token} />} />
        <Route path='/register' element={<Register auth={token} />} />
        <Route path='/rankings' element={<Rankings />} />
        <Route path='/play' element={<Game />} />
        <Route path='/user/:username' element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
