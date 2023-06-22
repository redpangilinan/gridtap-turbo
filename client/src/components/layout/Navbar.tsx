import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../common/Dropdown';

type tokenData = {
  auth: {
    decoded: {
      username: string;
    };
  };
};

const Navbar: React.FC<tokenData> = ({ auth }) => {
  const [navbar, setNavbar] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownClick = () => {
    setDropdown(!dropdown);
  };

  const handleClick = async () => {
    setNavbar(false);
    setDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className='w-full bg-neutral-900 select-none'>
      <div className='justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8'>
        <div>
          <div className='flex items-center justify-between py-3 md:py-5 md:block'>
            <Link to='/' onClick={handleClick}>
              <h2 className='text-2xl font-bold'>Gridtap Turbo</h2>
            </Link>
            <div className='md:hidden'>
              <button
                className='p-2 text-neutral-700 rounded-md outline-none focus:border-neutral-400 focus:border'
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-6 h-6 text-neutral-300'
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
                    className='w-6 h-6 text-neutral-300'
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
              <li className='text-neutral-300 hover:text-blue-300'>
                <Link to='/' onClick={handleClick}>
                  Home
                </Link>
              </li>
              <li className='text-neutral-300 hover:text-blue-300'>
                <Link to='/rankings' onClick={handleClick}>
                  Rankings
                </Link>
              </li>
              <li className='text-neutral-300 hover:text-blue-300'>
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
            ref={dropdownRef}
          >
            {auth && auth.decoded.username ? (
              <ul className='items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0 select-none'>
                <li className='text-neutral-300'>
                  Welcome,{' '}
                  <span
                    className='hover:text-blue-300 cursor-pointer'
                    onClick={handleDropdownClick}
                  >
                    {auth.decoded.username}
                  </span>
                  !
                  {dropdown && (
                    <div className='absolute mt-2 z-10'>
                      <Dropdown
                        username={auth.decoded.username}
                        handleClick={handleClick}
                      />
                    </div>
                  )}
                </li>
              </ul>
            ) : (
              <ul className='items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0'>
                <li className='text-neutral-300 hover:text-blue-300'>
                  <Link to='/login' onClick={handleClick}>
                    Log in
                  </Link>
                </li>
                <li className='text-neutral-300 hover:text-blue-300 md:hover:text-black md:hover:bg-white md:border md:rounded md:px-2 md:py-1'>
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
