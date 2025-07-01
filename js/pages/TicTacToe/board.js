import { getGameId, getPlayer } from './session-data.js';
import { getInventory, reduceInventory } from './inventory.js';
import { setGameData } from './game-subscribe.js';

let gameBoard = Array(9).fill(null); // one slot per cell, initialized as empty

export function setGameBoard(newBoard) {
    gameBoard = newBoard;
}

// ✅ NEW: Update one piece on the board
export function updateGamePiece(index, state) {
    gameBoard[index] = state;
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


// ./js/pages/ttt/board.js
//import { updateGameBoard } from './game-logic.js'; // Import your game logic function
let dragState = null; // Holds current dragging info: { size, player }

const SIZE_RANK = {
  small: 1,
  medium: 2,
  large: 3
};

function getCellTopPiece(cell) {
    if (!(cell instanceof HTMLElement)) {
      console.warn('Invalid cell passed to getCellTopPiece:', cell);
      return { player: null, size: null };
    }
  
    const img = cell.querySelector('img');
    return {
      player: img?.dataset?.player || null,
      size: img?.dataset?.size || null
    };
  }

  function isMoveValid(cell, dragging) {
    if (!dragging?.size || !dragging?.player) return false;
  
    const current = getCellTopPiece(cell);
    const currentRank = SIZE_RANK[current.size] || 0;
    const newRank = SIZE_RANK[dragging.size] || 0;
  
    console.log('[Move Check]', {
      cellIndex: cell.dataset.cellIndex,
      cell: current,
      dragging,
      currentRank,
      newRank
    });
  
    // Valid if: cell is empty OR we're placing a bigger piece over opponent's
    return (
      !current.size ||
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

export function handleCellEnter(eOrCell) {
    if (!dragState) return;
  
    // Support both manual call (element) and event object
    const cell = eOrCell.currentTarget || eOrCell;
    if (!cell) return;
  
    const valid = isMoveValid(cell, dragState);
    setHoverFeedback(cell, valid);
  }

  export function handleCellLeave(eOrCell) {
    const cell = eOrCell.currentTarget || eOrCell;
    if (!cell) return;
  
    clearHover(cell);
  }

export function BoardHoverSetup() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.addEventListener('pointerenter', handleCellEnter);
    cell.addEventListener('pointerleave', handleCellLeave);
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
  
    handleCellLeave(cell);

    const isValid = isMoveValid(cell, dragState);
    if (!isValid) return; // optionally give feedback
  
    // 📣 Update game logic
    const index = parseInt(cell.dataset.cellIndex);
    updateGamePiece(index, dragState); // <-- You can define this however you want

    reduceInventory(getPlayer(), dragState.size);

    let nextTurn = getPlayer() === 'p1' ? 'p2' : 'p1';
    setGameData(getGameId(), gameBoard, getInventory(), nextTurn);
  }
