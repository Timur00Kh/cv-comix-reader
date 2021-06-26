/* eslint-disable no-underscore-dangle */

import { Item } from '@/pages/stage';

const _images: Item[] = [
  {
    fileName: 'vagabond1.png',
    rects: [
      [0, 585, 811, 615],
      [0, 369, 491, 195],
      [498, 0, 312, 564],
      [0, 0, 491, 348]
    ]
  },
  {
    fileName: 'vagabond1_2.png',
    rects: [
      [0, 0, 491, 348],
      [498, 0, 312, 564],
      [0, 369, 491, 195],
      [0, 585, 811, 615],
      [1, 996, 150, 231]
    ]
  },
  {
    fileName: 'vagabond2.png',
    rects: [
      [1, 1, 375, 356],
      [383, 1, 426, 353],
      [1, 376, 806, 824]
    ]
  },
  {
    fileName: 'vagabond3.png',
    rects: [
      [52, 1, 806, 494],
      [49, 438, 410, 290],
      [453, 484, 405, 239],
      [51, 958, 454, 242],
      [514, 959, 344, 241]
    ]
  },
  {
    fileName: 'vagabond4.png',
    rects: [
      [439, 766, 363, 434],
      [0, 766, 430, 434],
      [0, 589, 322, 153],
      [329, 587, 473, 155],
      [511, 353, 291, 212],
      [510, 0, 291, 329],
      [0, 0, 503, 566]
    ]
  },
  {
    fileName: 'light_and_shadow1.jpeg',
    rects: [
      [46, 46, 279, 471],
      [344, 128, 330, 582],
      [46, 814, 628, 520],
      [46, 1473, 628, 449],
      [46, 2014, 628, 459],
      [27, 2503, 335, 535],
      [382, 2710, 329, 460]
    ]
  },
  {
    fileName: 'light_and_shadow2.jpeg',
    rects: [
      [46, 365, 628, 471],
      [47, 888, 542, 464],
      [154, 1432, 519, 446],
      [7, 1937, 687, 575],
      [47, 2478, 421, 566],
      [454, 2651, 252, 572]
    ]
  }
].map((img) => {
  const rects = img.rects.map((rect) => {
    const [x, y, width, height] = rect;
    return { x, y, width, height };
  });

  return {
    img: `/images/${img.fileName}`,
    rects
  };
});

export default _images;
