import { supabase, getUserData } from '../../core/db.js'; // or wherever your client is
import { updateInventoryDisplay } from './inventory-drag.js';
import { disableBoard, enableBoard, setStatusText } from './ui.js'; // optional helpers
import { renderBoardFromState } from './board.js';

// You should define this in ttt.js or game-logic.js
let gameState = Array(9).fill(null); // one slot per cell, initialized as empty
let inventoryCount = { small: 4, medium: 3, large: 2 };
const PLAYER_NUM = {p1: 1, p2: 2};

export function updateGameBoard(index, dragState) {
  const { player, size } = dragState;

  // Save the move to gameState
  gameState[index] = {
    player,
    size
  };

  // 🔻 Reduce inventory count for the piece size
  if (inventoryCount[size] > 0) {
    inventoryCount[size]--;
  } else {
    console.warn(`Tried to use ${size}, but none left!`);
  }

  // 🔁 Update visible inventory UI
  updateInventoryDisplay(inventoryCount);

  // 🧠 Log game state for debugging
  console.log(`Updated cell ${index} with ${player} ${size}`);
  console.log(gameState);

  // 🏁 Check for win
  checkForWin(player);

  // 🔄 Switch turns
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
  
  async function switchTurns() {
    //currentPlayer = currentPlayer === 'p1' ? 'p2' : 'p1';
    // TODO: update UI, disable inventory for other player, etc.
    //export async function updateGameState(updatedBoard, updatedInventory, nextTurn) {
        const user = getUserData();
        const gameId = user.game_id;
      
        // First get current player_state from DB
        const { data: gameData, error: fetchError } = await supabase
          .from('games')
          .select('player_state, turn')
          .eq('id', gameId)
          .single();
      
        if (fetchError || !gameData) {
          console.error('Failed to fetch player_state:', fetchError);
          return;
        }
      
        const currentPlayerState = gameData.player_state || [{}, {}];
        const playerIndex = user.player === 'p1' ? 0 : 1;
      
        // Replace current player's inventory with updatedInventory
        const newPlayerState = [...currentPlayerState];
        newPlayerState[playerIndex] = inventoryCount;
      
        const nextTurn = gameData.turn === 'p1' ? 'p2' : 'p1';

        // Update row in Supabase
        const { error: updateError } = await supabase
          .from('games')
          .update({
            board_state: gameState,
            turn: nextTurn,
            player_state: newPlayerState
          })
          .eq('id', gameId);
      
        if (updateError) {
          console.error('Failed to update game state:', updateError);
        }
      //}
  }
  

//Loads the board state from the database and calls the provided render function
export async function loadBoardState(gameId, currPlayer, onBoardReady) {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single();

  if (error || !data?.board_state) {
    console.error('Failed to load board state:', error);
    return;
  }

  //let inventoryCount = data.player_state[PLAYER_NUM[currPlayer]];
  // Call the render function you pass in
  //updateInventoryDisplay(inventoryCount);
  const roleIndex = currPlayer === 'p1' ? 0 : 1;
    const inventory = data.player_state?.[roleIndex];
    updateInventoryDisplay(inventory);

  //onBoardReady(data.board_state);
  updateGame(data);
}


//import { getUserData } from '../core/db.js';
//import { renderBoardFromState } from './board.js'; // make sure this exists


export function updateGame(updatedGameData) {
  const { player1_id, player2_id, board_state, turn } = updatedGameData;
  const user = getUserData();

  // ✅ Wait until both players are connected
  if (!player1_id || !player2_id) {
    setStatusText('Waiting for opponents...');
    disableBoard();
    return;
  }

  const currentPlayerRole = user.player; // 'p1' or 'p2'

  if (turn === currentPlayerRole) {
    setStatusText('Your turn');
    enableBoard();
  } else {
    setStatusText("Opponent's turn");
    disableBoard();
  }

  // ✅ Update the visual board
  renderBoardFromState(board_state);
}
