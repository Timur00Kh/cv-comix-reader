import cv2
import numpy as np
from matplotlib import pyplot as plt
from skimage.metrics import structural_similarity as compare_ssim

filename = 'images/vagabond4.png'

class FrameSelector:
    def grayscale(self, mat):
        result = cv2.cvtColor(mat, cv2.COLOR_BGR2GRAY)
        return result

    def threshold(self, src, thresh=80, maxval=255, type=cv2.THRESH_BINARY_INV):
        ret, result = cv2.threshold(src, thresh, maxval, type)
        return result

    def findContours(self, src):
        contours, h = cv2.findContours(src, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        return contours

    def drawConvexHullContours(self, contours, image):
        result = image.copy()
        for cnt in contours:
            hull = cv2.convexHull(cnt)
            cv2.drawContours(result, [cnt], -1, 255, -1)
            cv2.drawContours(result, [hull], -1, 255, -1)
        return result

    def fillContours(self, contours, image):
        result = np.zeros(image.shape, dtype = "uint8")
        for cnt in contours:
            cv2.drawContours(result, [cnt], -1, 255, -1)
        return result

    def morphologyClose(self, image, x, y, iterations, shape = cv2.MORPH_RECT):
        result = np.zeros(image.shape, dtype="uint8")
        ksize = (
            round(image.shape[0] / 100 * x),
            round(image.shape[1] / 100 * y)
        )
        M = cv2.getStructuringElement(shape, ksize)
        cv2.morphologyEx(image, cv2.MORPH_CLOSE, M, result, (-1, -1), iterations)
        return result

    def morphologyOpen(self, image, x, y, iterations, shape = cv2.MORPH_RECT):
        result = np.zeros(image.shape, dtype="uint8")
        ksize = (
            round(image.shape[0] / 100 * x),
            round(image.shape[1] / 100 * y)
        )
        M = cv2.getStructuringElement(shape, ksize)
        cv2.morphologyEx(image, cv2.MORPH_OPEN, M, result, (-1, -1), iterations)
        return result

    def getBounding(self, contours):
        arr = []
        for contour in contours:
            rect = cv2.boundingRect(contour)
            arr.append(rect)
        return arr

    def drawRectangles(self, image, rects):
        result = np.zeros(image.shape, dtype="uint8")
        for rect in rects:
            x,y,w,h = rect
            cv2.rectangle(result, (x,y), (x+w,y+h),(255,255,255), -1)
        return result

    def filterRects(self, shape, rects, t):
        arr = []
        maxS = shape[0] * shape[1] * t / 100
        for rect in rects:
            x,y,w,h = rect
            s = (x+w) * (y+h)
            if s > maxS:
                arr.append(rect)
        return arr

    def selectFrames(self, image,
                     tresh, maxVal,
                     xO, yO, iterationsO, shapeO,
                     xC, yC, iterationsC, shapeC,
                     filterRects
                     ):
        gray = fs.grayscale(mat=image)
        thresholdImage = fs.threshold(gray, tresh, maxVal)
        contours = fs.findContours(thresholdImage)
        res = fs.fillContours(contours, image)
        close = fs.morphologyClose(res, xO, yO, iterationsO, shapeO)
        open = fs.morphologyClose(close, xC, yC, iterationsC, shapeC)

        gray2 = fs.grayscale(open)
        contours2 = fs.findContours(gray2)
        res2 = fs.drawConvexHullContours(contours2, open)

        gray3 = fs.grayscale(res2)
        contours3 = fs.findContours(gray3)

        rects = fs.getBounding(contours3)
        frects = fs.filterRects(img.shape, rects, filterRects)

        return frects

    def compareRects(self, image, rects1, rects2):
        r1 = self.drawRectangles(image, rects1)
        r2 = self.drawRectangles(image, rects2)

        g1 = self.grayscale(r1)
        g2 = self.grayscale(r2)

        # h1 = cv2.calcHist([r1], [2], None, [256], [0,256])
        # h2 = cv2.calcHist([r2], [2], None, [256], [0,256])
        #
        # result = cv2.compareHist(h1, h2, cv2.HISTCMP_BHATTACHARYYA)

        (score, diff) = compare_ssim(g1, g2, full=True)
        diff = (diff * 255).astype("uint8")

        return score






fs = FrameSelector()
img = cv2.imread(filename)
gray = fs.grayscale(mat=img)
thresh = fs.threshold(src=gray)
contours = fs.findContours(src=thresh)
res = fs.fillContours(contours=contours, image=img)
close = fs.morphologyClose(res, 0.5, 0.5, 1)
open = fs.morphologyClose(close, 0.22, 0.2, 1)

gray2 = fs.grayscale(mat=open)
contours2 = fs.findContours(src=gray2)
res2 = fs.drawConvexHullContours(contours2, open)

gray3 = fs.grayscale(mat=res2)
contours3 = fs.findContours(src=gray3)

rects = fs.getBounding(contours3)
frects = fs.filterRects(img.shape, rects, 10)
drects = fs.drawRectangles(img, frects)

compare = fs.compareRects(img, rects, rects)

print(compare)

print(len(frects))
print(frects)
plt.subplot(121), plt.imshow(img)
plt.subplot(122), plt.imshow(drects)
plt.show()

