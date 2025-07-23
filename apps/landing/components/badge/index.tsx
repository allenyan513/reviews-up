import { Turbo0 } from '@/components/badge/turbo0';
import { Startupfa } from '@/components/badge/startupfa';
import { ProductHunt } from '@/components/badge/product-hunt';
import { Frogdr } from '@/components/badge/frogdr';
import { Twelve } from '@/components/badge/twelve';
import { WidgetWrapper } from '@/components/badge/widget-wrapper';

export function Badge() {
  return (
    <section className="flex flex-row gap-2 bg-red-50">
      <ProductHunt />
      <Startupfa />
      <Turbo0 />
      <Frogdr />
      <Twelve />
      {/*<WidgetWrapper/>*/}
    </section>
  );
}
