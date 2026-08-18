const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");
const colorChoice = document.getElementById("colorChoice");
const redButton = document.getElementById("redButton");
const blackButton = document.getElementById("blackButton");
const resetButton = document.getElementById("resetButton");

let board = [];
let currentPlayer = "red";
let playerColor = null;
let computerColor = null;
let selectedPiece = null;
let gameStarted = false;

// Create the board and starting pieces.
function createStartingBoard() {
    board = [];

    for (let row = 0; row < 8; row++) {
        const newRow = [];

        for (let column = 0; column < 8; column++) {
            let square = null;

            if ((row + column) % 2 === 1) {
                if (row < 3) {
                    square = {
                        color: "black",
                        king: false
                    };
                } else if (row > 4) {
                    square = {
                        color: "red",
                        king: false
                    };
                }
            }

            newRow.push(square);
        }

        board.push(newRow);
    }
}

// Start the game after the player chooses a color.
function startGame(chosenColor) {
    playerColor = chosenColor;

    if (playerColor === "red") {
        computerColor = "black";
    } else {
        computerColor = "red";
    }

    currentPlayer = "red";
    selectedPiece = null;
    gameStarted = true;

    createStartingBoard();
    displayBoard();

    colorChoice.classList.add("hidden");
    resetButton.style.display = "inline-block";

    if (playerColor === "red") {
        messageElement.textContent =
            "Your turn. You are red.";
    } else {
        messageElement.textContent =
            "You are black. The computer moves first.";

        setTimeout(function () {
            computerMove(null);
        }, 700);
    }
}

// Display the board.
function displayBoard() {
    boardElement.innerHTML = "";

    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            const square = document.createElement("div");

            square.classList.add("square");

            if ((row + column) % 2 === 0) {
                square.classList.add("light");
            } else {
                square.classList.add("dark");
            }

            square.dataset.row = row;
            square.dataset.column = column;

            const piece = board[row][column];

            if (piece !== null) {
                const pieceElement =
                    document.createElement("div");

                pieceElement.classList.add("piece");
                pieceElement.classList.add(
                    piece.color + "-piece"
                );

                if (piece.king) {
                    pieceElement.classList.add("king");
                }

                square.appendChild(pieceElement);
            }

            if (
                selectedPiece !== null &&
                selectedPiece.row === row &&
                selectedPiece.column === column
            ) {
                square.classList.add("selected");
            }

            if (
                selectedPiece !== null &&
                findMove(
                    selectedPiece.row,
                    selectedPiece.column,
                    row,
                    column
                ) !== null
            ) {
                square.classList.add("possible-move");
            }

            square.addEventListener(
                "click",
                handleSquareClick
            );

            boardElement.appendChild(square);
        }
    }
}

// Respond when a square is clicked.
function handleSquareClick(event) {
    if (!gameStarted) {
        messageElement.textContent =
            "Choose red or black to begin.";

        return;
    }

    if (currentPlayer !== playerColor) {
        messageElement.textContent =
            "Please wait for the computer.";

        return;
    }

    const row = Number(event.currentTarget.dataset.row);
    const column =
        Number(event.currentTarget.dataset.column);

    const clickedPiece = board[row][column];
    const allMoves = getAllLegalMoves(playerColor);

    // Select one of the player's movable pieces.
    if (
        clickedPiece !== null &&
        clickedPiece.color === playerColor
    ) {
        const pieceCanMove = allMoves.some(function (move) {
            return (
                move.oldRow === row &&
                move.oldColumn === column
            );
        });

        if (!pieceCanMove) {
            messageElement.textContent =
                "That piece cannot move. A jump may be required.";

            return;
        }

        selectedPiece = {
            row: row,
            column: column
        };

        if (allMoves[0].jumpedRow !== null) {
            messageElement.textContent =
                "A jump is available and must be taken.";
        } else {
            messageElement.textContent =
                "Choose an empty diagonal square.";
        }

        displayBoard();
        return;
    }

    if (selectedPiece !== null) {
        const chosenMove = findMove(
            selectedPiece.row,
            selectedPiece.column,
            row,
            column
        );

        if (chosenMove !== null) {
            makeMove(chosenMove);

            // Continue jumping with the same piece.
            if (chosenMove.jumpedRow !== null) {
                const moreJumps = getPieceMoves(
                    row,
                    column,
                    true
                );

                if (moreJumps.length > 0) {
                    selectedPiece = {
                        row: row,
                        column: column
                    };

                    messageElement.textContent =
                        "Another jump is available. Keep jumping.";

                    displayBoard();
                    return;
                }
            }

            endPlayerTurn();
            return;
        }
    }

    messageElement.textContent =
        "That move is not allowed.";
}

