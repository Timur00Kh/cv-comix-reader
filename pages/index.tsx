import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { setExample } from '@/store/example';
import Head from 'next/head';
import { Button, Col, Container, Row } from 'reactstrap';
import { FrameSelector, loadImage } from '@/lib/frame-selector';
import sleep from '@/utils/sleep';
import { RootState } from '@/store/root-reducer';
import { addComics as addComics$, IComics } from '@/store/comics';
import { nanoid } from 'nanoid';
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals
} from 'unique-names-generator';

export default function Home(): JSX.Element {
  const input = useRef<HTMLInputElement>();
  const comics = useSelector((s: RootState) => s.comics);
  const dispatch = useDispatch();
  const addComics = (c: IComics) => dispatch(addComics$(c));

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const files = e.currentTarget?.files;
    if (files?.length) {
      const images = [];
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        // eslint-disable-next-line no-await-in-loop
        const img = await loadImage(url);
        const rects = FrameSelector.getFrameSelectStepsOriginal(img);

        images.push({
          img: url,
          rects
        });
        // eslint-disable-next-line no-await-in-loop
        await sleep(20);
        console.log(`${i + 1} / ${files.length}: ${file.name}`);
      }

      addComics({
        title: uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: ' ',
          length: 3
        }),
        id: nanoid(),
        pages: images
      });
    }
  };

  return (
    <Container>
      <Row className="mt-4 mb-4">
        <Button onClick={() => input?.current?.click()} outline color="success">
          Load Comics
        </Button>
        <input
          onChange={onInputChange}
          style={{ display: 'none' }}
          ref={input}
          type="file"
          multiple
        />
      </Row>
      {comics.map((comic) => (
        <Row key={comic.id}>
          <Link href={`/read/${comic.id}`}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a style={{ textTransform: 'capitalize' }}>{comic.title}</a>
          </Link>
        </Row>
      ))}
    </Container>
  );
}
