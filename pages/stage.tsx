import React, { useMemo, useState } from 'react';
import { StageComponent } from '@/components/Stage/Stage';
import _images from '@/pages/_images';

export interface Item {
  img: string;
  rects: cv.Rect[];
}

const items: Item[] = _images;
//   [
//   {
//     img: '/images/vagabond1.png',
//     rects: [
//       {
//         x: 0,
//         y: 0,
//         width: 0,
//         height: 0
//       },
//       {
//         x: 0,
//         y: 584,
//         width: 811,
//         height: 616
//       },
//       {
//         x: 0,
//         y: 368,
//         width: 491,
//         height: 194
//       },
//       {
//         x: 0,
//         y: 5,
//         width: 490,
//         height: 342
//       },
//       {
//         x: 498,
//         y: 0,
//         width: 312,
//         height: 563
//       }
//     ]
//   }
// ];

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
