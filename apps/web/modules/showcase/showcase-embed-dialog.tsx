import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from '@reviewsup/ui/dialog';
import { BsGithub } from 'react-icons/bs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@reviewsup/ui/tabs';
import { Button, buttonVariants } from '@reviewsup/ui/button';
import { useState } from 'react';
import { CodeBlock } from '@/components/code-block';
import Link from 'next/link';
import { VerifyWidgetEmbedding } from '@/components/verify-widget-embedding';

export function ShowcaseEmbedDialog(props: {
  url: string;
  showcaseShortId: string;
  children: React.ReactNode;
}) {
  const { url, showcaseShortId, children } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>How to embed a widget?</DialogTitle>
          <DialogDescription>
            Embed a widget on your website using JavaScript or React component.
            or share the link to this showcase.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full md:max-w-3xl md:min-h-96 md:mx-0">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="javascript">Javascript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="iframe">iframe</TabsTrigger>
            </TabsList>
            <TabsContent value="javascript">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  1. Add the following code to your website to embed the widget.
                </p>
                <CodeBlock
                  codes={[
                    `<div id="reviewsup-showcase-${showcaseShortId}"></div>`,
                    `<script id="revewsup-embed-js" type="text/javascript"`,
                    `src="${process.env.NEXT_PUBLIC_APP_URL}/js/embed.js" defer></script>`,
                  ]}
                  lang="js"
                />
                <p className="text-sm text-muted-foreground flex flex-row">
                  2. Check the widget on your website, or click
                  <VerifyWidgetEmbedding url={url} showcaseShortId={showcaseShortId}>
                    Verify
                  </VerifyWidgetEmbedding>
                </p>
                <Link
                  target="_blank"
                  href="https://github.com/allenyan513/reviewsup-embed-example"
                  className="text-sm text-blue-500 hover:underline mt-2 flex flex-row items-center gap-2"
                >
                  <BsGithub className="text-black" /> View Full Code of Example
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="iframe">
              <div className="space-y-4">
                <p>
                  {/*或者分享此展示的链接*/}
                  or share the link to this showcase
                </p>
                <CodeBlock
                  lang="html"
                  codes={[
                    `${process.env.NEXT_PUBLIC_APP_URL}/showcases/${showcaseShortId}`,
                  ]}
                />
              </div>
            </TabsContent>
            <TabsContent value="react">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {/*1.安装@reviewsup/embed-react*/}
                  1. Install @reviewsup/embed-react
                </p>
                <CodeBlock
                  lang="bash"
                  codes={[`npm install @reviewsup/embed-react`]}
                />
                <p className="text-sm text-muted-foreground">
                  {/*2.在您的global.css中添加以下样式*/}
                  2. Add the following styles to your global.css
                </p>
                <CodeBlock
                  lang="css"
                  codes={[`@import "@reviewsup/embed-react/styles.css";`]}
                />
                <p className="text-sm text-muted-foreground">
                  {/*2.在您的React组件中使用Showcase组件*/}
                  3. Use the Showcase component in your React component
                </p>
                <CodeBlock
                  lang="js"
                  codes={[
                    `import { Showcase } from '@reviewsup/embed-react';`,
                    ``,
                    `<Showcase showcaseId="${showcaseShortId}" />`,
                  ]}
                />
                <p className="text-sm text-muted-foreground flex flex-row">
                  4. Check the widget on your website, or click
                  <VerifyWidgetEmbedding url={url} showcaseShortId={showcaseShortId}>
                    Verify
                  </VerifyWidgetEmbedding>
                </p>
                <Link
                  target="_blank"
                  href="https://github.com/allenyan513/reviewsup-embed-example"
                  className="text-sm text-blue-500 hover:underline mt-2 flex flex-row items-center gap-2"
                >
                  <BsGithub className="text-black" /> View Full Code of Example
                </Link>
              </div>
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
