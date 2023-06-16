import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  username: string;
  password: string;
  remember: string;
};

const Login = () => {
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch('username'));

  return (
    <div className='flex justify-center items-center h-full'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='max-w-lg w-full bg-gray-800 rounded p-6 md:p-12 mt-12 mx-2 space-y-4 shadow'
      >
        <div className='pb-2'>
          <h2 className='text-xl font-bold text-white'>
            Login to your account
          </h2>
        </div>
        <div className='pb-2'>
          <input
            className='w-full p-2 md:p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600'
            type='text'
            placeholder='Username'
          />
        </div>
        <div className='pb-2'>
          <input
            className='w-full p-2 md:p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600'
            type='password'
            placeholder='Password'
          />
        </div>
        <div className='flex items-center justify-between pb-4'>
          <div className='flex flex-row items-center'>
            <input
              id='remember'
              aria-describedby='remember'
              type='checkbox'
              className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded'
              {...register('remember', { required: true })}
            />
            <label
              htmlFor='remember'
              className='ml-2 text-sm font-normal text-gray-400'
            >
              Remember me
            </label>
          </div>
          <div>
            <a
              className='text-sm text-blue-600 hover:underline'
              href='/forgot-password'
            >
              Forgot password?
            </a>
          </div>
        </div>
        <div>
          <input
            type='submit'
            className='w-full py-2 md:py-3 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold cursor-pointer text-gray-50 transition duration-200'
            value='Log in'
          />
        </div>
        <p className='text-sm font-light text-gray-400'>
          Don’t have an account yet?{' '}
          <a href='/register' className='text-sm text-blue-600 hover:underline'>
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
