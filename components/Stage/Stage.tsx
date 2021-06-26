import React, { useEffect, useMemo, useRef, useState } from 'react';
import classes from './Stage.module.scss';

interface Props {
  img: string;
  rects: cv.Rect[];
  onPageRead?: () => void;
}

export const StageComponent: React.FC<Props> = ({ img, rects }) => {
  const [currentRects, setCurrentRects] = useState<cv.Rect[]>(rects);
  const [i, setI] = useState<number>(0);
  const imgRef = useRef<HTMLImageElement>();

  useEffect(() => {
    if (!imgRef.current) return;

    setCurrentRects((cr) => [
      {
        x: 0,
        y: 0,
        width: imgRef.current?.naturalWidth,
        height: imgRef.current?.naturalHeight
      },
      ...cr
    ]);
  }, [imgRef]);

  const computedStyles = useMemo<React.CSSProperties>(() => {
    const r = currentRects[i];
    const imgWidth = imgRef.current?.naturalWidth;
    const imgHeight = imgRef.current?.naturalHeight;
    const sX = r.width / imgWidth;
    const sY = r.height / imgHeight;
    const s = 1 + Math.min(sX, sY);
    const s$ = s * 100;
    const x$ = (r.x / imgWidth) * 100;
    const y$ = (r.y / imgHeight) * 100;

    return {
      transform: `translate(${-x$}%, ${-y$}%)`
    };
  }, [i, currentRects]);

  useEffect(() => {
    const r = () => setI((i$) => (i$ < currentRects.length - 1 ? i$ + 1 : i$));
    const l = () => setI((i$) => (i$ > 0 ? i$ - 1 : 0));

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
      <pre className={classes.pre}>
        <b>{i}:</b> {JSON.stringify(currentRects[i], null, 2)}
        <br />
        <b>styles:</b> {JSON.stringify(computedStyles, null, 2)}
      </pre>
      <div className={classes.stage}>
        <div
          style={{
            ...computedStyles
          }}
          className={classes.inner}
        >
          <img alt="1123" src={img} ref={imgRef} />
        </div>
      </div>
    </div>
  );
};
