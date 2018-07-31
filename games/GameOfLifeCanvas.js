const Conf = (() => {
  const Conf = {
    CELL_SIZE: 10, // px
    NUM_CELLS_HORIZONTAL: 0, // Wait for WorldView to tell Conf these
    NUM_CELLS_VERTICAL: 0,
    /** Use a lib to generate themes automatically! */
    ALIVE_COLOR: "#ffffff", // Light
    DEAD_COLOR: "#000000", // Dark
    // ALIVE_COLOR: "#000000",
    // DEAD_COLOR: "#ffffff",
    // ALIVE_COLOR: "#f45b69",
    // DEAD_COLOR: "#ebebeb",
    // ALIVE_COLOR: "#094074",
    // DEAD_COLOR: "#ffdd4a",
    // ALIVE_COLOR: "#35a7ff",
    // DEAD_COLOR: "#ffffff",
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
   * Put some live cells in the center. If dimension is odd, put a single live
   * cell in the center. If dimension is even, put 4 live cells in the center.
   * This assumes that the world is square.
   * @param {*} World
   */
  Seed.centerCells = (World) => {
    const m = World.length
    if (m % 2 === 0) {
      const right = parseInt(m / 2)
      const left = right - 1
      World[left][left] = 1 // Top left
      World[left][right] = 1 // Top right
      World[right][left] = 1 // Bottom left
      World[right][right] = 1 // Bottom right
    } else {
      const center = parseInt(m / 2)
      World[center][center] = 1
    }
  }

  /**
   * Seed center vertical line having width 1 if world dimension is odd, width 2
   * if even.
   * @param {*} World
   */
  Seed.verticalLineCenter = (World) => {
    const m = World.length
    if (m % 2 === 0) {
      const right = parseInt(m / 2)
      const left = right - 1
      for (let i = 0; i < m; i++) {
        World[i][left] = 1
        World[i][right] = 1
      }
    } else {
      const center = parseInt(m / 2)
      for (let i = 0; i < m; i++) {
        World[i][center] = 1
      }
    }
  }

  /**
   * Vertical line top to bottom with cells in this line randomly 1 or 0. If
   * dimension is even, create two lines mirrored across the center.
   * @param {*} World
   */
  Seed.randomVerticalLineCenter = (World) => {
    const m = World.length
    if (m % 2 === 0) {
      const right = parseInt(m / 2)
      const left = right - 1
      for (let i = 0; i < m; i++) {
        const life = Seed.FlipCoin()
        World[i][left - 1] = life
        World[i][left] = life
        World[i][right] = life
        World[i][right + 1] = life
      }
    } else {
      const center = parseInt(m / 2)
      for (let i = 0; i < m; i++) {
        const life = Seed.FlipCoin()
        World[i][center - 1] = life
        World[i][center] = life
        World[i][center + 1] = life
      }
    }
  }

  /**
   * Vertical line top to bottom with cells in this line randomly 1 or 0. If
   * dimension is even, create two lines mirrored across the center.
   * @param {*} World
   */
  Seed.randomHorizontalVerticalLineCenter = (World) => {
    const m = World.length
    if (m % 2 === 0) {
      const right = parseInt(m / 2)
      const left = right - 1
      for (let i = 0; i < m; i++) {
        const life = Seed.FlipCoin()

        World[i][left - 1] = life
        World[i][left] = life
        World[i][right] = life
        World[i][right + 1] = life

        World[left - 1][i] = life
        World[left][i] = life
        World[right][i] = life
        World[right + 1][i] = life
      }
    } else {
      const center = parseInt(m / 2)
      for (let i = 0; i < m; i++) {
        const life = Seed.FlipCoin()

        World[i][center - 1] = life
        World[i][center] = life
        World[i][center + 1] = life

        World[center - 1][i] = life
        World[center][i] = life
        World[center + 1][i] = life
      }
    }
  }

  /**
   * Seed center vertical line having width 1 if world dimension is odd, width 2
   * if even.
   * @param {*} World
   */
  Seed.verticalHorizontalLine = (World) => {
    const m = World.length
    if (m % 2 === 0) {
      const right = parseInt(m / 2)
      const left = right - 1
      for (let i = 0; i < m; i++) {
        World[i][left] = 1
        World[i][right] = 1
      }
      for (let i = 0; i < m; i++) {
        World[left][i] = 1
        World[right][i] = 1
      }
    } else {
      const center = parseInt(m / 2)
      for (let i = 0; i < m; i++) {
        World[i][center] = 1
      }
      for (let i = 0; i < m; i++) {
        World[center][i] = 1
      }
    }
  }

  Seed.centerThreeFourSquare = (World) => {
    const m = World.length
    if (m % 2 === 0) {
      const start = parseInt(m / 2) - 2
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          World[start + i][start + j] = 1
        }
      }
    } else {
      const start = parseInt(m / 2) - 1
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          World[start + i][start + j] = 1
        }
      }
    }
  }

  Seed.random = (World) => {
    const m = World.length
    const n = World[0].length
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        World[i] = World[i] || []
        World[i][j] = Seed.FlipCoin()
      }
    }
  }

  /**
   * See how the rules handle boundary areas
   * @param {*} World
   */
  Seed.deleteCenterSquare = (World) => {
    const m = World.length
    const half = parseInt(m / 3)
    let middle
    let start
    let end
    if (m % 2 === 0) {
      middle = parseInt(m / 2)
      start = middle - half
      end = middle + half - 1
    } else {
      middle = parseInt(m / 2)
      start = middle - half
      end = middle + half
    }
    for (let i = start; i <= end; i++) {
      for (let j = start; j <= end; j++) {
        World[i][j] = 0
      }
    }
  }

  Seed.init = (World) => {
    // Seed.centerCells(World)
    Seed.centerThreeFourSquare(World)
    // Seed.verticalLineCenter(World)
    // Seed.verticalHorizontalLine(World)
    // Seed.random(World)
    // Seed.randomVerticalLineCenter(World)
    // Seed.randomHorizontalVerticalLineCenter(World)
  }

  return Seed
})()

