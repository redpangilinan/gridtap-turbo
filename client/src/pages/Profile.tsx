import { useQuery } from '@tanstack/react-query';
import { getUserByUsername } from '../api/users';
import { useParams } from 'react-router-dom';
import ExpBar from '../components/pages/Profile/ExpBar';
import LoadingSpinner from '../components/loaders/LoadingSpinner';
import Badge from '../components/common/Badge';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { status, data: user } = useQuery({
    queryKey: ['users', username as string],
    queryFn: () => getUserByUsername(username as string),
  });
  // Mock data for the user profile
  const userProfile = {
    username: 'JohnDoe',
    level: 20,
    exp: 5000,
    playCount: 100,
    about: 'I love playing games and setting high scores!',
    topScores: [1000, 950, 900, 850, 800, 750, 700, 650, 600, 550],
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className='max-w-5xl mx-auto bg-neutral-800 px-4 py-8'>
        User Not Found
      </div>
    );
  }

  return (
    <div className='container bg-neutral-900 mx-auto'>
      <div className='w-full rounded shadow p-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          <div className='w-full lg:w-1/3 bg-neutral-800 p-8 h-full rounded-md'>
            <h2 className='text-2xl font-bold mb-4'>
              {user.username}
              {user.user_type === 'admin' && <Badge>Dev</Badge>}
            </h2>
            <ExpBar lvl={user.level} exp={user.exp_percent} />
            <div className='flex mb-4'>
              <div className='flex-1'>
                <p>
                  <span className='font-bold'>Best Score:</span>{' '}
                  {user.top_score}
                </p>
              </div>
              <div className='flex-1'>
                <p>
                  <span className='font-bold'>Total Scores:</span> {user.scores}
                </p>
              </div>
            </div>
            <div>
              Joined{' '}
              {new Date(user.created_at).toLocaleString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>
          <div className='w-full lg:w-2/3 bg-neutral-800 p-8 rounded-md'>
            <h2 className='text-2xl font-bold mb-4'>Top Scores</h2>
            <div className='grid grid-cols-2 gap-4'>
              {userProfile.topScores.map((score, index) => (
                <div key={index} className='bg-neutral-700 rounded shadow p-4'>
                  <p className='font-bold'>Score {index + 1}:</p>
                  <p>{score}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
