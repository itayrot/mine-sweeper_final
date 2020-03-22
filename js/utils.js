////////////////////////random number function /////////////////////

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// //// check if empty cell ////
// function isEmpty(cell) {
//     if (cell === "") return true;
//     else { return false; }

// }

//////////////////////////// Neighbors function /////////////////////
// return all cells around the location of cellI cellJ
function countNeighbors(cellI, cellJ, mat) {

    var numsOfMineSAround = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            //condition for all neighbors cells
            if (mat[i][j].isMine === true) numsOfMineSAround++

        }
    }
    return numsOfMineSAround
}


/////// game level setup//////////////
function setGameLevel(numOfCells) {

    coverModal();
    resetTime();

    gLevel.size = numOfCells
    switch (numOfCells) {
        case 4: gLevel.mines = 2;
            break;
        case 8: gLevel.mines = 12;
            break;
        case 16: gLevel.mines = 30;
            break;
        default: gLevel.mines = 2;
    }
    initGame()
}

///////time setup//////////

function startCount() {

    gGame.secsPassed = 1;
    timedCount();

}

function timedCount() {
    document.getElementById("timer").value = gGame.secsPassed;
    gGame.secsPassed++;
    gTime = setTimeout(timedCount, 1000);
}

function resetTime() {
    clearTimeout(gTime)
    gGame.secsPassed = 0;
    document.getElementById("timer").value = gGame.secsPassed;
}

//// color setup ///////////
function chageColorCell(cell) {
    cell.classList.add(`colorChange`);
}

function chageColorCellBack(cell) {
    cell.classList.remove(`colorChange`);
}

//////////// modal ///////////////////////
function showModal(isWin) {

    var elModal = document.querySelector(".alert")
    document.querySelector(".modal").style.display = "block"
    elModal.style.display = "block"
    if (!isWin) {
        elModal.innerHTML = "game over!!!"
    }
    else {
        elModal.innerHTML = "you win!!!"
    }
}



/////////////////////////////////////////////
function coverModal() {
    document.querySelector(".modal").style.display = "none"
    document.querySelector(".alert").style.display = "none"
}

///////////////////////////////////////////////////
function showCell(elCell, currCell) {

    if (currCell.isShown) return;
    chageColorCellBack(elCell)
    gGame.shownCount++
    elCell.classList.remove("hide")
    elCell.classList.add("show")
    currCell.isShown = true;

}

function hideCell(locations) {

    for (var i = 0; i < locations.length; i++) {

        elCell = document.querySelector(`.cell${locations[i].i}-${locations[i].j}`)
        elCell.classList.remove("show")
        elCell.innerHTML = EMPTY;
        elCell.classList.add("hide")
    }

}


function smileyChange(status) {

    var elBtn = document.querySelector(".smileys")
    var smiley;
    switch (status) {
        case "start": smiley = SMILEY_START;
            break;
        case "check": smiley = SMILEY_CHECK;
            break;
        case "lose": smiley = SMILEY_LOSE;
            break;
        case "win": smiley = SMILEY_WIN;
    }
    elBtn.innerHTML = `<button class = "smile-btn" onclick = "initGame()" >${smiley}</button>`
}


function checkNumOfCellShown(board) {

    var numsOfShownCells = 0
    var count = board.length - 1
    for (var i = 0; i <= count; i++) {
        for (var j = 0; j <= count; j++) {

            //condition for all neighbors cells
            if (board[i][j].isShown) numsOfShownCells++
        }
    }
    return numsOfShownCells;
}

function checkNeighbors(cellI, cellJ, isHint) {

    var locations = []

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;

            ///  current cell's number
            var countMinesCurrCell = countNeighbors(cellI, cellJ, gBoard)

            /// if current cell has a number and no hint used////
            if (countMinesCurrCell !== 0 && isHint === false) {
                var elCurrCell = document.querySelector(`.cell${cellI}-${cellJ}`)
                locations.push({ i: cellI, j: cellJ })
                showCell(elCurrCell, gBoard[cellI][cellJ])
                renderCells(locations)
                return;
            }

            var elCell = document.querySelector(`.cell${i}-${j}`)
            var currCell = gBoard[i][j]

            if (!currCell.isShown) {
                //expend cells///
                if (!isHint && currCell.isMine === false) {

                    locations.push({ i: i, j: j })
                    showCell(elCell, currCell)
                    renderCells(locations)
                    // recursive//
                    checkNeighbors(i, j, false)
                }
                else if (isHint) {
                    elCell.classList.add("show")
                    locations.push({ i: i, j: j });
                    renderCells(locations);
                    setTimeout(() => { hideCell(locations) }, 2000)
                }
            }
        }
    }
}


function hintIsOn(elHint) {
    // if used hint before a cell was pressed ///
    if (checkNumOfCellShown(gBoard) === 0) {
        showModalGuide()
    }
    else {
        gHint = true;
        elHint.style.display = "none";
    }

}

//////////// modal-guide ///////////////////////
function showModalGuide() {

    var elModal = document.querySelector(".modal-guide")
    var elalert = document.querySelector(".guide")
    elModal.style.display = "block"
    elalert.innerHTML = "please click a cell before using a hint!";
    setTimeout(() => {

        elModal.style.display = "none"
    }, 3000);

}


function resetHint() {
    for (var i = 1; i < 4; i++) {
        document.querySelector(`.hintbtn${i}`).style.display = "block"
    }

}





