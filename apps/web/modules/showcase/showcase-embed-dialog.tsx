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
import { Button, buttonVariants } from '@reviewsup/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { VerifyWidgetEmbedding } from '@/components/verify-widget-embedding';
import toast from 'react-hot-toast';
import { useVerifyEmbed } from '@/hooks/use-verify-embed';

const embedCodeTemplate = `
<blockquote class="reviewsup-embed" cite="${process.env.NEXT_PUBLIC_APP_URL}/showcases/{{widgetId}}" data-widget-id="{{widgetId}}"><section><a target="_blank" title="ReviewsUp Widget" href="${process.env.NEXT_PUBLIC_APP_URL}/showcases/{{widgetId}}?refer=embed">Rating 4.9/5 from 1000+ reviews</a></section></blockquote><script type="module" src="https://unpkg.com/@reviewsup/embed-react/dist/embed/embed.es.js"></script>`;

export function ShowcaseEmbedDialog(props: {
  url: string;
  showcaseShortId: string;
  children: React.ReactNode;
}) {
  const { url, showcaseShortId, children } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { loading, verify } = useVerifyEmbed(url, showcaseShortId);

  const embedCode = embedCodeTemplate
    .replace(/{{widgetId}}/g, showcaseShortId || 'your-widget-id')
    .trim();

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
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              1. Copy the code to embed the widget on your website.
            </p>
            <textarea
              className="w-full h-48 p-4 bg-gray-100 rounded-md border border-gray-300 text-sm"
              readOnly
              rows={10}
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

            <p className="text-sm text-muted-foreground flex flex-row">
              2. Check the widget on your website, or click
            </p>
            <Button
              variant="default"
              size="lg"
              disabled={loading}
              onClick={verify}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            <Link
              target="_blank"
              href="https://github.com/allenyan513/reviewsup-embed-example"
              className="text-sm text-blue-500 hover:underline mt-2 flex flex-row items-center gap-2"
            >
              <BsGithub className="text-black" /> View Full Code of Example
            </Link>
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
