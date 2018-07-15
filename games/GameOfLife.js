const Conf = (() => {
  const Conf = {
    CELL_SIZE: 5, // px
    NUM_CELLS_HORIZONTAL: 0, // Wait for WorldView to tell Conf these
    NUM_CELLS_VERTICAL: 0,
  }

  return Conf
})()

const WorldModel = (() => {
  const WorldModel = {}

  const World = []
  let WorldCache = []

  WorldModel.cacheWorld = (World) => {
    return _.cloneDeep(World)
  }

  /**
   *
   * @param {*} m How many cells vertically in the board.
   * @param {*} n How many cells horizontally.
   */
  WorldModel.init = (m, n) => {
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        World[i] = World[i] || []
        World[i][j] = 0
      }
    }
    WorldCache = WorldModel.cacheWorld(World)
  }

  WorldModel.getWorld = () => {
    return World
  }

  return WorldModel
})()

const WorldView = (() => {
  const WorldView = {}

  /**
   *
   * @param {*} m How many cells vertically in the board.
   * @param {*} n How many cells horizontally.
   * @param {*} CellSize Cell width and height.
   */
  WorldView.initCells = (m, n, CellSize) => {
    let world = ""
    for (let i = 0; i < m; i++) {
      let row = ""
      for (let j = 0; j < n; j++) {
        row += `<div
          class="WorldCellClass"
          data-celli="${i}"
          data-cellj="${j}"></div>`
      }
      world += `<div class="WorldRowClass">${row}</div>`
    }
    $("#WorldBoxId").html(`<div id="WorldContentId">${world}</div>`)
    $(".WorldRowClass").height(CellSize)
    $(".WorldCellClass")
      .css("background", "#ff0000")
      .width(CellSize)
      .height(CellSize)
  }

  /**
   * Renders the world using World cell values
   * @param {List[List]} World Cells values
   */
  WorldView.render = (World) => {}

  WorldView.initBoard = () => {
    const width = $("#WorldBoxId").width()
    const height = $("#WorldBoxId").height()
    const m = (Conf.NUM_CELLS_VERTICAL = parseInt(height / Conf.CELL_SIZE))
    const n = (Conf.NUM_CELLS_HORIZONTAL = parseInt(width / Conf.CELL_SIZE))
    WorldModel.init(m, n)
    WorldView.initCells(m, n, Conf.CELL_SIZE)
    WorldView.render(WorldModel.getWorld())
  }

  WorldView.init = () => {
    WorldView.initBoard()
  }

  return WorldView
})()

const Game = (() => {
  const Game = {}

  Game.init = () => {
    WorldView.init()
  }

  return Game
})()

$(window).on("load", () => {
  Game.init()
})
