import React, { useState } from 'react';

type TileProps = {
  isBlack: boolean;
  onClick?: () => void;
};

const Tiles: React.FC<TileProps> = ({ isBlack, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseDown = () => {
    if (!isBlack) {
      setIsClicked(true);
      setTimeout(() => {
        setIsClicked(false);
      }, 200);
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`relative ${
        isBlack ? 'bg-black' : isClicked ? 'bg-red-500' : 'bg-white'
      } w-24 h-24 md:w-32 md:h-32 flex items-center justify-center cursor-pointer select-none border duration-100`}
      onMouseDown={handleMouseDown}
    >
      <div className='absolute w-full h-full bg-white rounded-full opacity-0 pointer-events-none'></div>
    </div>
  );
};

export default Tiles;
