module.exports = function solveSudoku(matrix) {
  return backtrack(matrix);
};

function backtrack(matrix) {
  let row = -1, col = -1;
  rowsLoop:
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] === 0) {
          row = r;
          col = c;
          break rowsLoop;
        }
      }
    }
  if (row < 0 && col < 0) return matrix;
  do {
    do {
      matrix[row][col]++;
      if (matrix[row][col] > 9) {
        matrix[row][col] = 0;
        return false;
      }
    } while (hasConflict(matrix, {row, col}));
  } while (!backtrack(matrix));
  return matrix;
}

function hasConflict(matrix, {row, col}) {
  const value = matrix[row][col];
  if (matrix[row].filter((_, c) => c !== col).some(v => v === value)) return true;
  if (matrix.filter((_, r) => r !== row).some(row => row[col] === value)) return true;
  const boundaries = getBoxBoundaries({row, col});
  for (let r = boundaries.rowStart; r < boundaries.rowEnd; r++) {
    for (let c = boundaries.colStart; c < boundaries.colEnd; c++) {
      if (r === row && c === col) continue;
      if (matrix[r][c] === value) return true;
    }
  }
  return false;
}

function getBoxBoundaries({row, col}) {
  const box = {
    rowStart: Math.floor(row / 3) * 3,
    colStart: Math.floor(col / 3) * 3,
  };
  return {...box, rowEnd: box.rowStart + 3, colEnd: box.colStart + 3};
}
