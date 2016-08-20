/* jshint esversion: 6 */
/* jshint asi: true */

let canvas

let lines = []
let lightLines = []
let closestLines = []
let currentClosestLine

/**
 * Basically the "constructor" function,
 * it will be called once and only once the page has loaded.
 */
function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight)

    translate(width / 2, height / 2) // x = 0, y = 0 is the center of the sceren

    // Lines that sorround the sketch
    lines.push(new Line(-width / 2 + 1, -height / 2 + 1, width / 2 - 1, -height / 2 + 1))
    lines.push(new Line(width / 2 - 1, -height / 2 + 1, width / 2 - 1, height / 2 - 1))
    lines.push(new Line(width / 2 - 1, height / 2 - 1, -width / 2 + 1, height / 2 - 1))
    lines.push(new Line(-width / 2 + 1, height / 2 - 1, -width / 2 + 1, -height / 2 + 1))

    // Triangle 1 - Top Left
    lines.push(new Line(-width / 2 + 200, -height / 2 + 100, -width / 2 + 250, -height / 2 + 200))
    lines.push(new Line(-width / 2 + 250, -height / 2 + 200, -width / 2 + 150, -height / 2 + 200))
    lines.push(new Line(-width / 2 + 150, -height / 2 + 200, -width / 2 + 200, -height / 2 + 100))

    // Triangle 2 - Middle Down
    lines.push(new Line(-width / 2 + 500, -height / 2 + 650, -width / 2 + 600, -height / 2 + 700))
    lines.push(new Line(-width / 2 + 600, -height / 2 + 700, -width / 2 + 600, -height / 2 + 400))
    lines.push(new Line(-width / 2 + 600, -height / 2 + 400, -width / 2 + 500, -height / 2 + 650))

    // Polygon 1
    lines.push(new Line(350, 110, 400, 300))
    lines.push(new Line(400, 300, 475, 320))
    lines.push(new Line(475, 320, 500, -100))
    lines.push(new Line(500, -100, 350, 110))

    // Polygon 2
    lines.push(new Line(0, -300, 100, -400))
    lines.push(new Line(100, -400, 150, -270))
    lines.push(new Line(150, -270, 235, -340))
    lines.push(new Line(235, -340, 260, -290))
    lines.push(new Line(260, -290, 240, -200))
    lines.push(new Line(240, -200, 170, -80))
    lines.push(new Line(170, -80, 50, -100))
    lines.push(new Line(50, -100, 0, -300))

    // Polygon 3
    lines.push(new Line(-400, 350, -50, 300))
    lines.push(new Line(-50, 300, -50, 400))
    lines.push(new Line(-50, 400, -300, 400))
    lines.push(new Line(-300, 400, -400, 350))
}

/**
 * Handles screen resize
 */
window.onresize = function() {
    canvas.size(window.innerWidth, window.innerHeight)
    translate(width / 2, height / 2)
}

/**
 * Here the algorithm lives.
 * This function is called once per frame and updates the lines that then
 * are filled with triangles so that there will be light
 */
function update() {
    lightLines = []
    closestLines = []

    lightLines.push(new Line(-width / 2 + mouseX, -height / 2 + mouseY, lines[0].x1, lines[0].y1))
    for (let i = 0; i < lines.length - 1; i++) {
        lightLines.push(new Line(-width / 2 + mouseX, -height / 2 + mouseY, lines[i].x2, lines[i].y2))
    }
    lightLines.push(new Line(-width / 2 + mouseX, -height / 2 + mouseY, lines[lines.length - 1].x2, lines[lines.length - 1].y2))

    for (let i = 0; i < lightLines.length; i++) {
        q = i
        for (let j = 0; j < 3; j++) {
            let min = Infinity
            switch (j) {
                case 0:
                    let angle0 = atan2(lightLines[i].x1 - lightLines[i].x2, lightLines[i].y1 - lightLines[i].y2) + pow(10, -6)
                    let d0 = dist(lightLines[i].x1, lightLines[i].y1, lightLines[i].x2, lightLines[i].y2)
                    let x0 = d0 * sin(angle0)
                    let y0 = d0 * cos(angle0)
                    let lightLine0 = new Line(lightLines[i].x1, lightLines[i].y1, lightLines[i].x1 - x0, lightLines[i].y1 - y0)
                    for (let k = 0; k < lines.length; k++) {
                        value = calculateClosestLine(lines[k], lightLine0, min)
                        if (value != -1) {
                            min = value
                        }
                    }
                    closestLines.push(currentClosestLine)
                    continue
                case 1:
                    for (let k = 0; k < lines.length; k++) {
                        value = calculateClosestLine(lines[k], lightLines[i], min)
                        if (value != -1) {
                            min = value
                        }
                    }
                    closestLines.push(currentClosestLine)
                    continue
                case 2:
                    let angle2 = atan2(lightLines[i].x1 - lightLines[i].x2, lightLines[i].y1 - lightLines[i].y2) - pow(10, -6)
                    let d2 = dist(lightLines[i].x1, lightLines[i].y1, lightLines[i].x2, lightLines[i].y2)
                    let x2 = d2 * sin(angle2)
                    let y2 = d2 * cos(angle2)
                    let lightLine2 = new Line(lightLines[i].x1, lightLines[i].y1, lightLines[i].x1 - x2, lightLines[i].y1 - y2)
                    for (let k = 0; k < lines.length; k++) {
                        value = calculateClosestLine(lines[k], lightLine2, min)
                        if (value != -1) {
                            min = value
                        }
                    }
                    closestLines.push(currentClosestLine)
                    continue
            }
        }
    }

    quicksort(closestLines, 0, closestLines.length - 1)
}

