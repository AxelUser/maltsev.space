<!--
	@component
	Dev-only review overlay for a post. Loads `src/posts/<slug>/review.*.json` through the dev server
	(`src/lib/plugins/vite-post-review.js`) and shows each comment next to the block it quotes, in the left
	margin on wide screens or in a left drawer on narrow ones. Renders nothing when the post has no
	review files. Place it inside the positioned wrapper that holds `.prose`.

	{#if dev}{#await import('$lib/components/dev/review') then m}<m.ReviewOverlay slug={data.slug} />{/await}{/if}
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { MediaQuery, SvelteMap } from 'svelte/reactivity';
	import { Chip } from '$lib/components/ui';
	import { cn } from '$lib/utils';
	import { findAnchor } from './anchors';
	import ReviewCard from './review-card.svelte';
	import {
		SEVERITY,
		isResolved,
		threadResolved,
		type ReviewComment,
		type ReviewData,
		type ReviewStatus,
		type ReviewThread
	} from './types';

	interface Props {
		slug: string;
	}

	const { slug }: Props = $props();

	const STORAGE_KEY = 'post-review:open';
	const GAP = 12;

	let data = $state.raw<ReviewData>();
	let open = $state(!browser || localStorage.getItem(STORAGE_KEY) !== 'false');
	let showResolved = $state(false);
	let activeKey = $state<string>();
	const wide = new MediaQuery('min-width: 1280px', false);

	let host = $state<HTMLElement>();
	const wrapper = $derived(host?.parentElement ?? undefined);
	const anchors = new SvelteMap<string, HTMLElement | null>();
	const heights = new SvelteMap<string, number>();
	let tops = $state.raw<Record<string, number>>({});
	let layoutTick = $state(0);

	/** Keeps `heights` up to date for the element, keyed by thread. */
	function measure(node: HTMLElement, key: string) {
		const ro = new ResizeObserver(() => heights.set(key, node.offsetHeight));
		ro.observe(node);
		return {
			update(next: string) {
				key = next;
			},
			destroy() {
				ro.disconnect();
				heights.delete(key);
			}
		};
	}

	async function load() {
		const res = await fetch(`/__post-review/${encodeURIComponent(slug)}`);
		data = res.ok ? ((await res.json()) as ReviewData) : undefined;
	}

	const threads = $derived.by((): ReviewThread[] => {
		if (!data) return [];
		const byId = new Map(data.comments.map((c) => [c.id, c]));
		const tops = data.comments.filter((c) => !c.replyTo || !byId.has(c.replyTo));
		return tops
			.map((top) => ({
				key: `${top.reviewer}:${top.id}`,
				top,
				replies: data!.comments.filter((c) => c.replyTo === top.id)
			}))
			.sort((a, b) => (b.top.score ?? 0) - (a.top.score ?? 0));
	});

	const visible = $derived(threads.filter((t) => showResolved || !threadResolved(t)));
	const openCount = $derived(data?.comments.filter((c) => !isResolved(c)).length ?? 0);
	const resolvedCount = $derived(threads.filter(threadResolved).length);

	/** Threads in document order; unanchored ones first. */
	const ordered = $derived.by(() => {
		const prose = wrapper?.querySelector<HTMLElement>(':scope > .prose');
		if (!prose) return visible.map((t) => ({ thread: t, anchor: null as HTMLElement | null }));
		return visible
			.map((t) => ({ thread: t, anchor: anchors.get(t.key) ?? null }))
			.sort((a, b) => {
				if (!a.anchor || !b.anchor) return a.anchor ? 1 : b.anchor ? -1 : 0;
				const pos = a.anchor.compareDocumentPosition(b.anchor);
				return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
			});
	});

	// Resolve anchors once the post and the data are both there.
	$effect(() => {
		const prose = wrapper?.querySelector<HTMLElement>(':scope > .prose');
		if (!prose || !data) return;
		// The whole article, so quotes from the preview or the cover caption are found too.
		const root = prose.closest<HTMLElement>('article') ?? prose;
		anchors.clear();
		for (const t of threads) anchors.set(t.key, findAnchor(root, t.top.anchor));
	});

	// Stack threads at their anchors, pushing overlapping ones down.
	$effect(() => {
		void layoutTick;
		if (!wrapper || !wide.current || !open) return;
		const base = wrapper.getBoundingClientRect().top;
		const next: Record<string, number> = {};
		let floor = 0;
		for (const { thread, anchor } of ordered) {
			const want = anchor ? anchor.getBoundingClientRect().top - base : floor;
			const top = Math.max(want, floor);
			next[thread.key] = top;
			floor = top + (heights.get(thread.key) ?? 120) + GAP;
		}
		tops = next;
	});

	// Highlight the block of the active thread.
	$effect(() => {
		const el = activeKey ? anchors.get(activeKey) : null;
		const thread = threads.find((t) => t.key === activeKey);
		if (!el || !thread || !open) return;
		const color = (SEVERITY[thread.top.severity] ?? SEVERITY.consider).color;
		const prev = {
			outline: el.style.outline,
			offset: el.style.outlineOffset,
			bg: el.style.background
		};
		el.style.outline = `2px solid ${color}`;
		el.style.outlineOffset = '6px';
		el.style.background = 'var(--color-surface)';
		return () => {
			el.style.outline = prev.outline;
			el.style.outlineOffset = prev.offset;
			el.style.background = prev.bg;
		};
	});

	$effect(() => {
		localStorage.setItem(STORAGE_KEY, String(open));
	});

	async function setStatus(comment: ReviewComment, status: ReviewStatus) {
		if (!data) return;
		data = {
			...data,
			comments: data.comments.map((c) =>
				c.id === comment.id && c.reviewer === comment.reviewer ? { ...c, status } : c
			)
		};
		await fetch(`/__post-review/${encodeURIComponent(slug)}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ reviewer: comment.reviewer, id: comment.id, status })
		});
	}

	function locate(key: string) {
		const el = anchors.get(key);
		if (!el) return;
		el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		activeKey = key;
	}

	onMount(() => {
		const relayout = () => layoutTick++;
		const ro = new ResizeObserver(relayout);
		if (wrapper) ro.observe(wrapper);
		document.fonts?.ready.then(relayout);
		window.addEventListener('load', relayout);

		const onUpdate = (payload: { slug: string }) => {
			if (payload.slug === slug) load();
		};
		import.meta.hot?.on('post-review:update', onUpdate);
		return () => {
			ro.disconnect();
			window.removeEventListener('load', relayout);
			import.meta.hot?.off('post-review:update', onUpdate);
		};
	});

	$effect(() => {
		void slug;
		load();
	});
</script>

<div bind:this={host} class="contents" data-review-overlay>
	{#if data}
		{#snippet toolbar()}
			<div class="flex flex-wrap items-center gap-2">
				<span class="eyebrow">
					{data!.reviewers.map((r) => r.handle).join(' · ')}
				</span>
				{#if resolvedCount > 0}
					<Chip pressed={showResolved} onclick={() => (showResolved = !showResolved)}>
						Resolved · {resolvedCount}
					</Chip>
				{/if}
			</div>
		{/snippet}

		{#if open && wide.current}
			<aside
				class="absolute inset-y-0 right-full mr-10 w-[min(340px,calc((100vw-720px)/2-64px))] print:hidden"
				aria-label="Post review"
			>
				<div class="absolute -top-16 left-0">{@render toolbar()}</div>
				{#each ordered as { thread, anchor } (thread.key)}
					<div
						class="absolute inset-x-0 transition-[top] duration-200"
						style:top="{tops[thread.key] ?? 0}px"
						use:measure={thread.key}
					>
						<ReviewCard
							{thread}
							active={activeKey === thread.key}
							unanchored={!anchor}
							onstatus={setStatus}
							onactivate={(on) => (activeKey = on ? thread.key : undefined)}
						/>
					</div>
				{/each}
			</aside>
		{:else if open}
			<aside
				class="fixed inset-y-0 left-0 z-40 w-[min(380px,92vw)] overflow-y-auto border-r border-line bg-canvas px-4 pt-[calc(var(--spacing-header)+16px)] pb-24 print:hidden"
				aria-label="Post review"
			>
				{@render toolbar()}
				<div class="mt-4 flex flex-col gap-3">
					{#each ordered as { thread, anchor } (thread.key)}
						<ReviewCard
							{thread}
							active={activeKey === thread.key}
							unanchored={!anchor}
							onstatus={setStatus}
							onactivate={(on) => (activeKey = on ? thread.key : undefined)}
							onlocate={anchor ? () => locate(thread.key) : undefined}
						/>
					{/each}
				</div>
			</aside>
		{/if}

		<button
			type="button"
			class={cn(
				'chevron fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 py-2.5 pr-4 pl-6 font-display text-[14px] font-semibold font-stretch-[110%] shadow-frame transition-transform [--cut:10px] hover:translate-x-[3px] print:hidden',
				open ? 'bg-ink text-canvas' : 'bg-livery-1 text-on-livery'
			)}
			aria-pressed={open}
			onclick={() => (open = !open)}
		>
			Review · {openCount}
		</button>
	{/if}
</div>
