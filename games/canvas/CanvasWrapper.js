/**
 * Canvas wrapper.
 */
class CanvasWrapper {
  /**
   * Initialize canvas context.
   * @param {*} $canvas DOM element e.g. result from document.getElementById(),
   * or $(id).get(0). Caller should set $canvas.width and .height.
   */
  constructor($canvas) {
    const context = $canvas.getContext("2d")
    // Avoid anti-aliasing, so overlapping lines don't appear darker:
    context.translate(0.5, 0.5)

    this.canvas = $canvas
    this.context = context
  }

  /**
   * Draw a rectangle on the canvas.
   * @param {*} x position of top left corner.
   * @param {*} y position of top left corner.
   * @param {*} h Height of the rectangle.
   * @param {*} w Width of the rectangle.
   * @param {*} color Fill color.
   */
  drawRect(x, y, h, w, color) {
    this.context.fillStyle = color
    this.context.strokeStyle = color
    this.context.beginPath()
    this.context.rect(x, y, w, h)
    this.context.fill()
    this.context.stroke()
  }
}
