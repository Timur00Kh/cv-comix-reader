import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { FrameSelector, loadImage } from '@/lib/frame-selector';
import sleep from '@/utils/sleep';
import { addComics as addComics$, IComics } from '@/store/comics';
import { nanoid } from 'nanoid';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals
} from 'unique-names-generator';
import { Manga } from '@/lib/parser/ReadMangaParser';
import { FullSnackFrameSelector } from '@/lib/frame-selector/FullSnackFrameSelector';

export default function ReadmangaLoader(): JSX.Element {
  // const input = useRef<HTMLInputElement>();
  const dispatch = useDispatch();
  const addComics = (c: IComics) => dispatch(addComics$(c));
  const [url, setUrl] = useState<string>();
  const frameSelector = useMemo(() => new FullSnackFrameSelector(), []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  const onClick = async () => {
    const pages: IComics['pages'] = [];
    const manga: Manga = await fetch(`/api/parse?url=${url}`)
      .then((r) => r.json())
      .then((r) => r.manga);
    console.log(manga);

    if (manga?.chapters?.length) {
      const images = manga.chapters.reduce(
        (sum, m) => [...sum, ...m.pages],
        []
      );

      for (
        let i = 0;
        i <= (images.length > 100 ? 100 : images.length);
        i += 1
      ) {
        const imageUrl = `/api/imageProxy?url=${encodeURIComponent(images[i])}`;

        // eslint-disable-next-line no-await-in-loop
        const img = await loadImage(imageUrl);
        const rects = frameSelector.getFrames(img);

        pages.push({
          img: imageUrl,
          rects: rects.filter((r) => r.width * r.height > 100 * 100)
        });
        // eslint-disable-next-line no-await-in-loop
        await sleep(20);
        console.log(`${i + 1} / ${images[i]}`);
      }

      addComics({
        title:
          manga.title ||
          uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            separator: ' ',
            length: 3
          }),
        id: nanoid(),
        pages
      });
    }
  };

  return (
    <InputGroup>
      <Input
        value={url}
        onChange={onChange}
        placeholder="paste readmanga url"
      />
      <InputGroupAddon addonType="append">
        <Button color="success" outline onClick={onClick}>
          Load
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
