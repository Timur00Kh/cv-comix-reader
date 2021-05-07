import React, { useEffect, useMemo, useRef, useState } from 'react';
import classes from './Stage.module.scss';

interface Props {
  img: string;
  rects: cv.Rect[];
}

export const StageComponent: React.FC<Props> = ({ img, rects }) => {
  const [currentRects, setCurrentRects] = useState<cv.Rect[]>(rects);
  const [i, setI] = useState<number>(0);
  const imgRef = useRef<HTMLImageElement>();

  useEffect(() => {
    if (!imgRef.current) return;

    setCurrentRects([
      {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      ...currentRects
    ]);
  }, [imgRef, currentRects]);

  const computedStyles = useMemo<React.CSSProperties>(() => {
    const r = currentRects[i];

    return {
      transform: `translate(${r.x}px, ${-r.y}px) scale(${
        1 || ((r.x - r.width) / imgRef.current?.naturalWidth || 100) / 100
      })`
    };
  }, [i, currentRects]);

  useEffect(() => {
    const r = () => setI(i < currentRects.length - 1 ? i + 1 : i);
    const l = () => setI(i > 0 ? i - 1 : 0);

    const callback = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') {
        l();
      } else if (e.code === 'ArrowRight') {
        r();
      }
    };

    window.addEventListener('keydown', callback);
    return () => window.removeEventListener('keydown', callback);
  }, []);

  return (
    <div>
      <div className={classes.stage}>
        <img
          alt="1123"
          src={img}
          style={{
            height: '100%',
            ...computedStyles
          }}
        />
      </div>
    </div>
  );
};
