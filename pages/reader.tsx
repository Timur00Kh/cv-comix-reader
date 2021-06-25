/* eslint-disable prefer-const */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import openCvReady from '@/lib/frame-selector/openCvReady';
import InputRange, { Range } from 'react-input-range';
import { FrameSelector } from '@/lib/frame-selector';

interface ImgPathsI {
  name: string;
  path: string;
}

export default function Home(): JSX.Element {
  const dispatch = useDispatch();

  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);

  const [rangeValue, setRangeValue] = useState<Range | number>(0);
  const [mats, setMats] = useState<cv.Mat[]>([]);
  const [imgPath, setImgPath] = useState<string>(null);
  const [imgPaths, setImgPaths] = useState<ImgPathsI[]>([]);

  useEffect(() => {
    if (!canvasRef1 || imgPath) return;

    (async () => {
      const imgPaths$: ImgPathsI[] = await fetch('/api/images').then((r) =>
        r.json()
      );
      setImgPaths(imgPaths$);

      if (imgPaths$?.length) {
        setImgPath(imgPaths$[0].path);
      }
    })();
  }, [imgPath]);

  useEffect(() => {
    if (!canvasRef1 && imgPath) return;

    (async () => {
      console.log(`start process for: ${imgPath}`);
      await openCvReady();

      const canvas1 = canvasRef1.current;

      const img = await loadImage(imgPath);
      cv.imshow(canvas1, cv.imread(img));

      const mats$ = FrameSelector.getFrameSelectSteps(img);
      setMats(mats$);
      // setRangeValue(mats$.length - 1);
      console.log(`end process for: ${imgPath}`);

      return () => {
        mats$.forEach((e) => e.delete());
        setMats([]);
      };
    })();
  }, [imgPath]);

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
      <div style={{ width: '100%', padding: '10px', marginTop: '20px' }}>
        <select onChange={(e) => setImgPath(e.currentTarget.value)}>
          {imgPaths?.map((e) => (
            <option key={e.path} value={e.path}>
              {e.name}
            </option>
          ))}
        </select>
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
