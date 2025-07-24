'use client';
import { use, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { api } from '@/lib/api-client';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  return <div className='p-4'>Not yet implemented.</div>;
}
