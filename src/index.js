module.exports = function solveSudoku(matrix) {
  let smthChanged = false;
  updatePosibilities(matrix);


  do {
    smthChanged = false;
    for (let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
      const row = matrix[rowIdx];
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const item = row[colIdx];
        if (!Array.isArray(item)) continue;
        if (lastHero(matrix, item, rowIdx, colIdx)) {
          smthChanged = true;
          continue;
        }
        if (lastInBox(matrix, item, rowIdx, colIdx)) {
          smthChanged = true;
          continue;
        }
      }
    }
  } while (smthChanged);
  print(matrix);
  return matrix;
}

function updatePosibilities(matrix) {
  let smthChanged;
  do {
    smthChanged = false;
    for (let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
      const row = matrix[rowIdx];
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const item = row[colIdx];
        if (item === 0 || Array.isArray(item)) {
          const possibleValues = getPossibleValues(matrix, rowIdx, colIdx);
          if (possibleValues.length === 1) {
            matrix[rowIdx][colIdx] = possibleValues[0];
            smthChanged = true;
          } else {
            matrix[rowIdx][colIdx] = possibleValues
          }
        }
      }
    }
  } while (smthChanged);
}

function lastHero(matrix, possibleValues, rowIdx, colIdx) {
  if (possibleValues.length !== 1) return false;
  const value = possibleValues[0];
  matrix[rowIdx][colIdx] = value;
  removePossibleInRow(matrix, value, rowIdx, [colIdx]);
  removePossibleInCol(matrix, value, colIdx, [rowIdx]);
  return true;
}

function lastInBox(matrix, possibleValues, rowIdx, colIdx) {
  let smthChanged = false;
  const otherInBox = getBox(matrix, rowIdx, colIdx)
    .reduce((flat, boxRow) => [...flat, ...boxRow], [])
    .filter(boxItem => Array.isArray(boxItem) && boxItem !== possibleValues)
    .reduce((flat, possibilities) => [...flat, ...possibilities], [])
    .reduce((set, value) => set.add(value), new Set());

  possibleValues.forEach(possibleValue => {
    if (!otherInBox.has(possibleValue)) {
      lastHero(matrix, [possibleValue], rowIdx, colIdx);
      smthChanged = smthChanged || true;
    }
  });
  return smthChanged;
}


function removePossibleInRow(matrix, value, rowIdx, exceptCol = []) {
  matrix[rowIdx].forEach((_, id) => {
    if (!exceptCol.includes(id) && Array.isArray(_)) {
      matrix[rowIdx][id] = _.filter(v => v !== value)
    }
  });
}

function removePossibleInCol(matrix, value, colIdx, exceptRow = []) {
  matrix.forEach((row, id) => {
    if (!exceptRow.includes(id) && Array.isArray(row[colIdx])) {
      matrix[id][colIdx] = row[colIdx].filter(v => v !== value)
    }
  });
}

function removePossibleInBox(matrix, value, rowIdx, colIdx, except = []) {
  getBox(matrix, rowIdx, colIdx)
    .reduce((flat, boxRow) => [...flat, ...boxRow], [])
    .filter(boxItem => Array.isArray(boxItem) && !except.includes(boxItem))


}

function getPossibleValues(matrix, rowIdx, colIdx) {
  const possibleValues = new Set(Array.from({length: 9}, (_, v) => v + 1));
  matrix[rowIdx].forEach(item => possibleValues.delete(item));
  matrix.forEach(row => possibleValues.delete(row[colIdx]));
  getBox(matrix, rowIdx, colIdx)
    .reduce((flat, row) => [...flat, ...row], [])
    .forEach(value => possibleValues.delete(value));
  return [...possibleValues.values()];
}

function getBoxBorders(rowIdx, colIdx) {
  const boxRowStart = Math.floor(rowIdx / 3) * 3;
  const boxRowEnd = boxRowStart + 3;
  const boxColStart = Math.floor(colIdx / 3) * 3;
  const boxColEnd = boxColStart + 3;
  return {boxRowStart, boxRowEnd, boxColStart, boxColEnd}
}

function getBox(matrix, rowIdx, colIdx) {
  const {boxRowStart, boxRowEnd, boxColStart, boxColEnd} = getBoxBorders(rowIdx, colIdx);
  return matrix
    .slice(boxRowStart, boxRowEnd)
    .map(row => row.slice(boxColStart, boxColEnd))
}

function print(matrix) {
  matrix.forEach(row => console.log(row.map(v => String(v).padEnd(10, ' ')).join(' ')))
}
