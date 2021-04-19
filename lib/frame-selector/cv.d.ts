// eslint-disable-next-line max-classes-per-file
type CvConstant = unknown;

declare namespace cv {
  const COLOR_BGR2GRAY: CvConstant;
  const COLOR_BGR2RGB: CvConstant;
  const THRESH_BINARY_INV: CvConstant;
  const CV_8UC3: CvConstant;
  const CV_8UC1: CvConstant;
  const CV_8U: CvConstant;
  const MORPH_OPEN: CvConstant;
  const BORDER_CONSTANT: CvConstant;
  const LINE_8: CvConstant;
  const INT_MAX: CvConstant;
  const RETR_TREE: CvConstant;
  const CHAIN_APPROX_SIMPLE: CvConstant;

  function imread(img: HTMLImageElement): Mat;

  function imshow(canvas: HTMLCanvasElement, mat: Mat);

  function cvtColor(src: Mat, dst: Mat, color: CvConstant | number);

  class Mat {
    rows: number;

    cols: number;

    constructor();

    clone(): Mat;

    static zeros(rows: number, cols: number, type: CvConstant | number): Mat;

    static ones(rows: number, cols: number, type: CvConstant | number): Mat;
  }

  class MatVector {
    constructor();

    // eslint-disable-next-line camelcase
    push_back(mat: Mat): void;

    size(): number;

    get(i: number): Mat;
  }

  class Scalar {
    constructor(r: number, g: number, b: number);
  }

  class Point {
    constructor(a: number, b: number);
  }

  function threshold(
    src: Mat,
    dst: Mat,
    thresh: number,
    maxval: number,
    type: CvConstant | number
  ): void;

  function findContours(
    image: Mat,
    contours: MatVector,
    hierarchy: Mat,
    mode: CvConstant | number,
    method: CvConstant | number,
    offset?: Point
  ): void;

  function morphologyDefaultBorderValue(): unknown;

  function morphologyEx(
    src: Mat,
    dst: Mat,
    op: CvConstant | number,
    kernel: Mat,
    anchor = new Point(-1, -1),
    iterations = 1,
    borderType = BORDER_CONSTANT,
    borderValue = morphologyDefaultBorderValue()
  ): void;

  function drawContours(
    image: Mat,
    contours: MatVector,
    contourIdx: number,
    color: Scalar,
    thickness = 1,
    lineType = LINE_8,
    hierarchy = noArray(),
    maxLevel = INT_MAX,
    offset = Point()
  ): void;

  function convexHull(
    points: Mat,
    hull: Mat,
    clockwise = false,
    returnPoints = true
  ): void;

  let onRuntimeInitialized;
}
