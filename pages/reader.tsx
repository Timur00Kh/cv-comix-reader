/* eslint-disable prefer-const */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import openCvReady from '@/lib/frame-selector/openCvReady';
import InputRange, { Range } from 'react-input-range';
import { FrameSelector } from '@/lib/frame-selector';

export default function Home(): JSX.Element {
  const dispatch = useDispatch();

  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);

  const [rangeValue, setRangeValue] = useState<Range | number>(0);
  const [mats, setMats] = useState<cv.Mat[]>([]);

  useEffect(() => {
    if (!canvasRef1) return;

    const imgPath = 'vagabond1.png';

    (async () => {
      await openCvReady();

      const canvas1 = canvasRef1.current;

      const img = await loadImage(imgPath);
      cv.imshow(canvas1, cv.imread(img));

      const mats$ = FrameSelector.getFrameSelectSteps(img);
      setMats(mats$);
      setRangeValue(mats$.length - 1);
      console.log(mats$);
    })();
  }, [canvasRef1, canvasRef2]);

  useEffect(() => {
    if (!canvasRef2 || mats.length - 1 < rangeValue) return;
    const canvas2 = canvasRef2.current;

    cv.imshow(canvas2, mats[rangeValue as number]);
  }, [canvasRef2, rangeValue, mats]);

  return (
    <div className="flex">
      <div style={{ width: '100%', padding: '10px', marginTop: '20px' }}>
        <InputRange
          maxValue={mats.length ? mats.length - 1 : 1}
          minValue={0}
          value={rangeValue}
          onChange={(value) => setRangeValue(value)}
        />
      </div>
      <div className="flex_item">
        <canvas ref={canvasRef1} id="c1" className="canvas" />
      </div>
      <div className="flex_item">
        <canvas ref={canvasRef2} id="c2" className="canvas" />
      </div>
    </div>
  );
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
}
