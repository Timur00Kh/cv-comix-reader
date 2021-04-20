import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setExample } from '@/store/example';
import Head from 'next/head';

export default function Home(): JSX.Element {
  const dispatch = useDispatch();

  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);

  useEffect(() => {
    if (!canvasRef1 && !canvasRef2) return;

    const img_path = 'vagabond2.png';

    (async () => {
      await openCvReady();
      console.log(cv);

      const canvas1 = canvasRef1.current;
      const canvas2 = canvasRef2.current;

      const img1 = await loadImage(img_path);
      const img2 = await loadImage(img_path);

      let orig = cv.imread(img1);
      let img = cv.imread(img1);
      let result = cv.imread(img1);
      cv.cvtColor(img, result, cv.COLOR_BGR2GRAY);

      cv.imshow(canvas1, orig);

      // @ts-ignore
      let thresh = new cv.Mat(),
        contours = new cv.MatVector(),
        // @ts-ignore
        hierarchy = new cv.Mat();
      let a = cv.threshold(result, thresh, 80, 255, cv.THRESH_BINARY_INV);
      console.log(a);
      cv.imshow(canvas2, thresh);
      try {
        let b = cv.findContours(
          thresh,
          contours,
          hierarchy,
          cv.RETR_TREE,
          cv.CHAIN_APPROX_SIMPLE
        );
        console.log(b);
      } catch (e) {
        console.log(e);
      }
      console.log(thresh, contours, hierarchy);
      cv.imshow(canvas2, thresh);

      const c = cv.imread(img1);
      // @ts-ignore
      const c2 = cv.Mat.zeros(c.rows, c.cols, cv.CV_8UC3);
      // @ts-ignore
      const c3 = cv.Mat.zeros(c.rows, c.cols, cv.CV_8UC3);
      // @ts-ignore
      const c4 = cv.Mat.zeros(c.rows, c.cols, cv.CV_8UC3);
      const c5 = cv.imread(img1);
      cv.cvtColor(img, c5, cv.COLOR_BGR2RGB);
      const c6 = cv.imread(img1);
      cv.cvtColor(img, c6, cv.COLOR_BGR2RGB);
      for (let i = 0; i < contours.size(); ++i) {
        // @ts-ignore
        let color = new cv.Scalar(
          Math.round(Math.random() * 255),
          Math.round(Math.random() * 255),
          Math.round(Math.random() * 255)
        );
        // @ts-ignore
        let hull = new cv.Mat();
        cv.convexHull(contours.get(i), hull);

        let hulls = new cv.MatVector();
        hulls.push_back(hull);
        cv.drawContours(c6, contours, i, color, 1, cv.LINE_8);
        cv.drawContours(c5, hulls, 0, color, -1, cv.LINE_8);
        cv.drawContours(c4, contours, i, color, 1, cv.LINE_8);
        cv.drawContours(c2, hulls, 0, color, -1, cv.LINE_8);
        cv.drawContours(c3, hulls, 0, [255, 0, 0, 0], -1, cv.LINE_8);
      }

      // cv.imshow(canvas2, c3);

      // @ts-ignore
      let dst = new cv.Mat();
      const t = Math.min(c.rows / 20, c.cols / 20);
      // @ts-ignore
      let M = cv.Mat.ones(t, t, cv.CV_8U);
      // @ts-ignore
      let anchor = new cv.Point(-1, -1);

      cv.morphologyEx(
        c3,
        dst,
        cv.MORPH_OPEN,
        M,
        anchor,
        1,
        cv.BORDER_CONSTANT,
        cv.morphologyDefaultBorderValue()
      );
      cv.imshow(canvas2, dst);
    })();
  }, [canvasRef1, canvasRef2]);

  return (
    <div className="flex">
      <div className="flex_item">
        <canvas ref={canvasRef1} id="c1" className="canvas" />
      </div>
      <div className="flex_item">
        <canvas ref={canvasRef2} id="c2" className="canvas" />
      </div>
    </div>
  );
}

async function loadImage(src) {
  return await new Promise((resolve, reject) => {
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

async function openCvReady(wait = 10000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      reject(new Error('Слишком долго'));
    }, wait);
    cv['onRuntimeInitialized'] = () => {
      clearTimeout(t);
      resolve(true);
    };
  });
}
