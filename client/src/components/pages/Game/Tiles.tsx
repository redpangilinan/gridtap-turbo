import React, { useState } from 'react';

type TileProps = {
  device: string;
  isBlack: boolean;
  isSelected: boolean;
  onClick?: () => void;
};

const Tiles: React.FC<TileProps> = ({ device, isBlack, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
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

  if (device === 'Mobile') {
    return (
      <div
        className={`relative ${
          isBlack ? 'bg-black' : isClicked ? 'bg-red-500' : 'bg-white'
        } w-24 h-24 md:w-32 md:h-32 flex items-center justify-center cursor-crosshair select-none touch-none border duration-100`}
        onTouchStart={handleClick}
      >
        <div className='absolute w-full h-full bg-white rounded-full opacity-0 pointer-events-none'></div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${
        isBlack ? 'bg-black' : isClicked ? 'bg-red-500' : 'bg-white'
      } w-24 h-24 md:w-32 md:h-32 flex items-center justify-center cursor-crosshair select-none touch-none border duration-100`}
      onMouseDown={handleClick}
    >
      <div className='absolute w-full h-full bg-white rounded-full opacity-0 pointer-events-none'></div>
    </div>
  );
};

export default Tiles;
