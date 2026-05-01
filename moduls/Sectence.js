import charset from './charset.js';

const CHAR_W = 5;
const CHAR_H = 9;
const GAP_X  = 1;
const GAP_Y  = 1;
const STEP_X_DOTS = CHAR_W + GAP_X; // 6
const STEP_Y_DOTS = CHAR_H + GAP_Y; // 10

export default class Sentence {
    constructor(options) {
        this.options   = options;
        this._bgCanvas = null;  // cached background for default colors
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    invalidateBackground() {
        this._bgCanvas = null;
    }

    splitMessage(message, lineLetterCount, crlf) {
        if (!message) return [''];
        // If crlf is enabled, split on first; then word-wrap each segment
        const rawLines = crlf ? message.split('\n') : [message];
        const result = [];
        for (const raw of rawLines) {
            const words = raw.split(' ');
            let line = '';
            for (const word of words) {
                const candidate = line ? line + ' ' + word : word;
                if (candidate.length <= lineLetterCount) {
                    line = candidate;
                } else {
                    if (line) result.push(line);
                    // Word is too long to fit alone — hard-cut it
                    if (word.length > lineLetterCount) {
                        for (let i = 0; i < word.length; i += lineLetterCount) {
                            result.push(word.substring(i, i + lineLetterCount));
                        }
                        line = '';
                    } else {
                        line = word;
                    }
                }
            }
            if (line) result.push(line);
        }
        return result.length ? result : [''];
    }

    // ── Background builder ────────────────────────────────────────────────────

    _buildBg(colors) {
        const { canvas, dotSize, fill, padX = 0, padY = 0 } = this.options;
        const off = document.createElement('canvas');
        off.width  = canvas.width;
        off.height = canvas.height;
        const bctx = off.getContext('2d');

        bctx.fillStyle = colors.canvasBg;
        bctx.fillRect(0, 0, canvas.width, canvas.height);

        if (fill) {
            const r    = dotSize * 0.38;
            const path = new Path2D();
            // Grid starts at the padded edge so dots never enter the margin
            for (let gx = padX + dotSize / 2; gx < canvas.width  - padX; gx += dotSize) {
                for (let gy = padY + dotSize / 2; gy < canvas.height - padY; gy += dotSize) {
                    path.moveTo(gx + r, gy);
                    path.arc(gx, gy, r, 0, Math.PI * 2);
                }
            }
            bctx.fillStyle = colors.bg;
            bctx.fill(path);
        }
        return off;
    }

    // Returns the cached default background (rebuilds when canvas size changes).
    _defaultBg() {
        const { canvas } = this.options;
        if (!this._bgCanvas
                || this._bgCanvas.width  !== canvas.width
                || this._bgCanvas.height !== canvas.height) {
            this._bgCanvas = this._buildBg(this.options.colors);
        }
        return this._bgCanvas;
    }

    // Public: returns a background canvas for the given colors.
    // Used by DotMatrix to paint a static background behind text transitions.
    getBackground(colors) {
        if (!colors) return this._defaultBg();
        return this._buildBg(colors);
    }

    // ── Inline-color parser ───────────────────────────────────────────────────
    //
    //  Syntax: [#rrggbb]colored text[/]  — [/] resets to default active color
    //  Returns [{char, color}] where color===null means default active color.

    // ── Inline tag parser ───────────────────────────────────────────────────
    //
    //  Tags (case-insensitive parts, space-separated inside brackets):
    //    [bold]            — enable bold
    //    [/bold]           — disable bold
    //    [#rrggbb]         — set color
    //    [bold #rrggbb]    — bold + color together
    //    [/]               — reset color AND bold
    //
    //  Returns [{char, color, bold}] where color===null → default active color.

    _parseChars(message) {
        const result = [];
        let color = null;
        let bold  = false;
        let i = 0;
        while (i < message.length) {
            if (message[i] === '[') {
                const end = message.indexOf(']', i);
                if (end !== -1) {
                    const tag = message.slice(i + 1, end).trim();
                    if (tag === '/') {
                        color = null; bold = false;
                    } else if (tag === '/bold') {
                        bold = false;
                    } else {
                        const parts = tag.split(/\s+/);
                        let known = false;
                        for (const p of parts) {
                            if (p === 'bold')                         { bold  = true; known = true; }
                            else if (/^#[0-9a-fA-F]{3,8}$/.test(p)) { color = p;    known = true; }
                        }
                        // Unknown tag → treat as literal text
                        if (!known) { result.push({ char: message[i], color, bold }); i++; continue; }
                    }
                    i = end + 1;
                    continue;
                }
            }
            result.push({ char: message[i], color, bold });
            i++;
        }
        return result;
    }

    // Splits [{char,color}] into lines, respecting \n and word-wrap.
    _wordWrapColoredLines(chars, lineLetterCount, crlf) {
        // Split by \n (only when crlf, otherwise treat \n as space)
        const rawLines = [];
        let cur = [];
        for (const c of chars) {
            if (c.char === '\n' && crlf) {
                rawLines.push(cur);
                cur = [];
            } else if (c.char !== '\n') {
                cur.push(c);
            }
        }
        rawLines.push(cur);

        const result = [];
        for (const raw of rawLines) {
            // Split into word arrays (split on spaces, spaces discarded)
            const words = [];
            let wrd = [];
            for (const c of raw) {
                if (c.char === ' ') {
                    if (wrd.length) { words.push(wrd); wrd = []; }
                } else {
                    wrd.push(c);
                }
            }
            if (wrd.length) words.push(wrd);

            // Word-wrap
            let lineChars = [];
            for (const word of words) {
                if (lineChars.length === 0) {
                    lineChars = word.slice();
                } else if (lineChars.length + 1 + word.length <= lineLetterCount) {
                    lineChars.push({ char: ' ', color: null });
                    lineChars.push(...word);
                } else {
                    result.push(lineChars);
                    lineChars = word.slice();
                }
                // Hard-cut words longer than lineLetterCount
                while (lineChars.length > lineLetterCount) {
                    result.push(lineChars.slice(0, lineLetterCount));
                    lineChars = lineChars.slice(lineLetterCount);
                }
            }
            if (lineChars.length) result.push(lineChars);
            else if (raw.length === 0) result.push([]); // preserve empty \n line
        }
        return result.length ? result : [[]];
    }

    // ── Text-only renderer ────────────────────────────────────────────────────
    //
    //  Draws only active + passive dots (NO background fill) onto ctx.
    //  ctx should be a fresh transparent canvas — used for text-only transitions.
    //
    //  Inline colors ([#rrggbb]...[/]) affect active dots only; passive dots
    //  always use c.passive.

    _drawText(message, ctx, c) {
        const { canvas, dotSize, crlf, lineLetterCount, padX = 0, padY = 0 } = this.options;

        const stepX    = STEP_X_DOTS * dotSize;
        const stepY    = STEP_Y_DOTS * dotSize;
        const snap     = (val) => Math.round(val / dotSize) * dotSize;
        const r_normal = dotSize * 0.38;
        const r_bold   = dotSize * 0.48;  // slightly overlapping dots → thick look

        const areaW = canvas.width  - 2 * padX;
        const areaH = canvas.height - 2 * padY;

        const allChars = this._parseChars(message);
        const lines    = this._wordWrapColoredLines(allChars, lineLetterCount, crlf);

        const totalH  = lines.length * stepY;
        const originY = padY + snap((areaH - totalH) / 2);

        // activeGroups: Map<"color|b|n" → { path, color, r }>
        const activeGroups = new Map();
        const passivePath  = new Path2D();

        lines.forEach((lineChars, lineIdx) => {
            const lineW = lineChars.length * stepX;
            const lineX = padX + snap((areaW - lineW) / 2);
            const baseY = originY + lineIdx * stepY;

            lineChars.forEach((ch, charIdx) => {
                const map = charset[ch.char] || charset[' '];
                if (!map) return;
                const charX = lineX + charIdx * stepX;

                const key = `${ch.color || ''}|${ch.bold ? 'b' : 'n'}`;
                if (!activeGroups.has(key)) {
                    activeGroups.set(key, {
                        path  : new Path2D(),
                        color : ch.color,
                        r     : ch.bold ? r_bold : r_normal
                    });
                }
                const grp = activeGroups.get(key);

                map.forEach((row, rowIdx) => {
                    [...row].forEach((dot, colIdx) => {
                        if (colIdx >= CHAR_W) return;
                        const cx = charX + colIdx * dotSize + dotSize / 2;
                        const cy = baseY  + rowIdx  * dotSize + dotSize / 2;
                        if (dot === '.') {
                            grp.path.moveTo(cx + grp.r, cy);
                            grp.path.arc(cx, cy, grp.r, 0, Math.PI * 2);
                        } else {
                            passivePath.moveTo(cx + r_normal, cy);
                            passivePath.arc(cx, cy, r_normal, 0, Math.PI * 2);
                        }
                    });
                });
            });
        });

        // Passive dots (skip if same as bg — bg already covers them)
        if (c.passive !== c.bg) {
            ctx.fillStyle = c.passive;
            ctx.fill(passivePath);
        }
        // Active dots — one fill call per distinct (color, bold) group
        for (const { path, color } of activeGroups.values()) {
            ctx.fillStyle = color || c.active;
            ctx.fill(path);
        }
    }

    // Renders text only (no background) — for transition snapshots.
    renderTextOnly(message, ctx, colors) {
        this._drawText(message, ctx, colors || this.options.colors);
    }

    // Renders background + text (used for initial frame and after transition ends).
    renderTo(message, ctx, colors) {
        const c        = colors || this.options.colors;
        const bgCanvas = colors ? this._buildBg(c) : this._defaultBg();
        ctx.drawImage(bgCanvas, 0, 0);
        this._drawText(message, ctx, c);
    }

    // Convenience: renders to the main canvas context with default colors.
    render(message) {
        this.renderTo(message, this.options.ctx, null);
    }
}