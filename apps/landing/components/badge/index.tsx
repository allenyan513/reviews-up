import { Turbo0 } from '@/components/badge/turbo0';
import { Startupfa } from '@/components/badge/startupfa';
import { ProductHunt } from '@/components/badge/product-hunt';
import { Frogdr } from '@/components/badge/frogdr';
import { Twelve } from '@/components/badge/twelve';
import { WidgetWrapper } from '@/components/badge/widget-wrapper';

export function Badge() {
  return (
    <div className="flex flex-row gap-2 px-4 w-full md:max-w-5xl">
      <ProductHunt />
      <Startupfa />
      <Turbo0 />
      <Frogdr />
      <Twelve />
      <WidgetWrapper/>
    </div>
  );
}
