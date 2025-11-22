const board = document.getElementById('board');
const currentPlayerDisplay = document.getElementById('current-player');
const blackScoreDisplay = document.getElementById('black-score');
const whiteScoreDisplay = document.getElementById('white-score');
const levelSelect = document.getElementById('level');
const startGameButton = document.getElementById('start-game');
const setupDiv = document.getElementById('setup');
const gameDiv = document.getElementById('game');

let boardState = Array(8).fill().map(() => Array(8).fill(null));
let currentPlayer = 'black';
let aiLevel = 1;
let isAiThinking = false;

startGameButton.addEventListener('click', () => {
    aiLevel = parseInt(levelSelect.value);
    setupDiv.style.display = 'none';
    gameDiv.style.display = 'block';
    initBoard();
});

function initBoard() {
    boardState = Array(8).fill().map(() => Array(8).fill(null));
    // Place initial pieces
    boardState[3][3] = 'white';
    boardState[3][4] = 'black';
    boardState[4][3] = 'black';
    boardState[4][4] = 'white';

    currentPlayer = 'black';
    currentPlayerDisplay.textContent = 'Svart';

    renderBoard();
    updateScores();
}

function renderBoard() {
    board.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            if (currentPlayer === 'black' && boardState[row][col] === null && canPlace(row, col, 'black') && !isAiThinking) {
                cell.classList.add('valid');
            }
            if (!isAiThinking) {
                cell.addEventListener('click', () => makeMove(row, col));
            }
            if (boardState[row][col]) {
                const piece = document.createElement('div');
                piece.classList.add('piece', boardState[row][col]);
                cell.appendChild(piece);
            }
            board.appendChild(cell);
        }
    }
}

function makeMove(row, col) {
    if (boardState[row][col] !== null) return;

    const validMoves = getValidMoves(currentPlayer);
    if (!validMoves.some(move => move.row === row && move.col === col)) return;

    // Place piece
    boardState[row][col] = currentPlayer;

    // Flip pieces
    flipPieces(row, col, currentPlayer);

    // Switch player
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    currentPlayerDisplay.textContent = currentPlayer === 'black' ? 'Svart' : 'AI';

    renderBoard();
    updateScores();

    // If it's AI's turn, make AI move
    if (currentPlayer === 'white') {
        isAiThinking = true;
        renderBoard(); // Update to disable clicks
        aiMove();
    } else {
        // Check for game over or pass
        const nextValidMoves = getValidMoves(currentPlayer);
        if (nextValidMoves.length === 0) {
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            currentPlayerDisplay.textContent = currentPlayer === 'black' ? 'Svart' : 'AI';
            if (getValidMoves(currentPlayer).length === 0) {
                alert(getWinner());
            } else {
                renderBoard();
            }
        }
    }
}

function getValidMoves(player) {
    const validMoves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (boardState[row][col] === null && canPlace(row, col, player)) {
                validMoves.push({ row, col });
            }
        }
    }
    return validMoves;
}

function canPlace(row, col, player) {
    const opponent = player === 'black' ? 'white' : 'black';
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        let hasOpponent = false;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (boardState[r][c] === opponent) {
                hasOpponent = true;
            } else if (boardState[r][c] === player) {
                if (hasOpponent) return true;
                break;
            } else {
                break;
            }
            r += dr;
            c += dc;
        }
    }
    return false;
}

function flipPieces(row, col, player) {
    const opponent = player === 'black' ? 'white' : 'black';
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        const toFlip = [];
        while (r >= 0 && r < 8 && c >= 0 && c < 8 && boardState[r][c] === opponent) {
            toFlip.push([r, c]);
            r += dr;
            c += dc;
        }
        if (r >= 0 && r < 8 && c >= 0 && c < 8 && boardState[r][c] === player && toFlip.length > 0) {
            toFlip.forEach(([fr, fc]) => boardState[fr][fc] = player);
        }
    }
}

function getWinner() {
    let black = 0;
    let white = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (boardState[row][col] === 'black') black++;
            else if (boardState[row][col] === 'white') white++;
        }
    }
    if (black > white) return 'Svart vann!';
    if (white > black) return 'Vit vann!';
    return 'Oavgjort!';
}

function updateScores() {
    let black = 0;
    let white = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (boardState[row][col] === 'black') black++;
            else if (boardState[row][col] === 'white') white++;
        }
    }
    blackScoreDisplay.textContent = black;
    whiteScoreDisplay.textContent = white;
}

