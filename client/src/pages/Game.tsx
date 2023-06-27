import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import Tiles from '../components/pages/Game/Tiles';
import ScoreBar from '../components/pages/Game/ScoreBar';
import ScoreModal from '../components/pages/Game/ScoreModal';
import { useMutation } from '@tanstack/react-query';
import { submitScore } from '../api/users';

const generateUniqueIndices = () => {
  const indices = new Set<number>();
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * 16));
  }
  return Array.from(indices);
};

type tokenData = {
  auth: {
    accessToken: string;
    decoded: {
      userId: number;
    };
  };
  refreshToken: () => void;
};

const Game: React.FC<tokenData> = ({ auth, refreshToken }) => {
  const [blackSquareIndices, setBlackSquareIndices] = useState<number[]>(
    generateUniqueIndices()
  );
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [gameStart, setGameStart] = useState(false);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [miss, setMiss] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [multiPts, setMultiPts] = useState(5);
  const [multiplier, setMultiplier] = useState(Math.round(multiPts / 5));
  const [timer, setTimer] = useState(30);
  const [modalOpen, setModalOpen] = useState(false);
  const [device, setDevice] = useState('');
  const [message, setMessage] = useState('');
  const data = {
    score: score,
    accuracy: accuracy,
    maxCombo: maxCombo,
    hits: hits,
    miss: miss,
    device: device,
  };

  const { status, mutate } = useMutation({
    mutationFn: () => submitScore(data, auth),
    onSuccess: () => {
      setMessage('Submitted at ' + new Date().toLocaleDateString());
    },
    onError: async (error: AxiosError) => {
      setMessage('Login to submit scores!');
      if (error.response?.status === 403) {
        setMessage('Your account is restricted!');
      } else if (error.response?.status === 401) {
        await refreshToken();
        setMessage('Score submission failed!');
      }
    },
  });

  const openModal = () => {
    mutate();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    restartGame();
  };

  const restartGame = () => {
    setGameStart(false);
    setScore(0);
    setHits(0);
    setMiss(0);
    setAccuracy(0);
    setCombo(0);
    setMaxCombo(0);
    setMultiPts(5);
    setTimer(30);
    setBlackSquareIndices(generateUniqueIndices());
  };

  // Update accuracy whenever hits or miss change
  useEffect(() => {
    setAccuracy(Number(((hits / (hits + miss)) * 100).toFixed(2)));
  }, [hits, miss]);

  // Start the timer when a tile is clicked
  useEffect(() => {
    if (gameStart) {
      // Identify user device
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        setDevice('Mobile');
      } else {
        setDevice('PC');
      }

      // Setup game timer
      const gameTimer = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      const multiplierTimer = setInterval(() => {
        setMultiPts((prevMultiPts) => {
          if (prevMultiPts > 5) {
            return prevMultiPts - 1;
          }
          return prevMultiPts;
        });
      }, 350);

      return () => {
        clearInterval(gameTimer);
        clearInterval(multiplierTimer);
      };
    }
  }, [gameStart]);

  // Update multiplier everytime multiPts changes
  useEffect(() => {
    setMultiplier(Math.round(multiPts / 5));
  }, [multiPts]);

  // Update highest combo
  useEffect(() => {
    if (combo >= maxCombo) {
      setMaxCombo(combo);
    }
  }, [combo, maxCombo]);

  // Handle game over when timer reaches 0
  useEffect(() => {
    if (timer <= 0) {
      openModal();
      setGameStart(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  const handleSquareClick = (index: number): void => {
    if (gameStart === false) {
      setGameStart(true);
    }

    // Toggle the selection state of the clicked tile based on its index
    if (selectedIndices.includes(index)) {
      setSelectedIndices((prevIndices) =>
        prevIndices.filter((selectedIndex) => selectedIndex !== index)
      );
    } else {
      setSelectedIndices((prevIndices) => [...prevIndices, index]);
    }

    // Black tile clicked
    if (blackSquareIndices.includes(index)) {
      const newIndices = blackSquareIndices.map((oldIndex) => {
        if (oldIndex === index) {
          return generateUniqueIndex();
        }
        return oldIndex;
      });
      setBlackSquareIndices(newIndices);
      setHits((prevHits) => prevHits + 1);
      setCombo((prevCombo) => prevCombo + 1);
      setMultiPts((prevMultiPts) =>
        prevMultiPts < 25 ? prevMultiPts + 1 : prevMultiPts
      );
      setScore((prevScore) => prevScore + multiplier);
    } else {
      setMiss((prevMiss) => prevMiss + 1);
      setCombo(0);
      setMultiPts(5);
    }
  };

  const generateUniqueIndex = (): number => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * 16);
    } while (blackSquareIndices.includes(newIndex));
    return newIndex;
  };

  return (
    <div className='flex-grow container mx-auto'>
      <div className='flex justify-center'>
        <div className='flex flex-col max-w-lg bg-gray-100 border text-gray-800 select-none'>
          <ScoreBar
            score={score}
            accuracy={accuracy}
            combo={combo}
            maxCombo={maxCombo}
            hits={hits}
            miss={miss}
            multiplier={multiplier}
          />
          <div className='grid grid-cols-4'>
            {Array.from(Array(16), (_, index) => (
              <Tiles
                key={index}
                device={device}
                isBlack={blackSquareIndices.includes(index)}
                isSelected={selectedIndices.includes(index)}
                onClick={() => handleSquareClick(index)}
              />
            ))}
          </div>
          <div className='p-2 text-center text-lg'>
            {gameStart ? (
              <div>Timer: {timer} sec</div>
            ) : (
              <div>Tap a black tile to start</div>
            )}
            <button
              type='button'
              className='text-neutral-900 hover:text-white border border-neutral-800 hover:bg-neutral-900 focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center'
              onClick={restartGame}
            >
              Restart
            </button>
          </div>
        </div>
        <ScoreModal
          isOpen={modalOpen}
          onClose={closeModal}
          score={score}
          accuracy={accuracy}
          maxCombo={maxCombo}
          hits={hits}
          miss={miss}
          message={status === 'loading' ? 'Submitting...' : message}
          onMutate={mutate}
        />
      </div>
    </div>
  );
};

export default Game;
