import { getDisplayName } from './session-data.js';

export function changeDisplayName(elementName) {
    // Assuming user_data is defined and has a displayName property
    const playerNameSpan = document.getElementById(elementName);

    // Example: setting from user_data object
     playerNameSpan.textContent = getDisplayName();
     console.log('Display name updated:', getDisplayName());
}

export function setStatusText(text) {
    const el = document.getElementById('overlay-text');
    if (el) el.textContent = text;
  }
  
  export function disableBoard() {
    const overlay = document.getElementById('board-overlay');
    if (overlay) overlay.classList.remove('hidden');
  }
  
  export function enableBoard() {
    const overlay = document.getElementById('board-overlay');
    if (overlay) overlay.classList.add('hidden');
  }
  