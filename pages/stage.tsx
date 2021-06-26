import React, { useState } from 'react';
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
  const [curr] = useState(items[6]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <StageComponent img={curr.img} rects={curr.rects} />
    </div>
  );
}
