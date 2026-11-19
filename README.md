# Performance history

Measured on every push to `main` by `.github/workflows/perf.yml`; this branch is written by CI only.
JS and CSS sizes are gzip. Timings are medians of 3 loads on a shared runner without a GPU, so watch their trend, not single values.

Latest: [`29f4656`](https://github.com/AxelUser/maltsev.space/commit/29f46563c92b2f5f24a07c565d9602744f964138) feat: post sidebar with navigation for whole index (#32) (2026-11-19). 5 runs recorded.

## Latest

| Page | Device | Upfront JS | Total JS | Total JS vs [`69649a6`](https://github.com/AxelUser/maltsev.space/commit/69649a642adf9e85fa19759bfed421bfd278cee2) | LCP | Blocking time |
|---|---|--:|--:|--:|--:|--:|
| Home | desktop | 123.7 KB | 124.7 KB | −0.9 KB | 140 ms | 0 ms |
| Home | mobile | 123.7 KB | 124.7 KB | −0.9 KB | 164 ms | 23 ms |
| Blog index | desktop | 119.7 KB | 122.1 KB | −0.9 KB | 124 ms | 0 ms |
| Blog index | mobile | 119.7 KB | 122.1 KB | −0.9 KB | 348 ms | 33 ms |
| About | desktop | 118.0 KB | 123.9 KB | −0.3 KB | 120 ms | 0 ms |
| About | mobile | 118.0 KB | 123.9 KB | −0.3 KB | 164 ms | 20 ms |
| Misc | desktop | 117.1 KB | 123.5 KB | −0.3 KB | 100 ms | 56 ms |
| Misc | mobile | 117.1 KB | 123.5 KB | −0.3 KB | 312 ms | 455 ms |
| Misc collection | desktop | 116.2 KB | 122.6 KB | −0.3 KB | 96 ms | 55 ms |
| Misc collection | mobile | 116.2 KB | 122.6 KB | −0.3 KB | 116 ms | 445 ms |
| Post | desktop | 125.6 KB | 128.7 KB | ±0 | 136 ms | 0 ms |
| Post | mobile | 125.6 KB | 128.7 KB | ±0 | 156 ms | 29 ms |
| Post with live cover | desktop | 125.6 KB | 283.9 KB | +5.6 KB | 124 ms | 327 ms |
| Post with live cover | mobile | 125.6 KB | 141.7 KB | +3.2 KB | 656 ms | 179 ms |
| Post with diagrams | desktop | 125.6 KB | 140.8 KB | −169.8 KB | 128 ms | 0 ms |
| Post with diagrams | mobile | 125.6 KB | 140.8 KB | −169.8 KB | 224 ms | 144 ms |
| 404 | desktop | 26.2 KB | 127.2 KB | −98.9 KB | 88 ms | 0 ms |
| 404 | mobile | 26.2 KB | 127.2 KB | −98.9 KB | 260 ms | 38 ms |

## Trends (last 5 runs)

### Home

```mermaid
xychart-beta
  title "Home: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "KB" 0 --> 145
  line [125.6, 125.7, 125.7, 124.7, 124.7]
```

```mermaid
xychart-beta
  title "Home: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "ms" 0 --> 128
  line [27, 26, 29, 111, 23]
```

### Blog index

```mermaid
xychart-beta
  title "Blog index: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "KB" 0 --> 142
  line [123, 123, 123, 122.1, 122.1]
```

```mermaid
xychart-beta
  title "Blog index: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "ms" 0 --> 81
  line [38, 20, 39, 70, 33]
```

### About

```mermaid
xychart-beta
  title "About: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "KB" 0 --> 143
  line [124.2, 124.3, 124.3, 123.9, 123.9]
```

```mermaid
xychart-beta
  title "About: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "ms" 0 --> 64
  line [23, 11, 21, 55, 20]
```

### Misc

```mermaid
xychart-beta
  title "Misc: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "KB" 0 --> 143
  line [123.9, 124, 123.9, 123.5, 123.5]
```

```mermaid
xychart-beta
  title "Misc: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "ms" 0 --> 792
  line [474, 494, 459, 688, 455]
```

### Misc collection

```mermaid
xychart-beta
  title "Misc collection: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "KB" 0 --> 142
  line [122.9, 123, 123, 122.5, 122.6]
```

```mermaid
xychart-beta
  title "Misc collection: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "ms" 0 --> 777
  line [442, 418, 467, 675, 445]
```

### Post

```mermaid
xychart-beta
  title "Post: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "KB" 0 --> 149
  line [128.7, 129, 129, 127.8, 128.7]
```

```mermaid
xychart-beta
  title "Post: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "ms" 0 --> 74
  line [23, 18, 34, 64, 29]
```

### Post with live cover

```mermaid
xychart-beta
  title "Post with live cover: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "KB" 0 --> 327
  line [278.3, 281.1, 281.1, 283.1, 283.9]
```

```mermaid
xychart-beta
  title "Post with live cover: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "ms" 0 --> 421
  line [170, 180, 215, 366, 179]
```

### Post with diagrams

```mermaid
xychart-beta
  title "Post with diagrams: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "KB" 0 --> 358
  line [310.7, 311, 311, 140, 140.8]
```

```mermaid
xychart-beta
  title "Post with diagrams: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "ms" 0 --> 494
  line [386, 306, 429, 275, 144]
```

### 404

```mermaid
xychart-beta
  title "404: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "KB" 0 --> 261
  line [226.1, 226.4, 226.4, 126.4, 127.2]
```

```mermaid
xychart-beta
  title "404: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656"]
  y-axis "ms" 0 --> 67
  line [43, 32, 40, 58, 38]
```
