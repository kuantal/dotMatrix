'use strict';

// ── Easing ────────────────────────────────────────────────────────────────────

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ── Transition catalogue ─────────────────────────────────────────────────────
//
// Each function signature:
//   (ctx: CanvasRenderingContext2D, from: HTMLCanvasElement,
//    to: HTMLCanvasElement, t: number [0-1]) => void
//
// Available names (pass as the `transition` option):
//   none | fade | slideLeft | slideRight | slideUp | slideDown |
//   wipe | wipeDiag | zoomIn | zoomOut | flipH

export const TRANSITIONS = {

    // Instant switch at the midpoint — no animation
    none(ctx, from, to, t) {
        ctx.drawImage(t < 0.5 ? from : to, 0, 0);
    },

    // Alpha crossfade
    fade(ctx, from, to, t) {
        const e = easeInOut(t);
        ctx.globalAlpha = 1 - e;
        ctx.drawImage(from, 0, 0);
        ctx.globalAlpha = e;
        ctx.drawImage(to, 0, 0);
        ctx.globalAlpha = 1;
    },

    // Old slides out left, new enters from the right
    slideLeft(ctx, from, to, t) {
        const w = ctx.canvas.width;
        const e = easeInOut(t);
        ctx.drawImage(from, -w * e,       0);
        ctx.drawImage(to,    w * (1 - e), 0);
    },

    // Old slides out right, new enters from the left
    slideRight(ctx, from, to, t) {
        const w = ctx.canvas.width;
        const e = easeInOut(t);
        ctx.drawImage(from,  w * e,        0);
        ctx.drawImage(to,   -w * (1 - e),  0);
    },

    // Old slides out upward, new enters from the bottom
    slideUp(ctx, from, to, t) {
        const h = ctx.canvas.height;
        const e = easeInOut(t);
        ctx.drawImage(from, 0, -h * e);
        ctx.drawImage(to,   0,  h * (1 - e));
    },

    // Old slides out downward, new enters from the top
    slideDown(ctx, from, to, t) {
        const h = ctx.canvas.height;
        const e = easeInOut(t);
        ctx.drawImage(from, 0,  h * e);
        ctx.drawImage(to,   0, -h * (1 - e));
    },

    // Vertical wipe: new message revealed left → right
    wipe(ctx, from, to, t) {
        const { width: w, height: h } = ctx.canvas;
        const split = Math.round(w * easeInOut(t));
        // Old text fills the un-wiped (right) portion
        ctx.drawImage(from, 0, 0);
        if (split > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, split, h);
            ctx.clip();
            // Clear old text from the wipe zone so it doesn't bleed through
            ctx.clearRect(0, 0, split, h);
            ctx.drawImage(to, 0, 0);
            ctx.restore();
        }
    },

    // Diagonal wipe (top-left to bottom-right)
    wipeDiag(ctx, from, to, t) {
        const { width: w, height: h } = ctx.canvas;
        const e = easeInOut(t);
        ctx.drawImage(from, 0, 0);
        ctx.save();
        ctx.beginPath();
        const x = w * e * 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(x, 0);
        ctx.lineTo(x - h, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.clip();
        // Clear old text from the wipe zone before drawing new text
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(to, 0, 0);
        ctx.restore();
    },

    // New message zooms in from the centre while old fades out
    zoomIn(ctx, from, to, t) {
        const { width: w, height: h } = ctx.canvas;
        const e = easeInOut(t);
        ctx.globalAlpha = 1 - e;
        ctx.drawImage(from, 0, 0);
        ctx.globalAlpha = e;
        const scale = 0.4 + e * 0.6;
        const ox = w * (1 - scale) / 2;
        const oy = h * (1 - scale) / 2;
        ctx.drawImage(to, ox, oy, w * scale, h * scale);
        ctx.globalAlpha = 1;
    },

    // Old message zooms out while new fades in
    zoomOut(ctx, from, to, t) {
        const { width: w, height: h } = ctx.canvas;
        const e = easeInOut(t);
        // New text fades in
        ctx.globalAlpha = e;
        ctx.drawImage(to, 0, 0);
        // Old text zooms out + fades
        ctx.globalAlpha = 1 - e;
        const scale = 1 + e * 0.6;
        const ox = w * (1 - scale) / 2;
        const oy = h * (1 - scale) / 2;
        ctx.drawImage(from, ox, oy, w * scale, h * scale);
        ctx.globalAlpha = 1;
    },

    // Horizontal flip illusion: shrink old to centre, expand new from centre
    flipH(ctx, from, to, t) {
        const { width: w, height: h } = ctx.canvas;
        const e = easeInOut(t);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        if (e < 0.5) {
            // First half: shrink old horizontally
            const scaleX = 1 - e * 2;
            ctx.scale(scaleX, 1);
            ctx.drawImage(from, -w / 2, -h / 2);
        } else {
            // Second half: expand new horizontally
            const scaleX = (e - 0.5) * 2;
            ctx.scale(scaleX, 1);
            ctx.drawImage(to, -w / 2, -h / 2);
        }
        ctx.restore();
    },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns the transition function for the given name, falling back to 'fade'. */
export function getTransition(name) {
    return TRANSITIONS[name] || TRANSITIONS.fade;
}

/** All registered transition names — useful for UI pickers or logging. */
export const TRANSITION_NAMES = Object.keys(TRANSITIONS);
