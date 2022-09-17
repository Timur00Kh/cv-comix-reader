export interface IFrameSelector {
  getFrames(img: HTMLImageElement): cv.Rect[];
  getFramesWithSteps(img: HTMLImageElement): [cv.Rect[], cv.Mat[]];
}

export abstract class FrameSelector {
  abstract getFramesWithSteps(img: HTMLImageElement): [cv.Rect[], cv.Mat[]];

  getFrames(img: HTMLImageElement): cv.Rect[] {
    const [rects, mats] = this.getFramesWithSteps(img);
    mats.forEach((mat) => mat.delete());
    return rects;
  }
}
