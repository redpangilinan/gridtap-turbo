import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/authentication';

type DropdownProps = {
  username: string;
  handleClick: () => void;
};

const Dropdown: React.FC<DropdownProps> = ({ username, handleClick }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Call API to logout account
  const logoutUser = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate(0);
      queryClient.clear();
    },
  });

  const handleLogout = () => {
    logoutUser.mutate();
  };

  return (
    <div
      id='dropdown'
      className='z-10 divide-y rounded-lg shadow w-44 bg-neutral-700 divide-neutral-600'
    >
      <ul
        className='py-2 text-sm text-neutral-200'
        aria-labelledby='dropdownButton'
      >
        <li>
          <Link
            to={`/user/${username}`}
            onClick={handleClick}
            className='block px-4 py-2 hover:bg-neutral-600 hover:text-white'
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to='/settings'
            onClick={handleClick}
            className='block px-4 py-2 hover:bg-neutral-600 hover:text-white'
          >
            Settings
          </Link>
        </li>
      </ul>
      <div className='py-2'>
        {/* a href for page refresh (re-renders the whole page) */}
        <Link
          to='/login'
          onClick={handleLogout}
          className='block px-4 py-2 text-sm hover:bg-neutral-600 text-neutral-200 hover:text-white'
        >
          Log out
        </Link>
      </div>
    </div>
  );
};

export default Dropdown;
