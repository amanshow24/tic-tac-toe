let boxes = document.querySelectorAll(".box");
let resetbutton = document.querySelector("#reset");
let newGame = document.querySelector("#newbutton");
let msgcontainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");


let turnO = true;
const winningPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

boxes.forEach((box) => {
    box.addEventListener("click",() => {
       
        if(turnO === true) {
            box.innerText = "O";
            
            turnO = false ;
        }else{
            box.innerText = "X";
       
            turnO = true;
        }
        box.disabled = true;
        checkWinner();
    });
});

const disableBoxes = () => {
    for (let box of boxes){
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes){
        box.disabled = false;
        box.innerText ="";
        msgcontainer.classList.add("hide");
    }
};

const showWinner = (winner) =>{
    msg.innerText = `Congratulations, Winner is ${winner} 🎉`;
    msgcontainer.classList.remove("hide");
    disableBoxes();
}

const checkWinner = () => {
    let filledBox = 0;
    for ( let patterns of winningPatterns) {
      
        let pos1 =    boxes[patterns[0]].innerText;
        let pos2 =    boxes[patterns[1]].innerText;
        let pos3 =    boxes[patterns[2]].innerText;
      
        if(pos1 != "" && pos2 != "" && pos3 != ""){
            if(pos1 === pos2 && pos2 ===pos3){

                showWinner(pos1);
                return ;
            } 
            
        
        }
    }
    boxes.forEach((box) => {
        if(box.innerText !== "")
            filledBox ++;
    })
    if(filledBox === boxes.length){
        showDraw();
    }
};

const showDraw = () => {
    msg.innerText = "It's a Draw 🤝";
    msgcontainer.classList.remove("hide");
    disableBoxes();
};

const resetGame = () => {
    turnO = true ;
    enableBoxes();

};

newGame.addEventListener("click", resetGame);

resetbutton.addEventListener("click", resetGame);

