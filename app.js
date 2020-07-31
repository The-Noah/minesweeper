const grid = document.querySelector(".grid");
const bombsRemaining = document.querySelector(".bombs");
const message = document.querySelector(".message");
const squares = [];

const WIDTH = 10;
const BOMB_AMOUNT = 10;
bombsRemaining.innerText = BOMB_AMOUNT;

let isGameOver = false;
let flags = 0;

function createBoard(){
  const bombs = Array(BOMB_AMOUNT).fill("bomb");
  const empty = Array(WIDTH*WIDTH - BOMB_AMOUNT).fill("valid");
  const shuffled = empty.concat(bombs).sort(() => Math.random() - .5);

  for(let i = 0; i < WIDTH*WIDTH; i++){
    const square = document.createElement("div");
    square.setAttribute("id", i);
    square.classList.add(shuffled[i]);
    grid.appendChild(square);
    squares.push(square);

    square.addEventListener("click", function(){
      click(square);
    });

    square.addEventListener("contextmenu", function(e){
      e.preventDefault();
      addFlag(square);
    });
  }

  for(let i = 0; i < squares.length; i++){
    let total = 0;
    const isLeftEdge = i % WIDTH === 0;
    const isRightEdge = i % WIDTH === WIDTH - 1;

    if(squares[i].classList.contains("valid")){
      if(i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")){
        total++;
      }
      if(i > 9 && !isRightEdge && squares[i + 1 - WIDTH].classList.contains("bomb")){
        total++;
      }
      if(i > 10 && squares[i - WIDTH].classList.contains("bomb")){
        total++;
      }
      if(i > 11 && !isLeftEdge && squares[i - 1 - WIDTH].classList.contains("bomb")){
        total++;
      }
      if(i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb")){
        total++;
      }
      if(i < 90 && !isLeftEdge && squares[i - 1 + WIDTH].classList.contains("bomb")){
        total++;
      }
      if(i < 88 && !isRightEdge && squares[i + 1 + WIDTH].classList.contains("bomb")){
        total++;
      }
      if(i < 89 && squares[i + WIDTH].classList.contains("bomb")){
        total++;
      }

      squares[i].setAttribute("data", total);
    }
  }
}

createBoard();

function addFlag(square){
  if(isGameOver || square.classList.contains("checked")){
    return;
  }

  if(!square.classList.contains("flag")){
    square.classList.add("flag");
    square.innerText = "🚩";
    flags++;
  }else{
    square.classList.remove("flag");
    square.innerText = "";
    flags--;
  }

  bombsRemaining.innerText = BOMB_AMOUNT - flags;
  checkForWin();
}

function click(square){
  if(isGameOver || square.classList.contains("checked") || square.classList.contains("flag")){
    return;
  }

  if(square.classList.contains("bomb")){
    gameOver();
    return;
  }

  square.classList.add("checked");

  let total = square.getAttribute("data");
  if(total != 0){
    square.innerText = total;
    return;
  }

  checkSquare(square, square.id);
}

function checkSquare(square, currentId){
  const isLeftEdge = currentId % WIDTH === 0;
  const isRightEdge = currentId % WIDTH === WIDTH - 1;

  setTimeout(function(){
    if(currentId > 0 && !isLeftEdge){
      const newId = parseInt(currentId) - 1;
      click(squares[newId]);
    }
    if(currentId > 9 && !isRightEdge){
      const newId = parseInt(currentId) + 1 - WIDTH;
      click(squares[newId]);
    }
    if(currentId > 10){
      const newId = parseInt(currentId) - WIDTH;
      click(squares[newId]);
    }
    if(currentId > 11 && !isLeftEdge){
      const newId = parseInt(currentId) - 1 - WIDTH;
      click(squares[newId]);
    }
    if(currentId < 98 && !isRightEdge){
      const newId = parseInt(currentId) + 1;
      click(squares[newId]);
    }
    if(currentId < 90 && !isLeftEdge){
      const newId = parseInt(currentId) - 1 + WIDTH;
      click(squares[newId]);
    }
    if(currentId < 88 && !isRightEdge){
      const newId = parseInt(currentId) + 1 + WIDTH;
      click(squares[newId]);
    }
    if(currentId < 89){
      const newId = parseInt(currentId) + WIDTH;
      click(squares[newId]);
    }
  });
}

function gameOver(){
  isGameOver = true;

  for (const square of squares){
    if(square.classList.contains("bomb")){
      square.innerText = "💣";
    }
  }

  message.innerText = "💥 Boom! 💥";
}

function checkForWin(){
  if(flags > BOMB_AMOUNT){
    return;
  }

  let matches = 0;

  for(let i = 0; i < squares.length; i++){
    if(squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")){
      matches++;

      if(matches === BOMB_AMOUNT){
        isGameOver = true;
        message.innerText = "🎉 You Win! 🎉";
        break;
      }
    }
  }
}
