import DotMatrix from './moduls/dotMatrix.js';

// ── Configuration — global defaults ──────────────────────────────────────────
//
// Per-message overrides are specified in messages.txt using | delimiters.
// Transition options:
//   none | fade | slideLeft | slideRight | slideUp | slideDown |
//   wipe | wipeDiag | zoomIn | zoomOut | flipH

const opts = {
    canvas            : document.getElementById('dotMatrix'),
    messagesFile      : './messages.txt',
    fps               : 0.4,        // default hold time per message (0.4 fps → ~2.5 s); overridable with duration=5 in messages.txt
    transition        : 'fade',     // default transition style
    transitionDuration: 800,        // transition animation duration (ms)
    colors: {
        active    : '#ffcc03',      // lit dot color
        passive   : '#141414',      // unlit dot color (matches background — invisible)
        bg        : '#141414',      // background dot grid color
        canvasBg  : '#0a0a0a'       // canvas fill color
    },
    crlf            : true,         // true: split lines on \n
    lineLetterCount : 16,           // characters per line (determines dot size)
    fill            : true          // show background dot grid
};

// ── Message line parser ───────────────────────────────────────────────────────
//
// Format:  Message text | key=value | key=value
// Example: Hello! | transition=zoomIn | active=#ff3300
//
// Supported keys: transition, duration, active, passive, bg, canvasBg
//   duration=5  → this message stays on screen for 5 seconds (otherwise global fps is used)

function parseMessage(line) {
    const parts = line.split('|').map(p => p.trim());
    const entry = { text: parts[0].replace(/\\n/g, '\n') };

    for (let i = 1; i < parts.length; i++) {
        const eqIdx = parts[i].indexOf('=');
        if (eqIdx < 0) continue;
        const key = parts[i].slice(0, eqIdx).trim();
        const val = parts[i].slice(eqIdx + 1).trim();

        if (key === 'transition') {
            entry.transition = val;
        } else if (key === 'duration') {
            entry.duration = parseFloat(val) * 1000;  // seconds → ms
        } else if (['active', 'passive', 'bg', 'canvasBg'].includes(key)) {
            entry.colors = entry.colors || {};
            entry.colors[key] = val;
        }
    }

    return entry;
}

// ── messages.txt loader ───────────────────────────────────────────────────────

async function loadMessages(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        const entries = text
            .split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0 && !l.startsWith('#'))
            .map(parseMessage);
        if (entries.length === 0) throw new Error('Empty file');
        return entries;
    } catch (err) {
        console.warn('Could not load messages.txt:', err.message, '— using fallback messages.');
        return [
            { text: 'Hello World' },
            { text: 'Dot Matrix', transition: 'slideLeft' },
            { text: 'LED Display', transition: 'zoomIn', colors: { active: '#00ff88' } }
        ];
    }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

(async () => {
    opts.message  = await loadMessages(opts.messagesFile);
    window.matrix = new DotMatrix(opts);
})();