export function setStatusText(text) {
    const el = document.getElementById('status-text');
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
  