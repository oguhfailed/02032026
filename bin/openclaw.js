#!/usr/bin/env node
'use strict';

const args = process.argv.slice(2);

const HELP = `
Usage: openclaw [command] [options]

A command-line timer that counts up or down with
days / hours / minutes / seconds / milliseconds display.

Commands:
  start [duration]   Start a countdown timer (e.g. 1h30m, 90s, 2d)
                     Omit duration to start a stopwatch (count up)
  stop               Stop the running timer
  reset              Reset the timer to zero

Options:
  -h, --help         Show this help message
  -v, --version      Show version number

Examples:
  openclaw start          # stopwatch – counts up from 00:00:00.000
  openclaw start 5m       # countdown from 5 minutes
  openclaw start 1h30m    # countdown from 1 hour 30 minutes
  openclaw start 2d       # countdown from 2 days

Duration format:
  Use any combination of d (days), h (hours), m (minutes), s (seconds)
  e.g.  1d2h30m45s

`.trimStart();

const VERSION = require('../package.json').version;

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  process.stdout.write(HELP);
  process.exit(0);
}

if (args.includes('-v') || args.includes('--version')) {
  console.log(`openclaw v${VERSION}`);
  process.exit(0);
}

const [command, ...rest] = args;

switch (command) {
  case 'start':
    runTimer(rest[0] || null);
    break;
  case 'stop':
    console.log('No timer is currently running.');
    break;
  case 'reset':
    console.log('Timer reset.');
    break;
  default:
    console.error(`Unknown command: ${command}\nRun "openclaw --help" for usage.`);
    process.exit(1);
}

function parseDuration(str) {
  if (!str) return null;
  const re = /(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i;
  const m = str.match(re);
  if (!m || m[0] === '') return null;
  const [, d = 0, h = 0, min = 0, s = 0] = m;
  return (Number(d) * 86400 + Number(h) * 3600 + Number(min) * 60 + Number(s)) * 1000;
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const d  = Math.floor(totalSec / 86400);
  const h  = Math.floor((totalSec % 86400) / 3600);
  const mi = Math.floor((totalSec % 3600) / 60);
  const s  = totalSec % 60;
  const ms2 = ms % 1000;
  return [
    String(d).padStart(2, '0'),
    String(h).padStart(2, '0'),
    String(mi).padStart(2, '0'),
    String(s).padStart(2, '0'),
  ].join(':') + '.' + String(ms2).padStart(3, '0');
}

function runTimer(durationStr) {
  const totalMs = parseDuration(durationStr);
  const isCountdown = totalMs !== null;
  const start = Date.now();

  if (isCountdown) {
    console.log(`Starting countdown: ${durationStr}`);
  } else {
    console.log('Starting stopwatch. Press Ctrl+C to stop.');
  }

  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    const display = isCountdown
      ? Math.max(0, totalMs - elapsed)
      : elapsed;

    process.stdout.write('\r' + formatTime(display));

    if (isCountdown && elapsed >= totalMs) {
      clearInterval(interval);
      process.stdout.write('\n');
      console.log('Time\'s up!');
      process.exit(0);
    }
  }, 50);

  process.on('SIGINT', () => {
    clearInterval(interval);
    process.stdout.write('\n');
    console.log('Timer stopped.');
    process.exit(0);
  });
}
