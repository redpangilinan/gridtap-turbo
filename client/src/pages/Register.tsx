import { useForm, SubmitHandler } from 'react-hook-form';

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
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch('password'));

  return (
    <div className='flex justify-center items-center h-full'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='max-w-lg w-full bg-gray-800 rounded p-6 md:p-12 mt-12 mx-2 space-y-4 shadow'
      >
        <div className='pb-2'>
          <h2 className='text-xl font-bold text-white'>Create an account</h2>
        </div>
        <div className='pb-2'>
          <input
            {...register('username', { required: true, maxLength: 30 })}
            className='w-full p-2 md:p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600'
            type='text'
            placeholder='Username'
          />
          {errors.username && (
            <span className='text-red-400' role='alert'>
              This field is required
            </span>
          )}
        </div>
        <div className='pb-2'>
          <input
            {...register('email', {
              maxLength: 64,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
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
              required: true,
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
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
          <a href='/login' className='text-sm text-blue-600 hover:underline'>
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
