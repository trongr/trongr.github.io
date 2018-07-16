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
        liveNeighbours === 3 ||
        liveNeighbours === 4
      ) {
        return Conf.ALIVE // Just right
      } else {
        return Conf.DEAD // Overpopulation
      }
    } else {
      if (liveNeighbours === 2) {
        return Conf.ALIVE // I like this rule.
      } else {
        return Conf.DEAD
      }
    }
  }

  WorldModel.update = () => {
    /** Calculate new state from World and populate NewWorld. */
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

  // poij https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing#timing-problems
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
