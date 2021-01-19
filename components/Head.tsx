import React from 'react';
import NextHead from 'next/head';

interface IHeadProps {
  title: string;
  keywords?: string;
  description?: string;
  robots?: string;
}

export function Head({
  title,
  keywords,
  description,
  robots
}: IHeadProps): JSX.Element {
  return (
    <NextHead>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
    </NextHead>
  );
}

Head.defaultProps = {
  keywords: 'this, is, keywords',
  description: 'this is description',
  robots: 'index, follow'
};
