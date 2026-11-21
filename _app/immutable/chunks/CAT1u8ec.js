import{t as F,a,c}from"./D9wfgn6G.js";import"./nf-V95f5.js";import{d as t,f as l}from"./BiXpqJU_.js";import{h as d}from"./4uSPLpCN.js";import"./qQT_xVdj.js";import{P as B}from"./7I--izE6.js";import{S as h,a as x}from"./CTfqCud_.js";import{t as r,b as u,m as s,c as n}from"./Cy-NjVFR.js";const A=[{caption:"Insert A (0, 5, 8) and then B (5, 7, 9). Bit 5 is already set by A, so it simply stays 1.",state:{label:"after A and B",cells:u(10,[0,5,7,8,9]),marks:{0:"A",5:"A,B",7:"B",8:"A",9:"B"},tone:r([0,5,7,8,9],"changed")}},{caption:'"Delete" A by resetting bits 0, 5 and 8 to 0. Bit 5 goes too, although B still needs it.',state:{label:"after deleting A",cells:u(10,[7,9]),marks:s([0,5,8],"0"),tone:{5:"bad"},notes:{5:"B still needed this bit"}}},{caption:"Query B: bit 5 is 0, so the filter says B is <strong>definitely not</strong> present, although B was never deleted. That is a <strong>false negative</strong>.",state:{label:"after deleting A",cells:u(10,[7,9]),marks:{5:"✗",7:"✓",9:"✓"}}}],I=[{caption:"Insert A: counters 1, 4 and 7 go up by one.",state:{label:"after A",cells:n(10,{1:1,4:1,7:1}),marks:s([1,4,7],"+1"),tone:r([1,4,7],"changed")}},{caption:"Insert B: counters 4, 6 and 9 go up. Counter 4 is now 2, because both A and B use it.",state:{label:"after A and B",cells:n(10,{1:1,4:2,6:1,7:1,9:1}),marks:s([4,6,9],"+1"),notes:{4:"shared by A and B"}}},{caption:"Delete A: counters 1, 4 and 7 go down by one. Counter 4 only drops to 1.",state:{label:"after deleting A",cells:n(10,{4:1,6:1,9:1}),marks:s([1,4,7],"−1"),notes:{4:"still 1: B survives"}}},{caption:"Query B: counters 4, 6 and 9 are all above zero, so B is still found. The delete that caused a false negative in the classic filter is safe here.",state:{label:"after deleting A",cells:n(10,{4:1,6:1,9:1}),marks:s([4,6,9],"✓")}}],E=[{caption:"Insert A: counters 1, 5, 7 and 9 go up by one.",state:{label:"after A",cells:n(10,{1:1,5:1,7:1,9:1}),marks:s([1,5,7,9],"+1"),tone:r([1,5,7,9],"changed")}},{caption:"Delete B, which was never inserted. Counters 3 and 8 are already 0, so the underflow guard skips them, but counters 1 and 7 belong to A and go down to 0.",state:{label:"after deleting B",cells:n(10,{5:1,9:1}),marks:{1:"−1",3:"skip",7:"−1",8:"skip"},tone:r([1,7],"bad")}},{caption:"Query A: counters 1 and 7 are 0, so the filter says A is <strong>not present</strong>, although A was never deleted. That is a <strong>false negative</strong>.",state:{label:"after deleting B",cells:n(10,{5:1,9:1}),marks:{1:"✗",5:"✓",7:"✗",9:"✓"}}}],D={date:"2025-06-24",tags:["Algorithms"],keywords:["Bloom filters","Probabilistic data structures","Counting Bloom filters"],title:"Grokking Bloom Filters: Counting Bloom Filter",preview:"Bloom filters can't remove elements — unless you let them count.",series:"Grokking Bloom Filters",draft:!1,hero:"/images/blog/009-counting-bloom-filters/hero.jpg",aiCover:["Image"],coverCaption:"Taking samples and keeping count.",refs:["008-bloom-filters-pt1","010-cuckoo-filters"],readingTime:{text:"11 min read",minutes:10.55,time:633e3,words:2110}},{date:N,tags:R,keywords:z,title:U,preview:$,series:Q,draft:G,hero:L,aiCover:V,coverCaption:Y,refs:J,readingTime:K}=D;var W=F('<p>Bloom filters are incredibly space-efficient probabilistic data structures, perfect for answering a simple question: “Is this element in the set — no or maybe?”</p> <p>But as we discussed in <a href="/blog/008-bloom-filters-pt1">deep dive into Bloom filters</a>, there’s a big limitation: <strong>they don’t support deletion</strong>.</p> <!> <p>In this part of the series, we’ll tackle that problem. We’ll explore how we can extend Bloom filters to allow element removal — and what trade-offs come with that.</p> <h2 id="contents"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#contents">#</a>Contents</h2> <ul><li><a href="#why-deletion-is-hard">Why Deletion Is Hard</a></li> <li><a href="#easy-workarounds-that-actually-dont-work">Easy Workarounds (That Actually Don’t Work)</a> <ul><li><a href="#rebuilding-the-filter">Rebuilding the Filter</a></li> <li><a href="#using-a-tombstone-filter">Using a Tombstone Filter</a></li></ul></li> <li><a href="#counting-bloom-filters">Counting Bloom Filters</a> <ul><li><a href="#how-counting-bloom-filters-work">How Counting Bloom Filters Work</a></li> <li><a href="#handling-counter-overflow-and-underflow">Handling Counter Overflow and Underflow</a></li> <li><a href="#removing-a-non-existent-element">Removing a Non-Existent Element</a></li> <li><a href="#is-it-worth-it">Is It Worth It?</a></li></ul></li> <li><a href="#d-left-counting-bloom-filter">d-left Counting Bloom Filter</a> <ul><li><a href="#core-idea">Core Idea</a></li> <li><a href="#why-d-left">Why d-left?</a></li> <li><a href="#insertion">Insertion</a></li> <li><a href="#deletion">Deletion</a></li> <li><a href="#membership-check">Membership Check</a></li> <li><a href="#about-permutations-two-phase-hashing">About Permutations (Two-Phase Hashing)</a></li></ul></li> <li><a href="#moving-forward">Moving Forward</a></li></ul> <h2 id="why-deletion-is-hard"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#why-deletion-is-hard">#</a>Why Deletion Is Hard</h2> <p>To understand why deletion doesn’t work in a classic Bloom filter, let’s quickly revisit how it operates.</p> <p>A Bloom filter consists of two core components:</p> <ul><li>A fixed-size <strong>bit array</strong></li> <li>A set of <strong>hash functions</strong></li></ul> <p>Each time you insert an element, it is hashed at most <code>k</code> times to determine <code>k</code> bit positions in the array, and those bits are set to <code>1</code>. Since the bit array is shared across all elements, multiple elements may overlap and set the same bits — this is expected and what makes Bloom filters space-efficient.</p> <p>But this sharing creates a fundamental problem: <strong>you can’t tell which element set a given bit</strong>. If you try to delete an element by resetting its <code>k</code> bits to <code>0</code>, you may accidentally unset bits that are still needed by other elements, breaking one of the Bloom filter’s key guarantees: <strong>no false negatives</strong>.</p> <p>Let’s see this in action. Suppose we have a Bloom filter with 10 bits and we want to insert two elements:</p> <ul><li><strong>Element A</strong> hashes to positions 0, 5, and 8</li> <li><strong>Element B</strong> hashes to positions 5, 7, and 9</li></ul> <p>Notice that both elements share position 5 — this is where the trouble begins.</p> <p>First, we insert both elements. Position 5 is set by Element A, so it simply stays <code>1</code> when Element B arrives. Then we attempt to delete Element A the naive way, by resetting its bits at positions 0, 5, and 8 back to <code>0</code>. Position 5 goes too, and with it Element B’s contribution. When we later check for Element B, position 5 is <code>0</code>, so the Bloom filter reports that B is not present — a <strong>false negative</strong>. This is catastrophic because Element B was never deleted; it’s still supposed to be in the set.</p> <!> <div class="callout" data-callout="tip" data-collapsible="false"><div class="callout-title"><div class="callout-title-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg></div><div class="callout-title-text">Tip</div></div><div class="callout-content"><p>It’s similar to erasing your tag from a public graffiti wall — you might end up scrubbing off someone else’s mark too, and now no one can tell they were ever there.</p></div></div> <p>This is why deletion is fundamentally unsafe in standard Bloom filters — any attempt to remove an element risks corrupting the filter’s state and creating false negatives for other elements.</p> <h2 id="easy-workarounds-that-actually-dont-work"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#easy-workarounds-that-actually-dont-work">#</a>Easy Workarounds (That Actually Don’t Work)</h2> <p>Before diving into data structure modifications, let’s look at a few simple workarounds for deletion.</p> <h3 id="rebuilding-the-filter"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#rebuilding-the-filter">#</a>Rebuilding the Filter</h3> <p>In many use cases, full deletion support isn’t necessary. Instead, you can periodically <strong>rebuild</strong> the Bloom filter from scratch — daily, weekly, or based on certain metrics like false positive rate. This works especially well if:</p> <ul><li>You can tolerate brief downtime or rebuild in the background.</li> <li>The data set is relatively stable or changes in batches.</li></ul> <p>This is often the simplest and safest approach.</p> <h3 id="using-a-tombstone-filter"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#using-a-tombstone-filter">#</a>Using a Tombstone Filter</h3> <p>Another workaround is to maintain a second Bloom filter — a <strong>tombstone filter</strong> — to track deletions. When you remove an element, you insert it into the tombstone filter.</p> <p>To check for membership:</p> <ol><li>Check the main Bloom filter.</li> <li>If it’s a <strong>possible match</strong>, check the tombstone filter.</li> <li>If it also matches there, treat it as deleted.</li></ol> <p>The problem? If the tombstone filter gives a <strong>false positive</strong>, you’ll wrongly conclude that an element was deleted — effectively creating a <strong>false negative</strong>. This defeats the main strength of Bloom filters.</p> <p>So while this method technically adds delete support, it weakens the guarantees and is rarely worth the risk.</p> <h2 id="counting-bloom-filters"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#counting-bloom-filters">#</a>Counting Bloom Filters</h2> <p>The core strength of Bloom filters lies in their simplicity: a bit array and some hash functions. This makes them fast and compact — but also limited. In particular, the bit array can’t tell <strong>which elements</strong> contributed to setting each bit.</p> <p>That’s where <strong>Counting Bloom Filters (CBFs)</strong> come in.</p> <p>Originally proposed by <a href="https://www.cs.princeton.edu/courses/archive/spr05/cos598E/bib/p254-fan.pdf" rel="nofollow">Fan et al.</a> as a solution for scalable web cache, CBFs replace the bit array with an array of <strong>small integer counters</strong> — typically 4-bit values. These allow us to track how many elements have set each position. For example, here are the same positions set in both filters:</p> <!> <h3 id="how-counting-bloom-filters-work"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#how-counting-bloom-filters-work">#</a>How Counting Bloom Filters Work</h3> <p>CBFs operate using three fundamental operations, same as the classic Bloom filter, but each building on the counter-based structure.</p> <h4 id="insertion-of-an-element"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#insertion-of-an-element">#</a>Insertion of an Element</h4> <p>When inserting an element into a CBF:</p> <ol><li><strong>Hash the element</strong> to determine <code>k</code> positions in the counter array</li> <li><strong>Increment each counter</strong> at those <code>k</code> positions by 1</li></ol> <p>The key insight is that <strong>multiple elements may share the same positions</strong> — but now we track exactly how many elements contributed to each position through the counter values.</p> <h4 id="membership-query-operation"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#membership-query-operation">#</a>Membership Query Operation</h4> <p>To check if an element exists in the CBF:</p> <ol><li><strong>Hash the element</strong> using the same <code>k</code> hash functions to get <code>k</code> positions</li> <li><strong>Check all counters</strong> at those positions</li> <li><strong>Return the result</strong>: <ul><li>If <strong>all counters > 0</strong>: Element is <strong>possibly present</strong></li> <li>If <strong>any counter = 0</strong>: Element is <strong>definitely not present</strong></li></ul></li></ol> <p>The query operation is identical to a standard Bloom filter, just checking counters instead of bits.</p> <h4 id="deletion-of-an-element"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#deletion-of-an-element">#</a>Deletion of an Element</h4> <p>The deletion operation is just the opposite of the insertion operation:</p> <ol><li><strong>Hash the element</strong> to get the same <code>k</code> positions used during insertion</li> <li><strong>Decrement each counter</strong> at those positions by 1</li></ol> <p>The result is that other elements sharing those positions remain unaffected because their contributions are still counted. For example, suppose <strong>A</strong> hashes to positions 1, 4, 7 and <strong>B</strong> to positions 4, 6, 9. Insert both, then delete A:</p> <!> <p>This counter-based approach enables <strong>insert</strong>, <strong>query</strong>, and <strong>delete</strong> operations while preserving the probabilistic guarantees of the original Bloom filter structure. However, it’s not without its own challenges.</p> <h3 id="handling-counter-overflow-and-underflow"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#handling-counter-overflow-and-underflow">#</a>Handling Counter Overflow and Underflow</h3> <p>When implementing a CBF, you need to be mindful of counter limits. Most implementations use 4-bit counters, which means each counter can represent values from 0 to 15.</p> <h4 id="overflow-during-insertion"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#overflow-during-insertion">#</a>Overflow During Insertion</h4> <p>If a counter is already at its maximum value (e.g., 15) and you try to increment it, the result will either:</p> <ul><li>Wrap around to 0 (in case of overflow), or</li> <li>Overwrite memory incorrectly (if not handled properly)</li></ul> <p>To prevent this, insertions should <strong>skip incrementing</strong> counters that are already at their maximum value.</p> <h4 id="underflow-during-deletion"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#underflow-during-deletion">#</a>Underflow During Deletion</h4> <p>Similarly, if a counter is at <code>0</code> and you try to decrement it, you risk corrupting the filter — especially if that position was never associated with the element being removed. Deletion code should <strong>never decrement</strong> a zero counter.</p> <p>This raises a deeper issue: if the counter is <code>0</code>, the element likely wasn’t inserted — and deleting it can silently damage the filter. That brings us to a more subtle and dangerous scenario…</p> <h3 id="removing-a-non-existent-element"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#removing-a-non-existent-element">#</a>Removing a Non-Existent Element</h3> <p>Counting Bloom Filters only work reliably if deletions are performed on elements that were actually inserted. If you delete an element that was never added, you can unintentionally corrupt the state of the filter.</p> <p>Let’s walk through a simple example:</p> <ul><li>Element <strong>A</strong> hashes to positions <code>1, 5, 7, 9</code></li> <li>Element <strong>B</strong> hashes to positions <code>1, 3, 7, 8</code></li></ul> <p>Now suppose you insert <strong>A</strong> — this increments the counters at positions <code>1, 5, 7, 9</code>.</p> <p>Then, without inserting <strong>B</strong>, you try to delete it. This decrements counters at <code>1, 3, 7, 8</code>.</p> <p>Here’s what goes wrong:</p> <ul><li>Counters at positions <code>1</code> and <code>7</code> (shared with A) are decremented (capped at 0).</li> <li>When you later check for <strong>A</strong>, it may appear absent, even though it was never deleted.</li> <li>Counters at positions <code>5</code> and <code>9</code> remain set, creating an inconsistent state.</li></ul> <!> <p>This creates a <strong>false negative</strong>, something Bloom filters are explicitly designed to avoid. And the worst part? There’s no way to detect this corruption after the fact.</p> <h3 id="is-it-worth-it"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#is-it-worth-it">#</a>Is It Worth It?</h3> <p>Counting Bloom Filters provide a straightforward way to support deletions: just replace bits with small counters. The core algorithm remains nearly identical to the classic Bloom filter — simple and efficient.</p> <p>But this simplicity comes at a cost:</p> <ul><li>Requires more memory — typically 4× larger due to 4-bit counters.</li> <li>Vulnerable to accidental false negatives if deletions aren’t handled carefully.</li> <li>Doesn’t track which elements contributed to a counter — so overlapping deletions are still a risk.</li></ul> <p>CBFs were proposed back in 2000 as a practical workaround, and they still hold up in simple scenarios. But if memory is tight or deletion accuracy is critical, modern alternatives like <strong>Cuckoo Filters</strong> offer better guarantees.</p> <p>Before we get there, let’s look at one more variation that builds on this concept — the <strong>d-left Counting Bloom Filter</strong>.</p> <h2 id="d-left-counting-bloom-filter"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#d-left-counting-bloom-filter">#</a>d-left Counting Bloom Filter</h2> <p>This data structure is quite different from classic Bloom and Counting Bloom Filters, but it gives us useful ideas that eventually lead to Cuckoo Filters — especially I love the point when it comes to handling collisions.</p> <h3 id="core-idea"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#core-idea">#</a>Core Idea</h3> <p>The <a href="https://people.eecs.berkeley.edu/~sylvia/cs268-2014/papers/countingbloom.pdf" rel="nofollow">d-left Counting Bloom Filter (dlCBF)</a> replaces the flat array of counters with a multi-part structure — or simply, <code>d</code> separate hash tables (subtables).</p> <p>Each subtable contains <code>B</code> buckets. Every bucket holds a small, fixed number of cells (e.g., 8). Each cell has:</p> <ul><li>a <strong>fingerprint</strong> (a short hash of the original element)</li> <li>a <strong>counter</strong> (how many times it’s been added)</li></ul> <p>So instead of one giant table, we split it into <code>d</code> isolated parts. For example, here is a tiny dlCBF with <code>d = 2</code> subtables of <code>B = 4</code> buckets. Each cell holds a fingerprint and its counter (<code>A2C, 1</code> means fingerprint <code>0xA2C</code>, added once):</p> <!> <h3 id="why-d-left"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#why-d-left">#</a>Why d-left?</h3> <p>This structure is more complex than a flat CBF, but it packs data more tightly and handles collisions better. Each subtable manages its own space, and load balancing improves thanks to the “pick the least loaded” rule.</p> <div class="callout" data-callout="tip" data-collapsible="false"><div class="callout-title"><div class="callout-title-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg></div><div class="callout-title-text">Tip</div></div><div class="callout-content"><p>Think of it like driving on a busy 6-lane road approaching an intersection. Three lanes can turn left, and the other three can turn right. In a regular CBF, it’s as if there’s only one lane for your direction — everyone turning left has to squeeze into the same lane, creating a traffic jam. But with d-left CBF, you have multiple lanes (subtables) going in your direction. When you need to turn (insert an element), you look at all the lanes that can make your turn and choose the one with the least traffic (fewest occupied cells). This way, cars turning in the same direction spread out across multiple lanes, reducing congestion.</p></div></div> <h3 id="insertion"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#insertion">#</a>Insertion</h3> <ol><li>First, hash the element once to get the <strong>true fingerprint</strong>.</li> <li>Each subtable applies its own <strong>deterministic permutation</strong> to the fingerprint. This maps the fingerprint to a bucket in that subtable and modifies the fingerprint slightly to avoid clashes. I explain it later.</li> <li>Now we have <code>d</code> candidate buckets — one per subtable.</li> <li>From those, pick the bucket with the fewest used cells.</li> <li>If a cell with the modified fingerprint already exists there, increment its counter.</li> <li>Otherwise, insert a new cell with the fingerprint and counter set to 1.</li></ol> <p>For example, let’s insert <code>"apple"</code> into the filter above. Its fingerprint is <code>0x4A2</code>. Subtable 0 permutes it to <code>0x7B1</code>, which maps to bucket 3, and subtable 1 permutes it to <code>0x9E8</code>, which maps to bucket 1. Bucket 3 of subtable 0 uses one cell and bucket 1 of subtable 1 uses two, so apple goes to subtable 0 as a new cell <code>7B1, 1</code>:</p> <!> <p>If <code>7B1</code> had already been in that bucket, we would increment its counter instead of taking a new cell.</p> <h3 id="deletion"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#deletion">#</a>Deletion</h3> <p>To remove an element:</p> <ul><li>Use the same process to find candidate buckets and fingerprints.</li> <li>Locate the matching cell and decrement its counter.</li></ul> <h3 id="membership-check"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#membership-check">#</a>Membership Check</h3> <p>Same logic: use the original fingerprint, permute it per subtable, and check each candidate bucket. If any bucket contains a matching fingerprint with a positive counter, the element is <strong>possibly present</strong>.</p> <h3 id="about-permutations-two-phase-hashing"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#about-permutations-two-phase-hashing">#</a>About Permutations (Two-Phase Hashing)</h3> <p>One subtle but powerful part of dlCBF is <strong>how it avoids ambiguous deletions and collisions</strong>.</p> <ul><li><strong>Phase 1</strong>: Generate a fingerprint from the element.</li> <li><strong>Phase 2</strong>: Each subtable applies its own deterministic permutation to the fingerprint. This affects both the bucket index and the fingerprint value inside that subtable.</li></ul> <p>So instead of computing <code>d</code> separate hashes, we just compute one hash and shuffle it differently in each subtable. This helps avoid situations where two elements look the same across all subtables and buckets — a common cause of incorrect deletions.</p> <p>By doing this simple fingerprint transformation per subtable, dlCBF lowers the chance of “hot buckets” and overlapping fingerprints, making the structure more reliable.</p> <h2 id="moving-forward"><a class="header-anchor" aria-hidden="true" tabindex="-1" href="#moving-forward">#</a>Moving Forward</h2> <p>Counting Bloom Filters are a natural extension of the classic Bloom Filter — they add support for deletions with minimal structural changes. On paper, it’s a neat solution. But in practice, CBFs are not always the most efficient choice, especially today.</p> <p>It’s a bit sad, honestly. There’s no simple way to preserve the elegance of the original Bloom Filter and still get reliable deletions. Every attempt to fix that tends to compromise either performance or memory efficiency.</p> <p>That said, the alternatives — like <a href="/blog/010-cuckoo-filters">Cuckoo Filters</a> and the newer Ribbon Filters — are surprisingly elegant in their own right. They’re more complex under the hood, but if you’re working with modern libraries, that complexity is abstracted away. For most real-world use cases where deletions matter, these filters are excellent, first-class replacements for classic Bloom Filters.</p> <!>',1);function X(C){var y=W(),p=t(l(y),4);B(p,{slug:"008-bloom-filters-pt1"});var g=t(p,28);h(g,{title:"Naive deletion in a classic Bloom filter",steps:A});var m=t(g,38);x(m,{children:(i,k)=>{var e=c(),o=l(e);d(o,()=>`<svg role="img" aria-label="The same positions 1, 4, 6, 7 and 9 set in a classic Bloom filter, as single bits, and in a counting Bloom filter, as 4-bit counters, where position 4 holds 2." xmlns="http://www.w3.org/2000/svg" width="664" height="208" class="svgbob">
  <rect class="backdrop" x="0" y="0" width="664" height="208"></rect><rect class="tone tone-set" x="28" y="24" width="16" height="32"></rect><rect class="tone tone-set" x="76" y="24" width="16" height="32"></rect><rect class="tone tone-set" x="108" y="24" width="16" height="32"></rect><rect class="tone tone-set" x="124" y="24" width="16" height="32"></rect><rect class="tone tone-set" x="156" y="24" width="16" height="32"></rect><rect class="tone tone-set" x="76" y="120" width="64" height="48"></rect><rect class="tone tone-set" x="396" y="120" width="64" height="48"></rect><rect class="tone tone-set" x="460" y="120" width="64" height="48"></rect><rect class="tone tone-set" x="588" y="120" width="64" height="48"></rect><rect class="tone tone-set" x="268" y="120" width="64" height="48"></rect>
  <text x="10" y="12" >Classic</text>
  <text x="74" y="12" >Bloom</text>
  <text x="122" y="12" >filter,</text>
  <text x="18" y="44" >0</text>
  <text x="34" y="44" class="on-set">1</text>
  <text x="50" y="44" >0</text>
  <text x="66" y="44" >0</text>
  <text x="82" y="44" class="on-set">1</text>
  <text x="98" y="44" >0</text>
  <text x="114" y="44" class="on-set">1</text>
  <text x="130" y="44" class="on-set">1</text>
  <text x="146" y="44" >0</text>
  <text x="162" y="44" class="on-set">1</text>
  <text x="18" y="76" >0</text>
  <text x="34" y="76" class="t-set">1</text>
  <text x="50" y="76" >2</text>
  <text x="66" y="76" >3</text>
  <text x="82" y="76" >4</text>
  <text x="98" y="76" >5</text>
  <text x="114" y="76" >6</text>
  <text x="130" y="76" >7</text>
  <text x="146" y="76" >8</text>
  <text x="162" y="76" >9</text>
  <text x="186" y="12" class="t-set">1</text>
  <text x="202" y="12" >bit</text>
  <text x="234" y="12" >per</text>
  <text x="266" y="12" >cell</text>
  <text x="10" y="108" >Counting</text>
  <text x="82" y="108" >Bloom</text>
  <text x="130" y="108" >filter,</text>
  <text x="194" y="108" >4</text>
  <text x="210" y="108" >bits</text>
  <text x="250" y="108" >per</text>
  <text x="282" y="108" >cell</text>
  <text x="42" y="140" >0</text>
  <text x="106" y="140" class="on-set">1</text>
  <text x="170" y="140" >0</text>
  <text x="234" y="140" >0</text>
  <text x="298" y="140" class="on-set">2</text>
  <text x="362" y="140" >0</text>
  <text x="426" y="140" class="on-set">1</text>
  <text x="490" y="140" class="on-set">1</text>
  <text x="554" y="140" >0</text>
  <text x="618" y="140" class="on-set">1</text>
  <text x="18" y="156" >0</text>
  <text x="34" y="156" >0</text>
  <text x="50" y="156" >0</text>
  <text x="66" y="156" >0</text>
  <text x="82" y="156" class="on-set">0</text>
  <text x="98" y="156" class="on-set">0</text>
  <text x="114" y="156" class="on-set">0</text>
  <text x="130" y="156" class="on-set">1</text>
  <text x="146" y="156" >0</text>
  <text x="162" y="156" >0</text>
  <text x="178" y="156" >0</text>
  <text x="194" y="156" >0</text>
  <text x="210" y="156" >0</text>
  <text x="226" y="156" >0</text>
  <text x="242" y="156" >0</text>
  <text x="258" y="156" >0</text>
  <text x="274" y="156" class="on-set">0</text>
  <text x="290" y="156" class="on-set">0</text>
  <text x="306" y="156" class="on-set">1</text>
  <text x="322" y="156" class="on-set">0</text>
  <text x="338" y="156" >0</text>
  <text x="354" y="156" >0</text>
  <text x="370" y="156" >0</text>
  <text x="386" y="156" >0</text>
  <text x="402" y="156" class="on-set">0</text>
  <text x="418" y="156" class="on-set">0</text>
  <text x="434" y="156" class="on-set">0</text>
  <text x="450" y="156" class="on-set">1</text>
  <text x="466" y="156" class="on-set">0</text>
  <text x="482" y="156" class="on-set">0</text>
  <text x="498" y="156" class="on-set">0</text>
  <text x="514" y="156" class="on-set">1</text>
  <text x="530" y="156" >0</text>
  <text x="546" y="156" >0</text>
  <text x="562" y="156" >0</text>
  <text x="578" y="156" >0</text>
  <text x="594" y="156" class="on-set">0</text>
  <text x="610" y="156" class="on-set">0</text>
  <text x="626" y="156" class="on-set">0</text>
  <text x="642" y="156" class="on-set">1</text>
  <text x="42" y="188" >0</text>
  <text x="106" y="188" class="t-set">1</text>
  <text x="170" y="188" >2</text>
  <text x="234" y="188" >3</text>
  <text x="298" y="188" >4</text>
  <text x="362" y="188" >5</text>
  <text x="426" y="188" >6</text>
  <text x="490" y="188" >7</text>
  <text x="554" y="188" >8</text>
  <text x="618" y="188" >9</text>
  <g>
    <line x1="12" y1="24" x2="172" y2="24" class="solid"></line>
    <line x1="12" y1="24" x2="12" y2="56" class="solid"></line>
    <line x1="28" y1="24" x2="28" y2="56" class="solid"></line>
    <line x1="44" y1="24" x2="44" y2="56" class="solid"></line>
    <line x1="60" y1="24" x2="60" y2="56" class="solid"></line>
    <line x1="76" y1="24" x2="76" y2="56" class="solid"></line>
    <line x1="92" y1="24" x2="92" y2="56" class="solid"></line>
    <line x1="108" y1="24" x2="108" y2="56" class="solid"></line>
    <line x1="124" y1="24" x2="124" y2="56" class="solid"></line>
    <line x1="140" y1="24" x2="140" y2="56" class="solid"></line>
    <line x1="156" y1="24" x2="156" y2="56" class="solid"></line>
    <line x1="172" y1="24" x2="172" y2="56" class="solid"></line>
    <line x1="12" y1="56" x2="172" y2="56" class="solid"></line>
  </g>
  <g>
    <line x1="12" y1="120" x2="652" y2="120" class="solid"></line>
    <line x1="12" y1="120" x2="12" y2="168" class="solid"></line>
    <line x1="76" y1="120" x2="76" y2="168" class="solid"></line>
    <line x1="140" y1="120" x2="140" y2="168" class="solid"></line>
    <line x1="204" y1="120" x2="204" y2="168" class="solid"></line>
    <line x1="268" y1="120" x2="268" y2="168" class="solid"></line>
    <line x1="332" y1="120" x2="332" y2="168" class="solid"></line>
    <line x1="396" y1="120" x2="396" y2="168" class="solid"></line>
    <line x1="460" y1="120" x2="460" y2="168" class="solid"></line>
    <line x1="524" y1="120" x2="524" y2="168" class="solid"></line>
    <line x1="588" y1="120" x2="588" y2="168" class="solid"></line>
    <line x1="652" y1="120" x2="652" y2="168" class="solid"></line>
    <line x1="12" y1="168" x2="652" y2="168" class="solid"></line>
  </g>
</svg>`),a(i,e)}});var f=t(m,30);h(f,{title:"Insert and delete in a counting Bloom filter",steps:I});var b=t(f,38);h(b,{title:"Deleting a never-inserted element",steps:E});var w=t(b,30);x(w,{children:(i,k)=>{var e=c(),o=l(e);d(o,()=>`<svg role="img" aria-label="A dlCBF with two subtables of four buckets each. Each bucket row shows two cells of fingerprint and counter, for example A2C, 1, and some cells are empty." xmlns="http://www.w3.org/2000/svg" width="656" height="176" class="svgbob">
  <rect class="backdrop" x="0" y="0" width="656" height="176"></rect>
  <text x="162" y="12" >subtable</text>
  <text x="234" y="12" >0</text>
  <text x="114" y="44" >A2C,</text>
  <text x="154" y="44" >1</text>
  <text x="194" y="44" >7F1,</text>
  <text x="234" y="44" >2</text>
  <text x="274" y="44" >...</text>
  <text x="114" y="76" >5B8,</text>
  <text x="154" y="76" >1</text>
  <text x="274" y="76" >...</text>
  <text x="274" y="108" >...</text>
  <text x="114" y="140" >8E6,</text>
  <text x="154" y="140" >2</text>
  <text x="274" y="140" >...</text>
  <text x="498" y="12" >subtable</text>
  <text x="570" y="12" >1</text>
  <text x="450" y="44" >3E9,</text>
  <text x="490" y="44" >1</text>
  <text x="610" y="44" >...</text>
  <text x="450" y="76" >9D4,</text>
  <text x="490" y="76" >3</text>
  <text x="530" y="76" >1C7,</text>
  <text x="570" y="76" >1</text>
  <text x="610" y="76" >...</text>
  <text x="450" y="108" >6A1,</text>
  <text x="490" y="108" >1</text>
  <text x="610" y="108" >...</text>
  <text x="610" y="140" >...</text>
  <text x="18" y="44" >bucket</text>
  <text x="74" y="44" >0</text>
  <text x="354" y="44" >bucket</text>
  <text x="410" y="44" >0</text>
  <text x="18" y="76" >bucket</text>
  <text x="74" y="76" >1</text>
  <text x="354" y="76" >bucket</text>
  <text x="410" y="76" >1</text>
  <text x="18" y="108" >bucket</text>
  <text x="74" y="108" >2</text>
  <text x="354" y="108" >bucket</text>
  <text x="410" y="108" >2</text>
  <text x="18" y="140" >bucket</text>
  <text x="74" y="140" >3</text>
  <text x="354" y="140" >bucket</text>
  <text x="410" y="140" >3</text>
  <g>
    <line x1="100" y1="24" x2="308" y2="24" class="solid"></line>
    <line x1="100" y1="24" x2="100" y2="152" class="solid"></line>
    <line x1="180" y1="24" x2="180" y2="152" class="solid"></line>
    <line x1="260" y1="24" x2="260" y2="152" class="solid"></line>
    <line x1="308" y1="24" x2="308" y2="152" class="solid"></line>
    <line x1="100" y1="56" x2="308" y2="56" class="solid"></line>
    <line x1="100" y1="88" x2="308" y2="88" class="solid"></line>
    <line x1="100" y1="120" x2="308" y2="120" class="solid"></line>
    <line x1="100" y1="152" x2="308" y2="152" class="solid"></line>
  </g>
  <g>
    <line x1="436" y1="24" x2="644" y2="24" class="solid"></line>
    <line x1="436" y1="24" x2="436" y2="152" class="solid"></line>
    <line x1="516" y1="24" x2="516" y2="152" class="solid"></line>
    <line x1="596" y1="24" x2="596" y2="152" class="solid"></line>
    <line x1="644" y1="24" x2="644" y2="152" class="solid"></line>
    <line x1="436" y1="56" x2="644" y2="56" class="solid"></line>
    <line x1="436" y1="88" x2="644" y2="88" class="solid"></line>
    <line x1="436" y1="120" x2="644" y2="120" class="solid"></line>
    <line x1="436" y1="152" x2="644" y2="152" class="solid"></line>
  </g>
</svg>`),a(i,e)}});var v=t(w,14);x(v,{children:(i,k)=>{var e=c(),o=l(e);d(o,()=>`<svg role="img" aria-label="Candidate buckets for apple: subtable 0 bucket 3 holds one cell, subtable 1 bucket 1 holds two. The new cell 7B1, 1 goes into the free cell of subtable 0 bucket 3." xmlns="http://www.w3.org/2000/svg" width="504" height="128" class="svgbob">
  <rect class="backdrop" x="0" y="0" width="504" height="128"></rect><rect class="tone tone-changed" x="268" y="40" width="80" height="32"></rect>
  <text x="274" y="12" class="t-changed">7B1,</text>
  <text x="298" y="28" >↓</text>
  <text x="202" y="60" >8E6,</text>
  <text x="242" y="60" >2</text>
  <text x="362" y="60" >...</text>
  <text x="202" y="92" >9D4,</text>
  <text x="242" y="92" >3</text>
  <text x="282" y="92" >1C7,</text>
  <text x="322" y="92" >1</text>
  <text x="362" y="92" >...</text>
  <text x="314" y="12" class="t-changed">1</text>
  <text x="10" y="60" >subtable</text>
  <text x="82" y="60" >0,</text>
  <text x="106" y="60" >bucket</text>
  <text x="162" y="60" >3</text>
  <text x="426" y="60" >load</text>
  <text x="466" y="60" >1</text>
  <text x="490" y="60" class="t-ok">✓</text>
  <text x="10" y="92" >subtable</text>
  <text x="82" y="92" >1,</text>
  <text x="106" y="92" >bucket</text>
  <text x="162" y="92" >1</text>
  <text x="426" y="92" >load</text>
  <text x="466" y="92" >2</text>
  <g>
    <line x1="188" y1="40" x2="396" y2="40" class="solid"></line>
    <line x1="188" y1="40" x2="188" y2="104" class="solid"></line>
    <line x1="268" y1="40" x2="268" y2="104" class="solid"></line>
    <line x1="348" y1="40" x2="348" y2="104" class="solid"></line>
    <line x1="396" y1="40" x2="396" y2="104" class="solid"></line>
    <line x1="188" y1="72" x2="396" y2="72" class="solid"></line>
    <line x1="188" y1="104" x2="396" y2="104" class="solid"></line>
  </g>
</svg>`),a(i,e)}});var T=t(v,32);B(T,{slug:"010-cuckoo-filters"}),a(C,y)}export{X as default,D as metadata};
