// 'use strict'

const EMPTY = "";
const MINE = "💣";
const HINT = "💡";
const FLAG = "🚩";
const SMILEY_START = "🙂";
const SMILEY_CHECK = "😮";
const SMILEY_LOSE = "😖";
const SMILEY_WIN = "😎";
const QMOUSE_MARK = `<i class="fas fa-question"></i>`

var gBoard;
var gTime;
var gHint;

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

////////////////*****************/////////////////////////
function initGame() {
    coverModal();
    gGame.isOn = true;
    gBoard = createBoard(gLevel.size);
    renderBoard(gBoard);
    smileyChange("start");
    resetHint();
}

///////////////////////build a board function /////////////////////
function createBoard(numsOfCells) {
    console.log("createing a board")

    var board = []
    for (var i = 0; i < numsOfCells; i++) {
        board.push([])
        for (var j = 0; j < numsOfCells; j++) {

            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

////////////place the mines /////////////

function placeMines(board, i, j) {

    var amountOfMines = gLevel.mines
    var randNumForI;
    var randNumForJ;
    var numOfMidesToSet = 0;

    while (numOfMidesToSet < amountOfMines) {

        randNumForI = getRandomIntInclusive(0, board.length - 1)
        randNumForJ = getRandomIntInclusive(0, board.length - 1)

        if (i === randNumForI && j === randNumForJ) continue;
        var currCell = board[randNumForI][randNumForJ]

        if (!currCell.isMine) {
            currCell.isMine = true
            numOfMidesToSet++
        } else continue;
    }
    console.log(gBoard);
}

/////////////////////// render a board function /////////////////////

function renderBoard(gBoard) {
    console.log("renfer a board")

    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < gBoard[i].length; j++) {
            strHTML += ` \t<td class = "cell cell${i}-${j} hide" onclick ="cellClicked(this,${i},${j},event)" 
            oncontextmenu="cellMarked(this,${i},${j},event)"  
            onmouseover="chageColorCell(this)" 
            onmouseout="chageColorCellBack(this)"> 
            </td>\n`
        }
        strHTML += `</tr>\n`
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}




///////////////cellClicked function/////////////////////////////
function cellClicked(elCell, cellI, cellJ) {

    /// check if hint!!! /////
    if (gHint) { gHint = false; checkNeighbors(cellI, cellJ, true); return; }

    // if (gHint) { gHint = false; showHint(cellI, cellJ); return; }
    var currCell = gBoard[cellI][cellJ]
    // var cellObj = { loc}
    // if (currCell.isMarked) return;

    smileyChange("check");
    ///place mines only after the first click ///
    if (checkNumOfCellShown(gBoard) === 0) { placeMines(gBoard, cellI, cellJ) }

    ////// start time count //////
    if (gGame.isOn === false) {
        return;
    } else if (gGame.secsPassed === 0) {
        startCount()
    }

    checkNeighbors(cellI, cellJ, false);

    isGameOver(currCell, elCell)
}


////////////check cell value// ////////////
function isGameOver(currCell, elCell) {

    /// pressed on mine///////////
    if (currCell.isMarked != true && currCell.isMine) {
        losing(elCell);

    }

    if ((gGame.shownCount === (gLevel.size * gLevel.size) - gLevel.mines)
        //marked cell equal to mined cell        
        && gGame.markedCount === gLevel.mines) {
        winning();
    }
    else return;
}


///////mark cell?////
function cellMarked(elCell, i, j, press) {
    press.preventDefault()

    var currCell = gBoard[i][j]
    if (currCell.isShown) return;

    if (currCell.isMarked) {
        currCell.isMarked = false;
        gBoard.markedCount--

        if (currCell.isMine) {
            elCell.innerHTML = MINE;
        }
        else if (currCell.minesAroundCount !== 0) {
            elCell.innerHTML = currCell.minesAroundCount;
        } else {
            elCell.innerHTML = EMPTY;
        }
    }
    //cell is not mark///
    else {
        gBoard[i][j].isMarked = true;
        gGame.markedCount++
        elCell.innerHTML = FLAG;
    }
    isGameOver(currCell, elCell)
}

//// //////////////////////////////////////////////


function winning() {

    smileyChange("win");
    gGame.isOn = false;
    clearTimeout(gTime);
    setTimeout(() => { showModal(true) }, 500);
}

function losing(elCell) {
    smileyChange("lose")
    elCell.innerHTML = MINE;
    gGame.isOn = false;
    clearTimeout(gTime);
    setTimeout(() => { showModal(false) }, 500);
}


////////////////////////////////////////////////////////

function renderCells(locations) {
    for (var i = 0; i < locations.length; i++) {

        var loc = locations[i]
        var currCell = gBoard[loc.i][loc.j];
        var elCell = document.querySelector(`.cell${loc.i}-${loc.j}`)
        //check the neighbors//
        var cellValue;
        var negsOfCell = countNeighbors(loc.i, loc.j, gBoard)
        currCell.minesAroundCount = negsOfCell

        ///check the cell value///
        if (currCell.isMine) {
            cellValue = MINE
        }
        //check neighbors amount//
        else if (negsOfCell === 0) {
            cellValue = EMPTY
        }
        else cellValue = negsOfCell

        elCell.innerHTML = cellValue;
    }
    return negsOfCell;
}
