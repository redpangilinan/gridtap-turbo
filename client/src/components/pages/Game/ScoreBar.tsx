import React from 'react';

type ScoreBarProps = {
  score: number;
  accuracy: number;
  combo: number;
  maxCombo: number;
  hits: number;
  miss: number;
  multiplier: number;
};

const ScoreBar: React.FC<ScoreBarProps> = ({
  score,
  accuracy,
  combo,
  maxCombo,
  multiplier,
}) => {
  return (
    <div className='p-4 flex justify-between'>
      <div>
        <p>Score:</p> <span className='text-lg font-semibold'>{score}</span>
      </div>
      <div>
        <p>Accuracy:</p>
        <span className='text-lg font-semibold'>
          {isNaN(accuracy) ? '0%' : `${accuracy}%`}
        </span>
      </div>
      <div>
        <p>Combo:</p>
        <span className='text-lg font-semibold'>
          {combo}/{maxCombo}
        </span>
      </div>
      <div>
        <p>Multiplier:</p>
        <span className='text-lg font-semibold'>x{multiplier}</span>
      </div>
    </div>
  );
};

export default ScoreBar;
