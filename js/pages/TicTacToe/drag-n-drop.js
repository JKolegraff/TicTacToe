import { getPlayer } from './session-data.js';
import { handlePieceDrop, handleCellLeave, handleCellEnter } from './board.js'; // Adjust path as needed

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
    const player = getPlayer(); // Replace with actual player logic
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
  

//function dragMove(e) {
//  if (dragElement) {
//    updateDragPosition(e);
//  }
//

let lastHoveredCell = null;

function dragMove(e) {
  if (dragElement) {
    updateDragPosition(e);

    // Hide drag image so we can detect the real cell underneath
    dragElement.style.display = 'none';
    const target = document.elementFromPoint(e.clientX, e.clientY);
    dragElement.style.display = 'block';

    const cell = target?.closest('.cell');

    if (cell !== lastHoveredCell) {
      if (lastHoveredCell) {
        handleCellLeave({ currentTarget: lastHoveredCell });
      }
      if (cell) {
        const cell = target.closest('.cell');
        if (cell) handleCellEnter({ currentTarget: cell });
      }
      lastHoveredCell = cell;
    }
  }
}


function endDrag() {
  if (dragElement) {
    dragElement.remove();
    dragElement = null;
  }
}

// 👇 Exposed setup function
export function DragNDropSetup(setDragInfo, clearDragInfo) {
    document.querySelectorAll('.piece-slot img').forEach(img => {
      img.addEventListener('pointerdown', e => {
        e.target.setPointerCapture(e.pointerId); // 👈 FIX: lock pointer to this element
        startDrag(e, setDragInfo); // 👈 Pass it here
      });
    });
  
    document.addEventListener('pointerup', (e) => {
        if (dragElement) {
          // ⬇️ Temporarily hide the preview image so it doesn't block detection
          //dragElement.style.display = 'none';
      
          const target = document.elementFromPoint(e.clientX, e.clientY);
      
          // ⬆️ Restore visibility right after detection
          //dragElement.style.display = 'block';
      
          if (target && target.closest('.cell')) {
            const cell = target.closest('.cell');
            handlePieceDrop(cell); // ⬅️ This is your drop logic
          }
      
          endDrag();
          clearDragInfo();
        }
      });
      
  
    document.addEventListener('pointermove', dragMove);
  }