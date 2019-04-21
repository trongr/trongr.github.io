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
  const COLOR = "#000000"
  canvas.drawRect(100, 100, 1, 1, COLOR)
})
