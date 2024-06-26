self.onmessage = function(e) {
    const { gameBoard, player, size, difficulty } = e.data;
    console.log("Worker received:", { gameBoard, player, size, difficulty });
    const bestMove = getBestMove(gameBoard, player, size, difficulty);
    self.postMessage(bestMove);
};

function getBestMove(board, player, size, difficulty) {
    const emptyCells = [];
    
    // Collect all empty cell indices
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            emptyCells.push(i);
        }
    }

    if (difficulty === 'easy') {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    if (difficulty === 'medium') {
        if (Math.random() > 0.5) {
            return minimax(board, player, size, 3, -Infinity, Infinity).index; // limit depth to 3
        } else {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
    }

    return minimax(board, player, size, 5, -Infinity, Infinity).index; // limit depth to 5
}

function minimax(board, player, size, depth, alpha, beta) {
    const emptyCells = [];
    
    // Collect all empty cell indices
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            emptyCells.push(i);
        }
    }

    if (checkWin(board, 'O', size)) return { score: -10 };
    if (checkWin(board, 'X', size)) return { score: 10 };
    if (emptyCells.length === 0 || depth === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < emptyCells.length; i++) {
        const index = emptyCells[i];
        const move = {};
        move.index = index;
        board[index] = player;

        if (player === 'X') {
            const result = minimax(board, 'O', size, depth - 1, alpha, beta);
            move.score = result.score;
            alpha = Math.max(alpha, move.score);
        } else {
            const result = minimax(board, 'X', size, depth - 1, alpha, beta);
            move.score = result.score;
            beta = Math.min(beta, move.score);
        }

        board[index] = null;
        moves.push(move);

        if (beta <= alpha) {
            break;
        }
    }

    let bestMove;
    if (player === 'X') {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move.index;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move.index;
            }
        });
    }

    return { index: bestMove, score: player === 'X' ? alpha : beta };
}

function checkWin(board, player, size) {
    const winPatterns = [];

    // Rows
    for (let i = 0; i < size; i++) {
        winPatterns.push([...Array(size).keys()].map(j => i * size + j));
    }

    // Columns
    for (let i = 0; i < size; i++) {
        winPatterns.push([...Array(size).keys()].map(j => i + j * size));
    }

    // Diagonals
    winPatterns.push([...Array(size).keys()].map(i => i * (size + 1)));
    winPatterns.push([...Array(size).keys()].map(i => (i + 1) * (size - 1)));

    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}
