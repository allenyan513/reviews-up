import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
import { api } from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const layoutOptions = [
  { value: 'list', label: 'ListLayout' },
  { value: 'flow', label: 'FlowLayout' },
  { value: 'marquee', label: 'MarqueeLayout' },
  { value: 'grid', label: 'GridLayout' },
];

export default function PageConfig(props: {
  showcase: ShowcaseEntity;
  showcaseConfig: ShowcaseConfig;
  setShowcaseConfig: (config: ShowcaseConfig) => void;
}) {
  const { data: session } = useSession();
  const updateFormConfig = async () => {
    if (!props.showcaseConfig) return;
    try {
      await api.updateShowcase(
        props.showcase.id,
        {
          config: props.showcaseConfig,
        },
        {
          session: session,
        },
      );
      toast.success('Form configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update form configuration');
    }
  };

  return (
    <div className="col-span-1 space-y-4 w-full">
      <div className="flex flex-col gap-1">
        <h2 className="uppercase">Page Config</h2>
        <p className="text-xs text-gray-500">
          Change the title and message of the thanks page that users see after
          submitting the form.
        </p>
      </div>
      <label className="text-sm font-medium text-gray-900">Layout</label>
      <Select
        value={props.showcaseConfig.type}
        onValueChange={(value) => {
          props.setShowcaseConfig({
            ...props.showcaseConfig,
            type: value,
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select layout" />
        </SelectTrigger>
        <SelectContent>
          {layoutOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={updateFormConfig}>Save</Button>
    </div>
  );
}
