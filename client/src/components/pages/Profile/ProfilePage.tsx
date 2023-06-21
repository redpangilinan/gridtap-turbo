import ExpBar from '../../pages/Profile/ExpBar';
import Badge from '../../common/Badge';
import ScoreCard from './ScoreCard';

type ProfileProps = {
  data: {
    user: {
      username: string;
      user_type: string;
      level: number;
      exp_percent: number;
      top_score: number;
      scores: number;
      created_at: string;
    };
    scores: [];
  };
};

const ProfilePage: React.FC<ProfileProps> = ({ data }) => {
  return (
    <div className='w-full rounded shadow p-6'>
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className='w-full lg:w-1/3 bg-neutral-800 p-4 md:p-8 h-full rounded-md'>
          <h2 className='text-2xl font-bold mb-4'>
            {data.user.username}
            {data.user.user_type === 'admin' && <Badge>Dev</Badge>}
          </h2>
          <ExpBar lvl={data.user.level} exp={data.user.exp_percent} />
          <div className='flex mb-4'>
            <div className='flex-1'>
              <p>
                <span className='font-bold'>Best Score:</span>{' '}
                {data.user.top_score}
              </p>
            </div>
            <div className='flex-1'>
              <p>
                <span className='font-bold'>Total Scores:</span>{' '}
                {data.user.scores}
              </p>
            </div>
          </div>
          <div className='text-neutral-400'>
            Joined{' '}
            {new Date(data.user.created_at).toLocaleString('en-US', {
              month: 'long',
              day: '2-digit',
              year: 'numeric',
            })}
          </div>
        </div>
        <div className='w-full lg:w-2/3 bg-neutral-800 p-4 md:p-8 rounded-md'>
          <h2 className='text-2xl font-bold mb-4'>Top Scores</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {data.scores.length > 0 ? (
              data.scores.map((score, index) => (
                <div
                  key={index}
                  className='bg-neutral-700 rounded-lg shadow-md p-4'
                >
                  <ScoreCard score={score} />
                </div>
              ))
            ) : (
              <p>There are no scores available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
