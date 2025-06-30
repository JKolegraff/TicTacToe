import { getPlayerImage } from './session-data.js';

let inventory = {small: 4, medium: 3, large: 2 }; // one slot per cell, initialized as empty

export function setInventory(newInventory, player) {
    inventory = player === 'p1' ? newInventory[0] : newInventory[1];
}

export function getInventory() {
    return inventory;
}

export function renderInventoryToScreen() {
    if (!inventory) {
        console.warn('❗ updateInventoryDisplay called with invalid inventory:', inventory);
        return;
      }
    
      const sizes = ['small', 'medium', 'large'];
    
      sizes.forEach(size => {
        // Update count text
        const countEl = document.getElementById(`count-${size}`);
        if (countEl) {
          countEl.textContent = inventory[size];
        }
    
        // ✅ Update piece image
        const imgEl = document.querySelector(`.piece-slot[data-size="${size}"] img`);
        if (imgEl) {
            imgEl.src = getPlayerImage();
        }

        // Show/hide overlay if out of pieces
        const overlay = document.getElementById(`inventory-overlay-${size}`);
        if (overlay) {
          overlay.classList.toggle('hidden', inventory[size] > 0);
        }
      });
}