/**
 * Draws everything on the screen.
 */
function draw() {
    update()
    background(51) // rgb(51, 51, 51)

    fill(130) // rgb(130, 130, 130)

    stroke(255, 145, 0) // rgb(255, 145, 0)
    for (let i = 0; i < lines.length; i++) {
        lines[i].show()
    }

    stroke(130) // rgb(130, 130, 130)
    for (let i = 0; i < closestLines.length - 1; i++) {
        let l = closestLines[i]
        let nextL = closestLines[i + 1]
        triangle(l.x1, l.y1, l.x2, l.y2, nextL.x2, nextL.y2)
    }
    let firstL = closestLines[0]
    let lastL = closestLines[closestLines.length - 1]
    triangle(lastL.x1, lastL.y1, lastL.x2, lastL.y2, firstL.x2, firstL.y2)

    fill(156, 226, 123) // rgb(156, 226, 123)
    textSize(26)
    text("2D Light Source, Made by Tony Solomonik", -width / 2 + width / 100, -height / 2 + height / 30)
}

/**
 * The function will calculate the closest line that there is
 * from the lightline and the material line itself
 *
 * @param  {Line} line      The material line (maybe part of a triangle or other polygon)
 * @param  {Line} lightLine     The light line (one of the lines that are made from mouse point and end point of a line)
 * @param  {Number} minDist   Current shortest distance squared of two lines
 * @return {Number}     The smallest distance squared if it is smaller than the current one,
 * else it will return -1. It will also return -1 if the line isn't in the right direction.
 */
let calculateClosestLine = function(line, lightLine, minDist) {
    // m = (y1 - y2) / (x1 - x2)
    // y = mx + n
    let m1 = (lightLine.y1 - lightLine.y2) / (lightLine.x1 - lightLine.x2)
    let n1 = lightLine.y2 - m1 * lightLine.x2

    let m2 = (line.y1 - line.y2) / (line.x1 - line.x2)
    let n2 = line.y1 - m2 * line.x1

    let mutualX = m2 === Infinity || m2 === -Infinity ? line.x1 : (n1 - n2) / (m2 - m1)
    let mutualY = m2 === 0 || m2 === -0 ? line.y1 : mutualX * m1 + n1

    let angle = atan2(lightLine.x1 - mutualX, lightLine.y1 - mutualY)
    if (abs(atan2(lightLine.x1 - lightLine.x2, lightLine.y1 - lightLine.y2) - angle) > pow(10, -10)) {
        return -1
    }

    if (mutualX > max(line.x1, line.x2) + pow(10, -10) ||
        mutualX < min(line.x1, line.x2) - pow(10, -10) ||
        mutualY > max(line.y1, line.y2) + pow(10, -10) ||
        mutualY < min(line.y1, line.y2) - pow(10, -10)) {
        return -1
    }
    // not square rooting to make the algorithm run faster
    let distSq = pow(lightLine.x1 - mutualX, 2) + pow(lightLine.y1 - mutualY, 2)
    if (distSq < minDist) {
        // m = tan(TWO_PI - angle + PI / 2)
        currentClosestLine = new Line(lightLine.x1, lightLine.y1, mutualX, mutualY)
        return distSq
    }
    return -1
}

/**
 * Quicksort algorithm function
 *
 * @param  {Array} A    The array
 * @param  {Number} lo   The lowest index
 * @param  {Number} hi   The highest index
 */
let quicksort = function(A, lo, hi) {
    if (lo < hi) {
        let p = partition(A, lo, hi);
        quicksort(A, lo, p);
        quicksort(A, p + 1, hi);
    }
}

/**
 * Part of the quicksort algorithm
 *
 * @param  {Array} A    The array
 * @param  {Number} lo   The lowest index
 * @param  {Number} hi   The highest index
 * @return {Number} j    The current index that the quicksort is swapping
 */
let partition = function(A, lo, hi) {
    let pivot = atan2(A[lo].x1 - A[lo].x2, A[lo].y1 - A[lo].y2);
    let i = lo - 1;
    let j = hi + 1;
    while (true) {
        do {
            i++;
        } while (atan2(A[i].x1 - A[i].x2, A[i].y1 - A[i].y2) < pivot);
        do {
            j--;
        } while (atan2(A[j].x1 - A[j].x2, A[j].y1 - A[j].y2) > pivot);
        if (i >= j) {
            return j;
        }
        let temp = A[i];
        A[i] = A[j];
        A[j] = temp;
    }
}
