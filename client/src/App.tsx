import { Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserTokens, refreshUserTokens } from './api/users';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Rankings from './pages/Rankings';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const App = () => {
  const { data: token, refetch } = useQuery({
    queryKey: ['auth'],
    queryFn: getUserTokens,
    retry: false,
    onError: async () => {
      try {
        await refreshUserTokens();
        refetch();
      } catch (error) {
        console.error('Failed to refresh tokens:', error);
      }
    },
  });

  const refreshToken = () => {
    refetch();
  };

  return (
    <div className='flex flex-col min-h-screen bg-neutral-900 text-neutral-300'>
      <Navbar auth={token} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/rankings' element={<Rankings />} />
        <Route path='/user/:username' element={<Profile />} />
        <Route path='/login' element={<Login auth={token} />} />
        <Route path='/register' element={<Register auth={token} />} />
        <Route
          path='/play'
          element={<Game auth={token} refreshToken={refreshToken} />}
        />
        <Route
          path='/settings'
          element={<Settings auth={token} refreshToken={refreshToken} />}
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
