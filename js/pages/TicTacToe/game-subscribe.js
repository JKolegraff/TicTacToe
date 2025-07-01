import { supabase } from '../../core/db.js'; // adjust path as needed
import { updateGame } from './game-logic.js'; // adjust path as needed

let gameChannel = null;

export function subscribeToGameUpdates(gameId) {
  // Unsubscribe from existing channel if already active
  if (gameChannel) {
    supabase.removeChannel(gameChannel);
  }

  gameChannel = supabase
    .channel(`game:${gameId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`
      },
      payload => {
        console.log('[Realtime] Game updated:', payload.new);
        updateGame(payload.new);
      }
    )
    .subscribe(status => {
      if (status === 'SUBSCRIBED') {
        console.log(`[Realtime] Subscribed to game ${gameId}`);
      }
    });
}

//Loads the game data from the database
export async function getGameData(gameId) {
    const { data: gameData, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

        updateGame(gameData);
}

// Updates the board_state and player_state in the database
export async function setGameData(gameId, boardState, playerState, nextTurn) {
    const { data, error } = await supabase
      .from('games')
      .update({
        board_state: boardState,
        player_state: playerState,
        turn: nextTurn
      })
      .eq('id', gameId);
  
    if (error) {
      console.error('❌ Failed to update game data:', error.message);
    } else {
      console.log('✅ Game data updated successfully');
    }
  }
  
