const tiles = document.querySelectorAll(".tile");
const PLAYER_X = "X";
const PLAYER_O = "O";
let turn = PLAYER_X;
let backGroundSound = new Audio("../Assets/media/background.mp3");
let targetBtn = document.getElementById("myBtn");

let gameContainer = document.getElementById(`gameContainer`);
let nameInput = document.getElementById(`submit-name`);
let popup = document.getElementById(`popup`);

let playerXName = document.getElementById(`playerXName`);
let playerOName = document.getElementById(`playerOName`);

let frstPlayer = PLAYER_X;
let secondPlayer = PLAYER_O;

function enterName() {
  nameInput.addEventListener(`click`, function () {
    if (!playerXName.value || !playerOName.value) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter the name of both players!",
      });
      return;
    }
    gameContainer.className = "visible";
    document.getElementById(
      "info1"
    ).innerText = `Turn for ${playerXName.value}`;
    document.getElementById(
      "info2"
    ).innerText = `Turn for ${playerOName.value}`;
    document.getElementById("info1").style.background = "rgb(123 18 70)";

    popup.className = "hidden";
  });
}
enterName();

targetBtn.addEventListener("click", myFun);
function myFun() {
  if (backGroundSound.paused) {
    backGroundSound.play();
    targetBtn.innerHTML = "Pause";
  } else {
    backGroundSound.pause();
    targetBtn.innerHTML = "Play";
  }
}

const boardState = Array(tiles.length);
boardState.fill(null);

// Elements :

let strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");
playAgain.addEventListener("click", () => startNewGame());
const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => startNewGame());

// Sounds :

const gameOverSound = new Audio("../Assets/media/win.mp3");
const clickSound = new Audio("../Assets/media/ting.mp3");
const tieSound = new Audio("../Assets/media/tie.mp3");

tiles.forEach((tile) => tile.addEventListener("click", tileClick));

function setHoverText() {
  // Remove all hover text :

  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");
    tile.classList.remove("o-hover");
  });
  const hoverClass = `${turn.toLowerCase()}-hover`;
  tiles.forEach((tile) => {
    if (tile.innerText === "") {
      tile.classList.add(hoverClass);
    }
  });
}

setHoverText();

function tileClick(event) {
  if (gameOverArea.classList.contains("visible")) {
    return;
  }
  const tile = event.target;
  const tileNumber = tile.dataset.index;
  if (tile.innerText != "") {
    return;
  }
  if (turn === PLAYER_X) {
    tile.innerText = PLAYER_X;
    boardState[tileNumber - 1] = PLAYER_X;
    turn = PLAYER_O;
    document.getElementById(
      "info2"
    ).innerText = `Turn for ${playerOName.value}`;
    document.getElementById("info2").style.background = "rgb(123 18 70)";
    document.getElementById("info1").style.background = "transparent";
  } else {
    tile.innerText = PLAYER_O;
    boardState[tileNumber - 1] = PLAYER_O;
    turn = PLAYER_X;
    document.getElementById(
      "info1"
    ).innerText = `Turn for ${playerXName.value}`;
    document.getElementById("info1").style.background = "rgb(123 18 70)";
    document.getElementById("info2").style.background = "transparent";
  }
  clickSound.play();
  setHoverText();
  checkWinner();
}

// checkWinner()

function checkWinner() {
  for (const winingCombination of winingCombinations) {
    const { combo, strikeClass } = winingCombination;
    const tileVal1 = boardState[combo[0] - 1];
    const tileVal2 = boardState[combo[1] - 1];
    const tileVal3 = boardState[combo[2] - 1];

    if (tileVal1 != null && tileVal1 === tileVal2 && tileVal1 === tileVal3) {
      backGroundSound.pause();
      document.getElementById("myBtn").innerHTML = "Play";
      document.getElementById("info").classList.add("visibility");

      strike.classList.add(strikeClass);
      gameOverScreen(tileVal1);
      document
        .querySelector(".imgBox")
        .getElementsByTagName("img")[0].style.width = "150px";

      return;
    }
  }

  // Check for a Draw :

  const allTileFilledIn = boardState.every((tile) => tile !== null);

  if (allTileFilledIn) {
    document.getElementById("info").classList.add("visibility");

    backGroundSound.pause();
    document.getElementById("myBtn").innerHTML = "Play";
    tieSound.play();
    gameOverScreen(null);
    document
      .querySelector(".imgBox")
      .getElementsByTagName("img")[1].style.width = "150px";
  }
}

// GameOver() :

function gameOverScreen(winnerText) {
  let text = "Tie Game !";
  if (winnerText === PLAYER_X) {
    text = `Winner ${playerXName.value}!`;
    gameOverSound.play();
  } else if (winnerText === PLAYER_O) {
    text = `Winner ${playerOName.value}!`;
    gameOverSound.play();
  } else {
    text = text;
    gameOverSound.play();
  }
  gameOverArea.className = "visible";
  gameOverText.innerText = text;
}

// startNewGame() :

function startNewGame() {
  document.getElementById("info").classList.remove("visibility");

  strike.className = "strike";
  gameOverArea.className = "hidden";
  boardState.fill(null);
  tiles.forEach((tile) => (tile.innerText = ""));
  turn = PLAYER_X;
  document.getElementById("info1").innerText = "Turn for " + playerXName.value;
  document.getElementById("info2").innerText = "Turn for " + playerOName.value;
  document.getElementById("info1").style.background = "rgb(123 18 70)";
  document.getElementById("info2").style.background = "transparent";

  document.querySelector(".imgBox").getElementsByTagName("img")[0].style.width =
    "0";
  document.querySelector(".imgBox").getElementsByTagName("img")[1].style.width =
    "0";

  setHoverText();
}

const winingCombinations = [
  // Rows :
  { combo: [1, 2, 3], strikeClass: "strike-row-1" },
  { combo: [4, 5, 6], strikeClass: "strike-row-2" },
  { combo: [7, 8, 9], strikeClass: "strike-row-3" },
  // Coloms :
  { combo: [1, 4, 7], strikeClass: "strike-colom-1" },
  { combo: [2, 5, 8], strikeClass: "strike-colom-2" },
  { combo: [3, 6, 9], strikeClass: "strike-colom-3" },
  //Diagonal :
  { combo: [1, 5, 9], strikeClass: "strike-diagonal-1" },
  { combo: [3, 5, 7], strikeClass: "strike-diagonal-2" },
];
