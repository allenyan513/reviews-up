import { Button } from '@/components/ui/button';
import { useWidgetContext } from './context/widget-context';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@reviewsup/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@reviewsup/ui/dialog';
import {
  BsCaretDown,
  BsCaretUp,
  BsGear,
  BsInfo,
  BsInfoCircle,
  BsLayers,
} from 'react-icons/bs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SortBy } from '@/types/sortby';
import { layoutOptions } from '@/modules/widget/layout-options';
import { sortOptions } from './sort-options';
import { WidgetConfig } from '@reviewsup/api/widgets';
import { WidgetSelectReviewsDialog } from '@/modules/widget/widget-select-reviews-dialog';

function LayoutToggleButton(props: {
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

const ToggleOption = (props: {
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

export function WidgetPageConfig(props: { className?: string }) {
  const {
    widget,
    widgetConfig,
    setWidgetConfig,
    setWidgetConfigAndRefresh,
    saveChange,
  } = useWidgetContext();
  const [isLayoutOpen, setIsLayoutOpen] = useState(true);
  const [isDataOpen, setIsDataOpen] = useState(true);
  const [isSettingOpen, setIsSettingOpen] = useState(true);

  /**
   * Render columns count and breakpoints input fields when the layout type is grid or flow.
   * @param widgetConfig
   */
  const renderColumnsCount = (widgetConfig: WidgetConfig) => {
    if (widgetConfig.type !== 'grid' && widgetConfig.type !== 'flow') {
      return null;
    }
    return (
      <div>
        <label className="text-sm">Columns Count:</label>
        <div className="text-sm grid grid-cols-3 gap-2 mt-2">
          <label>sm:</label>
          <label>md:</label>
          <label>lg:</label>
          <Input
            type="number"
            min="1"
            max="5"
            className="w-full"
            value={widgetConfig.breakpoints?.sm || 1}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setWidgetConfig({
                  ...widgetConfig,
                  breakpoints: {
                    ...widgetConfig.breakpoints,
                    sm: value,
                  },
                });
              }
            }}
          />
          <Input
            type="number"
            min="1"
            max="5"
            className="w-full"
            value={widgetConfig.breakpoints?.md || 2}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setWidgetConfig({
                  ...widgetConfig,
                  breakpoints: {
                    ...widgetConfig.breakpoints,
                    md: value,
                  },
                });
              }
            }}
          />
          <Input
            type="number"
            min="1"
            max="5"
            className="w-full"
            value={widgetConfig.breakpoints?.lg || 3}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setWidgetConfig({
                  ...widgetConfig,
                  breakpoints: {
                    ...widgetConfig.breakpoints,
                    lg: value,
                  },
                });
              }
            }}
          />
        </div>
      </div>
    );
  };

  const renderRowsAndSpeed = (widgetConfig: WidgetConfig) => {
    if (widgetConfig.type !== 'carousel') {
      return null;
    }
    return (
      <>
        <div>
          <label className="text-sm">Rows Count:</label>
          <Input
            type="number"
            placeholder="Enter rows count"
            min="1"
            max="10"
            className="w-full mt-2"
            value={widgetConfig.rows || 1}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setWidgetConfig({
                  ...widgetConfig,
                  rows: value,
                });
              }
            }}
          />
        </div>
        <div>
          <label className="text-sm">Speed:</label>
          <Input
            type="number"
            placeholder="Enter speed"
            min="1"
            max="120"
            className="w-full mt-2"
            value={widgetConfig.speed || 40}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setWidgetConfig({
                  ...widgetConfig,
                  speed: value,
                });
              }
            }}
          />
        </div>
      </>
    );
  };

  if (!widgetConfig) {
    return null;
  }
  return (
    <div className={cn('', props.className)}>
      <div className="w-full h-[700px] overflow-y-auto py-2">
        <div className="space-y-4 w-full pr-4 ">
          <LayoutToggleButton
            title="Layout"
            icon={<BsLayers className="h-4 w-4" />}
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
                className={`flex flex-row items-center gap-2 p-3 border rounded cursor-pointer ${
                  widgetConfig.type === opt.value
                    ? 'border-red-400 bg-red-50 shadow'
                    : 'border-gray-300'
                }`}
                onClick={() => {
                  setWidgetConfig({
                    ...widgetConfig,
                    type: opt.value as WidgetConfig['type'],
                  });
                }}
              >
                {opt.icon}
                <span className="text-sm text-start">{opt.label}</span>
              </div>
            ))}
          </div>

          <LayoutToggleButton
            title="Data"
            icon={<BsLayers className="h-4 w-4" />}
            isOpen={isDataOpen}
            setIsOpen={setIsDataOpen}
          />
          <div className={cn('', isDataOpen ? '' : 'hidden')}>
            <div className="flex flex-row items-center justify-between gap-2 w-full">
              <p>{widget?.reviewCount || 0} reviews selected</p>
              <WidgetSelectReviewsDialog
                defaultSelectedRowIds={[...(widgetConfig.reviewIds || [])]}
                onSelectionChange={(ids) => {
                  setWidgetConfigAndRefresh(widget?.id || '', {
                    ...widgetConfig,
                    reviewIds: ids,
                  });
                }}
              />
            </div>
          </div>

          <LayoutToggleButton
            title="Settings"
            icon={<BsGear className="h-4 w-4" />}
            isOpen={isSettingOpen}
            setIsOpen={setIsSettingOpen}
          />
          <div
            className={cn(
              'flex flex-col gap-4 pb-4',
              isSettingOpen ? '' : 'hidden',
            )}
          >
            {renderColumnsCount(widgetConfig)}
            {renderRowsAndSpeed(widgetConfig)}

            <div>
              <label className="text-sm">Reviews Max Count:</label>
              <Input
                type="number"
                placeholder="Enter max count of reviews"
                min="1"
                max="100"
                className="w-full mt-2"
                value={widgetConfig.count || 20}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    setWidgetConfig({
                      ...widgetConfig,
                      count: value,
                    });
                  }
                }}
              />
            </div>

            <div>
              <label className="text-sm">Sort by:</label>
              <Select
                defaultValue={widgetConfig.sortBy || 'newest'}
                onValueChange={(value) => {
                  setWidgetConfig({
                    ...widgetConfig,
                    sortBy: value as SortBy,
                  });
                }}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select sort option" />
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
              label="Show More Views"
              checked={widgetConfig.isMoreViewsEnabled || false}
              onChange={(checked) =>
                setWidgetConfig({
                  ...widgetConfig,
                  isMoreViewsEnabled: checked,
                })
              }
            />
            <ToggleOption
              label="Show Summary Rating"
              checked={widgetConfig.isRatingSummaryEnabled || false}
              onChange={(checked) =>
                setWidgetConfig({
                  ...widgetConfig,
                  isRatingSummaryEnabled: checked,
                })
              }
            />
            <ToggleOption
              label="Show Rating"
              checked={widgetConfig.isRatingEnabled || false}
              onChange={(checked) =>
                setWidgetConfig({
                  ...widgetConfig,
                  isRatingEnabled: checked,
                })
              }
            />
            <ToggleOption
              label="Show Date"
              checked={widgetConfig.isDateEnabled || false}
              onChange={(checked) =>
                setWidgetConfig({ ...widgetConfig, isDateEnabled: checked })
              }
            />
            <ToggleOption
              label="Show Images"
              checked={widgetConfig.isImageEnabled || false}
              onChange={(checked) =>
                setWidgetConfig({
                  ...widgetConfig,
                  isImageEnabled: checked,
                })
              }
            />
            <ToggleOption
              label="Show Video"
              checked={widgetConfig.isVideoEnabled || false}
              onChange={(checked) =>
                setWidgetConfig({
                  ...widgetConfig,
                  isVideoEnabled: checked,
                })
              }
            />

            <ToggleOption
              label="Show Source"
              checked={widgetConfig.isSourceEnabled || false}
              onChange={(checked) =>
                setWidgetConfig({
                  ...widgetConfig,
                  isSourceEnabled: checked,
                })
              }
            />
            <ToggleOption
              label="Show Reviews Powered By"
              checked={widgetConfig.isPoweredByEnabled || false}
              onChange={(checked) =>
                setWidgetConfig({
                  ...widgetConfig,
                  isPoweredByEnabled: checked,
                })
              }
            />
            {/*<ToggleOption*/}
            {/*  label="Dofollow enabled"*/}
            {/*  checked={widgetConfig.isDoFollowEnabled || false}*/}
            {/*  onChange={(checked) =>*/}
            {/*    setWidgetConfig({*/}
            {/*      ...widgetConfig,*/}
            {/*      isDoFollowEnabled: checked,*/}
            {/*    })*/}
            {/*  }*/}
            {/*  information={*/}
            {/*    'If enabled, the source link will be dofollow. If disabled, it will be nofollow.'*/}
            {/*  }*/}
            {/*/>*/}
          </div>
        </div>
      </div>
      <div className="w-full pr-4">
        <Button
          className="w-full"
          onClick={() => {
            saveChange();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