const LifeRules = (() => {
  const LifeRules = {}

  /** Conway rule */
  // const Rules = [
  //   [0, 0, 0, 1, 0, 0, 0, 0, 0], // Rules for dead cells (0)
  //   [0, 0, 1, 1, 0, 0, 0, 0, 0], // Rules for living cells (1)
  // ]
  // const Rules = [[1, 1, 1, 1, 1, 0, 1, 1, 0], [0, 1, 0, 1, 1, 1, 0, 0, 1]]
  const Rules = [[], []] // Rules[0] is for dead cells, Rules[1] for live.

  /**
   * Randomizes the rules mid-game.
   */
  LifeRules.randomize = () => {
    LifeRules.randomizeAll()
    console.log("Rules", JSON.stringify(Rules))
  }

  LifeRules.randomizeAll = () => {
    for (let i = 0; i < 9; i++) {
      Rules[0][i] = Seed.FlipCoin()
      Rules[1][i] = Seed.FlipCoin()
    }
  }

  /**
   * Randomizes the rules mid-game, but only one random bit at a time.
   */
  LifeRules.randomizeOneBit = () => {
    const randomIdx = Seed.FlipCoin()
    const randomIntBetween0And9 = Math.floor(Math.random() * 9)
    const oldVal = Rules[randomIdx][randomIntBetween0And9]
    Rules[randomIdx][randomIntBetween0And9] = (oldVal + 1) % 2
    console.log(JSON.stringify(Rules))
  }

  LifeRules.init = () => {
    for (let i = 0; i < 9; i++) {
      Rules[0].push(Seed.FlipCoin())
      Rules[1].push(Seed.FlipCoin())
    }
    // setInterval(() => {
    //   LifeRules.randomize()
    //   // LifeRules.randomizeOneBit()
    //   console.log(JSON.stringify(Rules))
    // }, 15000)
  }
  LifeRules.init()

  LifeRules.isCellAlive = (cell) => {
    return cell === 1
  }

  /**
   *
   * @param {*} cell
   * @param {*} neighbours
   * @returns The number of live neighbours cell has.
   */
  LifeRules.countLiveNeighbours = (cell, neighbours) => {
    const liveCount = neighbours.filter((c) => {
      return LifeRules.isCellAlive(c)
    }).length
    if (LifeRules.isCellAlive(cell)) return liveCount - 1
    return liveCount
  }

  /**
   * Calculate the new cell state given the old cell and its neighbours,
   * according to the Rules.
   * @param {*} cell
   * @param {*} neighbours
   */
  LifeRules.calculateNewCellState = (cell, neighbours) => {
    const liveNeighbours = LifeRules.countLiveNeighbours(cell, neighbours)
    return Rules[cell][liveNeighbours]
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
        NewWorld[i][j] = LifeRules.calculateNewCellState(cell, neighbours)
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
    /** Initialize board with dead cells */
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        World[i] = World[i] || []
        World[i][j] = 0
      }
    }
    Seed.init(World)
  }

  return WorldModel
})()

const WorldView = (() => {
  const WorldView = {}

  let Canvas
  let CanvasContext

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
    // Make a square board using min width height.
    const width = Math.min($("#WorldBoxId").width(), $("#WorldBoxId").height())
    const m = (Conf.NUM_CELLS_VERTICAL = parseInt(width / Conf.CELL_SIZE))
    const n = (Conf.NUM_CELLS_HORIZONTAL = parseInt(width / Conf.CELL_SIZE))

    Canvas = document.getElementById("WorldCanvasId")
    Canvas.width = width
    Canvas.height = width
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

  let IsGamePaused = false
  let FPS = 8 // Frames / iterations per second
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
        LifeRules.randomize() // ENTER
      } else if (code === 46) {
        Seed.deleteCenterSquare(WorldModel.getWorld()) // DELETE
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
