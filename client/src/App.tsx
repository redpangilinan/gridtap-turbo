import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Rankings from './pages/Rankings';

function App() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-gray-300'>
      <Helmet>
        <title>Gridtap Turbo</title>
        <meta
          name='description'
          content='Tap fast and climb the leaderboards in GridTap Turbo, a fast-paced grid-tapping challenge.'
        />
        <meta
          name='keywords'
          content='dont tap, donttap, grid tap, grid, tap, dont, tap, white, tiles, dont tap the white tile, gridtap, turbo'
        />
        <meta name='author' content='Red Pangilinan' />
        <link rel='canonical' href='https://gridtap-turbo.vercel.app/' />
        <meta property='og:title' content='GridTap Turbo' />
        <meta
          property='og:description'
          content='Tap fast and climb the leaderboards in GridTap Turbo, a fast-paced grid-tapping challenge.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://gridtap-turbo.vercel.app/' />
        <meta property='og:image:alt' content='GridTap Turbo' />
        <meta property='og:site_name' content='GridTap Turbo' />
        <meta name='twitter:title' content='GridTap Turbo' />
        <meta
          name='twitter:description'
          content='Tap fast and climb the leaderboards in GridTap Turbo, a fast-paced grid-tapping challenge.'
        />
      </Helmet>
      <Navbar />
      <BrowserRouter>
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
}

export default App;
