import { getGameId } from './session-data.js';
import { supabase } from '../../core/db.js'; // adjust path if needed

export function setupGameControls() {
  const newGameBtn = document.getElementById('new-game-btn');
  const cancelGameBtn = document.getElementById('cancel-game-btn');

  if (newGameBtn) {
    newGameBtn.addEventListener('click', async () => {
      //window.location.href = 'index.html';
      const gameId = getGameId();

        const newBoard = Array(9).fill(null);
        const newPlayerState = [
            { small: 4, medium: 3, large: 2 },
            { small: 4, medium: 3, large: 2 }
        ];
        const newTurn = Math.random() < 0.5 ? 'p1' : 'p2';

        // Update Supabase
        const { error } = await supabase
        .from('games')
        .update({
            board_state: newBoard,
            player_state: newPlayerState,
            turn: newTurn
        })
        .eq('id', gameId);

        if (error) {
        console.error('❌ Failed to reset game:', error);
        alert('Could not reset the game. Try again.');
        }
    });
  }

  if (cancelGameBtn) {
    cancelGameBtn.addEventListener('click', async () => {
      const confirmCancel = confirm('Are you sure you want to cancel this game?');
      if (confirmCancel) {
        const gameId = getGameId();
        if (gameId) {
          await supabase.from('games').delete().eq('id', gameId);
        }
        sessionStorage.removeItem('game_id');
        window.location.href = 'index.html';
      }
    });
  }
}
