type timeProps = {
  time: string;
};

const LastOnline: React.FC<timeProps> = ({ time }) => {
  const getTimeDifference = () => {
    const currentTime = new Date().getTime();
    const lastOnlineTime = new Date(time).getTime();
    const timeDifference = Math.abs(currentTime - lastOnlineTime);
    const minutes = Math.floor(timeDifference / 60000);

    if (minutes < 15) {
      return 'Currently online';
    } else if (minutes < 60) {
      return `Last seen ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `Last seen ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes < 10080) {
      const days = Math.floor(minutes / 1440);
      return `Last seen ${days} day${days > 1 ? 's' : ''} ago`;
    } else if (minutes < 43800) {
      const weeks = Math.floor(minutes / 10080);
      return `Last seen ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (minutes < 525600) {
      const months = Math.floor(minutes / 43800);
      return `Last seen ${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(minutes / 525600);
      return `Last seen ${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  const timeDifference = getTimeDifference();

  return <span>{timeDifference}</span>;
};

export default LastOnline;
