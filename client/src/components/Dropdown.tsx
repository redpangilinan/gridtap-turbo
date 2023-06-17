import React from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { Link } from 'react-router-dom';
import { logout } from '../service/authService';

type DropdownProps = {
  username: string;
  handleClick: () => void;
};

const Dropdown: React.FC<DropdownProps> = ({ username, handleClick }) => {
  const handleLogout = async () => {
    logout();
  };

  return (
    <div
      id='dropdown'
      className='z-10 divide-y rounded-lg shadow w-44 bg-gray-700 divide-gray-600'
    >
      <ul
        className='py-2 text-sm text-gray-200'
        aria-labelledby='dropdownButton'
      >
        <li>
          <Link
            to={`/user/${username}`}
            onClick={handleClick}
            className='block px-4 py-2 hover:bg-gray-600 hover:text-white'
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to='/settings'
            onClick={handleClick}
            className='block px-4 py-2 hover:bg-gray-600 hover:text-white'
          >
            Settings
          </Link>
        </li>
      </ul>
      <div className='py-2'>
        {/* a href for page refresh (re-renders the whole page) */}
        <a
          href='/login'
          onClick={handleLogout}
          className='block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white'
        >
          Log out
        </a>
      </div>
    </div>
  );
};

export default Dropdown;
