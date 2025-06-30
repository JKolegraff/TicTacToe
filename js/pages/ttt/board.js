// ./js/pages/ttt/board.js
import { updateGameBoard } from './game-logic.js'; // Import your game logic function
let dragState = null; // Holds current dragging info: { size, player }

const SIZE_RANK = {
  small: 1,
  medium: 2,
  large: 3
};

function getCellTopPiece(cell) {
  //const imgDiv = cell.querySelector('.cell-img');
  const imgDiv = cell.querySelector('img');
  return {
    player: imgDiv.dataset.player || null,
    size: imgDiv.dataset.size || null
  };
}

function isMoveValid(cell, dragging) {
  const current = getCellTopPiece(cell);
  const currentRank = SIZE_RANK[current.size] || 0;
  const newRank = SIZE_RANK[dragging.size];

  console.log('Current cell:', current);
    console.log('Dragging piece:', dragging);
  // Must be bigger and not your own piece
  return (
    !current.size || // empty
    (newRank > currentRank && current.player !== dragging.player)
  );
}

function setHoverFeedback(cell, isValid) {
  cell.style.backgroundColor = isValid
    ? 'rgba(0, 255, 0, 0.4)' // green
    : 'rgba(255, 0, 0, 0.4)'; // red
}

function clearHover(cell) {
  cell.style.backgroundColor = '';
}

function handleCellEnter(e) {
  if (!dragState) return;
  const cell = e.currentTarget;
  const valid = isMoveValid(cell, dragState);
  setHoverFeedback(cell, valid);
  //console.log(`Cell ${cell.dataset.cellIndex} hover: ${valid ? 'valid' : 'invalid'}`);
}

function handleCellLeave(e) {
  clearHover(e.currentTarget);
}

export function BoardHoverSetup() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.addEventListener('mouseenter', handleCellEnter);
    cell.addEventListener('mouseleave', handleCellLeave);
  });
}

// 🔄 Call this during drag start to update current piece info
export function SetCurrentDragPiece(info) {
  // info = { size: 'small'|'medium'|'large', player: 'p1'|'p2' }
  dragState = info;
}

// 🔁 Optionally call on drag end to clear
export function ClearCurrentDragPiece() {
  dragState = null;
}

export function handlePieceDrop(cell) {
    if (!dragState) return;
  
    const isValid = isMoveValid(cell, dragState);
    if (!isValid) return; // optionally give feedback
  
    // 🔄 Update the visual cell
    const cellImg = cell.querySelector('.cell-img img');
cellImg.src = `./images/TTT_Red.png`;
cellImg.className = dragState.size; // set class to small, medium, or large
cellImg.dataset.player = dragState.player;
cellImg.dataset.size = dragState.size;
  
    // 📣 Update game logic
    const index = parseInt(cell.dataset.cellIndex);
    updateGameBoard(index, dragState); // <-- You can define this however you want
  }

  // Renders the board from the provided state array
export function renderBoardFromState(boardArray) {
    boardArray.forEach((cell, i) => {
      const cellEl = document.querySelector(`.cell[data-cell-index="${i}"]`);
      const img = cellEl.querySelector('img');
  
      if (cell) {
        img.src = `images/${cell.player}-piece-${cell.size}.png`;
        img.className = cell.size;
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