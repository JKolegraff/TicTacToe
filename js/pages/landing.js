import { supabase, setGameId } from '../core/db.js';
import { getUserData, getGameTypeIfExists } from '../core/db.js';

export async function checkAndResumeGame(user) {
  //const user = getUserData();

  if (user.game_id) {
    const gameType = await getGameTypeIfExists(user.game_id);

    if (gameType) {
      // Redirect based on game type
      switch (gameType) {
        case 'tic-tac-toe':
          window.location.href = '../TicTacToe.html';
          break;
        // Add other types here as needed
        default:
          alert(`Unsupported game type: ${gameType}`);
      }
    } else {
      console.log('Game not found or deleted');
    }
  }
}


export async function loadActiveGames(player_uuid) {
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'waiting') // or whatever your schema uses for joinable
    .order('created_at', { ascending: false });

  const gameList = document.getElementById('game-list');
  gameList.innerHTML = '';

  if (error || !games.length) {
    gameList.textContent = 'No games available to join.';
    return;
  }

  games.forEach(game => {
    const item = document.createElement('div');
    item.className = 'game-item';
    item.innerHTML = `
      <span>🎲 ${game.game_type}</span>
      <button onclick="joinGame('${player_uuid}', '${game.id}')">Join</button>
    `;
    gameList.appendChild(item);
  });
}

export async function startNewGame(user_uuid) {
  const gameType = document.getElementById('game-type-select').value;

  const { data, error } = await supabase
    .from('games')
    .insert([{
      player1_id: user_uuid, // ✅ match your table column name
      board_state: Array(9).fill(null),
      player_state: 0,
      status: 'waiting',
      turn: Math.random() < 0.5 ? 'p1' : 'p2',
      game_type: gameType, // ✅ include this
      player_state: [
        { small: 4, medium: 3, large: 2 }, // Player 1
        { small: 4, medium: 3, large: 2 }  // Player 2
      ]
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    alert('Failed to start a game.');
    return;
  }

  setGameId(data.id, 'p1');
  // Redirect to the game page with game ID
  // window.location.href = `game.html?game_id=${data.id}`;
  window.location.href = '../../TicTacToe.html';
}

export async function joinGame(user_uuid, gameId) {
  const { data, error } = await supabase
    .from('games')
    .update({
      player2_id: user_uuid,
      status: 'playing'
    })
    .eq('id', gameId)
    .is('player2_id', null) // prevent joining already-full games
    .select()
    .single();

  if (error || !data) {
    console.error('Supabase join error:', error);
    alert('Failed to join the game. It may already be full.');
    return;
  }

  setGameId(data.id, 'p2');
  window.location.href = '../../TicTacToe.html';
}

window.joinGame = joinGame;


// 👇 Optional global if joinGame is needed by inline onclick
//window.joinGame = function(gameId) {
  //window.location.href = `game.html?game_id=${gameId}`;
//}
