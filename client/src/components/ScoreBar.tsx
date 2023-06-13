import React from 'react';

type ScoreBarProps = {
  score: number;
};

const ScoreBar: React.FC<ScoreBarProps> = ({ score }) => {
  return (
    <div className='border-white'>
      <span>Score: {score}</span>
    </div>
  );
};

export default ScoreBar;
