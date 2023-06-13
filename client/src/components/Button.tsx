type BtnProps = {
  type?: 'submit' | 'button';
  className?: string;
  processing?: boolean;
  content: string;
  onClick?: () => void;
};

const Button: React.FC<BtnProps> = ({
  type = 'submit',
  className = '',
  processing = false,
  content,
  onClick,
}) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center font-semibold py-2 px-4 border border-gray-400 rounded shadow active:bg-gray-400 transition ease-in-out duration-150 ${
        processing ? 'opacity-25' : ''
      } ${className}`}
      disabled={processing}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default Button;
