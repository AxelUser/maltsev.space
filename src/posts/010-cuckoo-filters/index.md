---
date: "2025-06-28"
tags:
 - "Algorithms"
keywords:
 - "Cuckoo filters"
 - "Probabilistic data structures"
title: "Cuckoo Filters: Better Than Bloom Filters?"
preview: "Cuckoo filters are a space-efficient probabilistic data structure that can answer the question: 'Is this element in the set — no or maybe?'"
series: "Grokking Bloom Filters"
draft: true
hero: /images/blog/010-cuckoo-filters/hero.jpg
---

Bloom Filters are brilliant, they use minimal memory to support approximate membership query operations, i.e., answering what elements may be represented in a set, or what absolutely not. Their simplicity is both their strength and weakness. As I’ve described in a previous article about Counting Bloom Filter, it’s not trivial to support deletion and preserve their guarantees of absence of false-negative results, i.e., telling what elements are not in a set.

Counting Bloom Filters (CBF) and d-left Counting Bloom Filters are supposed to solve this issue, but they come at a cost of greater memory overhead, 1.5 to 4 times more than classic Bloom Filters do.

In this article, I’ll describe a memory-efficient and deletion-friendly solution. Meet the Cuckoo Filters!
