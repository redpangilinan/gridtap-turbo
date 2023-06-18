import RankTable from '../components/RankTable';
import LoadingTable from '../components/LoadingTable';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/users';

const Rankings = () => {
  const { status, data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  return (
    <div className='flex-grow container mx-auto px-2 pb-6'>
      <h1 className='text-xl font-bold my-3'>Rankings</h1>
      {status === 'loading' ? (
        <LoadingTable />
      ) : status === 'error' ? (
        <LoadingTable />
      ) : (
        <RankTable data={users || []} />
      )}
    </div>
  );
};

export default Rankings;
