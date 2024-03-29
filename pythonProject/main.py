import cv2
import numpy as np
from matplotlib import pyplot as plt
from skimage.metrics import structural_similarity as compare_ssim
import json
from random import randrange, uniform
from functools import cmp_to_key
from operator import itemgetter
import csv
import time




filename = 'images/vagabond1.png'


def getCenterPoint(rect):
    x, y, w, h = rect
    return (round(x + w / 2), round(y + h / 2))

def cmp_rects(r1, r2):
    x1,y1 = getCenterPoint(r1)
    x2,y2 = getCenterPoint(r2)

    if x1 > x2:
        return 1
    elif x1 == x2:
        if y1 > y2:
            return 1
        elif y1 == y2:
            return 0
        else:
            return -1
    else:
        return -1

def rectIntersection(a,b):
  x = max(a[0], b[0])
  y = max(a[1], b[1])
  w = min(a[0]+a[2], b[0]+b[2]) - x
  h = min(a[1]+a[3], b[1]+b[3]) - y
  if w<0 or h<0: return () # or (0,0,0,0) ?
  return (x, y, w, h)

cmp_rects_py3 = cmp_to_key(cmp_rects)

def distance(pt_1, pt_2):
    pt_1 = np.array((pt_1[0], pt_1[1]))
    pt_2 = np.array((pt_2[0], pt_2[1]))
    return np.linalg.norm(pt_1-pt_2)

def closest_rect(rect, rects, thresh):
    pt = None
    dist = 9999999
    for r in rects:
        d = distance((rect[4], rect[5]), (r[4], r[5]))
        if d <= dist and d < thresh:
            dist = d
            pt = r
    return pt


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
        edge = min(shape[0], shape[1])
        maxS = edge * edge * t / 100
        for rect in rects:
            x,y,w,h = rect
            s = w*h
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
        frects = fs.filterRects(image.shape, rects, filterRects)

        return frects

    def compareRects(self, image, rects1, rects2):
        r1 = self.drawRectangles(image, rects1)
        r2 = self.drawRectangles(image, rects2)

        g1 = self.grayscale(r1)
        g2 = self.grayscale(r2)

        (score, diff) = compare_ssim(g1, g2, full=True)
        diff = (diff * 255).astype("uint8")

        return score

    def compareRects2(self, image, testRects, rects):
        if len(testRects) < 2:
            return 0

        srects1 = sorted(map(lambda item: tuple(item) + getCenterPoint(item), testRects), key=itemgetter(4,5))
        srects2 = sorted(map(lambda item: tuple(item) + getCenterPoint(item), rects), key=itemgetter(4,5))

        distanceThresh = 150
        l = max(len(srects2), len(srects1))
        sum = 0
        for rect in srects2:
            if len(srects1) > 0:
                testRect = closest_rect(rect, srects1, distanceThresh)
                if testRect != None:
                    srects1.remove(testRect)

                    res = self.compareRects(image, [testRect[:-2]], [rect[:-2]])
                    sum += res
            else:
                break

        return sum / l







s = open("images/list.json")
testData = json.load(s)
s.close()
testResult = []
morphTypes = [cv2.MORPH_RECT, cv2.MORPH_CROSS, cv2.MORPH_ELLIPSE]
fs = FrameSelector()

# img = cv2.imread(filename)
# gray = fs.grayscale(mat=img)
# thresh = fs.threshold(src=gray)
# contours = fs.findContours(src=thresh)
# res = fs.fillContours(contours=contours, image=img)
# close = fs.morphologyClose(res, 0.5, 0.5, 1)
# open = fs.morphologyClose(close, 0.22, 0.2, 1)
#
# gray2 = fs.grayscale(mat=open)
# contours2 = fs.findContours(src=gray2)
# res2 = fs.drawConvexHullContours(contours2, open)
#
# gray3 = fs.grayscale(mat=res2)
# contours3 = fs.findContours(src=gray3)
#
# rects = fs.getBounding(contours3)
# frects = fs.filterRects(img.shape, rects, 10)
# drects = fs.drawRectangles(img, frects)
#
# compare = fs.compareRects(img, rects, rects)
# compare2 = fs.compareRects2(img, rects, rects)
#
# print(compare)
# print(compare2)
#
# print(len(frects))
# print(frects)
# plt.subplot(121), plt.imshow(img)
# plt.subplot(122), plt.imshow(drects)
# plt.show()
# exit(0)

# index = 1
# img = cv2.imread('images/' + testData[index]['fileName'])
# rects = fs.selectFrames(img, 137, 91, 0.5, 0.5, 1, 1, 0.22, 0.2, 1, 0, 5)
# drects = fs.drawRectangles(img, rects)
# compare = fs.compareRects2(img, rects, testData[index]['rects'])
# print(compare)
# plt.subplot(121), plt.imshow(img)
# plt.subplot(122), plt.imshow(drects)
# plt.show()
# exit(0)

iterations = 10000
with open('results/' + str(time.time()) + '.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['i', 'fileName', 'tresh', 'maxVal',
                     'xO', 'yO', 'iterationsO', 'shapeO',
                     'xC', 'yC', 'iterationsC', 'shapeC',
                     'filterRects',
                     'compare', 'compare2'])

    for testImage in testData:
        image = cv2.imread('images/' + testImage['fileName'])
        for i in range(iterations):
            tresh = randrange(255)
            maxVal = randrange(255)
            xO = uniform(0.001, 2.0)
            yO = uniform(0.001, 2.0)
            iterationsO = randrange(10)
            so = randrange(0, 3)
            shapeO = morphTypes[so]
            xC = uniform(0.001, 2.0)
            yC = uniform(0.001, 2.0)
            iterationsC = randrange(10)
            sc = randrange(0, 3)
            shapeC = morphTypes[sc]
            filterRects = randrange(2, 10)



            try:
                rects = fs.selectFrames(image,
                                        tresh, maxVal,
                                        xO, yO, iterationsO, shapeO,
                                        xC, yC, iterationsC, shapeC,
                                        filterRects
                                        )
                compare = fs.compareRects(image, rects, testImage['rects'])
                compare2 = fs.compareRects2(image, rects, testImage['rects'])
            except BaseException:
                compare = 'error'
                compare2 = 'error'

            params = [i, testImage['fileName'], tresh, maxVal,
                      xO, yO, iterationsO, shapeO,
                      xC, yC, iterationsC, shapeC,
                      filterRects,
                      compare, compare2
                      ]
            testResult.append(params)

            print(params)
        writer.writerows(testResult)
        testResult = []




print(testResult)


