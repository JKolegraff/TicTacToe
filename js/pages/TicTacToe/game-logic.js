import { getPlayer } from './session-data.js';
import { setGameBoard, renderBoardToScreen } from './board.js';
import { setInventory, renderInventoryToScreen } from './inventory.js';
import { disableBoard, enableBoard } from './ui.js';

export async function updateGame(data) {
    setGameBoard(data.board_state);
    renderBoardToScreen();

    let thisPlayer = getPlayer();
    console.log('Current player:', thisPlayer);

    thisPlayer === data.turn ? enableBoard() : disableBoard();

    setInventory(data.player_state, thisPlayer);
    renderInventoryToScreen();
    console.log('Game updated:', data);
}