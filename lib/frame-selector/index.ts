/* eslint-disable prefer-const */

// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
// import Worker from 'worker-loader!./frame-selector.worker';

export interface FrameSelectStepsOptions {
  morphologyQ?: number;
  threshold?: {
    thresh?: number;
    maxval?: number;
    type?: CvConstant | number;
  };
}

interface FrameSelectorI {
  grayscale(mat: cv.Mat): cv.Mat;

  threshold(
    src: cv.Mat,
    thresh: number,
    maxval: number,
    type: CvConstant | number
  ): cv.Mat;

  findContours(src: cv.Mat): cv.MatVector;

  drawContoursRandomColors(
    contours: cv.MatVector,
    image: cv.Mat,
    thickness: number
  ): cv.Mat;

  fillContours(contours: cv.MatVector, image: cv.Mat, color: cv.Scalar): cv.Mat;

  drawConvexHullContours(
    contours: cv.MatVector,
    image: cv.Mat,
    color: cv.Scalar
  ): cv.Mat;

  morphologyOpen(src: cv.Mat, q: number): cv.Mat;

  morphologyClose(src: cv.Mat, q: number): cv.Mat;

  getFrameSelectSteps(img: HTMLImageElement): cv.Mat[];
}

export class FrameSelector {
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

    return contours;
  }

  static drawContoursRandomColors(
    contours: cv.MatVector,
    image: cv.Mat,
    thickness = 1
  ): cv.Mat {
    let result = cv.Mat.zeros(image.rows, image.cols, cv.CV_8UC3);
    for (let i = 0; i < contours.size(); i += 1) {
      let color = new cv.Scalar(
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255)
      );
      cv.drawContours(result, contours.clone(), i, color, thickness, cv.LINE_8);
    }
    return result;
  }

  static fillContours(
    contours: cv.MatVector,
    image: cv.Mat,
    color: cv.Scalar = new cv.Scalar(255, 0, 0)
  ): cv.Mat {
    let result = cv.Mat.zeros(image.rows, image.cols, cv.CV_8UC3);
    for (let i = 0; i < contours.size(); i += 1) {
      cv.drawContours(result, contours.clone(), i, color, -1, cv.LINE_8);
    }
    return result;
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
    }
    return result;
  }

  static morphologyOpen(src: cv.Mat, q = 20): cv.Mat {
    const result = new cv.Mat();
    const t = Math.min(src.rows / q, src.cols / q);
    let M = cv.Mat.ones(t, t, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);

    cv.morphologyEx(src, result, cv.MORPH_OPEN, M, anchor, 1);

    return result;
  }

  static morphologyClose(src: cv.Mat, q = 20): cv.Mat {
    const result = new cv.Mat();
    const t = Math.min(src.rows / q, src.cols / q);
    let M = cv.Mat.ones(t, t, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);

    cv.morphologyEx(src, result, cv.MORPH_CLOSE, M, anchor, 1);

    return result;
  }

  static getFrameSelectSteps(
    img: HTMLImageElement,
    options?: FrameSelectStepsOptions
  ): cv.Mat[] {
    let original = cv.imread(img);
    let greyscale = this.grayscale(original);
    let threshold = this.threshold(greyscale, 30, 80);
    let contours = this.findContours(threshold);
    let randomColorsContours = this.drawContoursRandomColors(
      contours,
      original
    );
    let filledContours = this.fillContours(contours, original);
    let convexHullContours = this.drawConvexHullContours(contours, original);
    let convexHullResult = this.morphologyOpen(convexHullContours, 20);
    let closed = this.morphologyClose(filledContours, 100);
    let result = this.morphologyOpen(closed, 50);

    return [
      original,
      greyscale,
      threshold,
      randomColorsContours,
      filledContours,
      closed,
      result,
      convexHullContours,
      convexHullResult
    ];
  }

  static getFrameSelectSteps2(
    img: HTMLImageElement,
    options?: FrameSelectStepsOptions
  ): cv.Mat[] {
    let original = cv.imread(img);
    let greyscale = this.grayscale(original);
    let threshold = this.threshold(greyscale, 80, 255);
    let open = this.morphologyOpen(threshold, 250);
    let close = this.morphologyClose(open, 250);
    let contours = this.findContours(close);
    let randomColorsContours = this.drawContoursRandomColors(
      contours,
      original
    );
    let filledContours = this.fillContours(contours, original);
    let convexHullContours = this.drawConvexHullContours(contours, original);
    let convexHullResult = this.morphologyOpen(convexHullContours, 20);
    let closed = this.morphologyClose(filledContours, 100);
    let result = this.morphologyOpen(closed, 50);

    return [
      original,
      greyscale,
      threshold,
      open,
      close,
      randomColorsContours,
      filledContours,
      closed,
      result,
      convexHullContours,
      convexHullResult
    ];
  }

  static async getFrameSelectStepsWorker(
    imgSrc: string,
    options?: FrameSelectStepsOptions
  ): Promise<cv.Mat[]> {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./frame-selector.worker.js');
      worker.postMessage([imgSrc, options]);
      worker.onmessage = (result) => {
        console.log(result.data);
        resolve(result.data);
      };
      worker.onerror = (e) => reject(e);
    });
  }
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
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
