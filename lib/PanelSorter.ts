type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default {
  leftToRight: (r1: Rect, r2: Rect) => {
    if (r1.x > r2.x + r2.width && r1.y + r1.height > r2.y) {
      return -1;
    }
    if (r1.x < r2.x + r2.width && r1.y + r1.height < r2.y) {
      return -1;
    }
    if (r1.x < r2.x + r2.width && r1.y + r1.height > r2.y) {
      return 1;
    }
    if (r1.x > r2.x + r2.width && r1.y + r1.height < r2.y) {
      return 1;
    }
    return 0;
  },
  rightToLeft: (r1: Rect, r2: Rect) => {
    if (r1.x + r1.width > r2.x && r1.y + r1.height > r2.y) {
      return 1;
    }
    if (r1.x + r1.width < r2.x && r1.y + r1.height < r2.y) {
      return 1;
    }
    if (r1.x + r1.width < r2.x && r1.y + r1.height > r2.y) {
      return -1;
    }
    if (r1.x + r1.width > r2.x && r1.y + r1.height < r2.y) {
      return -1;
    }
    return 0;
  },
  leftToRight2: (r1: Rect, r2: Rect) => {
    const cx1 = Math.round(r1.x + r1.width / 2);
    const cx2 = Math.round(r2.x + r2.width / 2);
    const cy1 = Math.round(r1.y + r1.height / 2);
    const cy2 = Math.round(r2.y + r2.height / 2);

    if (cx1 >= cx2 && cy1 > cy2) {
      return 1;
    }
    if (cx1 <= cx2 && cy1 > cy2) {
      return 1;
    }
    if (cx1 >= cx2 && cy1 < cy2) {
      return 1;
    }
    if (cx1 <= cx2 && cy1 < cy2) {
      return -1;
    }
    return 0;
  }
};
