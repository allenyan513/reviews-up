import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CodeBlock } from '@/components/code-block';
import toast from 'react-hot-toast';

export function ShowcaseEmbedDialog(props: {
  showcaseId: string;
  children: React.ReactNode;
}) {
  const { showcaseId, children } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Embed Showcase</DialogTitle>
          <DialogDescription>
            Embed this showcase on your website using JavaScript or React
            component. or share the link to this showcase.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="space-y-4 flex flex-row">
            <p>
              {' '}
              Embed Showcase ID:
              <span
                onClick={() => {
                  navigator.clipboard.writeText(showcaseId);
                  toast.success('Showcase ID copied to clipboard!');
                }}
                className={'font-bold text-primary cursor-pointer ml-2'}
              >
                {showcaseId}
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <p>
              {/*使用JavaScript代码将此展示嵌入到您的网站中*/}
              Embed this showcase on your website using JavaScript
            </p>
            <CodeBlock
              codes={[
                `<div id="reviewsup-showcase-${showcaseId}"></div>`,
                `<script id="revewsup-embed-js" type="text/javascript"`,
                `src="${process.env.NEXT_PUBLIC_APP_URL}/js/embed.js" defer></script>`,
              ]}
              lang="js"
            />
          </div>

          <div className="space-y-4">
            <p>
              {/*或者使用React组件将此展示嵌入到您的网站中*/}
              or embed this showcase using React component
            </p>

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
                `<Showcase showcaseId="${showcaseId}" />`,
              ]}
            />
          </div>

          <div className="space-y-4">
            <p>
              {/*或者分享此展示的链接*/}
              or share the link to this showcase
            </p>
            <CodeBlock
              lang="html"
              codes={[
                `${process.env.NEXT_PUBLIC_APP_URL}/showcases/${showcaseId}`,
              ]}
            />
          </div>
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
