import Badge from '../../common/Badge';
import ExpBar from './ExpBar';
import ScoreCard from './ScoreCard';
import LastOnline from './LastOnline';

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
      updated_at: string;
    };
    rank: {
      user_rank: number;
    };
    stats: {
      total_hits: number;
      highest_hits: number;
      average_acc: number;
      total_score: number;
    };
    scores: [];
  };
};

const ProfilePage: React.FC<ProfileProps> = ({ data }) => {
  return (
    <div className='w-full rounded shadow p-2'>
      <div className='flex flex-col lg:flex-row gap-2'>
        <div className='w-full lg:w-1/3 bg-neutral-800 p-4 md:p-8 h-full rounded-md'>
          <h1 className='text-2xl font-bold'>
            {data.user.username}
            {data.rank.user_rank == 1 && (
              <Badge className='bg-yellow-200 text-yellow-700'>#1</Badge>
            )}
            {data.user.user_type === 'admin' && <Badge>Dev</Badge>}
          </h1>
          <p className='text-neutral-400 mb-4'>Rank #{data.rank.user_rank}</p>
          <ExpBar lvl={data.user.level} exp={data.user.exp_percent} />
          <div className='flex'>
            <div className='flex-1'>Total Score</div>
            <div className='flex-1'>
              {Number(data.stats.total_score).toLocaleString() ?? 0}
            </div>
          </div>
          <div className='flex'>
            <div className='flex-1'>Highest Score</div>
            <div className='flex-1'>{data.user.top_score ?? 0}</div>
          </div>
          <div className='flex'>
            <div className='flex-1'>Scores</div>
            <div className='flex-1'>
              {Number(data.user.scores).toLocaleString() ?? 0}
            </div>
          </div>
          <div className='flex'>
            <div className='flex-1'>Average Acc</div>
            <div className='flex-1'>{Number(data.stats.average_acc) ?? 0}%</div>
          </div>
          <div className='flex'>
            <div className='flex-1'>Total Hits</div>
            <div className='flex-1'>
              {Number(data.stats.total_hits).toLocaleString() ?? 0}
            </div>
          </div>
          <div className='flex'>
            <div className='flex-1'>Highest Hits</div>
            <div className='flex-1'>{data.stats.highest_hits ?? 0}</div>
          </div>
          <div className='text-neutral-400 flex flex-col-reverse md:flex-row justify-between mt-4'>
            Joined{' '}
            {new Date(data.user.created_at).toLocaleString('en-US', {
              month: 'long',
              day: '2-digit',
              year: 'numeric',
            })}
            <LastOnline time={data.user.updated_at} />
          </div>
        </div>
        <div className='w-full lg:w-2/3 bg-neutral-800 p-4 md:p-8 rounded-md'>
          <h1 className='text-2xl font-bold mb-4'>Top Scores</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
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
