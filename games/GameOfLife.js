const Conf = (() => {
  const Conf = {
    CELL_SIZE: 10, // px
    NUM_CELLS_HORIZONTAL: 0, // Wait for WorldView to tell Conf these
    NUM_CELLS_VERTICAL: 0,
    ALIVE_COLOR: "#ffffff", // Light
    DEAD_COLOR: "#000000", // Dark
  }

  return Conf
})()

const WorldModel = (() => {
  const WorldModel = {}

  let World = []

  /**
   * Get cell's neighbours as a list
   * @param {*} i Cell position
   * @param {*} j Cell position
   */
  WorldModel.getCellNeighbours = (i, j) => {
    // poij
  }

  WorldModel.update = () => {
    const NewWorld = _.cloneDeep(World)
    const m = Conf.NUM_CELLS_VERTICAL
    const n = Conf.NUM_CELLS_HORIZONTAL
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const cell = World[i][j]
        const neighbours = WorldModel.getCellNeighbours(i, j)
        // poij calculate new world state
      }
    }
    World = NewWorld
  }

  /**
   * Caller must not modify World.
   */
  WorldModel.getWorld = () => {
    return World
  }

  /**
   *
   * @param {*} m How many cells vertically on the board.
   * @param {*} n How many cells horizontally on the board.
   */
  WorldModel.init = (m, n) => {
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        World[i] = World[i] || []
        World[i][j] = 0
      }
    }
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
    /** Generate cell content */
    let world = ""
    for (let i = 0; i < m; i++) {
      let row = ""
      for (let j = 0; j < n; j++) {
        row += `<div id="Cell-${i}-${j}" class="WorldCellClass"></div>`
      }
      world += `<div class="WorldRowClass">${row}</div>`
    }

    /** Add cells to page and update them. */
    $("#WorldBoxId").html(`<div id="WorldContentId">${world}</div>`)
    $(".WorldRowClass").height(CellSize)
    $(".WorldCellClass")
      .css("background", Conf.DEAD_COLOR)
      .width(CellSize)
      .height(CellSize)
  }

  /**
   * Renders the world using World cell values
   * @param {List[List]} World Cells values
   */
  WorldView.render = (World) => {
    const m = Conf.NUM_CELLS_VERTICAL
    const n = Conf.NUM_CELLS_HORIZONTAL
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const cell = World[i][j]
        $(`#Cell-${i}-${j}`).css(
          "background",
          cell == 1 ? Conf.ALIVE_COLOR : Conf.DEAD_COLOR,
        )
      }
    }
  }

  WorldView.initBoard = () => {
    const width = $("#WorldBoxId").width()
    const height = $("#WorldBoxId").height()
    const m = (Conf.NUM_CELLS_VERTICAL = parseInt(height / Conf.CELL_SIZE))
    const n = (Conf.NUM_CELLS_HORIZONTAL = parseInt(width / Conf.CELL_SIZE))
    WorldModel.init(m, n)
    WorldView.initCells(m, n, Conf.CELL_SIZE)
  }

  WorldView.init = () => {
    WorldView.initBoard()
  }

  return WorldView
})()

const Game = (() => {
  const Game = {}

  // TODO. Add stop start button
  Game.loop = () => {
    WorldModel.update()
    WorldView.render(WorldModel.getWorld())
    requestAnimationFrame(Game.loop)
  }

  Game.init = () => {
    WorldView.init()
    requestAnimationFrame(Game.loop)
  }

  return Game
})()

$(window).on("load", () => {
  Game.init()
})
