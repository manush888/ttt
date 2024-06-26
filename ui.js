// ui.js

const boardElement = document.getElementById('board');

function setCellDimensions(size) {
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    const gap = 5; // 5px gap
    const maxCellSizeWidth = (maxWidth - gap * (size - 1)) / size;
    const maxCellSizeHeight = (maxHeight - gap * (size - 1)) / size;
    const cellSize = Math.min(maxCellSizeWidth, maxCellSizeHeight);
    
    boardElement.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    boardElement.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`;
    boardElement.style.gap = `${gap}px`;
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.fontSize = `${cellSize / 3}px`; // Adjust font size based on cell size
    });
}

window.addEventListener('resize', () => {
    const size = parseInt(document.getElementById('board-size').value);
    setCellDimensions(size);
});

function createBoardUI(size) {
    boardElement.innerHTML = '';

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        boardElement.appendChild(cell);
    }

    setCellDimensions(size);
}
