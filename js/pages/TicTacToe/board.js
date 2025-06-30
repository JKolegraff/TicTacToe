let gameBoard = Array(9).fill(null); // one slot per cell, initialized as empty

export function setGameBoard(newBoard) {
    gameBoard = newBoard;
}

export function getGameBoard() {
    return gameBoard;
}

export function buildBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; // clear existing
  
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.cellIndex = i;
  
      const cellImgWrapper = document.createElement('div');
      cellImgWrapper.className = 'cell-img';
  
      const cellImg = document.createElement('img');
      cellImg.src = ''; // starts empty
      cellImg.alt = ''; // optional
      cellImg.className = ''; // will be set when a piece is placed
      cellImg.dataset.player = '';
      cellImg.dataset.size = '';
  
      cellImgWrapper.appendChild(cellImg);
      cell.appendChild(cellImgWrapper);
      board.appendChild(cell);
    }
}

export function renderBoardToScreen() {
    gameBoard.forEach((cell, i) => {
        const cellEl = document.querySelector(`.cell[data-cell-index="${i}"]`);
        const img = cellEl.querySelector('img');
    
        if (cell) {
          // Determine correct image based on player
          const pieceImage = cell.player === 'p1' ? 'TTT_Red.png' : 'TTT_Green.png';
    
          img.src = `images/${pieceImage}`;
          img.className = cell.size; // small, medium, large
          img.dataset.player = cell.player;
          img.dataset.size = cell.size;
        } else {
          img.src = '';
          img.className = '';
          img.dataset.player = '';
          img.dataset.size = '';
        }
      });
}