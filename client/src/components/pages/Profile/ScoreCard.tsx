type Score = {
  score: {
    score_id: number;
    user_id: number;
    score: number;
    hits: number;
    miss: number;
    accuracy: number;
    max_combo: number;
    device: string;
    submitted_at: string;
  };
};

const ScoreCard: React.FC<Score> = ({ score }) => {
  let grade, theme;
  if (score.accuracy >= 99.99) {
    grade = 'SS';
    theme = 'bg-yellow-600 text-yellow-200';
  } else if (score.accuracy >= 98) {
    grade = 'S';
    theme = 'bg-violet-500 text-violet-100';
  } else if (score.accuracy >= 94) {
    grade = 'A';
    theme = 'bg-blue-600 text-blue-200';
  } else if (score.accuracy >= 90) {
    grade = 'B';
    theme = 'bg-green-600 text-green-200';
  } else if (score.accuracy >= 85) {
    grade = 'C';
    theme = 'bg-orange-600 text-orange-200';
  } else {
    grade = 'D';
    theme = 'bg-red-600 text-red-200';
  }

  return (
    <div className='flex items-center justify-between'>
      <div>
        <div className='grid grid-cols-2 mb-2'>
          <p>Hits: {score.hits}</p>
          <p>Miss: {score.miss}</p>
          <p>
            Acc:{' '}
            {Number.isInteger(Number(score.accuracy))
              ? Number(score.accuracy).toFixed(0)
              : Number(score.accuracy).toFixed(2)}
            %
          </p>
          <p>Combo: {score.max_combo}</p>
        </div>
        <p className='text-sm text-neutral-400'>
          Submitted at{' '}
          {new Date(score.submitted_at).toLocaleString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
          })}{' '}
          ({score.device})
        </p>
      </div>
      <div className='flex flex-col items-center text-white rounded-full p-2'>
        <div
          className={`${theme} text-2xl pb-1 font-bold rounded-full h-full w-14 text-center shadow select-none`}
        >
          {grade}
        </div>
        <h1 className='text-2xl font-bold mb-2'>{score.score}</h1>
      </div>
    </div>
  );
};

export default ScoreCard;
