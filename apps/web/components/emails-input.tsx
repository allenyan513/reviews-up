import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailsInputProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  disabled?: boolean;
}

export function EmailsInput({ emails, onChange, disabled }: EmailsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && isValidEmail(trimmed) && !emails.includes(trimmed)) {
        onChange([...emails, trimmed]);
        setInputValue('');
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(emails.filter((email) => email !== emailToRemove));
  };

  return (
    <div
      className={cn(
        'w-full p-2 border border-gray-300 rounded flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500',
        disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'bg-white',
      )}
    >
      {emails.map((email) => (
        <div
          key={email}
          className="flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
        >
          <span className="text-sm">{email}</span>
          <button
            type="button"
            className="ml-1 text-gray-600 hover:text-gray-900"
            onClick={() => removeEmail(email)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter email and press Enter"
        disabled={disabled}
        className={cn(
          'flex-grow outline-none min-w-[150px]',
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'bg-white',
        )}
      />
    </div>
  );
}
