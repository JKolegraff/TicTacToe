import { getPlayerImage } from './session-data.js';

//let inventory = {small: 4, medium: 3, large: 2 }; // one slot per cell, initialized as empty
let inventory = [{small: 4, medium: 3, large: 2 }, {small: 4, medium: 3, large: 2 }];

export function setInventory(newInventory) { inventory = newInventory; }
//export function setInventory(newInventory, player) {
//    let index = player === 'p1' ? 0 : 1;
 //   inventory[index] = newInventory;
//}

export function reduceInventory(player, size) {
    const playerIndex = player === 'p1' ? 0 : 1;
    if (inventory[playerIndex][size] > 0) {
        inventory[playerIndex][size]--;
    }
}

export function getInventory() { return inventory; }
//export function getInventory(player) {
//    let index = player === 'p1' ? 0 : 1;
//    return inventory[index];
//}

export function renderInventoryToScreen(player) {
    console.warn('my stuff:', player, inventory);

    if (!player) {
        console.warn('❗ No player specified for inventory rendering.');
        return;
    }

    const playerIndex = player === 'p1' ? 0 : 1;

    if (!inventory || !inventory[playerIndex]) {
        console.warn('❗ Invalid inventory state for player:', player, inventory);
        return;
    }

    const sizes = ['small', 'medium', 'large'];

    sizes.forEach(size => {
        // Update count text
        const countEl = document.getElementById(`count-${size}`);
        if (countEl) {
            countEl.textContent = inventory[playerIndex][size];
        }

        // ✅ Update piece image
        const imgEl = document.querySelector(`.piece-slot[data-size="${size}"] img`);
        if (imgEl) {
            imgEl.src = getPlayerImage();
        }

        // Show/hide overlay if out of pieces
        const overlay = document.getElementById(`inventory-overlay-${size}`);
        if (overlay) {
            overlay.classList.toggle('hidden', inventory[playerIndex][size] > 0);
        }
    });
}
