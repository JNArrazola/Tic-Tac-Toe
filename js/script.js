let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let startTime;
let computerStrategy = "random"; 
let timerInterval; 

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const bestTimesList = document.getElementById('best-times');
const minimaxButton = document.getElementById('minimax-button');
const randomButton = document.getElementById('random-button');
const timerDisplay = document.getElementById('timer'); 

// ! Timer
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 100); 
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = ((currentTime - startTime) / 1000).toFixed(2);
    timerDisplay.textContent = `Tiempo: ${elapsedTime} segundos`; 
}

function stopTimer() {
    clearInterval(timerInterval); 
}

function resetTimer() {
    timerDisplay.textContent = "Tiempo: 0.00 segundos"; 
    clearInterval(timerInterval); 
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[cellIndex] !== "" || !gameActive) {
        return;
    }

    if (!startTime) {  
        startTimer();  
    }

    board[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if (checkResult()) {
        stopTimer();  
        return;
    }

    currentPlayer = "O";
    setTimeout(computerMove, 500); 
}

function computerMove() {
    if (computerStrategy === "minimax") {
        playMinimax();
    } else {
        playRandom();
    }
}

function playRandom() {
    let availableCells = board
        .map((val, idx) => (val === "" ? idx : null))
        .filter(val => val !== null);

    if (availableCells.length === 0 || !gameActive) return;

    let randomIndex =
        availableCells[Math.floor(Math.random() * availableCells.length)];
    board[randomIndex] = currentPlayer;
    document.querySelector(`.cell[data-index='${randomIndex}']`).textContent =
        currentPlayer;

    if (checkResult()) {
        return;
    }

    currentPlayer = "X";
}

function playMinimax() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = currentPlayer;
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    if (move !== undefined) {
        board[move] = currentPlayer;
        document.querySelector(`.cell[data-index='${move}']`).textContent =
            currentPlayer;

        if (checkResult()) {
            return;
        }

        currentPlayer = "X";
    }
}

function minimax(newBoard, depth, isMaximizing) {
    let scores = {
        'X': -10,
        'O': 10,
        'tie': 0
    };

    let result = checkWinnerForMinimax(newBoard);
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "O";
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "X";
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerForMinimax(board) {
    for (let condition of winningConditions) {
        let [a, b, c] = condition;
        if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes("")) {
        return 'tie';
    }

    return null;
}


function checkResult() {
    let roundWon = false;
    let winningCells = [];
    let endTime;

    for (let condition of winningConditions) {
        let a = board[condition[0]];
        let b = board[condition[1]];
        let c = board[condition[2]];

        if (a === "" || b === "" || c === "") {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            winningCells = condition;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;

        if (currentPlayer === "X") {
            endTime = new Date();
        }

        minimaxButton.disabled = true;
        randomButton.disabled = true;

        winningCells.forEach(index => {
            document.querySelector(`.cell[data-index='${index}']`).classList.add('winning-cell');
        });

        updateTimer(); 
        stopTimer(); 

        setTimeout(() => {
            if (currentPlayer === "X") {
                let timeTaken = ((endTime - startTime) / 1000).toFixed(2);
                statusDisplay.textContent = `¡Ganaste! Tiempo: ${timeTaken} segundos`;
                statusDisplay.style.color = "lightgreen";

                setTimeout(() => {
                    saveBestTime(timeTaken);
                    minimaxButton.disabled = false;
                    randomButton.disabled = false;
                }, 150);
            } else {
                statusDisplay.textContent = "La computadora ha ganado.";
                statusDisplay.style.color = "red";
                minimaxButton.disabled = false;
                randomButton.disabled = false;
            }
        }, 1500); 
        return true;
    }

    if (!board.includes("")) {
        gameActive = false;
        setTimeout(() => {
            statusDisplay.textContent = "Empate.";
            statusDisplay.style.color = "white";
        }, 100);
        stopTimer();  
        return true;
    }

    return false;
}

async function saveBestTime(time) {
    let playerName = prompt("¡Felicidades! Ingrese su nombre:");
    if (!playerName) playerName = "Anonimo";

    playerName = encodeURIComponent(playerName);

    try {
        const response = await fetch("addscore.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                score: Math.round(time * 1000), 
                player: playerName,
                game: "TicTacToe-JArrazola", 
            }),
        });

        if (!response.ok) {
            throw new Error("Error al guardar el puntaje.");
        }

        const result = await response.json();
        console.log("Puntaje guardado:", result);
        alert("¡Puntaje guardado exitosamente!");
    } catch (error) {
        console.error("Error al guardar el puntaje:", error);
        alert("Hubo un error al guardar el puntaje.");
    }
}

async function displayBestTimes() {
    try {
        const response = await fetch("scores.php?game=TicTacToe-JArrazola&orderAsc=1");

        if (!response.ok) {
            throw new Error("Error al cargar los puntajes.");
        }

        const bestTimes = await response.json();

        bestTimesList.innerHTML = "";

        bestTimes.forEach((record) => {
            const li = document.createElement("li");
            li.textContent = `${record.player} - ${record.score} ms - ${record.date}`;
            bestTimesList.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar los puntajes:", error);
        alert("No se pudieron cargar los puntajes. Intenta más tarde.");
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    startTime = null;
    statusDisplay.textContent = "";
    cells.forEach(cell => (cell.textContent = ""));
    cells.forEach(cell => cell.classList.remove('winning-cell'));
}

function selectButton(strategy) {
    computerStrategy = strategy;

    minimaxButton.classList.remove("selected");
    randomButton.classList.remove("selected");

    timerDisplay.textContent = "Tiempo: 0.00 segundos";
    if(timerInterval) {
        clearInterval(timerInterval);
    }

    if (strategy === "minimax") {
        minimaxButton.classList.add("selected");
    } else {
        randomButton.classList.add("selected");
    }

    resetGame();
}

minimaxButton.addEventListener("click", () => selectButton("minimax"));
randomButton.addEventListener("click", () => selectButton("random"));

cells.forEach(cell => cell.addEventListener("click", handleCellClick));

displayBestTimes();
