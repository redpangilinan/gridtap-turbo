import { useState, useEffect } from 'react';
import Tiles from '../components/Tiles';
import ScoreBar from '../components/ScoreBar';
import ScoreModal from '../components/ScoreModal';
import { useMutation } from '@tanstack/react-query';
import { submitScore } from '../api/users';

const generateUniqueIndices = () => {
  const indices = new Set<number>();
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * 16));
  }
  return Array.from(indices);
};

const Game = () => {
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
  const [multiPts, setMultiPts] = useState(4);
  const [multiplier, setMultiplier] = useState(Math.round(multiPts / 4));
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

  const submit = useMutation({
    mutationFn: submitScore,
    onSuccess: () => {
      setMessage('Submitted at ' + new Date().toLocaleDateString());
    },
    onError: () => {
      setMessage('Login to submit scores!');
    },
  });

  const openModal = () => {
    submit.mutate(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);

    // Restart game
    setScore(0);
    setHits(0);
    setMiss(0);
    setAccuracy(0);
    setCombo(0);
    setMaxCombo(0);
    setMultiPts(4);
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
          if (prevMultiPts > 4) {
            return prevMultiPts - 1;
          }
          return prevMultiPts;
        });
      }, 250);

      return () => {
        clearInterval(gameTimer);
        clearInterval(multiplierTimer);
      };
    }
  }, [gameStart]);

  // Update multiplier everytime multiPts changes
  useEffect(() => {
    setMultiplier(Math.round(multiPts / 4));
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
        prevMultiPts < 20 ? prevMultiPts + 1 : prevMultiPts
      );
      setScore((prevScore) => prevScore + multiplier);
    } else {
      setMiss((prevMiss) => prevMiss + 1);
      setCombo(0);
      setMultiPts(4);
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
    <div className='p-4 flex justify-center'>
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
        message={message}
      />
    </div>
  );
};

export default Game;
