// ./js/pages/ttt/inventory-drag.js
import { handlePieceDrop } from './board.js';

let dragElement = null;

function updateDragPosition(e) {
  if (!dragElement) return;
  dragElement.style.left = `${e.clientX - dragElement.width / 2}px`;
  dragElement.style.top = `${e.clientY - dragElement.height / 2}px`;
}

function startDrag(e, setDragInfo) {
    const size = e.target.dataset.size;
    const src = e.target.getAttribute('src');
  
    // 🧠 Send drag state to board module
    const player = 'p1'; // Replace with actual player logic
    setDragInfo({ size, player });
    //console.log('Drag started:', { size, player });

    dragElement = document.createElement('img');
    dragElement.src = src;
  
    const originalWidth = e.target.offsetWidth;
    const originalHeight = e.target.offsetHeight;
    dragElement.style.width = `${originalWidth}px`;
    dragElement.style.height = `${originalHeight}px`;
  
    dragElement.className = `drag-preview ${size}`;
    dragElement.style.position = 'fixed';
    dragElement.style.pointerEvents = 'none';
    dragElement.style.zIndex = '9999';
    dragElement.style.opacity = '0.8';
    dragElement.style.visibility = 'hidden';
  
    document.body.appendChild(dragElement);
  
    dragElement.onload = () => {
      dragElement.style.visibility = 'visible';
      updateDragPosition(e);
    };
  }
  

function dragMove(e) {
  if (dragElement) {
    updateDragPosition(e);
  }
}

function endDrag() {
  if (dragElement) {
    dragElement.remove();
    dragElement = null;
  }
}

// 👇 Exposed setup function
export function InventoryDragSetup(setDragInfo, clearDragInfo) {
    document.querySelectorAll('.piece-slot img').forEach(img => {
      img.addEventListener('pointerdown', e => {
        startDrag(e, setDragInfo); // 👈 Pass it here
      });
    });
  
    document.addEventListener('pointerup', (e) => {
        if (dragElement) {
            const target = document.elementFromPoint(e.clientX, e.clientY);
            if (target && target.closest('.cell')) {
              const cell = target.closest('.cell');
              handlePieceDrop(cell); // ⬅️ This is a function in board.js
            }

      endDrag();
      clearDragInfo(); // 👈 Tell board no piece is being dragged anymore
        }
    });
  
    document.addEventListener('pointermove', dragMove);
  }
  

  export function updateInventoryDisplay(inventoryCount) {
    const sizes = ['small', 'medium', 'large'];
  
    sizes.forEach(size => {
      // Update count text
      const countEl = document.getElementById(`count-${size}`);
      if (countEl) {
        countEl.textContent = inventoryCount[size];
      }
  
      // Show/hide overlay if out of pieces
      const overlay = document.getElementById(`inventory-overlay-${size}`);
      if (overlay) {
        if (inventoryCount[size] <= 0) {
          overlay.classList.remove('hidden');
        } else {
          overlay.classList.add('hidden');
        }
      }
    });
  }
  