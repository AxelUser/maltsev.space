# Performance history

Measured on every push to `main` by `.github/workflows/perf.yml`; this branch is written by CI only.
JS and CSS sizes are gzip. Timings are medians of 3 loads on a shared runner without a GPU, so watch their trend, not single values.

Latest: [`016b41c`](https://github.com/AxelUser/maltsev.space/commit/016b41ce2d1e72453200b01f01fded6ffa9bbd82) AI agent skills (#33) (2026-11-23). 7 runs recorded.

## Latest

| Page | Device | Upfront JS | Total JS | Total JS vs [`69649a6`](https://github.com/AxelUser/maltsev.space/commit/69649a642adf9e85fa19759bfed421bfd278cee2) | LCP | Blocking time |
|---|---|--:|--:|--:|--:|--:|
| Home | desktop | 123.9 KB | 124.9 KB | −0.7 KB | 188 ms | 0 ms |
| Home | mobile | 123.9 KB | 124.9 KB | −0.7 KB | 184 ms | 87 ms |
| Blog index | desktop | 119.3 KB | 121.9 KB | −1.0 KB | 172 ms | 0 ms |
| Blog index | mobile | 119.3 KB | 121.9 KB | −1.0 KB | 260 ms | 92 ms |
| About | desktop | 117.7 KB | 125.2 KB | +1.0 KB | 168 ms | 0 ms |
| About | mobile | 117.7 KB | 125.2 KB | +1.0 KB | 224 ms | 50 ms |
| Misc | desktop | 116.9 KB | 124.9 KB | +1.1 KB | 160 ms | 87 ms |
| Misc | mobile | 116.9 KB | 124.9 KB | +1.1 KB | 428 ms | 684 ms |
| Misc collection | desktop | 115.9 KB | 124.0 KB | +1.1 KB | 136 ms | 87 ms |
| Misc collection | mobile | 115.9 KB | 124.0 KB | +1.1 KB | 152 ms | 623 ms |
| Post | desktop | 126.8 KB | 129.8 KB | +1.1 KB | 180 ms | 0 ms |
| Post | mobile | 126.8 KB | 129.8 KB | +1.1 KB | 328 ms | 83 ms |
| Post with live cover | desktop | 126.8 KB | 285.5 KB | +7.2 KB | 300 ms | 540 ms |
| Post with live cover | mobile | 126.8 KB | 143.2 KB | +4.7 KB | 1200 ms | 396 ms |
| Post with diagrams | desktop | 126.8 KB | 142.3 KB | −168.3 KB | 132 ms | 5 ms |
| Post with diagrams | mobile | 126.8 KB | 142.3 KB | −168.3 KB | 464 ms | 350 ms |
| 404 | desktop | 26.0 KB | 128.3 KB | −97.7 KB | 116 ms | 0 ms |
| 404 | mobile | 26.0 KB | 128.3 KB | −97.7 KB | 352 ms | 70 ms |

## Trends (last 7 runs)

### Home

```mermaid
xychart-beta
  title "Home: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "KB" 0 --> 145
  line [125.6, 125.7, 125.7, 124.7, 124.7, 124.9, 124.9]
```

```mermaid
xychart-beta
  title "Home: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "ms" 0 --> 128
  line [27, 26, 29, 111, 23, 79, 87]
```

### Blog index

```mermaid
xychart-beta
  title "Blog index: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "KB" 0 --> 142
  line [123, 123, 123, 122.1, 122.1, 121.9, 121.9]
```

```mermaid
xychart-beta
  title "Blog index: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "ms" 0 --> 106
  line [38, 20, 39, 70, 33, 63, 92]
```

### About

```mermaid
xychart-beta
  title "About: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "KB" 0 --> 144
  line [124.2, 124.3, 124.3, 123.9, 123.9, 125.2, 125.2]
```

```mermaid
xychart-beta
  title "About: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "ms" 0 --> 64
  line [23, 11, 21, 55, 20, 41, 50]
```

### Misc

```mermaid
xychart-beta
  title "Misc: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "KB" 0 --> 144
  line [123.9, 124, 123.9, 123.5, 123.5, 125, 124.9]
```

```mermaid
xychart-beta
  title "Misc: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "ms" 0 --> 866
  line [474, 494, 459, 688, 455, 753, 684]
```

### Misc collection

```mermaid
xychart-beta
  title "Misc collection: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "KB" 0 --> 143
  line [122.9, 123, 123, 122.5, 122.6, 124, 124]
```

```mermaid
xychart-beta
  title "Misc collection: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "ms" 0 --> 838
  line [442, 418, 467, 675, 445, 728, 623]
```

### Post

```mermaid
xychart-beta
  title "Post: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "KB" 0 --> 150
  line [128.7, 129, 129, 127.8, 128.7, 129.8, 129.8]
```

```mermaid
xychart-beta
  title "Post: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "ms" 0 --> 96
  line [23, 18, 34, 64, 29, 63, 83]
```

### Post with live cover

```mermaid
xychart-beta
  title "Post with live cover: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "KB" 0 --> 329
  line [278.3, 281.1, 281.1, 283.1, 283.9, 285.5, 285.5]
```

```mermaid
xychart-beta
  title "Post with live cover: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "ms" 0 --> 456
  line [170, 180, 215, 366, 179, 200, 396]
```

### Post with diagrams

```mermaid
xychart-beta
  title "Post with diagrams: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "KB" 0 --> 358
  line [310.7, 311, 311, 140, 140.8, 142.3, 142.3]
```

```mermaid
xychart-beta
  title "Post with diagrams: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "ms" 0 --> 494
  line [386, 306, 429, 275, 144, 176, 350]
```

### 404

```mermaid
xychart-beta
  title "404: total JS, desktop (KB gzip)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "KB" 0 --> 261
  line [226.1, 226.4, 226.4, 126.4, 127.2, 128.3, 128.3]
```

```mermaid
xychart-beta
  title "404: blocking time, mobile (ms)"
  x-axis ["69649a6", "0a1b7f2", "9e09f34", "1417e72", "29f4656", "5fc530f", "016b41c"]
  y-axis "ms" 0 --> 81
  line [43, 32, 40, 58, 38, 65, 70]
```
