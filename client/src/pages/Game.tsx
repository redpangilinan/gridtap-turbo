import { useState } from 'react';
import Tiles from '../components/Tiles';
import ScoreBar from '../components/ScoreBar';

function generateUniqueIndices() {
  const indices = new Set<number>();
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * 16));
  }
  return Array.from(indices);
}

const Game = () => {
  const [blackSquareIndices, setBlackSquareIndices] = useState<number[]>(
    generateUniqueIndices()
  );
  const [score, setScore] = useState(0);

  const handleSquareClick = (index: number): void => {
    if (blackSquareIndices.includes(index)) {
      const newIndices = blackSquareIndices.map((oldIndex) => {
        if (oldIndex === index) {
          return generateUniqueIndex();
        }
        return oldIndex;
      });
      setBlackSquareIndices(newIndices);
      setScore((prevScore) => prevScore + 1);
    }
  };

  function generateUniqueIndex(): number {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * 16);
    } while (blackSquareIndices.includes(newIndex));
    return newIndex;
  }

  return (
    <>
      <div className='flex justify-center'>
        <ScoreBar score={score} />
      </div>

      <div className='flex justify-center p-2'>
        <div className='grid grid-cols-4'>
          {Array.from(Array(16), (_, index) => (
            <Tiles
              key={index}
              isBlack={blackSquareIndices.includes(index)}
              onClick={() => handleSquareClick(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Game;
