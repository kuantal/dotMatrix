# 🟡 Dot Matrix Display

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black)
![Canvas API](https://img.shields.io/badge/Canvas-API-orange?logo=html5&logoColor=white)
![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)

A pure JavaScript library that simulates a full-screen **LED dot-matrix display** in the browser.  
Built on the Canvas API with **no external dependencies**.

**[▶ Live Demo](https://kuantal.github.io/dotMatrix/)**

</div>

![dotmatrix](https://raw.githubusercontent.com/kuantal/dotMatrix/refs/heads/master/dotmatrix.JPG)

---

## ✨ Features

| | Feature |
|---|---|
| 🖥️ | Full-screen canvas — automatically adapts to window size (`resize` support) |
| 📄 | Messages loaded from `messages.txt` — unlimited entries |
| 🎬 | **11 transition animation styles** — each message can specify its own |
| ⏱️ | **Per-message hold duration** (`duration=5` in seconds) |
| 📐 | **2% edge padding** — the dot grid is never clipped at the edges |
| 🔒 | **Background stays perfectly static** during transitions — only the text layer animates |
| 🎨 | **Inline color tags** — `[#rrggbb]text[/]` |
| **B** | **Inline bold text** — `[bold]text[/bold]` |
| 📝 | **Automatic word-wrap** — breaks at spaces; `\n` forces an explicit line break |
| 🎛️ | Colors (active, passive, background) configurable globally and per-message |
| ⚡ | Batch rendering with Path2D — high-performance draw calls |
| 💾 | Offscreen canvas background caching |
| 🇹🇷 | Turkish character support (Ü ü Ş ş İ i Ö ö Ç ç Ğ ğ) |

---

## 🚀 Setup & Running

```sh
git clone https://github.com/kuantal/dotMatrix.git
cd dotMatrix
npm start        # npx serve . — http://localhost:3000
```

> ⚠️ `messages.txt` is loaded via `fetch()`, so an **HTTP server is required**.  
> Opening `index.html` directly with the `file://` protocol will not work.

---

## 💬 Message File — `messages.txt`

Each line is displayed as a separate message.  
Lines starting with `#` are comments; blank lines are ignored.

### Basic format

```
Message text
Message text | key=value | key=value
```

### 🔑 Supported keys

| Key | Description | Example |
|---|---|---|
| `transition` | Transition animation (see table below) | `transition=slideLeft` |
| `duration` | Time to stay on screen (seconds) | `duration=5` |
| `active` | Lit dot color | `active=#ff6600` |
| `passive` | Unlit dot color | `passive=#1a1a1a` |
| `bg` | Background dot grid color | `bg=#141414` |
| `canvasBg` | Canvas fill color | `canvasBg=#0a0a0a` |

Values not specified fall back to the global defaults in `dotMatrix.js`.

### 🏷️ Inline formatting

Tags can be placed anywhere inside the message text:

| Tag | Description |
|---|---|
| `[#rrggbb]…[/]` | 🎨 Changes the active dot color for that span |
| `[bold]…[/bold]` | **B** Renders that span in bold |
| `[bold #rrggbb]…[/]` | 🎨**B** Bold and color together |
| `[/]` | ↩️ Resets both color and bold |

### ↵ Line breaks

Use `\n` inside a message to force a line break (`crlf: true` must be set):

```
56Z \n MAHMUTBEY - MECIDIYEKOY | transition=slideLeft
```

Without `\n`, long messages are automatically word-wrapped at `lineLetterCount` characters, breaking at word boundaries.

### 📋 Example entries

```
# Simple message
Hello World!

# Per-message transition and duration
LED Display | transition=zoomIn | duration=6 | active=#00ff88

# Inline color
[#ff0000]RED[/] WHITE [#0000ff]BLUE[/] | transition=fade

# Bold + color
[bold #ffcc03]IMPORTANT[/] \n Call us for details | duration=8

# Multi-line with mixed styles
56Z \n [#00aaff]MAHMUTBEY[/] - [bold]MECIDIYEKOY[/bold] | transition=slideLeft
```

---

## ⚙️ Configuration — `dotMatrix.js`

```js
const opts = {
    canvas            : document.getElementById('dotMatrix'),
    messagesFile      : './messages.txt',  // path to message file
    fps               : 0.4,              // default hold time (0.4 → ~2.5 s); overridable with duration=5
    transition        : 'fade',           // default transition style
    transitionDuration: 800,              // transition animation duration (ms)
    colors: {
        active  : '#ffcc03',  // lit dot color
        passive : '#141414',  // unlit dot color (matches bg — invisible)
        bg      : '#141414',  // background dot grid color
        canvasBg: '#0a0a0a'   // canvas fill color
    },
    crlf           : true,   // true → split lines on \n
    lineLetterCount : 16,    // characters per line (determines dot size)
    fill            : true   // show background dot grid
};
```

> 💡 **`lineLetterCount`** directly controls dot size: higher value → smaller dots / more characters per line; lower value → larger dots / fewer characters.

---

## 🎬 Transition Styles

Pass one of the following names to the `transition` option:

| Style | Description |
|---|---|
| `none` | ⚡ Instant switch |
| `fade` | 🌫️ Alpha crossfade |
| `slideLeft` | ⬅️ Old slides out left, new enters from the right |
| `slideRight` | ➡️ Old slides out right, new enters from the left |
| `slideUp` | ⬆️ Old slides out upward, new enters from the bottom |
| `slideDown` | ⬇️ Old slides out downward, new enters from the top |
| `wipe` | 🪟 Horizontal wipe (left → right) |
| `wipeDiag` | ↗️ Diagonal wipe (top-left → bottom-right) |
| `zoomIn` | 🔍 New message zooms in from the centre |
| `zoomOut` | 🔎 Old message zooms out while new fades in |
| `flipH` | 🔄 Horizontal flip illusion |

> 🔒 The background dot grid remains completely static during all transitions; only the text layer moves.

---

## 📁 File Structure

```
dotMatrix/
├── 📄 index.html          — Full-screen canvas page
├── ⚙️  dotMatrix.js        — Entry point: configuration + messages.txt loader
├── 💬 messages.txt        — Messages to display
├── 📦 package.json
└── 📂 moduls/
    ├── dotMatrix.js    — DotMatrix class (canvas, transitions, resize)
    ├── Sectence.js     — Layout, inline tag parser, Path2D renderer
    ├── transitions.js  — 11 transition animation functions
    ├── charset.js      — 5×9 pixel character set (incl. Turkish)
    ├── drawLetter.js   — (legacy — kept for backwards compatibility)
    ├── drawCircle.js   — (legacy — kept for backwards compatibility)
    └── circle.js       — (legacy — kept for backwards compatibility)
```

---

## 📄 License

**ISC** © [kuantal](https://github.com/kuantal)


## Setup & Running

```sh
git clone https://github.com/kuantal/dotMatrix.git
cd dotMatrix
npm start        # npx serve . — http://localhost:3000
```

> `messages.txt` is loaded via `fetch()`, so an **HTTP server is required**.  
> Opening `index.html` directly with the `file://` protocol will not work.

## Message File — `messages.txt`

Each line is displayed as a separate message.  
Lines starting with `#` are comments; blank lines are ignored.

### Basic format

```
Message text
Message text | key=value | key=value
```

### Supported keys

| Key | Description | Example |
|---|---|---|
| `transition` | Transition animation (see table below) | `transition=slideLeft` |
| `duration` | Time to stay on screen (seconds) | `duration=5` |
| `active` | Lit dot color | `active=#ff6600` |
| `passive` | Unlit dot color | `passive=#1a1a1a` |
| `bg` | Background dot grid color | `bg=#141414` |
| `canvasBg` | Canvas fill color | `canvasBg=#0a0a0a` |

Values not specified fall back to the global defaults in `dotMatrix.js`.

### Inline formatting

Tags can be placed anywhere inside the message text:

| Tag | Description |
|---|---|
| `[#rrggbb]…[/]` | Changes the active dot color for that span |
| `[bold]…[/bold]` | Renders that span in bold |
| `[bold #rrggbb]…[/]` | Bold and color together |
| `[/]` | Resets both color and bold |

### Line breaks

Use `\n` inside a message to force a line break (`crlf: true` must be set):

```
56Z \n MAHMUTBEY - MECIDIYEKOY | transition=slideLeft
```

Without `\n`, long messages are automatically word-wrapped at `lineLetterCount` characters, breaking at word boundaries.

### Example entries

```
# Simple message
Hello World!

# Per-message transition and duration
LED Display | transition=zoomIn | duration=6 | active=#00ff88

# Inline color
[#ff0000]RED[/] WHITE [#0000ff]BLUE[/] | transition=fade

# Bold + color
[bold #ffcc03]IMPORTANT[/] \n Call us for details | duration=8

# Multi-line with mixed styles
56Z \n [#00aaff]MAHMUTBEY[/] - [bold]MECIDIYEKOY[/bold] | transition=slideLeft
```

## Configuration — `dotMatrix.js`

```js
const opts = {
    canvas            : document.getElementById('dotMatrix'),
    messagesFile      : './messages.txt',  // path to message file
    fps               : 0.4,              // default hold time (0.4 → ~2.5 s); overridable with duration=5
    transition        : 'fade',           // default transition style
    transitionDuration: 800,              // transition animation duration (ms)
    colors: {
        active  : '#ffcc03',  // lit dot color
        passive : '#141414',  // unlit dot color (matches bg — invisible)
        bg      : '#141414',  // background dot grid color
        canvasBg: '#0a0a0a'   // canvas fill color
    },
    crlf           : true,   // true → split lines on \n
    lineLetterCount : 16,    // characters per line (determines dot size)
    fill            : true   // show background dot grid
};
```

> **`lineLetterCount`** directly controls dot size: higher value → smaller dots / more characters per line; lower value → larger dots / fewer characters.

## Transition Styles

Pass one of the following names to the `transition` option:

| Style | Description |
|---|---|
| `none` | Instant switch |
| `fade` | Alpha crossfade |
| `slideLeft` | Old slides out left, new enters from the right |
| `slideRight` | Old slides out right, new enters from the left |
| `slideUp` | Old slides out upward, new enters from the bottom |
| `slideDown` | Old slides out downward, new enters from the top |
| `wipe` | Horizontal wipe (left → right) |
| `wipeDiag` | Diagonal wipe (top-left → bottom-right) |
| `zoomIn` | New message zooms in from the centre |
| `zoomOut` | Old message zooms out while new fades in |
| `flipH` | Horizontal flip illusion |

The background dot grid remains completely static during all transitions; only the text layer moves.

## File Structure

```
dotMatrix/
├── index.html          — Full-screen canvas page
├── dotMatrix.js        — Entry point: configuration + messages.txt loader
├── messages.txt        — Messages to display
├── package.json
└── moduls/
    ├── dotMatrix.js    — DotMatrix class (canvas, transitions, resize)
    ├── Sectence.js     — Layout, inline tag parser, Path2D renderer
    ├── transitions.js  — 11 transition animation functions
    ├── charset.js      — 5×9 pixel character set (incl. Turkish)
    ├── drawLetter.js   — (legacy — kept for backwards compatibility)
    ├── drawCircle.js   — (legacy — kept for backwards compatibility)
    └── circle.js       — (legacy — kept for backwards compatibility)
```

## License

ISC
