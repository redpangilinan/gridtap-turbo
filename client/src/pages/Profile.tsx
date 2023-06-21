import { useQuery } from '@tanstack/react-query';
import { getUserByUsername } from '../api/users';
import { useParams } from 'react-router-dom';
import ProfilePage from '../components/pages/Profile/ProfilePage';

import LoadingSpinner from '../components/loaders/LoadingSpinner';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { status, data: user } = useQuery({
    queryKey: ['users', username as string],
    queryFn: () => getUserByUsername(username as string),
  });

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
    <div className='container mx-auto'>
      <ProfilePage data={user} />
    </div>
  );
};

export default Profile;
