import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { BsGear, BsLayers } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import { LayoutToggleButton } from '@/components/layout-toggle-button';
import { WallOfLoveConfig, WallOfLoveEntity } from '@reviewsup/api/walloflove';
import { UploadContainer } from '@/components/upload-container';
import { BiImage } from 'react-icons/bi';
import { useWallOfLoveContext } from './wall-of-love-context';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@reviewsup/ui/checkbox';
import { Label } from '@reviewsup/ui/label';

export function WallOfLoveConfigPage(props: { className?: string }) {
  const { wallOfLove, setWallOfLove, updateConfig } = useWallOfLoveContext();
  if (!wallOfLove) {
    return null;
  }
  const config = wallOfLove.config as WallOfLoveConfig;
  const [isSettingOpen, setIsSettingOpen] = useState(true);

  return (
    <div className={cn('', props.className)}>
      <div className="w-full h-[700px] overflow-y-auto py-2">
        <div className="space-y-4 w-full pr-4 ">
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
            <div className="flex flex-col gap-2">
              <p className="text-sm">Cover Image</p>
              <div className="flex flex-row justify-between items-end">
                {config.backgroundUrl && (
                  <img
                    src={config.backgroundUrl}
                    alt="Product Icon"
                    className="h-24 w-auto aspect-video  object-contain rounded border border-gray-300"
                  />
                )}
                <UploadContainer
                  accept={'image/*'}
                  onUploadSuccess={(url) => {
                    setWallOfLove((prev: any) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        config: {
                          ...prev.config,
                          backgroundUrl: url,
                        },
                      } as WallOfLoveEntity;
                    });
                  }}
                >
                  <Button>
                    <BiImage className="" />
                    Select Image
                  </Button>
                </UploadContainer>
              </div>
            </div>

            {/*Title Config*/}
            <div>
              <label className="text-sm">Title:</label>
              <Input
                type="text"
                placeholder="Enter title"
                className="w-full mt-2"
                value={config.title || ''}
                onChange={(e) => {
                  setWallOfLove((prev: any) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      config: {
                        ...prev.config,
                        title: e.target.value,
                      },
                    } as WallOfLoveEntity;
                  });
                }}
              />
            </div>
            {/*Subtitle*/}
            <div>
              <label className="text-sm">Subtitle:</label>
              <Input
                type="text"
                placeholder="Enter subtitle"
                className="w-full mt-2"
                value={config.subtitle || ''}
                onChange={(e) => {
                  setWallOfLove((prev: any) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      config: {
                        ...prev.config,
                        subtitle: e.target.value,
                      },
                    } as WallOfLoveEntity;
                  });
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">CTA Button:</label>
              <div className='flex flex-row gap-2 items-center'>
                <Checkbox
                  key="ctaButtonEnabled"
                  checked={config.ctaButtonHidden || false}
                  onCheckedChange={(checked) => {
                    setWallOfLove((prev: any) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        config: {
                          ...prev.config,
                          ctaButtonHidden: checked,
                        },
                      } as WallOfLoveEntity;
                    });
                  }}
                />
                <Label
                  htmlFor="ctaButtonText"
                  className="text-sm w-full cursor-pointer font-normal"
                >
                  Hide Button
                </Label>
              </div>
              <Input
                type="text"
                placeholder="Enter CTA Button Text"
                className="w-full"
                value={config.ctaButtonText || ''}
                onChange={(e) => {
                  setWallOfLove((prev: any) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      config: {
                        ...prev.config,
                        ctaButtonText: e.target.value,
                      },
                    } as WallOfLoveEntity;
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full pr-4">
        <Button
          className="w-full"
          onClick={() => {
            updateConfig();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
