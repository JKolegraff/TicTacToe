import { getUserData } from '../../core/db.js';

let game_id = null;
let player_id = null;
let player = null;
let player_name = null;
let player_image = null;
let other_player_image = null;

export function getSessionData() {
    const user_data = getUserData();
    game_id = user_data.game_id || null;
    player_id = user_data.uuid || null;
    player_name = user_data.displayName || 'Anonymouse';
    player = user_data.player || 'p1';

    player_image = player === 'p1' ? 'images/TTT_Red.png' : 'images/TTT_Green.png';
    other_player_image = player === 'p1' ? 'images/TTT_Green.png' : 'images/TTT_Red.png';
}

export function getGameId() { return game_id;}
export function getDisplayName() { return player_name;}
export function getPlayerId() { return player_id;}
export function getPlayer() { return player;}
export function getPlayerImage() { return player_image;}
export function getOtherPlayerImage() { return other_player_image;}