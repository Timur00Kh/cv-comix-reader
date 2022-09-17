/* eslint-disable prefer-const */
import { FrameSelector } from '@/lib/frame-selector/IFrameSelector';

// Based on: https://github.com/volinhbao/The-Full-Snack/blob/master/manga-frame.md
export class FullSnackFrameSelector extends FrameSelector {
  static grayscale(mat: cv.Mat): cv.Mat {
    let result = mat.clone();
    cv.cvtColor(mat, result, cv.COLOR_BGR2GRAY);
    return result;
  }

  static threshold(
    src: cv.Mat,
    thresh = 80,
    maxval = 255,
    type: CvConstant | number = cv.THRESH_BINARY_INV
  ): cv.Mat {
    let result = src.clone();
    cv.threshold(src, result, thresh, maxval, type);
    return result;
  }

  static findContours(src: cv.Mat): cv.MatVector {
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(
      src,
      contours,
      hierarchy,
      cv.RETR_TREE,
      cv.CHAIN_APPROX_SIMPLE
    );

    hierarchy.delete();

    return contours;
  }

  static drawConvexHullContours(
    contours: cv.MatVector,
    image: cv.Mat,
    color: cv.Scalar = new cv.Scalar(255, 0, 0)
  ): cv.Mat {
    let result = cv.Mat.zeros(image.rows, image.cols, cv.CV_8UC3);
    for (let i = 0; i < contours.size(); i += 1) {
      let hull = new cv.Mat();
      cv.convexHull(contours.get(i), hull);

      let hulls = new cv.MatVector();
      hulls.push_back(hull);
      cv.drawContours(result, hulls, 0, color, -1, cv.LINE_8);
      hull.delete();
      hulls.delete();
    }
    return result;
  }

  static getBounding(contours: cv.MatVector): cv.Rect[] {
    const arr = [];
    for (let i = 0; i < contours.size(); i += 1) {
      let c = contours.get(i);
      const rect = cv.boundingRect(c);
      arr.push(rect);
    }
    return arr;
  }

  getFramesWithSteps(img: HTMLImageElement): [cv.Rect[], cv.Mat[]] {
    let original = cv.imread(img);
    let greyscale = FullSnackFrameSelector.grayscale(original);
    let threshold = FullSnackFrameSelector.threshold(greyscale);
    let contours = FullSnackFrameSelector.findContours(threshold);
    let convexHullContours = FullSnackFrameSelector.drawConvexHullContours(
      contours,
      original
    );
    let greyscale2 = FullSnackFrameSelector.grayscale(convexHullContours);
    const rects = FullSnackFrameSelector.getBounding(
      FullSnackFrameSelector.findContours(greyscale2)
    );

    contours.delete();

    return [
      rects,
      [original, greyscale, threshold, convexHullContours, greyscale2]
    ];
  }
}
