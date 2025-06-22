let boxes = document.querySelectorAll(".box");
let resetbutton = document.querySelector("#reset");
let newGame = document.querySelector("#newbutton");
let msgcontainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let modeSelect = document.querySelector("#mode-select");

let turnO = true;
let mode = "2p"; // default mode
let gameOver = false;

const winningPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

modeSelect.addEventListener("change", (e) => {
  mode = e.target.value;
  resetGame();
});

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "" || gameOver) return;

    if (mode === "2p") {
      if (turnO) {
        box.innerText = "O";
      } else {
        box.innerText = "X";
      }
      box.disabled = true;
      turnO = !turnO;
      checkWinner();
    } else {
      box.innerText = "X";
      box.disabled = true;
      turnO = true;

      if (checkWinner()) return;

      setTimeout(() => {
        if (mode === "easy") easyAIMove();
        else if (mode === "hard") hardAIMove();
      }, 300);
    }
  });
});

function easyAIMove() {
  let empty = [...boxes].filter(b => b.innerText === "");
  if (empty.length === 0) return;
  let rand = Math.floor(Math.random() * empty.length);
  empty[rand].innerText = "O";
  empty[rand].disabled = true;
  turnO = false;
  checkWinner();
}

function hardAIMove() {
  let bestScore = -Infinity;
  let move;
  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      box.innerText = "O";
      let score = minimax(false);
      box.innerText = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });
  boxes[move].innerText = "O";
  boxes[move].disabled = true;
  turnO = false;
  checkWinner();
}

function minimax(isMaximizing) {
  let result = checkWinnerForMinimax();
  if (result !== null) return scores[result];

  if (isMaximizing) {
    let best = -Infinity;
    boxes.forEach((box) => {
      if (box.innerText === "") {
        box.innerText = "O";
        let score = minimax(false);
        box.innerText = "";
        best = Math.max(score, best);
      }
    });
    return best;
  } else {
    let best = Infinity;
    boxes.forEach((box) => {
      if (box.innerText === "") {
        box.innerText = "X";
        let score = minimax(true);
        box.innerText = "";
        best = Math.min(score, best);
      }
    });
    return best;
  }
}

const scores = {
  X: -1,
  O: 1,
  tie: 0,
};

function checkWinnerForMinimax() {
  for (let pattern of winningPatterns) {
    let [a, b, c] = pattern;
    let pos1 = boxes[a].innerText;
    let pos2 = boxes[b].innerText;
    let pos3 = boxes[c].innerText;
    if (pos1 && pos1 === pos2 && pos2 === pos3) {
      return pos1;
    }
  }

  let full = [...boxes].every(box => box.innerText !== "");
  return full ? "tie" : null;
}

function checkWinner() {
  for (let pattern of winningPatterns) {
    let [a, b, c] = pattern;
    let pos1 = boxes[a].innerText;
    let pos2 = boxes[b].innerText;
    let pos3 = boxes[c].innerText;
    if (pos1 && pos1 === pos2 && pos2 === pos3) {
      showWinner(pos1);
      return true;
    }
  }

  let full = [...boxes].every(box => box.innerText !== "");
  if (full) {
    showDraw();
    return true;
  }
  return false;
}

function showWinner(winner) {
  msg.innerText = `Congratulations, Winner is ${winner} 🎉`;
  msgcontainer.classList.remove("hide");
  disableBoxes();
  gameOver = true;
}

function showDraw() {
  msg.innerText = "It's a Draw 🤝";
  msgcontainer.classList.remove("hide");
  disableBoxes();
  gameOver = true;
}

function disableBoxes() {
  boxes.forEach(box => box.disabled = true);
}

function enableBoxes() {
  boxes.forEach(box => {
    box.disabled = false;
    box.innerText = "";
  });
  msgcontainer.classList.add("hide");
}

function resetGame() {
  turnO = true;
  gameOver = false;
  enableBoxes();
  
  // If vs AI and AI is 'O', let it play first
  if (mode !== "2p" && turnO === false) {
    setTimeout(() => {
      if (mode === "easy") easyAIMove();
      else if (mode === "hard") hardAIMove();
    }, 300);
  }
}  





newGame.addEventListener("click", resetGame);
resetbutton.addEventListener("click", resetGame);
