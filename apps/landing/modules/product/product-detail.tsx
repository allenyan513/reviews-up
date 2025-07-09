import { fetchProductDetail } from '@/actions/fetch-product-detail';
import Link from 'next/link';
import { BsBoxArrowUp } from 'react-icons/bs';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function ProductDetail(props: { lang: string; slug: string }) {
  const { lang, slug } = props;
  const product = await fetchProductDetail(slug);
  return (
    <div>
      <div className="flex flex-col gap-8 pt-24 pb-8 px-48 bg-linear">
        <div className="flex flex-row gap-2 items-center">
          {product.icon && (
            <img
              className="w-12 h-12 rounded object-cover aspect-video"
              src={product.icon}
              alt={product.name}
            />
          )}
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <h2 className="text-gray-500 line-clamp-1">
              {product.description}
            </h2>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <Link href={product.url || ''} target="_blank">
              <img
                className="rounded object-cover aspect-video shadow-sm hover:shadow-lg transition-shadow duration-300"
                src={product.screenshot}
                alt={product.name}
              />
            </Link>
          </div>
          <div className="flex-1 flex flex-col gap-3 justify-start items-start">
            <Link
              className=" inline-flex items-center bg-black text-white px-3 py-2 rounded gap-2 "
              href={product.url || ''}
              target="_blank"
            >
              <span>Visit {product.name}</span>
              <BsBoxArrowUp />
            </Link>
            <div className="flex flex-row items-center gap-4">
              <p className="w-36 font-semibold">AddedOn:</p>
              <p className="">{product.createdAt?.toLocaleString()}</p>
            </div>

            <p className="w-32 font-semibold">Categories:</p>
            <div className="flex flex-row flex-wrap gap-2">
              <Link href={``} className="product-category">
                {product.category}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 px-48 py-8 w-full">
        <div className="w-full">
          <p className="h2">{product.name} Product Information</p>
          <div className="flex flex-col rounded border border-gray-300 px-5 py-4 gap-2 bg-white">
            <h2 className="h3">What is {product.name}?</h2>
            <div className="rich-text text-start">
              <Markdown
                children={product.longDescription}
                remarkPlugins={[remarkGfm]}
              />
            </div>
            <div className="divider" />

            <h2 className="h3">How to use {product.name}?</h2>
            <div className="rich-text text-start">
              <Markdown
                children={product.howToUse}
                remarkPlugins={[remarkGfm]}
              />
            </div>
            <div className="divider" />

            <h2 className="h3">Core features of {product.name}</h2>
            <div className="rich-text text-start">
              <Markdown
                children={product.features}
                remarkPlugins={[remarkGfm]}
              />
            </div>
            <div className="divider" />

            <h2 className="h3">Use cases of {product.name}</h2>
            <div className="rich-text text-start">
              <Markdown
                children={product.useCase}
                remarkPlugins={[remarkGfm]}
              />
            </div>
            <div className="divider" />
            <h2 className="h3">FAQ of {product.name}</h2>
            <div className="rich-text text-start">
              <Markdown children={product.faq} remarkPlugins={[remarkGfm]} />
            </div>
            <div className="divider" />
          </div>
        </div>
      </div>
    </div>
  );
}
