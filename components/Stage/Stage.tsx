import React, { useEffect, useMemo, useRef, useState } from 'react';
import useImage from '@/hooks/useImage';
import { Motion, spring } from 'react-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/root-reducer';
import { ReadOrder } from '@/store/settings';
import PanelSorter from '@/lib/PanelSorter';
import classes from './Stage.module.scss';

interface Props {
  img: string;
  rects: cv.Rect[];
  prevPage?: () => void;
  nextPage?: () => void;
}

export const StageComponent: React.FC<Props> = ({
  img,
  rects,
  nextPage,
  prevPage
}) => {
  const settings = useSelector((s: RootState) => s.settings);
  const [i, setI] = useState<number>(0);
  const refI = useRef<number>(i);
  useEffect(() => {
    refI.current = i;
  }, [i]);
  const imgRef = useRef<HTMLImageElement>();
  const [image] = useImage(img);

  useEffect(() => {
    setI(0);
  }, [img]);

  const currentRects = useMemo(() => {
    const sorted = rects
      .slice()
      .sort(
        settings.readOrder === ReadOrder.leftToRight
          ? PanelSorter.leftToRight
          : PanelSorter.rightToLeft
      );

    const pageRect = {
      x: 0,
      y: 0,
      width: image?.naturalWidth || 0,
      height: image?.naturalHeight || 0
    };

    return [pageRect, ...sorted, pageRect];
  }, [rects, image, settings]);

  const computedStyles = useMemo<number[]>(() => {
    const r = currentRects[i];

    if (!r || !image) return [0, 0, 1];

    const imgWidth = image.naturalWidth;
    const imgHeight = image.naturalHeight;

    const s = imgWidth / r.width;
    const s$ = s * 100;
    const x$ = (r.x / imgWidth) * 100;
    const y$ = (r.y / imgHeight) * 100;

    return [-x$, -y$, s$];
  }, [i, currentRects, image]);

  const nextPanel = () => {
    if (refI.current < currentRects.length - 1) {
      setI((i$) => i$ + 1);
    } else {
      nextPage();
    }
  };
  const prevPanel = () => {
    if (refI.current > 0) {
      setI((i$) => i$ - 1);
    } else {
      prevPage();
    }
  };

  useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') {
        prevPanel();
      } else if (e.code === 'ArrowRight') {
        nextPanel();
      }
    };

    window.addEventListener('keydown', callback);
    return () => window.removeEventListener('keydown', callback);
  }, [currentRects, nextPage, prevPage]);

  const onStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.clientX > window.innerWidth / 2) {
      nextPanel();
    } else {
      prevPanel();
    }
  };

  return (
    <>
      {settings.showDebugHint && (
        <pre className={classes.pre}>
          <b>{i}:</b> {JSON.stringify(currentRects[i], null, 2)}
          <br />
          <b>styles:</b> {JSON.stringify(computedStyles, null, 2)}
        </pre>
      )}
      <Motion
        defaultStyle={{ x: 0, y: 0, s: 1 }}
        style={{
          x: spring(computedStyles[0]),
          y: spring(computedStyles[1]),
          s: spring(computedStyles[2])
        }}
      >
        {(values) => (
          <div className={classes.stage} onClick={onStageClick}>
            <div className={classes.inner}>
              <div
                className={classes.scale}
                style={{
                  transform: `scale(${values.s}%, ${values.s}%)`
                }}
              >
                <img
                  style={{
                    transform: `translate(${values.x}%, ${values.y}%)`
                  }}
                  alt="1123"
                  src={img}
                  ref={imgRef}
                />
              </div>
            </div>
          </div>
        )}
      </Motion>
    </>
  );
};