// Find a particular legal move.
function findMove(
    oldRow,
    oldColumn,
    newRow,
    newColumn
) {
    let availableMoves;

    /*
     * During a multiple jump, only check jumps belonging
     * to the currently selected checker.
     */
    if (
        selectedPiece !== null &&
        selectedPiece.row === oldRow &&
        selectedPiece.column === oldColumn
    ) {
        const jumps = getPieceMoves(
            oldRow,
            oldColumn,
            true
        );

        if (jumps.length > 0) {
            availableMoves = jumps;
        } else {
            availableMoves = getAllLegalMoves(
                currentPlayer
            );
        }
    } else {
        availableMoves = getAllLegalMoves(
            currentPlayer
        );
    }

    for (let move of availableMoves) {
        if (
            move.oldRow === oldRow &&
            move.oldColumn === oldColumn &&
            move.newRow === newRow &&
            move.newColumn === newColumn
        ) {
            return move;
        }
    }

    return null;
}

// Find all legal moves for one player.
function getAllLegalMoves(color) {
    const regularMoves = [];
    const jumpMoves = [];

    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            const piece = board[row][column];

            if (
                piece !== null &&
                piece.color === color
            ) {
                const moves = getPieceMoves(
                    row,
                    column,
                    false
                );

                for (let move of moves) {
                    if (move.jumpedRow !== null) {
                        jumpMoves.push(move);
                    } else {
                        regularMoves.push(move);
                    }
                }
            }
        }
    }

    // Checkers rules require a jump when one exists.
    if (jumpMoves.length > 0) {
        return jumpMoves;
    }

    return regularMoves;
}

// Find the moves available to one checker.
function getPieceMoves(row, column, jumpsOnly) {
    const moves = [];
    const piece = board[row][column];

    if (piece === null) {
        return moves;
    }

    let rowDirections = [];

    if (piece.king) {
        rowDirections = [-1, 1];
    } else if (piece.color === "red") {
        rowDirections = [-1];
    } else {
        rowDirections = [1];
    }

    for (let rowDirection of rowDirections) {
        checkDirection(
            moves,
            row,
            column,
            rowDirection,
            -1,
            jumpsOnly
        );

        checkDirection(
            moves,
            row,
            column,
            rowDirection,
            1,
            jumpsOnly
        );
    }

    return moves;
}

// Check one diagonal direction for a move or jump.
function checkDirection(
    moves,
    row,
    column,
    rowDirection,
    columnDirection,
    jumpsOnly
) {
    const nextRow = row + rowDirection;
    const nextColumn = column + columnDirection;

    if (!isOnBoard(nextRow, nextColumn)) {
        return;
    }

    const nextSquare = board[nextRow][nextColumn];

    // Add a normal one-square move.
    if (nextSquare === null && !jumpsOnly) {
        moves.push({
            oldRow: row,
            oldColumn: column,
            newRow: nextRow,
            newColumn: nextColumn,
            jumpedRow: null,
            jumpedColumn: null
        });

        return;
    }

    const piece = board[row][column];

    // Check whether the next piece belongs to the opponent.
    if (
        nextSquare !== null &&
        nextSquare.color !== piece.color
    ) {
        const landingRow = row + rowDirection * 2;
        const landingColumn =
            column + columnDirection * 2;

        if (
            isOnBoard(landingRow, landingColumn) &&
            board[landingRow][landingColumn] === null
        ) {
            moves.push({
                oldRow: row,
                oldColumn: column,
                newRow: landingRow,
                newColumn: landingColumn,
                jumpedRow: nextRow,
                jumpedColumn: nextColumn
            });
        }
    }
}

