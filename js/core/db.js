// core/db.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://fjtxjjxrzejswsvrgkku.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqdHhqanhyemVqc3dzdnJna2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTg1NjksImV4cCI6MjA2Njc5NDU2OX0.7DSfSNQKlk8yVQ1TBFQv6MDBMfVvkENEuQVkzQt6TAE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// Create or get persistent session UUID for anonymous tracking
export function getUserData() {
  let userData = sessionStorage.getItem('user_data');

  if (userData) {
    return JSON.parse(userData);
  }

  const uuid = crypto.randomUUID();
  let displayName = '';

  // Prompt for name until they enter something
  while (!displayName) {
    displayName = prompt('Enter your display name:');
    if (displayName === null) break; // user pressed Cancel
  }

  const user = { uuid, displayName: displayName || 'Player' };
  sessionStorage.setItem('user_data', JSON.stringify(user));
  return user;
}


export function setGameId(gameId, playerNum) {
  const userData = getUserData(); // gets or creates user_data
  userData.game_id = gameId;
  userData.player = playerNum;
  sessionStorage.setItem('user_data', JSON.stringify(userData));
}


export function clearGameId() {
  const userData = getUserData();
  delete userData.game_id;
  delete userData.player;
  sessionStorage.setItem('user_data', JSON.stringify(userData));
}

export async function getGameTypeIfExists(gameId) {
  const { data, error } = await supabase
    .from('games')
    .select('game_type')
    .eq('id', gameId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.game_type;
}
