import { startCanvasMeditation, exitCanvasMeditation } from './canvas-control.js';

export function pageSetup() {
    const startBtn = document.getElementById('startBtn');
    const durationSelect = document.getElementById('duration');
    const canvas = document.getElementById('meditationCanvas');
  
    startBtn.addEventListener('click', () => {
      const duration = parseInt(durationSelect.value, 10);
      const color1 = document.getElementById('colorPhase1').value;
      const color2 = document.getElementById('colorPhase2').value;
      const color3 = document.getElementById('colorPhase3').value;
  
      startCanvasMeditation(duration, [color1, color2, color3]);
    });
  
    canvas.addEventListener('click', () => {
      exitCanvasMeditation();
    });
  }
