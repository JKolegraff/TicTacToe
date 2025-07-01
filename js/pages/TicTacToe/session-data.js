import { getUserData } from '../../core/db.js';

export function getGameId() { return getUserData().game_id;}
export function getDisplayName() { return getUserData().displayName;}
export function getPlayerId() { return getUserData().uuid;}
export function getPlayer() { return getUserData().player;}