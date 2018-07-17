const Conf = (() => {
  const Conf = {
    CELL_SIZE: 10, // px
    NUM_CELLS_HORIZONTAL: 0, // Wait for WorldView to tell Conf these
    NUM_CELLS_VERTICAL: 0,
    ALIVE: 1,
    DEAD: 0,
    /** Use a lib to generate themes automatically! */
    // ALIVE_COLOR: "#ffffff", // Light
    // DEAD_COLOR: "#000000", // Dark
    // ALIVE_COLOR: "#000000",
    // DEAD_COLOR: "#ffffff",
    // ALIVE_COLOR: "#f45b69",
    // DEAD_COLOR: "#ebebeb",
    // ALIVE_COLOR: "#094074",
    // DEAD_COLOR: "#ffdd4a",
    ALIVE_COLOR: "#35a7ff",
    DEAD_COLOR: "#ffffff",
  }

  return Conf
})()

/**
 * Binds user actions relating to the game, e.g. pause, start.
 */
const GameBinding = (() => {
  const GameBinding = {}

  GameBinding.bindPauseStartGame = () => {
    $(window).on("keydown", function Listener(e) {
      const code = e.keyCode || e.which
      if (code === 32) {
        Game.togglePause() // SPACE KEY
      }
    })
  }

  GameBinding.init = () => {
    GameBinding.bindPauseStartGame()
  }

  return GameBinding
})()

const WorldModel = (() => {
  const WorldModel = {}

  let World = []

  /**
   *
   * @param {*} World State
   * @param {*} i Cell position
   * @param {*} j
   * @returns Cell value at ij
   */
  WorldModel.getCell = (World, i, j) => {
    return World[i][j]
  }

  /**
   * Get cell's neighbours as a list, [NW, N, NE, W, Cell, E, SW, S, SE]. This
   * method assumes the map wraps around, like a torus, so we need the width and
   * height of the map.
   * @param {*} World State
   * @param {*} i Cell position
   * @param {*} j Cell position
   * @param {*} m Height of the map
   * @param {*} n Width of the map
   */
  WorldModel.getCellNeighboursTorus = (World, i, j, m, n) => {
    let neighbours = []
    for (let k = i - 1; k <= i + 1; k++) {
      for (let l = j - 1; l <= j + 1; l++) {
        const K = (k + m) % m // Wrap around if needed.
        const L = (l + n) % n
        neighbours.push(WorldModel.getCell(World, K, L))
      }
    }
    return neighbours
  }

  WorldModel.isCellAlive = (cell) => {
    return cell === Conf.ALIVE
  }

  /**
   *
   * @param {*} cell
   * @param {*} neighbours
   * @returns The number of live neighbours cell has.
   */
  WorldModel.countLiveNeighbours = (cell, neighbours) => {
    const liveCount = neighbours.filter((c) => {
      return WorldModel.isCellAlive(c)
    }).length
    if (WorldModel.isCellAlive(cell)) return liveCount - 1
    else return liveCount
  }

  /**
   * poij
   * @param {Number} cell Cell value.
   * @param {[Number]} neighbours List of cell neighbour values.
   * @returns New cell value based on Game of Life rule.
   */
  // WorldModel.calculateNewCellState = (cell, neighbours) => {
  //   const liveNeighbours = WorldModel.countLiveNeighbours(cell, neighbours)
  //   if (WorldModel.isCellAlive(cell)) {
  //     if (liveNeighbours < 2) {
  //       return Conf.DEAD // Underpopulation
  //     } else if (liveNeighbours === 2 || liveNeighbours === 3) {
  //       return Conf.ALIVE // Just right
  //     } else {
  //       return Conf.DEAD // Overpopulation
  //     }
  //   } else {
  //     if (liveNeighbours === 3) {
  //       return Conf.ALIVE
  //     } else {
  //       return Conf.DEAD
  //     }
  //   }
  // }

  WorldModel.calculateNewCellState = (cell, neighbours) => {
    const liveNeighbours = WorldModel.countLiveNeighbours(cell, neighbours)
    if (WorldModel.isCellAlive(cell)) {
      if (liveNeighbours < 2) {
        return Conf.DEAD // Underpopulation
      } else if (
        // liveNeighbours === 2 ||
        // liveNeighbours === 3 ||
        // liveNeighbours === 4 ||
        // liveNeighbours === 5 ||
        // liveNeighbours === 6 ||
        // liveNeighbours === 7 ||
        liveNeighbours === 8
      ) {
        return Conf.ALIVE // Just right
      } else {
        return Conf.DEAD // Overpopulation
      }
    } else {
      if (liveNeighbours === 1) {
        return Conf.ALIVE // I like this rule.
      } else {
        return Conf.DEAD
      }
    }
  }

  WorldModel.update = () => {
    /** Calculate new state from World and populate NewWorld. */
    // Important that we clone so we don't modify the current world during
    // calculation. Would be interesting to see what the game looks like if we
    // modify the world as we are calculating the cells:
    const NewWorld = _.cloneDeep(World)
    const m = Conf.NUM_CELLS_VERTICAL
    const n = Conf.NUM_CELLS_HORIZONTAL
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const cell = WorldModel.getCell(World, i, j)
        const neighbours = WorldModel.getCellNeighboursTorus(World, i, j, m, n)
        NewWorld[i][j] = WorldModel.calculateNewCellState(cell, neighbours)
      }
    }
    World = NewWorld // It's OK to assign this here without cloning.
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
        World[i][j] = Math.random() > 0.5 ? Conf.ALIVE : Conf.DEAD
      }
    }
  }

  return WorldModel
})()

