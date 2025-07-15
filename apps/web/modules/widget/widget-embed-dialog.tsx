import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@reviewsup/ui/dialog';
import { BsGithub } from 'react-icons/bs';
import { Button, buttonVariants } from '@reviewsup/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@reviewsup/ui/tabs';
import { CodeBlock } from '@/components/code-block';

const embedCodeTemplate = `
<blockquote class="reviewsup-embed" cite="${process.env.NEXT_PUBLIC_APP_URL}/widgets/{{widgetId}}" data-widget-id="{{widgetId}}"><section><a target="_blank" title="ReviewsUp Widget" href="${process.env.NEXT_PUBLIC_APP_URL}/widgets/{{widgetId}}?refer=embed">Rating 4.9/5 from 1000+ reviews</a></section></blockquote><script type="module" src="https://unpkg.com/@reviewsup/embed-react/dist/embed/embed.es.js"></script>`;

function ReactTab(props: { widgetShortId: string }) {
  const { widgetShortId } = props;
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        1. Install @reviewsup/embed-react
      </p>
      <CodeBlock lang="bash" codes={[`npm install @reviewsup/embed-react`]} />
      <p className="text-sm text-muted-foreground">
        {/*添加css样式到你的global.css，为了避免样式覆盖，请优先加载这个css样式*/}
        2. Add the CSS styles to your global CSS file
      </p>
      <CodeBlock
        lang="css"
        codes={[`@import "@reviewsup/embed-react/styles.css";`]}
      />
      <p className="text-sm text-muted-foreground">
        3. Add a <strong>reviewsup-wrapper.tsx</strong> component to your app
      </p>
      <CodeBlock
        lang="js"
        codes={[
          `'use client';`,
          ``,
          `import { ReviewsUp } from '@reviewsup/embed-react';`,
          ``,
          `export function ReviewsUpWrapper() {`,
          `  return <ReviewsUp widgetId={'${widgetShortId}'} />;`,
          `}`,
        ]}
      />
      <p className="text-sm text-muted-foreground">
        4. Add the <strong>ReviewsUpWrapper</strong> component on your page
      </p>
      <Link
        target="_blank"
        href="https://github.com/allenyan513/reviewsup-embed-example"
        className="text-sm text-blue-500 hover:underline mt-2 flex flex-row items-center gap-2"
      >
        <BsGithub className="text-black" /> View Full Code of Example
      </Link>
    </div>
  );
}

function EmbedCodeTab(props: { widgetShortId: string }) {
  const { widgetShortId } = props;
  const embedCode = embedCodeTemplate
    .replace(/{{widgetId}}/g, widgetShortId || 'your-widget-id')
    .trim();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Copy the code to embed the widget on your website
      </p>
      <textarea
        className="w-full h-40 p-4 bg-gray-100 rounded-md border border-gray-300 text-sm"
        readOnly
        value={embedCode}
      />
      <Button
        variant="default"
        size="lg"
        onClick={() => {
          navigator.clipboard.writeText(embedCode);
          toast.success('Embed code copied to clipboard!');
        }}
      >
        Copy Code
      </Button>

      <Link
        target="_blank"
        href="https://github.com/allenyan513/reviewsup-embed-example"
        className="text-sm text-blue-500 hover:underline mt-2 flex flex-row items-center gap-2"
      >
        <BsGithub className="text-black" /> View Full Code of Example
      </Link>
    </div>
  );
}

export function WidgetEmbedDialog(props: {
  widgetShortId: string;
  children: React.ReactNode;
}) {
  const { widgetShortId, children } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>How to embed a widget?</DialogTitle>
          <DialogDescription>
            Embed a widget on your website using JavaScript or React component.
            or share the link to this widget.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full md:max-w-3xl md:min-h-96 md:mx-0">
          <Tabs defaultValue="javascript">
            <TabsList>
              <TabsTrigger value="javascript">Javascript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
            </TabsList>
            <TabsContent value="javascript">
              <EmbedCodeTab widgetShortId={widgetShortId} />
            </TabsContent>
            <TabsContent value="react">
              <ReactTab widgetShortId={widgetShortId} />
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="default">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
