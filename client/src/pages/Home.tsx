import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className='flex flex-grow flex-col justify-center items-center gap-5 container mx-auto px-2'>
      <h1 className='text-5xl font-extrabold'>GridTap Turbo</h1>
      <h2 className='text-xl font-medium text-center'>
        Tap fast and climb the leaderboards in GridTap Turbo, a fast-paced
        grid-tapping challenge.
      </h2>
      <Link to={`/play`}>
        <Button
          className='bg-white hover:bg-gray-200 text-gray-800'
          content='Play Now'
        />
      </Link>
    </div>
  );
};

export default Home;
