import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import useImage from '@/hooks/useImage';
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
  const [image] = useImage(img);

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

  const computedStyles = useMemo<{
    translate: CSSProperties;
    scale: CSSProperties;
  }>(() => {
    const r = currentRects[i];

    if (!r || !image)
      return {
        translate: {},
        scale: {}
      };

    const cX = r.x + r.width / 2;
    const cY = r.y + r.height / 2;

    const imgWidth = image.naturalWidth;
    const imgHeight = image.naturalHeight;

    const cX$ = (cX / imgWidth) * 100;
    const cY$ = (cY / imgHeight) * 100;

    const sX = imgWidth / r.width;
    const sY = imgHeight / r.height;
    const s = sX;
    const s$ = s * 100;
    const x$ = (r.x / imgWidth) * 100;
    const y$ = (r.y / imgHeight) * 100;

    return {
      translate: {
        transform: `translate(${-x$}%, ${-y$}%)`
      },
      scale: {
        transform: `scale(${s$}%, ${s$}%)`
      }
    };
  }, [i, currentRects, image]);

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
    <>
      <pre className={classes.pre}>
        <b>{i}:</b> {JSON.stringify(currentRects[i], null, 2)}
        <br />
        <b>styles:</b> {JSON.stringify(computedStyles, null, 2)}
      </pre>
      <div className={classes.stage}>
        <div className={classes.inner}>
          <div
            className={classes.scale}
            style={{
              ...computedStyles.scale
            }}
          >
            <img
              style={{
                ...computedStyles.translate
              }}
              alt="1123"
              src={img}
              ref={imgRef}
            />
          </div>
        </div>
      </div>
    </>
  );
};
