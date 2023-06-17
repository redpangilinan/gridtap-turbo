import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { login, validateLogin } from '../service/authService';
import ErrorMessage from '../components/ErrorMessage';

type Inputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    validateLogin(navigate);
  }, [navigate]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));

      const apiUrl = `${import.meta.env.VITE_BASE_URL}/users`;
      const response = await axios.post(apiUrl, data);

      if (response.status === 200) {
        const loginData = {
          username: data.username,
          password: data.password,
        };

        await login(loginData);
      } else {
        setMessage('Failed to create an account');
      }
    } catch (error) {
      setMessage('The username or email is already taken!');
    }
  };

  // Validate white spaces
  const validateWhitespace = (value: string) => {
    if (value.trim() !== value) {
      return 'Whitespace at the beginning or end is not allowed';
    }
    return true;
  };

  return (
    <div className='flex justify-center items-center h-full'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='max-w-lg w-full bg-gray-800 rounded p-6 md:p-12 mt-12 mx-2 space-y-4 shadow'
      >
        <div className='pb-2'>
          <h2 className='text-xl font-bold text-white'>Create an account</h2>
        </div>
        {message && (
          <ErrorMessage data={message} onClose={() => setMessage('')} />
        )}
        <div className='pb-2'>
          <input
            {...register('username', {
              required: {
                value: true,
                message: 'This field is required',
              },
              minLength: {
                value: 3,
                message: 'Username must not be shorter than 3 characters',
              },
              maxLength: {
                value: 30,
                message: 'Username must not be longer than 30 characters',
              },
              validate: validateWhitespace,
            })}
            className='w-full p-2 md:p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600'
            type='text'
            placeholder='Username'
          />
          {errors.username && (
            <span className='text-red-400' role='alert'>
              {errors.username.message}
            </span>
          )}
        </div>
        <div className='pb-2'>
          <input
            {...register('email', {
              maxLength: {
                value: 64,
                message: 'Email must not be longer than 64 characters',
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
              validate: validateWhitespace,
            })}
            className='w-full p-2 md:p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600'
            type='text'
            placeholder='Email (Optional)'
          />
          {errors.email && (
            <span className='text-red-400' role='alert'>
              {errors.email.message}
            </span>
          )}
        </div>
        <div className='pb-2'>
          <input
            {...register('password', {
              required: {
                value: true,
                message: 'This field is required',
              },
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
              validate: validateWhitespace,
            })}
            className='w-full p-2 md:p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600'
            type='password'
            placeholder='Password'
          />
          {errors.password && (
            <span className='text-red-400' role='alert'>
              {errors.password.message}
            </span>
          )}
        </div>
        <div className='pb-2'>
          <input
            {...register('confirmPassword', {
              validate: (val: string) => {
                if (watch('password') != val) {
                  return 'Passwords do not match';
                }
              },
            })}
            className='w-full p-2 md:p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600'
            type='password'
            placeholder='Confirm Password'
          />
          {errors.confirmPassword && (
            <span className='text-red-400' role='alert'>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <div>
          <input
            type='submit'
            className='w-full py-2 md:py-3 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold cursor-pointer text-gray-50 transition duration-200'
            value='Register'
          />
        </div>
        <p className='text-sm font-light text-gray-400'>
          Already have an account?{' '}
          <Link to='/login' className='text-sm text-blue-600 hover:underline'>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
