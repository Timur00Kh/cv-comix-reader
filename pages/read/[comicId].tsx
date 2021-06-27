import React, { useMemo, useState } from 'react';
import { StageComponent } from '@/components/Stage/Stage';
import _images from '@/pages/_images';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/root-reducer';
import { useRouter } from 'next/router';

export interface Item {
  img: string;
  rects: cv.Rect[];
}

const items: Item[] = _images;

export default function Stage(): JSX.Element {
  const comics = useSelector((s: RootState) => s.comics);
  const router = useRouter();
  const { comicId } = router.query;
  const currentComic = useMemo(() => comics.find((c) => c.id === comicId), [
    comics,
    comicId
  ]);
  const [i, setI] = useState<number>(0);
  const curr = useMemo(() => currentComic.pages[i], [currentComic, i]);

  const r = () =>
    setI((i$) => (i$ < currentComic.pages.length - 1 ? i$ + 1 : i$));
  const l = () => setI((i$) => (i$ > 0 ? i$ - 1 : 0));

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <StageComponent
        img={curr.img}
        rects={curr.rects}
        nextPage={r}
        prevPage={l}
      />
    </div>
  );
}
