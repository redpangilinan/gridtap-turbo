type ScoreProps = {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  accuracy: number;
  maxCombo: number;
  hits: number;
  miss: number;
};

const Modal: React.FC<ScoreProps> = ({
  isOpen,
  onClose,
  score,
  accuracy,
  maxCombo,
  hits,
  miss,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center select-none'>
      <div className='fixed inset-0 bg-gray-900 opacity-75'></div>
      <div className='relative bg-gray-900 p-8 max-w-md mx-auto rounded border'>
        <button
          className='absolute top-0 right-0 m-4 text-gray-200 hover:text-gray-400'
          onClick={onClose}
        >
          Close
        </button>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-around border rounded p-4 mt-6 gap-6'>
            <div>
              <p>Ranking:</p>
              <span className='text-4xl font-semibold'>
                {accuracy === 100
                  ? 'SS'
                  : accuracy >= 98
                  ? 'S'
                  : accuracy >= 94
                  ? 'A'
                  : accuracy >= 90
                  ? 'B'
                  : accuracy >= 85
                  ? 'C'
                  : 'D'}
              </span>
            </div>
            <div>
              <p>Score:</p>
              <span className='text-4xl font-semibold'>{score}</span>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2 p-2'>
            <div>
              <p>Hits:</p> <span className='text-lg font-semibold'>{hits}</span>
            </div>
            <div>
              <p>Misses:</p>
              <span className='text-lg font-semibold'>{miss}</span>
            </div>
            <div>
              <p>Accuracy:</p>
              <span className='text-lg font-semibold'>{accuracy}%</span>
            </div>
            <div>
              <p>Max Combo:</p>
              <span className='text-lg font-semibold'>{maxCombo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;