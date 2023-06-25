import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { getUserCount } from '../api/users';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Home = () => {
  const { status, data } = useQuery({
    queryKey: ['stats'],
    queryFn: getUserCount,
  });

  return (
    <div className='flex flex-grow flex-col justify-center items-center gap-5 container mx-auto px-2'>
      <h1 className='text-5xl font-extrabold'>Gridtap Turbo</h1>
      <h2 className='text-xl font-medium text-center'>
        Tap fast and climb the leaderboards in Gridtap Turbo, a fast-paced
        grid-tapping challenge.
      </h2>
      <div className='flex gap-4 mb-4'>
        <div className='p-2'>
          <p className='text-sm text-neutral-400'>Users</p>
          <span className='text-xl'>
            {status === 'loading' ? (
              <Skeleton
                className='animate-pulse'
                width={40}
                height={15}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              />
            ) : status === 'error' ? (
              <Skeleton
                className='animate-pulse'
                width={40}
                height={15}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              />
            ) : (
              Number(data.user_count?.total_count).toLocaleString()
            )}
          </span>
        </div>
        <div className='p-2'>
          <p className='text-sm text-neutral-400'>Online Users</p>
          <span className='text-xl'>
            {status === 'loading' ? (
              <Skeleton
                className='animate-pulse'
                width={40}
                height={15}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              />
            ) : status === 'error' ? (
              <Skeleton
                className='animate-pulse'
                width={40}
                height={15}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              />
            ) : (
              Number(data.active_users?.online_users).toLocaleString()
            )}
          </span>
        </div>
        <div className='p-2'>
          <p className='text-sm text-neutral-400'>Highest Score</p>
          <span className='text-xl'>
            {status === 'loading' ? (
              <Skeleton
                className='animate-pulse'
                width={40}
                height={15}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              />
            ) : status === 'error' ? (
              <Skeleton
                className='animate-pulse'
                width={40}
                height={15}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              />
            ) : (
              Number(data.highest_score?.top_score).toLocaleString()
            )}
          </span>
        </div>
      </div>
      <Link to={`/play`}>
        <Button
          className='bg-white hover:bg-gray-200 text-gray-800'
          content='Play Now'
        />
      </Link>
    </div>
  );
};

export default Home;
