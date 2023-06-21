type ExpProps = {
  lvl: number;
  exp: number;
};

const ExpBar: React.FC<ExpProps> = ({ lvl, exp }) => {
  const expPercent = `${exp}%`;

  return (
    <div className='flex items-center gap-4 mb-4'>
      <p className='text-neutral-400'>Lv.{lvl}</p>
      <div className='w-full bg-neutral-200 max-h-4 rounded-full select-none'>
        {exp != 0 ? (
          <div
            className='bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full'
            style={{ width: expPercent }}
          >
            {expPercent}
          </div>
        ) : (
          <div
            className='bg-neutral-200 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full none'
            style={{ width: '100%' }}
          >
            {expPercent}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpBar;
