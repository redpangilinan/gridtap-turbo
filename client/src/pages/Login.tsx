import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import ErrorMessage from '../components/common/ErrorMessage';
import { login } from '../api/authentication';

type Inputs = {
  username: string;
  password: string;
};

type tokenData = {
  auth: {
    accessToken: string;
  };
};

const Login: React.FC<tokenData> = ({ auth }) => {
  const { register, handleSubmit } = useForm<Inputs>();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  if (auth) {
    navigate('/');
  }

  // Call API to login account
  const loginUser = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(0);
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 500) {
        setMessage('Your username or password is incorrect!');
      } else {
        setMessage('Connection failed! Please try again later.');
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    loginUser.mutate(data);
  };

  return (
    <div className='flex-grow container mx-auto'>
      <div className='flex justify-center items-center h-full'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='max-w-lg w-full bg-neutral-800 rounded p-6 md:p-12 mt-12 mx-2 space-y-4 shadow'
        >
          <div className='pb-2'>
            <h2 className='text-xl font-bold text-white'>
              Login to your account
            </h2>
          </div>
          {message && (
            <ErrorMessage data={message} onClose={() => setMessage('')} />
          )}
          <div className='pb-2'>
            <input
              {...register('username')}
              className='w-full p-2 md:p-3 text-sm bg-neutral-50 focus:outline-none border border-neutral-200 rounded text-neutral-600'
              type='text'
              placeholder='Username'
            />
          </div>
          <div className='pb-2'>
            <input
              {...register('password')}
              className='w-full p-2 md:p-3 text-sm bg-neutral-50 focus:outline-none border border-neutral-200 rounded text-neutral-600'
              type='password'
              placeholder='Password'
            />
          </div>
          {/* <div className='flex items-center justify-end pb-4'>
          <div>
            <Link
              to='/forgot-password'
              className='text-sm text-blue-600 hover:underline'
            >
              Forgot password?
            </Link>
          </div>
        </div> */}
          <div>
            <input
              type='submit'
              className='w-full py-2 md:py-3 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold cursor-pointer text-neutral-50 transition duration-200'
              value={loginUser.isLoading ? 'Logging in...' : 'Log in'}
              disabled={loginUser.isLoading}
            />
          </div>
          <p className='text-sm font-light text-neutral-400'>
            Don’t have an account yet?{' '}
            <Link
              to='/register'
              className='text-sm text-blue-600 hover:underline'
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
