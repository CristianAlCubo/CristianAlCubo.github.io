class Board {
  constructor() {
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.winningCells = [];
  }

  renderBoard(game) {
    const gameBoard = document.getElementById("gameBoard");
    gameBoard.innerHTML = "";
    this.board.forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("game-cell");
      cellElement.dataset.index = index;
      if (this.winningCells.includes(index)) {
        cellElement.classList.add("winning-cell");
      }
      cellElement.innerHTML =
        cell === "X"
          ? '<i class="fas fa-times player-x"></i>'
          : cell === "O"
          ? '<i class="far fa-circle player-o"></i>'
          : "";
      cellElement.addEventListener("click", () => game.handleCellClick(index));
      gameBoard.appendChild(cellElement);
    });
  }

  checkWin(player) {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Vertical
      [0, 4, 8],
      [2, 4, 6], // Diagonal
    ];

    const winningPattern = winPatterns.find((pattern) =>
      pattern.every((index) => this.board[index] === player)
    );

    if (winningPattern) {
      this.winningCells = winningPattern; // Save winning pattern
      return true;
    }

    return false;
  }
}

class Player {
  constructor(symbol) {
    this.symbol = symbol;
  }
}

class Game {
  constructor() {
    this.board = new Board();
    this.player = null;
    this.bot = null;
    this.currentPlayer = this.playerX;
    this.isGameOver = false;
  }

  startGame(playerSymbol) {
    this.player = new Player(playerSymbol);
    this.bot = new Bot(playerSymbol === "X" ? "O" : "X");
    this.currentPlayer = playerSymbol === "X" ? this.player : this.bot;
    this.renderStatus();
    if (this.currentPlayer === this.bot) {
      setTimeout(() => this.botMove(), 250); // Bot makes the first move if it starts
    }
    this.board.renderBoard(this);
  }

  renderStatus(reset = false) {
    const status = document.getElementById("status");
    if (reset) {
      status.innerHTML = "";
      return;
    }

    status.innerHTML = `Turno de: <span>${this.currentPlayer.symbol}</span>`;
  }

  handleCellClick(index) {
    if (this.board.board[index] === "" && !this.isGameOver && this.currentPlayer !== this.bot) {
      this.board.board[index] = this.currentPlayer.symbol;
      if (this.checkWin(this.currentPlayer.symbol)) {
        this.endGame(`${this.currentPlayer.symbol} ha ganado!`);
      } else if (this.board.board.every((cell) => cell !== "")) {
        this.endGame("Empate!");
      } else {
        this.switchPlayer();
      }
      this.board.renderBoard(this);
    }
  }

  botMove() {
    this.bot.makeMove(this.board);
    if (this.checkWin(this.bot.symbol)) {
      this.endGame(`${this.bot.symbol} ha ganado!`);
    } else if (this.board.board.every((cell) => cell !== "")) {
      this.endGame("Empate!");
    } else {
      this.switchPlayer();
    }
    this.board.renderBoard(this);
  }

  checkWin(symbol) {
    if (this.board.checkWin(symbol)) {
      return true;
    }
    return false;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === this.player ? this.bot : this.player;
    this.renderStatus();
    if (this.currentPlayer === this.bot) {
      setTimeout(() => this.botMove(), 250); // Bot's turn
    }
  }

  endGame(message) {
    const status = document.getElementById("status");
    status.innerHTML = `<span>${message}</span>`;
    this.isGameOver = true;
  }

  resetGame() {
    this.board = new Board();
    this.currentPlayer = this.player;
    this.isGameOver = false;
    this.board.renderBoard(this);
    this.renderStatus(true);
  }
}

class UI {
  constructor(game) {
    this.game = game;
    this.setupElements();
  }

  setupElements() {
    const startButton = document.getElementById("startButton");
    const resetButton = document.getElementById("resetButton");
    const playerSymbolSelect = document.getElementById("playerSymbol");
    const setup = document.getElementById("setup");
    const gameBoard = document.getElementById("gameBoard");

    startButton.addEventListener("click", () => {
      const playerSymbol = playerSymbolSelect.value;
      resetButton.style.display = "block";
      setup.style.display = "none";
      gameBoard.style.display = "grid";
      this.game.startGame(playerSymbol);
    });

    resetButton.addEventListener("click", () => {
      this.game.resetGame();
      document.getElementById("setup").style.display = "block";
      gameBoard.style.display = "none";
      resetButton.style.display = "none";
    });
  }
}

