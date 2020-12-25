/**
 *
 * @param {*} canvasId Id of the canvas element
 * @param {*} canvasBoxId Id of the canvas parent div
 */
function __initCanvasElmt(canvasId, canvasBoxId) {
  const $canvas = $(`${canvasId}`).get(0)

  const width = $(`${canvasBoxId}`).width()
  const height = $(`${canvasBoxId}`).height()
  $canvas.width = width
  $canvas.height = height

  return $canvas
}

$(window).on("load", () => {
  const $canvas = __initCanvasElmt("#canvas", "#canvasBox")
  const canvas = new CanvasWrapper($canvas)

  const width = canvas.getWidth()
  const height = canvas.getHeight()
  const COLOR = "#ff0000"
  canvas.drawRect(width / 2, height / 2, 10, 10, COLOR)
})
