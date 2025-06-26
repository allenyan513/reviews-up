import {Button} from '@/components/ui/button';
import {useShowcaseContext} from './context/ShowcaseProvider';
import {Input} from '@/components/ui/input';
import {ShowcaseEntity} from '@repo/api/showcases/entities/showcase.entity';
import {useState} from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BsArrowDown,
  BsArrowUp,
  BsCaretDown,
  BsCaretUp,
  BsGear,
  BsLayers,
} from 'react-icons/bs';
import {cn} from '@/lib/utils';
import {SortBy} from '@/types/sortby';

const layoutOptions = [
  {
    value: 'flow',
    label: 'FlowLayout',
    img: '/img/grid-card.webp',
    settings: {
      column: 3,
    },
  },
  {
    value: 'multi-carousel',
    label: 'MultiCarouselLayout',
    img: '/img/grid-card.webp',
  },
  // {
  //   value: 'carousel',
  //   label: 'CarouselLayout',
  //   img: '/img/grid-card.webp',
  // },
  // {
  //   value: 'list',
  //   label: 'ListLayout',
  //   img: '/img/list-card.webp',
  // },
];

const sortOptions = [
  {
    value: SortBy.newest,
    label: 'Dates from Newest to Oldest',
  },
  {
    value: SortBy.oldest,
    label: 'Dates from Oldest to Newest',
  },
  {
    value: SortBy.random,
    label: 'Random',
  },
  {
    value: SortBy.rating,
    label: 'Rating from Highest to Lowest',
  },
];

type ToggleOptionProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function LayoutToggleButton(props: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const {isOpen, setIsOpen, title, icon} = props;
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
          <BsCaretDown/>
        </div>
      ) : (
        <div>
          <BsCaretUp/>
        </div>
      )}
    </div>
  );
}

const ToggleOption = ({label, checked, onChange}: ToggleOptionProps) => (
  <div className="flex flex-row justify-between items-center w-full">
    <label className="text-sm">{label}</label>
    <Input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4"
    />
  </div>
);

export function ShowcasePageConfig(props: {
  className?: string;
}) {
  const {
    showcase,
    showcaseConfig,
    setShowcase,
    setShowcaseConfig,
    saveChange,
  } = useShowcaseContext();
  const [isLayoutOpen, setIsLayoutOpen] = useState(true);
  const [isSettingOpen, setIsSettingOpen] = useState(true);

  if (!showcaseConfig) {
    return null;
  }
  return (
    <div className={cn("", props.className)}>
      <div className="w-full h-[700px] overflow-y-auto py-2">
        <div className="space-y-4 w-full pr-4 ">
          <LayoutToggleButton
            title="Layout"
            icon={<BsLayers className="h-4 w-4"/>}
            isOpen={isLayoutOpen}
            setIsOpen={setIsLayoutOpen}
          />
          <div
            className={cn(
              'grid grid-cols-2 gap-2',
              isLayoutOpen ? '' : 'hidden',
            )}
          >
            {layoutOptions.map((opt) => (
              <div
                key={opt.value}
                className={`flex flex-col items-center gap-2 p-2 border rounded cursor-pointer ${
                  showcaseConfig.type === opt.value
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
                onClick={() => {
                  setShowcaseConfig({
                    ...showcaseConfig,
                    type: opt.value,
                  });
                }}
              >
                <img
                  src={opt.img}
                  alt={opt.label}
                  className="w-full aspect-video"
                />
                <span className="text-sm">{opt.label}</span>
              </div>
            ))}
          </div>

          <LayoutToggleButton
            title="Settings"
            icon={<BsGear className="h-4 w-4"/>}
            isOpen={isSettingOpen}
            setIsOpen={setIsSettingOpen}
          />
          <div
            className={cn('flex flex-col gap-4', isSettingOpen ? '' : 'hidden')}
          >
            {/*flow layout specific settings*/}
            {showcaseConfig.type === 'flow' && (
              <div>
                <label className="text-sm">FlowLayout Columns:</label>
                <Input
                  type="number"
                  placeholder="Enter number of columns"
                  min="1"
                  max="5"
                  className="w-full mt-2"
                  value={showcaseConfig.flow?.columns || 3}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      setShowcaseConfig({
                        ...showcaseConfig,
                        flow: {
                          ...showcaseConfig.flow,
                          columns: value,
                        },
                      });
                    }
                  }}
                />
              </div>
            )}

            <div>
              <label className="text-sm">Reviews Max Count:</label>
              <Input
                type="number"
                placeholder="Enter max count of reviews"
                min="1"
                max="100"
                className="w-full mt-2"
                value={showcaseConfig.count || 20}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    setShowcaseConfig({
                      ...showcaseConfig,
                      count: value,
                    });
                  }
                }}
              />
            </div>

            <div>
              <label className="text-sm">Sort by:</label>
              <Select
                defaultValue={showcaseConfig.sortBy || 'newest'}
                onValueChange={(value) => {
                  setShowcaseConfig({
                    ...showcaseConfig,
                    sortBy: value as SortBy,
                  });
                }}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select sort option"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <ToggleOption
              label="Show Rating"
              checked={showcaseConfig.isRatingEnabled || false}
              onChange={(checked) =>
                setShowcaseConfig({
                  ...showcaseConfig,
                  isRatingEnabled: checked,
                })
              }
            />
            <ToggleOption
              label="Show Date"
              checked={showcaseConfig.isDateEnabled || false}
              onChange={(checked) =>
                setShowcaseConfig({...showcaseConfig, isDateEnabled: checked})
              }
            />
            <ToggleOption
              label="Show Images"
              checked={showcaseConfig.isImageEnabled || false}
              onChange={(checked) =>
                setShowcaseConfig({
                  ...showcaseConfig,
                  isImageEnabled: checked,
                })
              }
            />
            <ToggleOption
              label="Show Video"
              checked={showcaseConfig.isVideoEnabled || false}
              onChange={(checked) =>
                setShowcaseConfig({
                  ...showcaseConfig,
                  isVideoEnabled: checked,
                })
              }
            />

            <ToggleOption
              label="Show Source"
              checked={showcaseConfig.isSourceEnabled || false}
              onChange={(checked) =>
                setShowcaseConfig({
                  ...showcaseConfig,
                  isSourceEnabled: checked,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="w-full pr-4">
        <Button className="w-full" onClick={saveChange}>
          Save
        </Button>
      </div>
    </div>
  );
}