const WorldView = (() => {
  const WorldView = {}

  let Canvas, CanvasContext

  /**
   *
   * @param {Integer} i The grid position, e.g. 0, 1, 2,...
   * @param {*} CELL_SIZE
   * @returns The Canvas coordinate
   */
  WorldView.getCanvasCoordinate = (i, CELL_SIZE) => {
    return i * CELL_SIZE
  }

  /**
   *
   * @param {*} x Canvas position. Top left corner.
   * @param {*} y Canvas position. NOTE. Not grid position.
   * @param {*} h Height of the rectangle
   * @param {*} w Width
   * @param {*} color Fill color
   */
  WorldView.drawRect = (x, y, h, w, color) => {
    CanvasContext.fillStyle = color
    CanvasContext.strokeStyle = color
    CanvasContext.beginPath()
    CanvasContext.rect(x, y, w, h)
    CanvasContext.fill()
    CanvasContext.stroke()
  }

  /**
   * Renders the world using World cell values
   * @param {List[List]} World Cells values
   */
  WorldView.render = (World) => {
    const m = Conf.NUM_CELLS_VERTICAL
    const n = Conf.NUM_CELLS_HORIZONTAL
    const w = Conf.CELL_SIZE
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const cell = World[i][j]
        const color = cell === 1 ? Conf.ALIVE_COLOR : Conf.DEAD_COLOR
        const y = i * w
        const x = j * w
        WorldView.drawRect(x, y, w, w, color)
      }
    }
  }

  WorldView.initBoard = () => {
    const width = $("#WorldBoxId").width()
    const height = $("#WorldBoxId").height()
    const m = (Conf.NUM_CELLS_VERTICAL = parseInt(height / Conf.CELL_SIZE))
    const n = (Conf.NUM_CELLS_HORIZONTAL = parseInt(width / Conf.CELL_SIZE))

    Canvas = document.getElementById("WorldCanvasId")
    Canvas.width = width
    Canvas.height = height
    CanvasContext = Canvas.getContext("2d")
    // This avoids anti-aliasing, so two overlapping lines don't appear darker:
    CanvasContext.translate(0.5, 0.5)

    WorldModel.init(m, n)
  }

  WorldView.init = () => {
    WorldView.initBoard()
  }

  return WorldView
})()

const Game = (() => {
  const Game = {}

  let isGamePaused = false

  Game.togglePause = () => {
    isGamePaused = !isGamePaused
    if (!isGamePaused) Game.loop() // Continue the game
  }

  Game.getIsGamePaused = () => {
    return isGamePaused
  }

  Game.loop = () => {
    if (isGamePaused) return
    WorldModel.update()
    WorldView.render(WorldModel.getWorld())
    requestAnimationFrame(Game.loop)
  }

  Game.init = () => {
    GameBinding.init()
    WorldView.init()
    Game.loop()
  }

  return Game
})()

$(window).on("load", () => {
  Game.init()
})
