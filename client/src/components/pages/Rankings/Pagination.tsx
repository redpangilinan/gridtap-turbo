type PaginationProps = {
  currentPage: number;
  totalPages: number;
  maxPageNumbers: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPageNumbers,
}) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Calculate the range of pages to be displayed
    let startPage = Math.max(currentPage - Math.floor(maxPageNumbers / 2), 1);
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    // Adjust the startPage if the range exceeds the total number of pages
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }

    // Add ellipsis and the first page number
    if (startPage > 1) {
      pageNumbers.push(
        <li
          key={1}
          className={`inline-block mx-0.5 px-3 py-1 rounded-md cursor-pointer ${
            1 === currentPage
              ? 'bg-neutral-500'
              : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-500'
          }`}
          onClick={() => onPageChange(1)}
        >
          {1}
        </li>
      );

      if (startPage > 2) {
        pageNumbers.push(
          <li
            key='ellipsis-start'
            className='inline-block px-3 py-1 rounded-md cursor-pointer text-neutral-300'
            onClick={() => onPageChange(startPage - 1)}
          >
            ...
          </li>
        );
      }
    }

    // Add the page numbers within the range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`inline-block mx-0.5 px-3 py-1 rounded-md cursor-pointer ${
            i === currentPage
              ? 'bg-neutral-500'
              : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-500'
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </li>
      );
    }

    // Add ellipsis and the last page number
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <li
            key='ellipsis-end'
            className='inline-block px-3 py-1 rounded-md cursor-pointer text-neutral-300'
            onClick={() => onPageChange(endPage + 1)}
          >
            ...
          </li>
        );
      }

      pageNumbers.push(
        <li
          key={totalPages}
          className={`inline-block mx-0.5 px-3 py-1 rounded-md cursor-pointer ${
            totalPages === currentPage
              ? 'bg-neutral-500'
              : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-500'
          }`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <ul className='flex justify-center my-4 select-none'>
      <li
        className={`inline-block mx-0.5 px-3 py-1 rounded-md cursor-pointer ${
          currentPage <= 1
            ? 'bg-neutral-700 opacity-50 pointer-events-none'
            : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-500'
        }`}
        onClick={() =>
          onPageChange(currentPage > totalPages ? totalPages : currentPage - 1)
        }
      >
        Prev
      </li>
      {renderPageNumbers()}
      <li
        className={`inline-block mx-0.5 px-3 py-1 rounded-md cursor-pointer ${
          currentPage >= totalPages
            ? 'bg-neutral-700 opacity-50 pointer-events-none'
            : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-500'
        }`}
        onClick={() => onPageChange(currentPage < 1 ? 1 : currentPage + 1)}
      >
        Next
      </li>
    </ul>
  );
};

export default Pagination;
