export const ActionIcon = ({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
    aria-label={label}
  >
    {children}
  </button>
);
