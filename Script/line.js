/* jshint esversion: 6 */
/* jshint asi: true */

function Line(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2

    this.show = function() {
        line(x1, y1, x2, y2)
    }
}
