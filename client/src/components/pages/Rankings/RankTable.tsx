import { Link } from 'react-router-dom';
import Badge from '../../common/Badge';

type TableData = {
  user_id: number;
  username: string;
  level: number;
  exp_percent: number;
  scores: number;
  top_score: number;
  total_score: number;
  user_rank: number;
  user_type: string;
};

type RankTableProps = {
  data: {
    data: TableData[];
  };
};

const RankTable: React.FC<RankTableProps> = ({ data }) => {
  if (data.data.length <= 0) {
    return <div>No users</div>;
  }

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left text-neutral-400'>
        <thead className='text-xs uppercase bg-neutral-700 text-neutral-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Rank
            </th>
            <th scope='col' className='px-6 py-3'>
              Username
            </th>
            <th scope='col' className='px-6 py-3'>
              Level
            </th>
            <th scope='col' className='px-6 py-3'>
              Scores
            </th>
            <th scope='col' className='px-6 py-3'>
              Highest Score
            </th>
            <th scope='col' className='px-6 py-3'>
              Total Score
            </th>
          </tr>
        </thead>
        <tbody className='bg-neutral-800 divide-y divide-neutral-700'>
          {data.data.map((user) => (
            <tr
              key={user.user_id}
              className=' border-b bg-neutral-800 border-neutral-700 hover:bg-neutral-600'
            >
              <td className='px-6 py-4'>{user.user_rank}</td>
              <td className='px-6 py-4 font-medium whitespace-nowrap text-white'>
                <Link
                  to={`/user/${user.username}`}
                  className='max-w-xs overflow-hidden inline-block truncate hover:text-neutral-100'
                >
                  {user.username}
                  {user.user_rank == 1 && (
                    <Badge className='bg-yellow-200 text-yellow-700'>#1</Badge>
                  )}
                  {user.user_type === 'admin' && <Badge>Dev</Badge>}
                </Link>
              </td>
              <td className='px-6 py-4'>
                Lv.{user.level} - {user.exp_percent}%
              </td>
              <td className='px-6 py-4'>
                {Number(user.scores).toLocaleString()}
              </td>
              <td className='px-6 py-4'>
                {Number(user.top_score).toLocaleString()}
              </td>
              <td className='px-6 py-4 font-medium whitespace-nowrap text-white'>
                {Number(user.total_score).toLocaleString() ?? 1}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankTable;
