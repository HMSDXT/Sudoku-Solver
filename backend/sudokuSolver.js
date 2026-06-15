class SudokuSolver {

  constructor(board) {
    this.board=board.map(row=>[...row]);
    this.stats={
      nodesVisited:0,
      backtracks:0,
      timeMs:0
    };
  }

  validatePuzzle(){
    for(let row=0;row<9;row++){
      const seen=new Set();

      for (let col = 0; col < 9; col++) {

        const num = this.board[row][col];

        if (num === 0) continue;

        if (seen.has(num))
          return false;

        seen.add(num);
      }
    }

    for (let col = 0; col < 9; col++) {

      const seen = new Set();

      for (let row = 0; row < 9; row++) {

        const num = this.board[row][col];

        if (num === 0) continue;

        if (seen.has(num))
          return false;

        seen.add(num);
      }
    }

    for (let sr = 0; sr < 9; sr += 3) {

      for (let sc = 0; sc < 9; sc += 3) {

        const seen = new Set();

        for (let i = 0; i < 3; i++) {

          for (let j = 0; j < 3; j++) {

            const num = this.board[sr + i][sc + j];

            if (num === 0) continue;

            if (seen.has(num))
              return false;

            seen.add(num);
          }
        }
      }
    }

    return true;
  }

  isRowSafe(row, num) {

    for (let col = 0; col < 9; col++) {

      if (this.board[row][col] === num)
        return false;
    }

    return true;
  }

  isColSafe(col, num) {

    for (let row = 0; row < 9; row++) {

      if (this.board[row][col] === num)
        return false;
    }

    return true;
  }

  isBoxSafe(startRow, startCol, num) {

    for (let i = 0; i < 3; i++) {

      for (let j = 0; j < 3; j++) {

        if (this.board[startRow + i][startCol + j] === num)
          return false;
      }
    }

    return true;
  }

  isSafe(row, col, num) {

    return (
      this.isRowSafe(row, num) &&
      this.isColSafe(col, num) &&
      this.isBoxSafe(
        row - (row % 3),
        col - (col % 3),
        num
      )
    );
  }

  findEmptyCell() {

    for (let row = 0; row < 9; row++) {

      for (let col = 0; col < 9; col++) {

        if (this.board[row][col] === 0)
          return { row, col };
      }
    }

    return null;
  }

  countCandidates(row, col) {

    let count = 0;

    for (let num = 1; num <= 9; num++) {

      if (this.isSafe(row, col, num))
        count++;
    }

    return count;
  }

  findMRVCell() {

    let minChoices = 10;
    let bestCell = null;

    for (let row = 0; row < 9; row++) {

      for (let col = 0; col < 9; col++) {

        if (this.board[row][col] === 0) {

          const choices =
            this.countCandidates(row, col);

          if (choices < minChoices) {

            minChoices = choices;

            bestCell = {
              row,
              col
            };
          }
        }
      }
    }

    return bestCell;
  }

  solveBasic() {

    this.stats.nodesVisited++;

    const cell = this.findEmptyCell();

    if (!cell)
      return true;

    const { row, col } = cell;

    for (let num = 1; num <= 9; num++) {

      if (this.isSafe(row, col, num)) {

        this.board[row][col] = num;

        if (this.solveBasic())
          return true;

        this.board[row][col] = 0;
        this.stats.backtracks++;
      }
    }

    return false;
  }

  solveMRV() {

    this.stats.nodesVisited++;

    const cell = this.findMRVCell();

    if (!cell)
      return true;

    const { row, col } = cell;

    for (let num = 1; num <= 9; num++) {

      if (this.isSafe(row, col, num)) {

        this.board[row][col] = num;

        if (this.solveMRV())
          return true;

        this.board[row][col] = 0;
        this.stats.backtracks++;
      }
    }

    return false;
  }

  solve(algorithm = 'basic') {

    this.stats = {
      nodesVisited: 0,
      backtracks: 0,
      timeMs: 0
    };

    const startTime = Date.now();

    let solved = false;

    if (algorithm === 'mrv')
      solved = this.solveMRV();
    else
      solved = this.solveBasic();

    this.stats.timeMs =
      Date.now() - startTime;

    return {
      solved,
      board: this.board,
      stats: this.stats
    };
  }

  compareAlgorithms() {

    const originalBoard =
      this.board.map(row => [...row]);

    const basicSolver =
      new SudokuSolver(originalBoard);

    const basicResult =
      basicSolver.solve('basic');

    const mrvSolver =
      new SudokuSolver(originalBoard);

    const mrvResult =
      mrvSolver.solve('mrv');

    return {
      basic: basicResult.stats,
      mrv: mrvResult.stats
    };
  }

  static generateSolvedBoard() {

    const board = Array(9)
      .fill()
      .map(() => Array(9).fill(0));

    function isSafe(board, row, col, num) {

      for (let x = 0; x < 9; x++) {

        if (board[row][x] === num)
          return false;

        if (board[x][col] === num)
          return false;
      }

      const startRow = row - row % 3;
      const startCol = col - col % 3;

      for (let i = 0; i < 3; i++) {

        for (let j = 0; j < 3; j++) {

          if (
            board[startRow + i][startCol + j] === num
          )
            return false;
        }
      }

      return true;
    }

    function fill(board) {

      for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

          if (board[row][col] === 0) {

            const nums =
              [1,2,3,4,5,6,7,8,9]
              .sort(() => Math.random() - 0.5);

            for (const num of nums) {

              if (isSafe(board, row, col, num)) {

                board[row][col] = num;

                if (fill(board))
                  return true;

                board[row][col] = 0;
              }
            }

            return false;
          }
        }
      }

      return true;
    }

    fill(board);

    return board;
  }

  static generatePuzzle(difficulty = 'easy') {

    const board =
      this.generateSolvedBoard();

    difficulty =
      difficulty.toLowerCase();

    let holes;

    switch (difficulty) {

      case 'easy':
        holes = 35;
        break;

      case 'medium':
        holes = 45;
        break;

      case 'hard':
        holes = 55;
        break;

      default:
        holes = 35;
    }

    let removed = 0;

    while (removed < holes) {

      const row =
        Math.floor(Math.random() * 9);

      const col =
        Math.floor(Math.random() * 9);

      if (board[row][col] !== 0) {

        board[row][col] = 0;
        removed++;
      }
    }

    return board;
  }
}

export default SudokuSolver;
