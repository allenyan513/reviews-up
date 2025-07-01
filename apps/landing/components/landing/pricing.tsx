import React from 'react';
import { Check } from 'lucide-react';
import { Button, buttonVariants } from '@repo/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import Link from 'next/link';

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  isPopular?: boolean;
};

export function PricingCard(props: PricingCardProps) {
  return (
    <Card
      className={`w-full ${
        props.isPopular ? 'border-primary border-2 shadow-lg' : ''
      }`}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-4xl font-bold">{props.price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-2">
          {props.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-5 w-5 p-1 font-bold text-primary bg-green-400 rounded-full" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link
          href={props.buttonHref}
          className={buttonVariants({
            variant: props.isPopular ? 'default' : 'outline',
          })}
        >
          {props.buttonText}
        </Link>
      </CardFooter>
    </Card>
  );
}

export function PricingGrid(props: {
  title: string;
  subtitle: string;
  items: PricingCardProps[];
}) {
  return (
    <section id="features" className="container space-y-6 p-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold">{props.title}</h2>
        <p className="max-w-[85%] text-muted-foreground sm:text-lg">
          {props.subtitle}
        </p>
      </div>

      <div className="mx-auto grid justify-center gap-4 w-full md:grid-cols-2">
        {props.items.map((item, index) => (
          <PricingCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
