const Conf = (() => {
  const Conf = {
    CELL_SIZE: 10, // px
    NUM_CELLS_HORIZONTAL: 0, // Wait for WorldView to tell Conf these
    NUM_CELLS_VERTICAL: 0,
    /** Use a lib to generate themes automatically! */
    // ALIVE_COLOR: "#ffffff", // Light
    // DEAD_COLOR: "#000000", // Dark
    ALIVE_COLOR: "#000000",
    DEAD_COLOR: "#ffffff",
  }

  return Conf
})()

const Seed = (() => {
  const Seed = {}

  /**
   * Return 0 or 1 randomly.
   */
  Seed.FlipCoin = () => {
    return Math.random() > 0.5 ? 1 : 0
  }

  /**
   * Put some live cells in the center
   * @param {*} World
   */
  Seed.centerCells = (World) => {
    const m = World.length
    if (m % 2 === 0) {
      const right = parseInt(m / 2)
      const left = right - 1
      World[right] = 1
      World[left] = 1
    } else {
      const center = parseInt(m / 2)
      World[center] = 1
    }
  }

  Seed.init = (World) => {
    Seed.centerCells(World)
  }

  return Seed
})()

const LifeRules = (() => {
  const LifeRules = {}

  const Rules = []

  LifeRules.init = () => {
    for (let i = 0; i < 8; i++) {
      Rules.push(Seed.FlipCoin())
    }
    console.log("Rules", JSON.stringify(Rules))
  }
  LifeRules.init()

  /**
   * Return a number in 0,...,7 representing the encoding of the
   * CellAndNeighbours configuration.
   * @param {*} CellAndNeighbours a list of 3 numbers, representing the cell and
   * its 2 neighbours.
   */
  LifeRules.calculateCellNeighbourEncoding = (CellAndNeighbours) => {
    let encoding = 0
    const L = CellAndNeighbours.length
    for (let i = 0; i < L; i++) {
      encoding += CellAndNeighbours[i] * 2 ** (L - 1 - i)
    }
    return encoding
  }

  /**
   * Calculate the new cell state given the old cell and its neighbours,
   * according to the Rules.
   * @param {*} CellAndNeighbours
   */
  LifeRules.calculateNewCellState = (CellAndNeighbours) => {
    const encoding = LifeRules.calculateCellNeighbourEncoding(CellAndNeighbours)
    const newCell = Rules[encoding]
    return newCell
  }

  return LifeRules
})()

const WorldModel = (() => {
  const WorldModel = {}

  let World = []

  /**
   *
   * @param {*} World State
   * @param {*} i Cell position
   * @returns Cell value at i
   */
  WorldModel.getCell = (World, i) => {
    return World[i]
  }

  /**
   * Get cell and its immediate neighbours, with wrap around horizontally.
   * @param {*} World State
   * @param {*} i Cell position
   * @param {*} n Width of the map
   */
  WorldModel.getCellAndNeighboursTorus = (World, i, n) => {
    let neighbours = []
    for (let k = i - 1; k <= i + 1; k++) {
      const K = (k + n) % n // Wrap around if necessary
      neighbours.push(WorldModel.getCell(World, K))
    }
    return neighbours
  }

  WorldModel.isCellAlive = (cell) => {
    return cell === 1
  }

  WorldModel.update = () => {
    /** Calculate new state from World and populate NewWorld. */
    // Important that we clone so we don't modify the current world during
    // calculation. Would be interesting to see what the game looks like if we
    // modify the world as we are calculating the cells:
    const NewWorld = _.cloneDeep(World)
    const n = Conf.NUM_CELLS_HORIZONTAL
    for (let i = 0; i < n; i++) {
      const CellAndNeighbours = WorldModel.getCellAndNeighboursTorus(
        World,
        i,
        n,
      )
      NewWorld[i] = LifeRules.calculateNewCellState(CellAndNeighbours)
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
   * @param {*} n How many cells per row
   */
  WorldModel.init = (n) => {
    for (let i = 0; i < n; i++) {
      World.push(0)
    }
    Seed.init(World)
  }

  return WorldModel
})()

const WorldView = (() => {
  const WorldView = {}

  let Canvas
  let CanvasContext
  let CurrentRow = 0 // The current row in the canvas

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
    for (let i = 0; i < n; i++) {
      const cell = World[i]
      const color = cell === 1 ? Conf.ALIVE_COLOR : Conf.DEAD_COLOR
      const y = CurrentRow * w
      const x = i * w
      WorldView.drawRect(x, y, w, w, color)
    }
    CurrentRow = (CurrentRow + 1) % m
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

    WorldModel.init(n)
  }

  WorldView.init = () => {
    WorldView.initBoard()
  }

  return WorldView
})()

const Game = (() => {
  const Game = {}

  let IsGamePaused = false
  let FPS = 64 // Frames / iterations per second
  let MSPF // ms per frame.
  let LastFrameTime // Time in ms of last frame

  Game.togglePause = () => {
    IsGamePaused = !IsGamePaused
    if (!IsGamePaused) Game.loop() // Continue the game
  }

  Game.speedUp = () => {
    FPS *= 2
    MSPF = Game.calculateMSPF(FPS)
  }

  Game.slowDown = () => {
    FPS /= 2
    MSPF = Game.calculateMSPF(FPS)
  }

  Game.calculateMSPF = (FPS) => {
    return (1 / FPS) * 1000
  }

  Game.getIsGamePaused = () => {
    return IsGamePaused
  }

  Game.loop = () => {
    if (IsGamePaused) return

    // Skip this frame if game is running faster than desired FPS
    if (Date.now() - LastFrameTime < MSPF)
      return requestAnimationFrame(Game.loop)
    LastFrameTime = Date.now()

    WorldModel.update()
    WorldView.render(WorldModel.getWorld())
    requestAnimationFrame(Game.loop)
  }

  Game.init = () => {
    WorldView.init()
    MSPF = Game.calculateMSPF(FPS)
    LastFrameTime = Date.now()
    Game.loop()
  }

  return Game
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
      } else if (code === 37) {
        Game.slowDown() // LEFT
      } else if (code === 39) {
        Game.speedUp() // RIGHT
      } else if (code === 13) {
        // LifeRules.randomize() // ENTER
      } else if (code === 46) {
        // Seed.deleteCenterSquare(WorldModel.getWorld()) // DELETE
      }
    })
  }

  GameBinding.init = () => {
    GameBinding.bindPauseStartGame()
  }

  return GameBinding
})()

$(window).on("load", () => {
  GameBinding.init()
  Game.init()
})
