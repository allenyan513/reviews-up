import React from 'react';
import { howItWorksSteps } from '@/data/how-it-works';
import Link from 'next/link';
import { cn } from '@repo/ui/lib/utils';
import { buttonVariants } from '@repo/ui/button';

export const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="flex flex-col items-center gap-4 w-full p-4"
    >
      <h2 className="text-3xl md:text-4xl font-semibold">How it works</h2>
      <p className="text-muted-foreground sm:text-lg text-center p-4">
        Collect and display reviews effortlessly with our simple{' '}
        {howItWorksSteps.length}-step process.
      </p>
      <div className="flex flex-col gap-8 w-full">
        {howItWorksSteps.map((step, index) => (
          <div key={index} className="flex flex-col gap-4">
            <h3 className="border border-gray-300 rounded-md p-4 text-xl font-semibold">
              <span className="font-semibold rounded-full bg-red-200 text-black px-2 mr-2 text-md">
                {step.stepNumber}
              </span>{' '}
              {step.title}
            </h3>
            <p>{step.description}</p>
            {step.imageSrc && (
              <img
                className="w-full md:max-w-5xl h-auto overflow-y-auto border border-gray-300 rounded-md"
                src={step.imageSrc}
                alt={`Step ${step.stepNumber} illustration`}
              />
            )}
            {/*{step.codeBlocks &&*/}
            {/*  step.codeBlocks.map((codeBlock, codeIndex) => (*/}
            {/*    <CodeHighlighter*/}
            {/*      key={codeIndex}*/}
            {/*      code={codeBlock.content}*/}
            {/*      language={codeBlock.lang}*/}
            {/*      className="w-full hidden md:block"*/}
            {/*    />*/}
            {/*  ))}*/}
          </div>
        ))}
      </div>
      <Link
        href={`${process.env.NEXT_PUBLIC_DOCS_URL}`}
        target={'_blank'}
        className={cn(
          buttonVariants({ size: 'lg' }),
          'bg-red-400 hover:bg-red-500 rounded-full h-14 text-white font-semibold mt-8',
        )}
      >
        Read more in the docs
      </Link>
    </section>
  );
};
