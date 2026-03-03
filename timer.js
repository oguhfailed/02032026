'use strict';

let adjective  = "blazing";
let noun       = "cheetah";
let verb       = "sprints";
let place      = "savanna";
let adjective2 = "endless";
let noun2      = "horizon";
let firstStory = `The ${adjective} ${noun} ${verb} across the ${place} toward the ${adjective2} ${noun2}.`;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const elDays   = document.getElementById('days');
const elHours  = document.getElementById('hours');
const elMins   = document.getElementById('minutes');
const elSecs   = document.getElementById('seconds');
const elMs     = document.getElementById('milliseconds');

const btnStart = document.getElementById('btn-start');
const btnLap   = document.getElementById('btn-lap');
const btnReset = document.getElementById('btn-reset');

const lapsSection = document.getElementById('laps-section');
const lapsList    = document.getElementById('laps-list');
const display     = document.querySelector('.display');

// ── State ─────────────────────────────────────────────────────────────────────
let startTime   = 0;   // performance.now() snapshot at last start/resume
let accumulated = 0;   // total elapsed ms before latest start/resume
let rafId       = null;
let running     = false;
let lapStart    = 0;   // elapsed ms at the last lap
let lapTimes    = [];  // array of { total, split } in ms

// ── Helpers ───────────────────────────────────────────────────────────────────
function pad(n, digits = 2) {
  return String(Math.floor(n)).padStart(digits, '0');
}

function formatTime(ms) {
  const totalMs   = Math.floor(ms);
  const millisecs = totalMs % 1000;
  const totalSecs = Math.floor(totalMs / 1000);
  const seconds   = totalSecs % 60;
  const totalMins = Math.floor(totalSecs / 60);
  const minutes   = totalMins % 60;
  const totalHrs  = Math.floor(totalMins / 60);
  const hours     = totalHrs % 24;
  const days      = Math.floor(totalHrs / 24);

  return { days, hours, minutes, seconds, millisecs };
}

function renderTime(ms) {
  const { days, hours, minutes, seconds, millisecs } = formatTime(ms);
  elDays.textContent  = pad(days);
  elHours.textContent = pad(hours);
  elMins.textContent  = pad(minutes);
  elSecs.textContent  = pad(seconds);
  elMs.textContent    = pad(millisecs, 3);
}

function elapsed() {
  return accumulated + (performance.now() - startTime);
}

// ── Render loop ───────────────────────────────────────────────────────────────
function tick() {
  renderTime(elapsed());
  rafId = requestAnimationFrame(tick);
}

// ── Lap helpers ───────────────────────────────────────────────────────────────
function lapTimeString(ms) {
  const { days, hours, minutes, seconds, millisecs } = formatTime(ms);
  let s = '';
  if (days)  s += `${pad(days)}d `;
  if (days || hours) s += `${pad(hours)}:`;
  s += `${pad(minutes)}:${pad(seconds)}.${pad(millisecs, 3)}`;
  return s;
}

function findBestWorst() {
  if (lapTimes.length < 2) return { best: -1, worst: -1 };
  let best = 0, worst = 0;
  for (let i = 1; i < lapTimes.length; i++) {
    if (lapTimes[i].split < lapTimes[best].split) best  = i;
    if (lapTimes[i].split > lapTimes[worst].split) worst = i;
  }
  return { best, worst };
}

function rebuildLaps() {
  const { best, worst } = findBestWorst();
  lapsList.innerHTML = '';

  for (let i = 0; i < lapTimes.length; i++) {
    const { total, split } = lapTimes[i];
    const li = document.createElement('li');
    li.className = 'lap-item';
    if (lapTimes.length > 1) {
      if (i === best)  li.classList.add('best');
      if (i === worst) li.classList.add('worst');
    }

    li.innerHTML = `
      <span class="lap-num">Lap ${i + 1}</span>
      <span class="lap-time">${lapTimeString(total)}</span>
      <span class="lap-split">+${lapTimeString(split)}</span>
    `;
    lapsList.prepend(li);
  }
}

// ── Button handlers ───────────────────────────────────────────────────────────
btnStart.addEventListener('click', () => {
  if (!running) {
    startTime = performance.now();
    running   = true;
    rafId     = requestAnimationFrame(tick);
    display.classList.add('running');
    btnStart.textContent   = 'Stop';
    btnStart.classList.replace('btn-primary', 'btn-danger');
    btnLap.disabled        = false;
    btnReset.disabled      = true;
  } else {
    accumulated = elapsed();
    cancelAnimationFrame(rafId);
    rafId   = null;
    running = false;
    display.classList.remove('running');
    btnStart.textContent   = 'Resume';
    btnStart.classList.replace('btn-danger', 'btn-primary');
    btnLap.disabled        = true;
    btnReset.disabled      = false;
  }
});

btnLap.addEventListener('click', () => {
  if (!running) return;
  const now   = elapsed();
  const split = now - lapStart;
  lapTimes.push({ total: now, split });
  lapStart = now;
  rebuildLaps();
  lapsSection.classList.add('visible');
});

btnReset.addEventListener('click', () => {
  cancelAnimationFrame(rafId);
  rafId        = null;
  accumulated  = 0;
  startTime    = 0;
  lapStart     = 0;
  lapTimes     = [];
  running      = false;

  renderTime(0);
  lapsList.innerHTML = '';
  lapsSection.classList.remove('visible');
  display.classList.remove('running');

  btnStart.textContent  = 'Start';
  btnStart.classList.replace('btn-danger', 'btn-primary');
  btnLap.disabled       = true;
  btnReset.disabled     = true;
});

// ── Keyboard shortcuts ────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      btnStart.click();
      break;
    case 'KeyL':
      if (!btnLap.disabled) btnLap.click();
      break;
    case 'KeyR':
      if (!btnReset.disabled) btnReset.click();
      break;
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderTime(0);
