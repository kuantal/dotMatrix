'use strict';
import Sentence from './Sectence.js';
import { getTransition } from './transitions.js';

const CHAR_STEP_DOTS = 6;

class DotMatrix {
    constructor(config) {
        const defaults = {
            fps               : 1,
            transitionDuration: 800,
            transition        : 'fade',
            message           : 'Hello World',
            padding           : 0.02,   // fraction of canvas size kept empty on each edge
            colors: {
                active  : '#ffcc03',
                passive : '#1e1e1e',
                bg      : '#141414',
                canvasBg: '#0a0a0a'
            },
            crlf           : false,
            index          : 0,
            lineLetterCount: 16,
            fill           : true
        };

        this.options        = { ...defaults, ...config };
        this.options.colors = { ...defaults.colors, ...(config.colors || {}) };
        this.options.ctx    = this.options.canvas.getContext('2d');
        this._msgIndex      = this.options.index || 0;
        this._timerId       = null;
        this._sentence      = null;
        this._transitioning = false;

        this.init();
    }

    // ── Canvas setup ─────────────────────────────────────────────────────────

    setupCanvas() {
        const { canvas, colors, ctx, lineLetterCount, padding } = this.options;

        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        // Pixel padding on each edge (e.g. 0.02 → 2% of the shorter dimension)
        const pad = Math.round(Math.min(canvas.width, canvas.height) * padding);
        this.options.padX = pad;
        this.options.padY = pad;

        // dotSize derived from the available (inner) width
        const availW = canvas.width - 2 * pad;
        this.options.dotSize = availW / (lineLetterCount * CHAR_STEP_DOTS);

        ctx.fillStyle = colors.canvasBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this._sentence) this._sentence.invalidateBackground();
    }

    // ── Entry access ─────────────────────────────────────────────────────────

    getCurrentEntry() {
        const msg = this.options.message;
        const raw = Array.isArray(msg) ? msg[this._msgIndex % msg.length] : msg;
        if (typeof raw === 'string') return { text: raw };
        return raw;
    }

    _resolveColors(entry) {
        return entry.colors
            ? { ...this.options.colors, ...entry.colors }
            : null;
    }

    // ── Rendering ────────────────────────────────────────────────────────────

    _ensureSentence() {
        if (!this._sentence) {
            this._sentence = new Sentence(this.options);
        }
        return this._sentence;
    }

    draw(targetCtx) {
        const s      = this._ensureSentence();
        const entry  = this.getCurrentEntry();
        const ctx    = targetCtx || this.options.ctx;
        const colors = this._resolveColors(entry);
        s.renderTo(entry.text, ctx, colors);
    }

    // ── Transitions ──────────────────────────────────────────────────────────

    _makeOffscreen() {
        const { canvas } = this.options;
        const off = document.createElement('canvas');
        off.width  = canvas.width;
        off.height = canvas.height;
        return off;
    }

    // Transition between two text-only (transparent-background) canvases.
    // bgCanvas is drawn static every frame; only the text layer animates.
    _runTransition(fromText, toText, transitionName, bgCanvas) {
        const { ctx, canvas, transitionDuration } = this.options;
        const fn        = getTransition(transitionName);
        const startTime = performance.now();

        // Dedicated off-screen canvas for the text compositing
        const tmp    = this._makeOffscreen();
        const tmpCtx = tmp.getContext('2d');

        this._transitioning = true;

        const step = (now) => {
            const t = Math.min((now - startTime) / transitionDuration, 1);

            // 1) Static background — drawn every frame, never moves
            ctx.drawImage(bgCanvas, 0, 0);

            // 2) Run text transition on a fresh transparent overlay
            tmpCtx.clearRect(0, 0, canvas.width, canvas.height);
            fn(tmpCtx, fromText, toText, t);

            // 3) Composite text overlay onto main canvas
            ctx.drawImage(tmp, 0, 0);

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                this.draw();
                this._transitioning = false;
                this._scheduleNext();
            }
        };

        requestAnimationFrame(step);
    }

    _advanceMessage() {
        if (this._transitioning) return;

        const msg = this.options.message;
        if (!Array.isArray(msg) || msg.length <= 1) return;

        const s = this._ensureSentence();

        // Determine from / to entries.
        const fromEntry  = this.getCurrentEntry();
        const fromColors = this._resolveColors(fromEntry);

        const nextIndex = (this._msgIndex + 1) % msg.length;
        const rawNext   = msg[nextIndex];
        const toEntry   = typeof rawNext === 'string' ? { text: rawNext } : rawNext;
        const toColors  = this._resolveColors(toEntry);

        // Shared background: use the TO message's colors so the background
        // switches at the very start (imperceptible) and stays fixed throughout.
        const sharedBg = s.getBackground(toColors);

        // Build fromText = text-only canvas (transparent background).
        const fromText = this._makeOffscreen();
        const ffctx    = fromText.getContext('2d');
        s.renderTextOnly(fromEntry.text, ffctx, fromColors || this.options.colors);

        // Build toText = text-only canvas (transparent background).
        const toText = this._makeOffscreen();
        const tfctx  = toText.getContext('2d');
        s.renderTextOnly(toEntry.text, tfctx, toColors || this.options.colors);

        // Commit the index advance.
        this._msgIndex = nextIndex;

        const transitionName = toEntry.transition || this.options.transition;
        this._runTransition(fromText, toText, transitionName, sharedBg);
    }

    // ── Animation loop ───────────────────────────────────────────────────────

    // Returns hold duration (ms) for the CURRENT message entry.
    _holdMs() {
        const entry = this.getCurrentEntry();
        return entry.duration != null ? entry.duration : Math.round(1000 / this.options.fps);
    }

    _scheduleNext() {
        const msg = this.options.message;
        if (!Array.isArray(msg) || msg.length <= 1) return;
        this._timerId = setTimeout(() => this._advanceMessage(), this._holdMs());
    }

    startAnimation() {
        this.draw();
        this._scheduleNext();
    }

    stopAnimation() {
        if (this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }
    }

    // ── Resize ───────────────────────────────────────────────────────────────

    handleResize() {
        clearTimeout(this._resizeTimer);
        this._resizeTimer = setTimeout(() => {
            this.stopAnimation();
            this.setupCanvas();
            this.startAnimation();
        }, 150);
    }

    // ── Init ─────────────────────────────────────────────────────────────────

    init() {
        this.setupCanvas();
        window.addEventListener('resize', () => this.handleResize());
        this.startAnimation();
    }
}

export default DotMatrix;