function aiMove() {
    const validMoves = getValidMoves(currentPlayer);
    if (validMoves.length === 0) {
        // Pass turn
        currentPlayer = 'black';
        currentPlayerDisplay.textContent = 'Svart';
        isAiThinking = false;
        const humanValidMoves = getValidMoves('black');
        if (humanValidMoves.length === 0) {
            alert(getWinner());
        } else {
            renderBoard();
        }
        return;
    }

    let move;
    if (aiLevel === 1) {
        // Random move
        move = validMoves[Math.floor(Math.random() * validMoves.length)];
    } else if (aiLevel === 2) {
        // Strategic move: choose highest heuristic value
        move = validMoves.reduce((best, current) => {
            const bestScore = getHeuristicScore(best.row, best.col);
            const currentScore = getHeuristicScore(current.row, current.col);
            return currentScore > bestScore ? current : best;
        });
    } else if (aiLevel === 3) {
        // Advanced: minimax depth 1
        move = validMoves.reduce((best, current) => {
            const bestBoard = simulateMove(boardState, best, currentPlayer);
            const bestScore = minimax(bestBoard, 1, false);
            const currentBoard = simulateMove(boardState, current, currentPlayer);
            const currentScore = minimax(currentBoard, 1, false);
            return currentScore > bestScore ? current : best;
        });
    }

    const { row, col } = move;

    // Place piece
    boardState[row][col] = currentPlayer;

    // Flip pieces
    flipPieces(row, col, currentPlayer);

    // Switch to human
    currentPlayer = 'black';
    currentPlayerDisplay.textContent = 'Svart';
    isAiThinking = false;

    renderBoard();
    updateScores();

    // Check if human can move
    const humanValidMoves = getValidMoves('black');
    if (humanValidMoves.length === 0) {
        // AI's turn again
        currentPlayer = 'white';
        currentPlayerDisplay.textContent = 'AI';
        isAiThinking = true;
        renderBoard();
        aiMove();
    }
}

function getHeuristicScore(row, col) {
    // Simple heuristic: corners are good, edges next to corners are bad
    const cornerBonus = 10;
    const badEdgePenalty = -5;
    let score = 0;

    if ((row === 0 || row === 7) && (col === 0 || col === 7)) {
        score += cornerBonus;
    } else if ((row === 0 || row === 7 || col === 0 || col === 7) &&
               !((row === 0 || row === 7) && (col === 0 || col === 7))) {
        // Edge but not corner
        if ((row === 0 && col === 1) || (row === 0 && col === 6) ||
            (row === 7 && col === 1) || (row === 7 && col === 6) ||
            (col === 0 && row === 1) || (col === 0 && row === 6) ||
            (col === 7 && row === 1) || (col === 7 && row === 6)) {
            score += badEdgePenalty;
        }
    }

    return score;
}

function deepCopyBoard(board) {
    return board.map(row => row.slice());
}

function getValidMovesForBoard(board, player) {
    const validMoves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === null && canPlaceForBoard(board, row, col, player)) {
                validMoves.push({ row, col });
            }
        }
    }
    return validMoves;
}

function canPlaceForBoard(board, row, col, player) {
    const opponent = player === 'black' ? 'white' : 'black';
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        let hasOpponent = false;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (board[r][c] === opponent) {
                hasOpponent = true;
            } else if (board[r][c] === player) {
                if (hasOpponent) return true;
                break;
            } else {
                break;
            }
            r += dr;
            c += dc;
        }
    }
    return false;
}

function simulateMove(board, move, player) {
    const newBoard = deepCopyBoard(board);
    const { row, col } = move;
    newBoard[row][col] = player;
    flipPiecesForBoard(newBoard, row, col, player);
    return newBoard;
}

function flipPiecesForBoard(board, row, col, player) {
    const opponent = player === 'black' ? 'white' : 'black';
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        const toFlip = [];
        while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
            toFlip.push([r, c]);
            r += dr;
            c += dc;
        }
        if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === player && toFlip.length > 0) {
            toFlip.forEach(([fr, fc]) => board[fr][fc] = player);
        }
    }
}

function evaluateBoard(board) {
    let score = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === 'white') {
                score += 1 + getHeuristicScore(row, col);
            } else if (board[row][col] === 'black') {
                score -= 1 + getHeuristicScore(row, col);
            }
        }
    }
    // Mobility
    const whiteMoves = getValidMovesForBoard(board, 'white').length;
    const blackMoves = getValidMovesForBoard(board, 'black').length;
    score += whiteMoves - blackMoves;
    return score;
}

function minimax(board, depth, maximizing) {
    if (depth === 0) return evaluateBoard(board);
    const player = maximizing ? 'white' : 'black';
    const validMoves = getValidMovesForBoard(board, player);
    if (validMoves.length === 0) return evaluateBoard(board);
    if (maximizing) {
        let maxEval = -Infinity;
        for (const move of validMoves) {
            const newBoard = simulateMove(board, move, player);
            const eval = minimax(newBoard, depth - 1, false);
            maxEval = Math.max(maxEval, eval);
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of validMoves) {
            const newBoard = simulateMove(board, move, player);
            const eval = minimax(newBoard, depth - 1, true);
            minEval = Math.min(minEval, eval);
        }
        return minEval;
    }
}

// Auto start removed to allow level selection
