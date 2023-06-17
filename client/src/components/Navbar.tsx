import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Dropdown from './Dropdown';

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Store username to session storage to minimize API calls
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = sessionStorage.getItem('storedName');
        if (storedUser) {
          const storedName = JSON.parse(storedUser);
          setUsername(storedName);
        } else {
          const apiUrl = `${import.meta.env.VITE_BASE_URL}/cookies`;
          const response = await axios.get(apiUrl, { withCredentials: true });
          const storedName = response.data.username;
          sessionStorage.setItem('storedName', JSON.stringify(storedName));
          setUsername(storedName);
        }
      } catch (error) {
        console.log('Not logged in');
      }
    };

    fetchUser();
  }, []);

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClick = () => {
    setDropdownOpen(false);
    setNavbar(false);
  };

  return (
    <nav className='w-full bg-gray-900'>
      <div className='justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8'>
        <div>
          <div className='flex items-center justify-between py-3 md:py-5 md:block'>
            <Link to='/' onClick={handleClick}>
              <h2 className='text-2xl font-bold'>Gridtap Turbo</h2>
            </Link>
            <div className='md:hidden'>
              <button
                className='p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border'
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-6 h-6 text-gray-300'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-6 h-6 text-gray-300'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`flex-1 justify-self-center border-x border-t p-4 rounded-t-md md:block md:p-0 md:mt-0 md:border-none ${
              navbar ? 'block' : 'hidden'
            }`}
          >
            <ul className='items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0'>
              <li className='text-gray-300 hover:text-blue-300'>
                <Link to='/' onClick={handleClick}>
                  Home
                </Link>
              </li>
              <li className='text-gray-300 hover:text-blue-300'>
                <Link to='/rankings' onClick={handleClick}>
                  Rankings
                </Link>
              </li>
              <li className='text-gray-300 hover:text-blue-300'>
                <Link to='/play' onClick={handleClick}>
                  Play
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div
            className={`flex-1 justify-self-center border p-4 rounded-b-md md:block md:p-0 md:mt-0 md:border-none ${
              navbar ? 'block' : 'hidden'
            }`}
          >
            {username ? (
              <ul className='items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0 select-none'>
                <li className='text-gray-300'>
                  Welcome,{' '}
                  <span
                    className='hover:text-blue-300 cursor-pointer'
                    onClick={handleDropdownClick}
                  >
                    {username}
                  </span>
                  !
                  {dropdownOpen && (
                    <div className='absolute mt-2 z-10'>
                      <Dropdown username={username} handleClick={handleClick} />
                    </div>
                  )}
                </li>
              </ul>
            ) : (
              <ul className='items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0'>
                <li className='text-gray-300 hover:text-blue-300'>
                  <Link to='/login' onClick={handleClick}>
                    Log in
                  </Link>
                </li>
                <li className='text-gray-300 hover:text-blue-300 md:hover:text-black md:hover:bg-white md:border md:rounded md:px-2 md:py-1'>
                  <Link to='/register' onClick={handleClick}>
                    Register
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
