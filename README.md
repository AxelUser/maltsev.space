# Performance history

Measured on every push to `main` by `.github/workflows/perf.yml`; this branch is written by CI only.
JS and CSS sizes are gzip. Timings are medians of 3 loads on a shared runner without a GPU, so watch their trend, not single values.

Latest: [`69649a6`](https://github.com/AxelUser/maltsev.space/commit/69649a642adf9e85fa19759bfed421bfd278cee2) Feat: live covers (#29) (2026-11-17). 1 runs recorded.

## Latest

| Page | Device | Upfront JS | Total JS | Total JS vs [`69649a6`](https://github.com/AxelUser/maltsev.space/commit/69649a642adf9e85fa19759bfed421bfd278cee2) | LCP | Blocking time |
|---|---|--:|--:|--:|--:|--:|
| Home | desktop | 124.3 KB | 125.6 KB | ±0 | 156 ms | 0 ms |
| Home | mobile | 124.3 KB | 125.6 KB | ±0 | 200 ms | 27 ms |
| Blog index | desktop | 120.3 KB | 123.0 KB | ±0 | 140 ms | 0 ms |
| Blog index | mobile | 120.3 KB | 123.0 KB | ±0 | 368 ms | 38 ms |
| About | desktop | 118.2 KB | 124.2 KB | ±0 | 124 ms | 0 ms |
| About | mobile | 118.2 KB | 124.2 KB | ±0 | 176 ms | 23 ms |
| Misc | desktop | 117.3 KB | 123.9 KB | ±0 | 112 ms | 58 ms |
| Misc | mobile | 117.3 KB | 123.9 KB | ±0 | 320 ms | 474 ms |
| Misc collection | desktop | 116.4 KB | 122.9 KB | ±0 | 92 ms | 60 ms |
| Misc collection | mobile | 116.4 KB | 122.9 KB | ±0 | 112 ms | 442 ms |
| Post | desktop | 125.3 KB | 128.7 KB | ±0 | 148 ms | 0 ms |
| Post | mobile | 125.3 KB | 128.7 KB | ±0 | 164 ms | 23 ms |
| Post with live cover | desktop | 125.3 KB | 278.3 KB | ±0 | 232 ms | 318 ms |
| Post with live cover | mobile | 125.3 KB | 138.5 KB | ±0 | 608 ms | 170 ms |
| Post with diagrams | desktop | 125.3 KB | 310.7 KB | ±0 | 124 ms | 0 ms |
| Post with diagrams | mobile | 125.3 KB | 310.7 KB | ±0 | 216 ms | 386 ms |
| 404 | desktop | 26.3 KB | 226.1 KB | ±0 | 100 ms | 0 ms |
| 404 | mobile | 26.3 KB | 226.1 KB | ±0 | 268 ms | 43 ms |

## Trends (last 1 runs)

### Home

```mermaid
xychart-beta
  title "Home: total JS, desktop (KB gzip)"
  x-axis ["69649a6"]
  y-axis "KB" 0 --> 145
  line [125.6]
```

```mermaid
xychart-beta
  title "Home: blocking time, mobile (ms)"
  x-axis ["69649a6"]
  y-axis "ms" 0 --> 32
  line [27]
```

### Blog index

```mermaid
xychart-beta
  title "Blog index: total JS, desktop (KB gzip)"
  x-axis ["69649a6"]
  y-axis "KB" 0 --> 142
  line [123]
```

```mermaid
xychart-beta
  title "Blog index: blocking time, mobile (ms)"
  x-axis ["69649a6"]
  y-axis "ms" 0 --> 44
  line [38]
```

### About

```mermaid
xychart-beta
  title "About: total JS, desktop (KB gzip)"
  x-axis ["69649a6"]
  y-axis "KB" 0 --> 143
  line [124.2]
```

```mermaid
xychart-beta
  title "About: blocking time, mobile (ms)"
  x-axis ["69649a6"]
  y-axis "ms" 0 --> 27
  line [23]
```

### Misc

```mermaid
xychart-beta
  title "Misc: total JS, desktop (KB gzip)"
  x-axis ["69649a6"]
  y-axis "KB" 0 --> 143
  line [123.9]
```

```mermaid
xychart-beta
  title "Misc: blocking time, mobile (ms)"
  x-axis ["69649a6"]
  y-axis "ms" 0 --> 546
  line [474]
```

### Misc collection

```mermaid
xychart-beta
  title "Misc collection: total JS, desktop (KB gzip)"
  x-axis ["69649a6"]
  y-axis "KB" 0 --> 142
  line [122.9]
```

```mermaid
xychart-beta
  title "Misc collection: blocking time, mobile (ms)"
  x-axis ["69649a6"]
  y-axis "ms" 0 --> 509
  line [442]
```

### Post

```mermaid
xychart-beta
  title "Post: total JS, desktop (KB gzip)"
  x-axis ["69649a6"]
  y-axis "KB" 0 --> 149
  line [128.7]
```

```mermaid
xychart-beta
  title "Post: blocking time, mobile (ms)"
  x-axis ["69649a6"]
  y-axis "ms" 0 --> 27
  line [23]
```

### Post with live cover

```mermaid
xychart-beta
  title "Post with live cover: total JS, desktop (KB gzip)"
  x-axis ["69649a6"]
  y-axis "KB" 0 --> 321
  line [278.3]
```

```mermaid
xychart-beta
  title "Post with live cover: blocking time, mobile (ms)"
  x-axis ["69649a6"]
  y-axis "ms" 0 --> 196
  line [170]
```

### Post with diagrams

```mermaid
xychart-beta
  title "Post with diagrams: total JS, desktop (KB gzip)"
  x-axis ["69649a6"]
  y-axis "KB" 0 --> 358
  line [310.7]
```

```mermaid
xychart-beta
  title "Post with diagrams: blocking time, mobile (ms)"
  x-axis ["69649a6"]
  y-axis "ms" 0 --> 444
  line [386]
```

### 404

```mermaid
xychart-beta
  title "404: total JS, desktop (KB gzip)"
  x-axis ["69649a6"]
  y-axis "KB" 0 --> 261
  line [226.1]
```

```mermaid
xychart-beta
  title "404: blocking time, mobile (ms)"
  x-axis ["69649a6"]
  y-axis "ms" 0 --> 50
  line [43]
```
