import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingTable = () => {
  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left text-gray-400'>
        <thead className='text-xs uppercase bg-gray-700 text-gray-400'>
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
          </tr>
        </thead>
        <tbody className='bg-gray-800 divide-y divide-gray-700'>
          {Array.from({ length: 10 }).map((_, index) => (
            <tr
              key={index}
              className='border-b bg-gray-800 border-gray-700 hover:bg-gray-600'
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoadingTable;
