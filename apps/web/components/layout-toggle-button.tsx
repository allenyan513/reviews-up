import React from 'react';
import { cn } from '@/lib/utils';
import { BsCaretDown, BsCaretUp, BsInfoCircle } from 'react-icons/bs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

export function LayoutToggleButton(props: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { isOpen, setIsOpen, title, icon } = props;
  return (
    <div
      onClick={() => props.setIsOpen(!isOpen)}
      className={cn(
        'font-medium p-3 border border-gray-200 flex flex-row justify-between items-center select-none cursor-pointer hover:bg-gray-50 rounded',
        isOpen ? 'shadow border-gray-400' : '',
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <span
          className={cn('h-4 w-4', isOpen ? 'text-red-400' : 'text-gray-500')}
        >
          {icon}
        </span>

        <p
          className={cn(
            'text-sm',
            isOpen ? 'text-red-400 font-bold' : 'text-gray-500',
          )}
        >
          {title}
        </p>
      </div>
      {isOpen ? (
        <div>
          <BsCaretDown />
        </div>
      ) : (
        <div>
          <BsCaretUp />
        </div>
      )}
    </div>
  );
}

export const ToggleOption = (props: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  information?: string;
}) => {
  const { label, checked, onChange, information } = props;
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-row gap-2 items-center">
            <label className="text-sm">{label}</label>
            {information && <BsInfoCircle className="text-md" />}
          </div>
        </TooltipTrigger>
        {information && (
          <TooltipContent>
            <p>{information}</p>
          </TooltipContent>
        )}
      </Tooltip>

      <Input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
    </div>
  );
};
