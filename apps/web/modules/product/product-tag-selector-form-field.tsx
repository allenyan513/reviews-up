import { Popover, PopoverTrigger, PopoverContent } from '@reviewsup/ui/popover';
import { Button } from '@reviewsup/ui/button';
import { Command, CommandItem } from '@reviewsup/ui/command';
import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
} from '@reviewsup/ui/form';
import { ProductCategory } from '@reviewsup/api/products';

const categories = Object.entries(ProductCategory); // [['ai', 'ai'], ['analytics', 'analytics'], ...]

export function TagSelectorFormField({ form }: { form: any }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => {
        const selected = field.value || [];

        const handleSelect = (value: string) => {
          if (selected.includes(value)) return;
          if (selected.length >= 3) return;

          field.onChange([...selected, value]);
        };

        const handleRemove = (value: string) => {
          field.onChange(selected.filter((tag: string) => tag !== value));
        };

        return (
          <div>
            <FormLabel className="mb-2 text-md">Tags</FormLabel>
            <FormControl>
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      ref={buttonRef}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      {selected.length > 0
                        ? `${selected.length} selected`
                        : 'Select up to 3 tags'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    style={{ width: buttonRef.current?.offsetWidth }}
                    className="p-0"
                  >
                    <Command>
                      {categories.map(([key, value]) => (
                        <CommandItem
                          key={value}
                          value={value}
                          onSelect={() => {
                            handleSelect(value);
                          }}
                          disabled={selected.includes(value)}
                        >
                          {key
                            .split(/(?=[A-Z])/)
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(' ')}
                        </CommandItem>
                      ))}
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.map((tag: string) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(tag)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </div>
        );
      }}
    />
  );
}