class Node {
  constructor(board, type, root = null, symbol = null, cell = null) {
    this.type = type; // Tipo de nodo: MAX o MIN
    this.board = board; // Arreglo representando el estado del tablero en este nodo
    this.root = root;
    this.symbol = symbol; // Símbolo del jugador que movió en este nodo
    this.cell = cell; // Índice de la celda en la que se realizó la jugada

    this.score = 0;
    this.children = [];
  }
}

// ======================
// Bot class
// Aquí está la chicha
// ======================

class Bot extends Player {
  constructor(symbol) {
    super(symbol);
    this.statesTree = null;
  }

  computeStatesTree(board, depth, root = null, symbol = null) {
    if (depth === 0) {
      return;
    }

    root = root || new Node(board, "MAX", null, symbol);
    symbol = symbol || this.symbol;

    for (let i = 0; i < board.length; i++) {
      let temp = board.slice(); // Copia del tablero
      if (temp[i] === "") {
        temp[i] = symbol;
        let newChild = new Node(temp, depth % 2 === 0 ? "MAX" : "MIN", root, symbol, i);
        root.children.push(newChild);

        this.computeStatesTree(temp, depth - 1, newChild, symbol === "X" ? "O" : "X");
      }
    }

    this.statesTree = root;
  }

  scoreBoard(board) {
    /*

        Función de evaluación del tablero.

        Por ahora es muy sencilla, simplemente verifica si hay un ganador. Idealmente debería tener mas parametros en cuenta,
        como la profundidad de la jugada (Que tan rapido se llega a ese estado) o la posibilidad de considerar ventajas parciales

    */

    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Vertical
      [0, 4, 8],
      [2, 4, 6], // Diagonal
    ];
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === this.symbol ? 1 : -1;
      }
    }
    return 0;
  }

  minimax(board, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0) {
      return this.scoreBoard(board.board);
    }

    if (maximizingPlayer) {
      let maxScore = -Infinity;
      for (const child of board.children) {
        let score = this.minimax(child, depth - 1, alpha, beta, false);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);

        board.score = maxScore;

        if (beta <= alpha) {
          break;
        }
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const child of board.children) {
        let score = this.minimax(child, depth - 1, alpha, beta, true);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);

        board.score = minScore;

        if (beta <= alpha) {
          break;
        }
      }
      return minScore;
    }
  }

  printStatesTreeBFT() {
    if (!this.statesTree) {
      console.log("No hay nodos");
      return;
    }

    let queue = [this.statesTree];

    while (queue.length > 0) {
      let levelSize = queue.length;
      let currentLevel = [];

      for (let i = 0; i < levelSize; i++) {
        let currentNode = queue.shift();
        currentLevel.push(currentNode.board);

        for (let child of currentNode.children) {
          queue.push(child);
        }
      }

      this.printLevel(currentLevel);
    }
  }

  printTicTacToeBoard(board) {
    if (board.length !== 9) {
      console.log("El tablero debe tener exactamente 9 elementos.");
      return;
    }

    console.log(`
      ${board[0] || " "} | ${board[1] || " "} | ${board[2] || " "}
      -----------
      ${board[3] || " "} | ${board[4] || " "} | ${board[5] || " "}
      -----------
      ${board[6] || " "} | ${board[7] || " "} | ${board[8] || " "}
    `);
  }

  printLevel(level) {
    console.log("Nivel");
    for (const b of level) {
      this.printTicTacToeBoard(b);
    }
  }

  makeMove(board) {
    const depth = 2;
    this.computeStatesTree(board.board, depth);
    let bestScore = this.minimax(this.statesTree, depth, -Infinity, Infinity, true);

    for (const child of this.statesTree.children) {
      if (child.score === bestScore) {
        board.board[child.cell] = this.symbol;
        break;
      }
    }

    console.log("BEST SCORE: ", bestScore);
    console.log(this.statesTree.children);
  }
}

// Start the game
const game = new Game();
const ui = new UI(game);
