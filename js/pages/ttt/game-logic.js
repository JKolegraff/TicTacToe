// You should define this in ttt.js or game-logic.js
const gameState = Array(9).fill(null); // one slot per cell, initialized as empty

export function updateGameBoard(index, dragState) {
  const { player, size } = dragState;

  // Save the move to gameState
  gameState[index] = {
    player,
    size
  };

  // Optional: log game state for debugging
  console.log(`Updated cell ${index} with ${player} ${size}`);
  console.log(gameState);

  // Optional: check win conditions
  checkForWin(player);

  // Optional: switch turns
  switchTurns();
}


function checkForWin(player) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
  
    const occupied = gameState
      .map((slot, i) => (slot?.player === player ? i : -1))
      .filter(i => i >= 0);
  
    for (const pattern of winPatterns) {
      if (pattern.every(i => occupied.includes(i))) {
        console.log(`${player} wins!`);
        // TODO: show victory UI
      }
    }
  }
  
  function switchTurns() {
    currentPlayer = currentPlayer === 'p1' ? 'p2' : 'p1';
    // TODO: update UI, disable inventory for other player, etc.
  }
  