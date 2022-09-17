import React, { useMemo, useState } from 'react';
import { StageComponent } from '@/components/Stage/Stage';
import _images from '@/components/_images';

export interface Item {
  img: string;
  rects: cv.Rect[];
}

const items: Item[] = _images;

export default function Stage(): JSX.Element {
  const [i, setI] = useState<number>(0);
  const curr = useMemo(() => items[i], [i]);

  const r = () => setI((i$) => (i$ < items.length - 1 ? i$ + 1 : i$));
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
