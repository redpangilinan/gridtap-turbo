import React from 'react';
import { Link } from 'react-router-dom';

type TableData = {
  user_id: number;
  username: string;
  level: number;
  exp_percent: number;
  scores: number;
  top_score: number;
};

type RankTableProps = {
  data: TableData[];
};

const RankTable: React.FC<RankTableProps> = ({ data }) => {
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
              Top Score
            </th>
          </tr>
        </thead>
        <tbody className='bg-neutral-800 divide-y divide-neutral-700'>
          {data.map((user, index) => (
            <tr
              key={user.user_id}
              className=' border-b bg-neutral-800 border-neutral-700 hover:bg-neutral-600'
            >
              <td className='px-6 py-4'>{index + 1}</td>
              <td className='px-6 py-4 font-medium whitespace-nowrap text-white'>
                <Link
                  to={`/user/${user.username}`}
                  className='max-w-xs overflow-hidden inline-block truncate hover:text-neutral-100'
                >
                  {user.username}
                </Link>
              </td>
              <td className='px-6 py-4'>
                Lvl {user.level} - {user.exp_percent}%
              </td>
              <td className='px-6 py-4'>{user.scores}</td>
              <td className='px-6 py-4 font-medium whitespace-nowrap text-white'>
                {user.top_score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankTable;
