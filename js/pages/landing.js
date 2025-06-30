import { supabase } from '../core/db.js';

//document.addEventListener('DOMContentLoaded', () => {
 // loadActiveGames();
 // document.getElementById('start-game-btn').addEventListener('click', startNewGame);
//});

export async function loadActiveGames() {
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
      <button onclick="joinGame('${game.id}')">Join</button>
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
      status: 'waiting',
      turn: 'p1',
      game_type: gameType // ✅ include this
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    alert('Failed to start a game.');
    return;
  }

  // Redirect to the game page with game ID
  // window.location.href = `game.html?game_id=${data.id}`;
  window.location.href = '../../ttt.html';
}


// 👇 Optional global if joinGame is needed by inline onclick
//window.joinGame = function(gameId) {
  //window.location.href = `game.html?game_id=${gameId}`;
//}
