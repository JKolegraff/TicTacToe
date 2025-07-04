// canvas-control.js


//--------------------------------Phases--------------------------------//
// 📐 Distance from center to farthest corner
function getMaxRadius() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    return Math.sqrt(cx * cx + cy * cy);
  }
  
  // 🧭 Phase Configs
  let phases = [];

function buildPhases(colors) {
  phases = [
    {
      id: 1,
      start: () => 0,
      end: () => duration / 4,
      colorStart: colors[0],
      colorEnd: colors[1],
      radiusStart: getMaxRadius,
      radiusEnd: getMaxRadius,
      hzStart: 9,
      hzEnd: 6
    },
    {
      id: 2,
      start: () => duration / 4,
      end: () => duration,
      colorStart: colors[1],
      colorEnd: colors[2],
      radiusStart: getMaxRadius,
      radiusEnd: () => (canvas.width / 2) * (.5),
      hzStart: 6,
      hzEnd: 3.5
    },
    {
      id: 3,
      start: () => duration,
      end: () => duration / 2,
      colorStart: colors[2],
      colorEnd: '#000000',
      radiusStart: () => (canvas.width / 2) * (.5),
      radiusEnd: () => 0,
      hzStart: 3.5,
      hzEnd: 2
    }
  ];
}

  
  //-------------------------------Drawing Loop------------------------------//
const canvas = document.getElementById('meditationCanvas');
const ctx = canvas.getContext('2d');

// 🧠 State Variables
let duration = 0;
let startTime = 0;
let animationId = null;
let lastPulseToggle = 0;
let pulseVisible = true;

// 🎬 Start the meditation cycle
export function startCanvasMeditation(seconds, phaseColors) {
    duration = seconds;
    startTime = Date.now();
    pulseVisible = true;
    lastPulseToggle = 0;
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('fullscreen-canvas');
    canvas.style.display = 'block';
  
    buildPhases(phaseColors); // 👈 important
    animationId = requestAnimationFrame(drawLoop);
  }

// 🛑 Exit and hide canvas
export function exitCanvasMeditation() {
  if (animationId) cancelAnimationFrame(animationId);
  animationId = null;
  canvas.classList.remove('fullscreen-canvas');
  canvas.style.display = 'none';
}

// 🧼 Clears screen black (Phase 4)
function drawBlack() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}



//------------------------------Helpers------------------------------//
// 🔁 Linear interpolation
function lerp(start, end, t) {
    return start + (end - start) * t;
  }
  
  // 🔄 Converts Hz to milliseconds for pulse timing (on/off cycle)
  function hzToMs(hz) {
    return 1000 / (hz * 2);
  }
  
  // 🎨 Interpolate between two hex colors
  function interpolateColor(hex1, hex2, t) {
    const c1 = hexToRgb(hex1);
    const c2 = hexToRgb(hex2);
    const r = Math.round(lerp(c1.r, c2.r, t));
    const g = Math.round(lerp(c1.g, c2.g, t));
    const b = Math.round(lerp(c1.b, c2.b, t));
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }
  

  //-----------------------------Phase Getters-----------------------------//
  function getCurrentPhase(elapsedSec) {
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const phaseStart = phase.start();
      const phaseEnd = phase.end();
  
      const isLast = i === phases.length - 1;
  
      const isInPhase = (
        elapsedSec >= phaseStart &&
        (elapsedSec < phaseEnd || (isLast && elapsedSec <= phaseEnd))
      );
  
      if (isInPhase) return phase;
    }
    return null;
  }
  
  
  function getPhaseProgress(phase, elapsedSec) {
    const start = phase.start();
    const end = phase.end();
    return Math.min(1, Math.max(0, (elapsedSec - start) / (end - start)));
  }

  
  //------------------------------Draw Helpers------------------------------//
  function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  function drawCircle(baseRadius, baseColor, t = 0) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
  
    const radius = baseRadius;// * lerp(1.0, 0.95, t); // shrink slightly
    const color = baseColor; //interpolateColor(baseColor, '#000000', t); // fade to black
  
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  

  //--------------------------------------------Draw Loop--------------------------------------------//
  function drawLoop() {
    const now = Date.now();
    const elapsedSec = (now - startTime) / 1000;
  
    const phase = getCurrentPhase(elapsedSec);
  
    if (!phase) {
      drawBlack();
      return;
    }
  
    const t = getPhaseProgress(phase, elapsedSec);
  
    const color = interpolateColor(phase.colorStart, phase.colorEnd, t);
    const radius = lerp(phase.radiusStart(), phase.radiusEnd(), t);
    const hz = lerp(phase.hzStart, phase.hzEnd, t);
    const interval = hzToMs(hz);
  
    if (now - lastPulseToggle > interval) {
      pulseVisible = !pulseVisible;
      lastPulseToggle = now;
    }
  
    clearCanvas();
  
    if (pulseVisible) {
        const pulseProgress = ((now - lastPulseToggle) % interval) / interval;
        drawCircle(radius, color, pulseProgress);
      }
  
    animationId = requestAnimationFrame(drawLoop);
  }
  