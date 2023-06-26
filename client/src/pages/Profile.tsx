import { useQuery } from '@tanstack/react-query';
import { getUserByUsername } from '../api/users';
import { useParams } from 'react-router-dom';
import ProfilePage from '../components/pages/Profile/ProfilePage';

import LoadingSpinner from '../components/loaders/LoadingSpinner';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { status, data } = useQuery({
    queryKey: ['users', username as string],
    queryFn: () => getUserByUsername(username as string),
  });

  if (status === 'loading') {
    return (
      <div className='flex-grow container mx-auto text-center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!data.user) {
    return (
      <div className='flex-grow container mx-auto pt-6'>
        <div className='max-w-xs mx-auto bg-neutral-800 px-4 py-8 text-center rounded-md text-lg'>
          User Not Found
        </div>
      </div>
    );
  }

  return (
    <div className='flex-grow container mx-auto'>
      <ProfilePage data={data} />
    </div>
  );
};

export default Profile;
