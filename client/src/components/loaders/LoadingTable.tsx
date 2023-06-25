import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingTable = () => {
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
          {Array.from({ length: 25 }).map((_, index) => (
            <tr
              key={index}
              className='border-b bg-neutral-800 border-neutral-700 hover:bg-neutral-600'
            >
              <td className='px-6 py-4'>
                <Skeleton
                  className='animate-pulse'
                  width={30}
                  height={15}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                />
              </td>
              <td className='px-6 py-4'>
                <Skeleton
                  className='animate-pulse'
                  width={150}
                  height={15}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                />
              </td>
              <td className='px-6 py-4'>
                <Skeleton
                  className='animate-pulse'
                  width={30}
                  height={15}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                />
              </td>
              <td className='px-6 py-4'>
                <Skeleton
                  className='animate-pulse'
                  width={30}
                  height={15}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                />
              </td>
              <td className='px-6 py-4'>
                <Skeleton
                  className='animate-pulse'
                  width={30}
                  height={15}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                />
              </td>
              <td className='px-6 py-4'>
                <Skeleton
                  className='animate-pulse'
                  width={50}
                  height={15}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoadingTable;
