import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/users';
import RankTable from '../components/pages/Rankings/RankTable';
import Pagination from '../components/pages/Rankings/Pagination';
import LoadingTable from '../components/loaders/LoadingTable';

const Rankings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const pageParam = Number(queryParams.get('page')) || 1;

  const [page, setPage] = useState(pageParam);
  const { status, data } = useQuery(['users', page], () => getUsers(page));

  useEffect(() => {
    queryParams.set('page', page.toString());
    navigate(`?${queryParams.toString()}`);
  }, [page, queryParams, navigate]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className='flex-grow container mx-auto px-2'>
      {status === 'loading' ? (
        <LoadingTable />
      ) : status === 'error' ? (
        <LoadingTable />
      ) : (
        <>
          <Pagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            maxPageNumbers={3}
            onPageChange={handlePageChange}
          />
          <RankTable data={data || []} />
          <Pagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            maxPageNumbers={3}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Rankings;