// Check whether a square is inside the board.
function isOnBoard(row, column) {
    return (
        row >= 0 &&
        row < 8 &&
        column >= 0 &&
        column < 8
    );
}

// Move a checker and remove a captured piece.
function makeMove(move) {
    const piece =
        board[move.oldRow][move.oldColumn];

    board[move.newRow][move.newColumn] = piece;
    board[move.oldRow][move.oldColumn] = null;

    if (move.jumpedRow !== null) {
        board[move.jumpedRow][move.jumpedColumn] = null;
    }

    // Make the checker a king at the opposite side.
    if (
        (piece.color === "red" && move.newRow === 0) ||
        (piece.color === "black" && move.newRow === 7)
    ) {
        piece.king = true;
    }
}

// Finish the player's turn.
function endPlayerTurn() {
    selectedPiece = null;
    currentPlayer = computerColor;

    displayBoard();

    const computerMoves =
        getAllLegalMoves(computerColor);

    if (computerMoves.length === 0) {
        messageElement.textContent =
            "The computer has no moves. You win!";

        gameStarted = false;
        return;
    }

    messageElement.textContent =
        "The computer is moving.";

    setTimeout(function () {
        computerMove(null);
    }, 700);
}

// Make a computer move.
function computerMove(previousMove) {
    if (!gameStarted) {
        return;
    }

    let possibleMoves;

    /*
     * If the computer just jumped, check whether that
     * same piece can jump again.
     */
    if (
        previousMove !== null &&
        previousMove.jumpedRow !== null
    ) {
        possibleMoves = getPieceMoves(
            previousMove.newRow,
            previousMove.newColumn,
            true
        );
    } else {
        possibleMoves =
            getAllLegalMoves(computerColor);
    }

    if (possibleMoves.length === 0) {
        finishComputerTurn();
        return;
    }

    const randomNumber = Math.floor(
        Math.random() * possibleMoves.length
    );

    const chosenMove = possibleMoves[randomNumber];

    makeMove(chosenMove);
    displayBoard();

    // Continue if the computer can jump again.
    if (chosenMove.jumpedRow !== null) {
        const moreJumps = getPieceMoves(
            chosenMove.newRow,
            chosenMove.newColumn,
            true
        );

        if (moreJumps.length > 0) {
            messageElement.textContent =
                "The computer is jumping again.";

            setTimeout(function () {
                computerMove(chosenMove);
            }, 700);

            return;
        }
    }

    finishComputerTurn();
}

// Return control to the player.
function finishComputerTurn() {
    currentPlayer = playerColor;

    const playerMoves = getAllLegalMoves(playerColor);

    if (playerMoves.length === 0) {
        messageElement.textContent =
            "You have no available moves. The computer wins.";

        gameStarted = false;
        return;
    }

    messageElement.textContent =
        "Your turn. You are " + playerColor + ".";

    displayBoard();
}

// Return to the color selection screen.
function resetGame() {
    board = [];
    currentPlayer = "red";
    playerColor = null;
    computerColor = null;
    selectedPiece = null;
    gameStarted = false;

    boardElement.innerHTML = "";
    colorChoice.classList.remove("hidden");
    resetButton.style.display = "none";

    messageElement.textContent =
        "Choose red or black to begin.";
}

redButton.addEventListener("click", function () {
    startGame("red");
});

blackButton.addEventListener("click", function () {
    startGame("black");
});

resetButton.addEventListener("click", resetGame);
