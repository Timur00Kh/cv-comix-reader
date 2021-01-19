import React from 'react';
import Link from 'next/link';
import { Head } from '@/components/Head';
import { useSelector } from 'react-redux';

export default function Other(): JSX.Element {
  const example = useSelector((s) => s.example);

  console.log(example);

  return (
    <>
      <Head title="Other page" />
      <h2>This is H2</h2>

      <Link href="/">
        <a href="/">Go to home page</a>
      </Link>
    </>
  );
}
