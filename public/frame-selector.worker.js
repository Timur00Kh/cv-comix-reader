/* eslint-disable prefer-const,no-undef */

// eslint-disable-next-line no-redeclare
class FrameSelector {
  static grayscale(mat) {
    let result = mat.clone();
    cv.cvtColor(mat, result, cv.COLOR_BGR2GRAY);
    return result;
  }

  static threshold(
    src,
    thresh = 80,
    maxval = 255,
    type = cv.THRESH_BINARY_INV
  ) {
    let result = src.clone();
    cv.threshold(src, result, thresh, maxval, type);
    return result;
  }

  static findContours(src) {
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

  static drawContoursRandomColors(contours, image, thickness = 1) {
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

  static fillContours(contours, image, color = new cv.Scalar(255, 0, 0)) {
    let result = cv.Mat.zeros(image.rows, image.cols, cv.CV_8UC3);
    for (let i = 0; i < contours.size(); i += 1) {
      cv.drawContours(result, contours.clone(), i, color, -1, cv.LINE_8);
    }
    return result;
  }

  static drawConvexHullContours(
    contours,
    image,
    color = new cv.Scalar(255, 0, 0)
  ) {
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

  static morphologyOpen(src, q = 20) {
    const result = new cv.Mat();
    const t = Math.min(src.rows / q, src.cols / q);
    let M = cv.Mat.ones(t, t, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);

    cv.morphologyEx(src, result, cv.MORPH_OPEN, M, anchor, 1);

    return result;
  }

  static morphologyClose(src, q = 20) {
    const result = new cv.Mat();
    const t = Math.min(src.rows / q, src.cols / q);
    let M = cv.Mat.ones(t, t, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);

    cv.morphologyEx(src, result, cv.MORPH_CLOSE, M, anchor, 1);

    return result;
  }

  static getFrameSelectSteps(img, options) {
    let original = img;
    let greyscale = this.grayscale(original);
    let threshold = this.threshold(greyscale, 30, 80);
    let contours = this.findContours(threshold);
    let randomColorsContours = this.drawContoursRandomColors(
      contours,
      original
    );
    let filledContours = this.fillContours(contours, original);
    // let convexHullContours = this.drawConvexHullContours(contours, original);
    // let convexHullResult = this.morphologyOpen(convexHullContours, 20);
    let closed = this.morphologyClose(filledContours, 100);
    let result = this.morphologyOpen(closed, 5);

    return [
      original,
      greyscale,
      threshold,
      randomColorsContours,
      filledContours,
      closed,
      result
      // convexHullContours,
      // convexHullResult
    ];
  }
}

async function loadImage(src) {
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

onmessage = async (e) => {
  const [imgSrc, options] = e.data;
  const result = FrameSelector.getFrameSelectSteps(
    await loadImage(imgSrc),
    options
  );
  postMessage(result);
};
