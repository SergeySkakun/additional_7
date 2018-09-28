module.exports = function solveSudoku(matrix) {
  let flagChanged = false;
  let n = 0;

  function findItemsInRow (number) {
    let foundItems = [];

    for (let i = 0; i < 9; i++) {
      if(matrix[number][i] > 0) {
        foundItems.push(matrix[number][i]);
      }
    }

    return foundItems;
  }


  function findItemsInCol (number) {
    let foundItems = [];

    for (let i = 0; i < 9; i++) {
      if(matrix[i][number] > 0) {
        foundItems.push(matrix[i][number]);
      }
    }

    return foundItems;
  }


  function findItemsInSector (k, l) {
    let foundItems = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if(matrix[k + i][l + j] > 0) {
          foundItems.push(matrix[k + i][l + j]);
        }
      }
    }

    return foundItems;
  }


  function findBeginnigOfSector (k, l) {
    let begiinigOfSector = {};

    begiinigOfSector.k = Math.floor(k / 3) * 3;
    begiinigOfSector.l = Math.floor(l / 3) * 3;

    return begiinigOfSector;
  }


  function arrayDiff (arr1, arr2) {
    let diff = [];

    for (let i = 0; i < arr1.length; i++) {
      let equaly = false;

      for (let j = 0; j < arr2.length; j++) {
        if (arr1[i] == arr2[j]) {
          equaly = true;
          break;
        }
      }

      if (!equaly) {
        diff.push(arr1[i]);
      }
    }

    return diff;
  }


  function checkSingle (k, l) {
    let coordinatesOfSector = findBeginnigOfSector(k, l);
    let guess = arrayDiff(matrix[k][l], findItemsInRow(k));
    guess = arrayDiff(guess, findItemsInCol(l));
    guess = arrayDiff(guess, findItemsInSector(coordinatesOfSector.k, coordinatesOfSector.l));

    if (guess.length == 1) {
      matrix[k][l] = guess[0];
      flagChanged = true;
    }
    else {
      matrix[k][l] = guess;
    }
  }


  function deleteRepeatInRow (k, l) {
    let items = matrix[k][l];

    for (let i = 0; i < 9; i++) {
      if (i == k || !Array.isArray(matrix[k][i])) {
        continue;
      }
      items = arrayDiff(items, matrix[k][i]);
    }

    return items;
  }


  function deleteRepeatInCol (k, l) {
    let items = matrix[k][l];

    for (let i = 0; i < 9; i++) {
      if (i == k || !Array.isArray(matrix[i][l])) {
        continue;
      }
      items = arrayDiff(items, matrix[i][l]);
    }

    return items;
  }


  function deleteRepeatInSector (k, l) {
    let coordinatesOfSector = findBeginnigOfSector(k, l);
    let items = matrix[k][l];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (((i == k) && ( j == l)) || !Array.isArray(matrix[coordinatesOfSector.k + i][coordinatesOfSector.l + j])) {
          continue;
        }
        items = arrayDiff(items, matrix[coordinatesOfSector.k + i][coordinatesOfSector.l + j]);
      }
    }
  
    return items;
  }


  function checkHiddenSingle (k, l) {    
    let withoutRepeat = deleteRepeatInRow(k, l);

    if (withoutRepeat.length == 1) {
      matrix[k][l] = withoutRepeat[0];
      flagChanged = true;
    }

    withoutRepeat = deleteRepeatInCol(k, l);

    if (withoutRepeat.length == 1) {
      matrix[k][l] = withoutRepeat[0];
      flagChanged = true;
    }

    withoutRepeat = deleteRepeatInSector(k, l);
    
    if (withoutRepeat.length == 1) {
      matrix[k][l] = withoutRepeat[0];
      flagChanged = true;
    }
  }


  function initial () {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let fullLine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (matrix[i][j] == 0) {
          matrix[i][j] = fullLine;
        }
      }
    }
  }


  function firstStep () {
    flagChanged = false;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Array.isArray(matrix[i][j])) {
          checkSingle(i, j);
        }
      }
    }
  }
  

  function secondStep () {
    flagChanged = false;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Array.isArray(matrix[i][j])) {
          checkHiddenSingle(i, j);
        }
      }
    }
  }


  function isSolved(m) {

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Array.isArray(m[i][j])) {
          return false;
        }
      }
    }

    return true;
  }

  function isFailed (m) {

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Array.isArray(m[i][j]) && !m[i][j].length) {
          return true;
        }
      }
    }

    return false;
  }


  function backtracking () {
    let minSuggest = [0, 0, 0];
    let newMatrix = [[], [], [], [], [], [], [], [], []];

    for (let i = 0; i < 9; i++) {
      newMatrix[i].length = 9;
      for (let j = 0; j < 9; j++) {
        newMatrix[i][j] = matrix[i][j];
        if (Array.isArray(matrix[i][j]) && (matrix[i][j].length < minSuggest[2].length || !minSuggest[2])) {
          minSuggest[0] = i;
          minSuggest[1] = j;
          minSuggest[2] = matrix[i][j];
        }
      }
    }

    for (let i = 0; i < minSuggest[2].length; i++) {
      newMatrix[minSuggest[0]][minSuggest[1]] = minSuggest[2][i];

      // if(newMatrix[0][1] == 8) {
      //   console.log(minSuggest);
      //   console.log("Р‘Р›РЇР”РЎРљРђРЇ 8 РўРЈРў!!!")
      //   console.log(newMatrix);
      // }
      // console.log("BACKTRACKING: " + minSuggest[0] + " " + minSuggest[1] + " = " + minSuggest[2][i]);

      let backtrackMatrix = solveSudoku(newMatrix);

      if (isSolved(backtrackMatrix)) {

        // console.log("SOLVED!!!!");

        for (let k = 0; k < 9; k ++) {
          for (let l = 0; l < 9; l++) {
            if (Array.isArray(matrix[k][l])) {
              matrix[k][l] = backtrackMatrix[k][l];
            }
          }
        }

        return;
      }
    }
  }


  function solve() {

    do {
      // console.log("________BEFORE FIRSTSTEP_________");
      // console.log(matrix);
      
      firstStep();
      // console.log("________AFTER FIRSTSTEP_________");
      // console.log(matrix);
      

      if (!flagChanged) {
        // console.log("________BEFORE SECONDSTEP_________");
        // console.log(matrix);
        secondStep();
        // console.log("________AFTER SECONDSTEP_________");
        // console.log(matrix);
      }
    }
    while (flagChanged);
    
    if (!isSolved(matrix) && !isFailed(matrix)) {
        backtracking();
    }
  }

  
  initial();
  solve();

  return matrix;
}

