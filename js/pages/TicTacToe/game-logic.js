import { getPlayer } from './session-data.js';
import { setGameBoard, renderBoardToScreen } from './board.js';
import { setInventory, renderInventoryToScreen } from './inventory.js';
import { disableBoard, enableBoard, setStatusText } from './ui.js';

export async function updateGame(data) {
    setGameBoard(data.board_state);
    renderBoardToScreen();

    let thisPlayer = getPlayer();
    console.log('Current player:', thisPlayer);

    // ✅ Check for a winner
    const winner = checkForWin(data.board_state);

    if (winner) {
        setStatusText(winner === thisPlayer ? 'You win!' : 'You lose!');
        disableBoard();
    } else {
        (thisPlayer === data.turn) ? enableBoard() : disableBoard();
    }

    setInventory(data.player_state);
    renderInventoryToScreen(getPlayer());
    console.log('Game updated:', data);
}

export function checkForWin(gameState) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
  
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const slotA = gameState[a];
      const slotB = gameState[b];
      const slotC = gameState[c];
  
      if (
        slotA && slotB && slotC && // all three slots must be filled
        slotA.player === slotB.player &&
        slotA.player === slotC.player
      ) {
        return slotA.player; // 'p1' or 'p2'
      }
    }
  
    return null; // no winner yet
  }
  