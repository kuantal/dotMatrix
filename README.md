# Dot Matrix Display

A pure JavaScript library that simulates a full-screen LED dot-matrix display in the browser.  
Built on the Canvas API with no external dependencies.

Demo: [Dot Matrix](https://kuantal.github.io/dotMatrix/)

![dotmatrix](https://raw.githubusercontent.com/kuantal/dotMatrix/refs/heads/master/dotmatrix.JPG)

## Features

- Full-screen canvas that automatically adapts to window size (`resize` support)
- Messages loaded from `messages.txt` — unlimited entries
- **11 transition animation styles** — each message can specify its own
- **Per-message hold duration** (`duration=5` in seconds)
- **2% edge padding** — the dot grid is never clipped at the edges
- **Background stays perfectly static** during transitions — only the text layer animates
- **Inline color tags** — `[#rrggbb]text[/]`
- **Inline bold text** — `[bold]text[/bold]`
- **Automatic word-wrap** — breaks at spaces; `\n` forces an explicit line break
- Colors (active, passive, background) configurable globally and per-message
- Batch rendering with Path2D — high-performance draw calls
- Offscreen canvas background caching
- Turkish character support (Ü ü Ş ş İ i Ö ö Ç ç Ğ ğ)

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

Demo: [Dot Matrix](https://kuantal.github.io/dotMatrix/)

![dotmatrix](https://raw.githubusercontent.com/kuantal/dotMatrix/refs/heads/master/dotmatrix.JPG)

## Özellikler

- Tam ekran, pencere boyutuna otomatik uyum (`resize` desteği)
- Mesajlar `messages.txt` dosyasından yüklenir — sınırsız satır eklenebilir
- **11 animasyon geçiş stili** — her mesaj için ayrı stil tanımlanabilir
- **Per-mesaj ekranda kalma süresi** (`duration=5` saniye cinsinden)
- **Metinlerin kenarlarında %2 boşluk** — nokta ızgarası hiç kırpılmaz
- Geçişler sırasında **arka plan tamamen sabit kalır** — yalnızca metin katmanı animasyona girer
- **Satır içi renk desteği** — `[#rrggbb]metin[/]`
- **Satır içi kalın (bold) yazı** — `[bold]metin[/bold]`
- **Otomatik word-wrap** — boşluğa göre keser, `\n` ile zorla satır atılabilir
- Tüm renkler (aktif, pasif, arka plan) global ve per-mesaj düzeyinde ayarlanabilir
- Path2D ile toplu çizim — yüksek performanslı render
- Offscreen canvas ile arka plan önbellekleme
- Türkçe karakter desteği (Ü ü Ş ş İ i Ö ö Ç ç Ğ ğ)

## Kurulum ve Çalıştırma

```sh
git clone https://github.com/kuantal/dotMatrix.git
cd dotMatrix
npm start        # npx serve . — http://localhost:3000
```

> `messages.txt` dosyası `fetch()` ile yüklendiğinden **HTTP sunucusu gereklidir**.  
> `index.html`'i doğrudan `file://` protokolüyle açmak çalışmaz.

## Mesaj Dosyası — `messages.txt`

Her satır ayrı bir mesaj olarak gösterilir.  
`#` ile başlayan satırlar yorum, boş satırlar göz ardı edilir.

### Temel format

```
Mesaj metni
Mesaj metni | anahtar=deger | anahtar=deger
```

### Desteklenen anahtarlar

| Anahtar | Açıklama | Örnek |
|---|---|---|
| `transition` | Geçiş animasyonu (aşağıya bakın) | `transition=slideLeft` |
| `duration` | Ekranda kalma süresi (saniye) | `duration=5` |
| `active` | Yanan nokta rengi | `active=#ff6600` |
| `passive` | Sönen nokta rengi | `passive=#1a1a1a` |
| `bg` | Arka plan nokta ızgarası rengi | `bg=#141414` |
| `canvasBg` | Canvas dolgu rengi | `canvasBg=#0a0a0a` |

Belirtilmeyen değerler `dotMatrix.js`'teki global ayarlardan alınır.

### Satır içi biçimlendirme

Mesaj metninin herhangi bir yerine etiket eklenebilir:

| Etiket | Açıklama |
|---|---|
| `[#rrggbb]…[/]` | O bölümün aktif nokta rengini değiştirir |
| `[bold]…[/bold]` | O bölümü kalın (bold) yapar |
| `[bold #rrggbb]…[/]` | Bold + renk birlikte |
| `[/]` | Hem rengi hem bold'u sıfırlar |

### Satır atlama

`\n` ile mesaj içinde satır atlayabilirsiniz (`crlf: true` aktifken):

```
56Z \n MAHMUTBEY - MECİDİYEKÖY | transition=slideLeft
```

Boşluk karakterine göre otomatik word-wrap uygulanır; `\n` yoksa uzun metinler
`lineLetterCount` karaktere sığacak şekilde kelime sınırından kırılır.

### Örnek satırlar

```
# Basit mesaj
Merhaba Dunya!

# Per-mesaj geçiş ve süre
LED Display | transition=zoomIn | duration=6 | active=#00ff88

# Satır içi renk
[#ff0000]RED[/] WHITE [#0000ff]BLUE[/] | transition=fade

# Bold + renk
[bold #ffcc03]ÖNEMLİ DUYURU[/] \n Detaylar için bizi arayın | duration=8

# Çok satırlı
56Z \n [#00aaff]MAHMUTBEY[/] - [bold]MECİDİYEKÖY[/bold] | transition=slideLeft
```

## Konfigürasyon — `dotMatrix.js`

```js
const opts = {
    canvas            : document.getElementById('dotMatrix'),
    messagesFile      : './messages.txt',  // mesaj dosyasının yolu
    fps               : 0.4,              // varsayılan ekranda kalma süresi (0.4 → ~2.5 sn)
    transition        : 'fade',           // varsayılan geçiş stili
    transitionDuration: 800,              // geçiş animasyonu süresi (ms)
    colors: {
        active  : '#ffcc03',  // yanan nokta rengi
        passive : '#141414',  // sönen nokta rengi (arka planla aynı → görünmez)
        bg      : '#141414',  // arka plan nokta ızgarası rengi
        canvasBg: '#0a0a0a'   // canvas dolgu rengi
    },
    crlf           : true,   // true → \n ile satırlara böl
    lineLetterCount : 32,    // satır başı karakter sayısı (nokta boyutunu belirler)
    fill           : true    // arka plan nokta ızgarasını göster
};
```

> **`lineLetterCount`** değeri nokta boyutunu doğrudan belirler: büyük değer → küçük noktalar / daha fazla karakter; küçük değer → büyük noktalar / az karakter.

## Animasyon Stilleri

`transition` seçeneğine aşağıdaki isimlerden birini verin:

| Stil | Açıklama |
|---|---|
| `none` | Anlık geçiş |
| `fade` | Alfa karışımı (crossfade) |
| `slideLeft` | Sola kayarak çıkar, sağdan girer |
| `slideRight` | Sağa kayarak çıkar, soldan girer |
| `slideUp` | Yukarı kayarak çıkar, alttan girer |
| `slideDown` | Aşağı kayarak çıkar, üstten girer |
| `wipe` | Yatay wipe (sol → sağ) |
| `wipeDiag` | Diagonal wipe (sol-üst → sağ-alt) |
| `zoomIn` | Ortadan büyüyerek girer |
| `zoomOut` | Büyüyerek uzaklaşarak çıkar |
| `flipH` | Yatay flip efekti |

Geçişler sırasında arka plan (nokta ızgarası) tamamen sabit kalır; yalnızca metin katmanı hareket eder.

## Dosya Yapısı

```
dotMatrix/
├── index.html          — Tam ekran canvas sayfası
├── dotMatrix.js        — Giriş noktası: konfigürasyon + messages.txt yükleyici
├── messages.txt        — Gösterilecek mesajlar
├── package.json
└── moduls/
    ├── dotMatrix.js    — DotMatrix sınıfı (canvas, geçiş, resize yönetimi)
    ├── Sectence.js     — Satır/karakter yerleşimi, inline etiket parser, Path2D çizici
    ├── transitions.js  — 11 animasyon geçiş fonksiyonu
    ├── charset.js      — 5×9 piksel karakter seti (TR dahil)
    ├── drawLetter.js   — (eski — geriye dönük uyumluluk)
    ├── drawCircle.js   — (eski — geriye dönük uyumluluk)
    └── circle.js       — (eski — geriye dönük uyumluluk)
```

## Lisans

ISC
