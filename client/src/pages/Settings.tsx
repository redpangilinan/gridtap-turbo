import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { updateUserInfo, getUserSettings } from '../api/users';
import ErrorMessage from '../components/common/ErrorMessage';

type Inputs = {
  username: string;
  email: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

type TokenData = {
  auth: {
    accessToken: string;
    decoded: {
      userId: number;
    };
  };
  refreshToken: () => void;
};

const Settings: React.FC<TokenData> = ({ auth, refreshToken }) => {
  const [infoInputData, setInfoInputData] = useState<Inputs>({} as Inputs);
  const [passwordInputData, setPasswordInputData] = useState<Inputs>(
    {} as Inputs
  );
  const [message, setMessage] = useState('');
  const [messagePass, setMessagePass] = useState('');

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    watch,
    formState: { errors: errorsPass },
  } = useForm<Inputs>();
  const navigate = useNavigate();

  useQuery({
    queryKey: ['users', auth?.decoded?.userId],
    queryFn: () => getUserSettings(auth?.decoded?.userId),
    enabled: !!auth,
    onSuccess: (data) => {
      setValue('username', data.username);
      setValue('email', data.email);
    },
  });

  // Update account information
  const updateInfo = useMutation({
    mutationFn: () => updateUserInfo(infoInputData, auth),
    onSuccess: () => {
      navigate(0);
    },
    onError: () => {
      try {
        refreshToken();
        updateInfo.mutate();
      } catch (error) {
        setMessage('Username or email is already taken!');
      }
    },
  });

  // Update account password
  const updatePass = useMutation({
    mutationFn: () => updateUserInfo(passwordInputData, auth, 'password'),
    onSuccess: () => {
      navigate(0);
    },
    onError: async () => {
      try {
        refreshToken();
        updatePass.mutate();
      } catch (error) {
        setMessagePass('Your password is incorrect!');
      }
    },
  });

  const onSubmitInfo: SubmitHandler<Inputs> = async (data) => {
    setInfoInputData(data);
    updateInfo.mutate();
  };

  const onSubmitPass: SubmitHandler<Inputs> = async (data) => {
    setPasswordInputData(data);
    updatePass.mutate();
  };

  // Validate white spaces
  const validateWhitespace = (value: string) => {
    if (value.trim() !== value) {
      return 'Whitespace at the beginning or end is not allowed';
    }
    return true;
  };

  if (!auth) {
    navigate('/login');
  }

  return (
    <>
      <div className='flex flex-col items-center'>
        <form
          onSubmit={handleSubmit(onSubmitInfo)}
          className='max-w-lg w-full bg-neutral-800 rounded p-6 md:p-10 mt-4 mx-2 space-y-4 shadow h-full'
        >
          <div className='pb-2'>
            <h2 className='text-xl font-bold text-white'>Information</h2>
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
              className='w-full p-2 md:p-3 text-sm bg-neutral-50 focus:outline-none border border-neutral-200 rounded text-neutral-600'
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
              className='w-full p-2 md:p-3 text-sm bg-neutral-50 focus:outline-none border border-neutral-200 rounded text-neutral-600'
              type='text'
              placeholder='Email (Optional)'
            />
            {errors.email && (
              <span className='text-red-400' role='alert'>
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <input
              type='submit'
              className='w-full py-2 md:py-3 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold cursor-pointer text-neutral-50 transition duration-200'
              value={updateInfo.isLoading ? 'Loading...' : 'Save changes'}
              disabled={updateInfo.isLoading}
            />
          </div>
        </form>
        <form
          onSubmit={handleSubmitPass(onSubmitPass)}
          className='max-w-lg w-full bg-neutral-800 rounded p-6 md:p-10 mt-4 mx-2 space-y-4 shadow h-full'
        >
          <div className='pb-2'>
            <h2 className='text-xl font-bold text-white'>Password</h2>
          </div>
          {messagePass && (
            <ErrorMessage
              data={messagePass}
              onClose={() => setMessagePass('')}
            />
          )}
          <div className='pb-2'>
            <input
              {...registerPass('oldPassword', {
                required: {
                  value: true,
                  message: 'This field is required',
                },
                validate: validateWhitespace,
              })}
              className='w-full p-2 md:p-3 text-sm bg-neutral-50 focus:outline-none border border-neutral-200 rounded text-neutral-600'
              type='password'
              placeholder='Current Password'
            />
            {errorsPass.oldPassword && (
              <span className='text-red-400' role='alert'>
                {errorsPass.oldPassword.message}
              </span>
            )}
          </div>
          <div className='pb-2'>
            <input
              {...registerPass('password', {
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
              className='w-full p-2 md:p-3 text-sm bg-neutral-50 focus:outline-none border border-neutral-200 rounded text-neutral-600'
              type='password'
              placeholder='New Password'
            />
            {errorsPass.password && (
              <span className='text-red-400' role='alert'>
                {errorsPass.password.message}
              </span>
            )}
          </div>
          <div className='pb-2'>
            <input
              {...registerPass('confirmPassword', {
                validate: (val: string) => {
                  if (watch('password') != val) {
                    return 'Passwords do not match';
                  }
                },
              })}
              className='w-full p-2 md:p-3 text-sm bg-neutral-50 focus:outline-none border border-neutral-200 rounded text-neutral-600'
              type='password'
              placeholder='Confirm Password'
            />
            {errorsPass.confirmPassword && (
              <span className='text-red-400' role='alert'>
                {errorsPass.confirmPassword.message}
              </span>
            )}
          </div>
          <div>
            <input
              type='submit'
              className='w-full py-2 md:py-3 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold cursor-pointer text-neutral-50 transition duration-200'
              value={updatePass.isLoading ? 'Loading...' : 'Save changes'}
              disabled={updatePass.isLoading}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Settings;
