# Performance history

Measured on every push to `main` by `.github/workflows/perf.yml`; this branch is written by CI only.
JS and CSS sizes are gzip. Timings are medians of 3 loads on a shared runner without a GPU, so watch their trend, not single values.

Latest: [`0a1b7f2`](https://github.com/AxelUser/maltsev.space/commit/0a1b7f234c0006abd16f4002eec8ef9274d92bc0) Feat: cuckoo filter note live cover (#30) (2026-11-18). 2 runs recorded.

## Latest

| Page | Device | Upfront JS | Total JS | Total JS vs [`69649a6`](https://github.com/AxelUser/maltsev.space/commit/69649a642adf9e85fa19759bfed421bfd278cee2) | LCP | Blocking time |
|---|---|--:|--:|--:|--:|--:|
| Home | desktop | 124.4 KB | 125.7 KB | +0.1 KB | 116 ms | 0 ms |
| Home | mobile | 124.4 KB | 125.7 KB | +0.1 KB | 160 ms | 26 ms |
| Blog index | desktop | 120.4 KB | 123.0 KB | +0.1 KB | 124 ms | 0 ms |
| Blog index | mobile | 120.4 KB | 123.0 KB | +0.1 KB | 320 ms | 20 ms |
| About | desktop | 118.3 KB | 124.3 KB | +0.1 KB | 120 ms | 0 ms |
| About | mobile | 118.3 KB | 124.3 KB | +0.1 KB | 152 ms | 11 ms |
| Misc | desktop | 117.4 KB | 124.0 KB | +0.1 KB | 100 ms | 54 ms |
| Misc | mobile | 117.4 KB | 124.0 KB | +0.1 KB | 316 ms | 494 ms |
| Misc collection | desktop | 116.4 KB | 123.0 KB | +0.1 KB | 112 ms | 53 ms |
| Misc collection | mobile | 116.4 KB | 123.0 KB | +0.1 KB | 116 ms | 418 ms |
| Post | desktop | 125.6 KB | 129.0 KB | +0.4 KB | 116 ms | 0 ms |
| Post | mobile | 125.6 KB | 129.0 KB | +0.4 KB | 312 ms | 18 ms |
| Post with live cover | desktop | 125.6 KB | 281.1 KB | +2.8 KB | 204 ms | 319 ms |
| Post with live cover | mobile | 125.6 KB | 138.8 KB | +0.3 KB | 796 ms | 180 ms |
| Post with diagrams | desktop | 125.6 KB | 311.0 KB | +0.3 KB | 104 ms | 0 ms |
| Post with diagrams | mobile | 125.6 KB | 311.0 KB | +0.3 KB | 364 ms | 306 ms |
| 404 | desktop | 26.3 KB | 226.4 KB | +0.3 KB | 96 ms | 0 ms |
| 404 | mobile | 26.3 KB | 226.4 KB | +0.3 KB | 236 ms | 32 ms |

## Trends (last 2 runs)

### Home

```mermaid
xychart-beta
  title "Home: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "KB" 0 --> 145
  line [125.6, 125.7]
```

```mermaid
xychart-beta
  title "Home: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "ms" 0 --> 32
  line [27, 26]
```

### Blog index

```mermaid
xychart-beta
  title "Blog index: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "KB" 0 --> 142
  line [123, 123]
```

```mermaid
xychart-beta
  title "Blog index: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "ms" 0 --> 44
  line [38, 20]
```

### About

```mermaid
xychart-beta
  title "About: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "KB" 0 --> 143
  line [124.2, 124.3]
```

```mermaid
xychart-beta
  title "About: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "ms" 0 --> 27
  line [23, 11]
```

### Misc

```mermaid
xychart-beta
  title "Misc: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "KB" 0 --> 143
  line [123.9, 124]
```

```mermaid
xychart-beta
  title "Misc: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "ms" 0 --> 569
  line [474, 494]
```

### Misc collection

```mermaid
xychart-beta
  title "Misc collection: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "KB" 0 --> 142
  line [122.9, 123]
```

```mermaid
xychart-beta
  title "Misc collection: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "ms" 0 --> 509
  line [442, 418]
```

### Post

```mermaid
xychart-beta
  title "Post: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "KB" 0 --> 149
  line [128.7, 129]
```

```mermaid
xychart-beta
  title "Post: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "ms" 0 --> 27
  line [23, 18]
```

### Post with live cover

```mermaid
xychart-beta
  title "Post with live cover: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "KB" 0 --> 324
  line [278.3, 281.1]
```

```mermaid
xychart-beta
  title "Post with live cover: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "ms" 0 --> 207
  line [170, 180]
```

### Post with diagrams

```mermaid
xychart-beta
  title "Post with diagrams: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "KB" 0 --> 358
  line [310.7, 311]
```

```mermaid
xychart-beta
  title "Post with diagrams: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "ms" 0 --> 444
  line [386, 306]
```

### 404

```mermaid
xychart-beta
  title "404: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "KB" 0 --> 261
  line [226.1, 226.4]
```

```mermaid
xychart-beta
  title "404: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2"]
  y-axis "ms" 0 --> 50
  line [43, 32]
```
