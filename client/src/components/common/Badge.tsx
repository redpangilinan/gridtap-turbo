type BadgeProps = {
  children: string;
  className?: string;
};

const Badge: React.FC<BadgeProps> = ({ children, className }) => {
  const extraClass = className || 'bg-blue-200 text-blue-700';

  return (
    <span
      className={`inline-block whitespace-nowrap rounded-lg ml-2 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none select-none ${extraClass}`}
    >
      {children}
    </span>
  );
};

export default Badge;
