const board = document.getElementById('game-board');

export function renderBoard() {
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
  

export function changeDisplayName(elementName, user_data) {
    // Assuming user_data is defined and has a displayName property
    const playerNameSpan = document.getElementById(elementName);

    // Example: setting from user_data object
    if (user_data && user_data.displayName) {
        playerNameSpan.textContent = user_data.displayName;
    } else {
        playerNameSpan.textContent = 'Anonymous Player';
    }
}