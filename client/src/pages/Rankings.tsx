import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RankTable from '../components/RankTable';
import LoadingTable from '../components/LoadingTable';

type TableData = {
  user_id: number;
  username: string;
  level: number;
  exp_percent: number;
  scores: number;
  top_score: number;
};

const Rankings: React.FC = () => {
  const [userData, setUserData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 350));

        const apiUrl = `http://localhost:3001/users`;
        const response = await axios.get(apiUrl);

        setUserData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className='flex-grow container mx-auto px-2'>
      <h1 className='text-xl font-bold my-3'>Rankings</h1>
      {isLoading ? <LoadingTable /> : <RankTable data={userData} />}
    </div>
  );
};

export default Rankings;
