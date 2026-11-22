<!--
	@component
	One review thread: a comment and its replies, with Done / Discard / Reopen per comment.
	Collapses to one line when every comment in it is resolved. An outdated thread (quote edited away)
	stays visible, with its old quote struck through.
-->
<script lang="ts">
	import { cn } from '$lib/utils';
	import {
		SEVERITY,
		isResolved,
		threadResolved,
		type ReviewComment,
		type ReviewStatus,
		type ReviewThread
	} from './types';

	interface Props {
		thread: ReviewThread;
		active: boolean;
		/** Comment has no matching block in the post. */
		unanchored?: boolean;
		onstatus: (comment: ReviewComment, status: ReviewStatus) => void;
		onactivate: (active: boolean) => void;
		onlocate?: () => void;
		class?: string;
	}

	const {
		thread,
		active,
		unanchored = false,
		onstatus,
		onactivate,
		onlocate,
		class: className
	}: Props = $props();

	const resolved = $derived(threadResolved(thread));
	const severity = $derived(SEVERITY[thread.top.severity] ?? SEVERITY.consider);
	let expanded = $state(false);
	const collapsed = $derived(resolved && !expanded);
</script>

{#snippet actions(comment: ReviewComment)}
	<div class="mt-2 flex gap-3 font-mono text-[11.5px]">
		{#if isResolved(comment)}
			<span class="text-ink-3 uppercase">{comment.status}</span>
			<button
				type="button"
				class="text-ink-2 hover:text-link"
				onclick={() => onstatus(comment, 'open')}>Reopen</button
			>
		{:else}
			<button
				type="button"
				class="text-ink-2 hover:text-link"
				onclick={() => onstatus(comment, 'done')}>✓ Done</button
			>
			<button
				type="button"
				class="text-ink-2 hover:text-link"
				onclick={() => onstatus(comment, 'discarded')}>✕ Discard</button
			>
		{/if}
	</div>
{/snippet}

{#snippet meta(comment: ReviewComment)}
	<p class="eyebrow m-0 flex flex-wrap items-center gap-x-2">
		<span class="text-ink-2 normal-case">{comment.handle}</span>
		{#if comment.score != null}<span>▲ {comment.score}</span>{/if}
		{#if comment.check}
			<span
				class={cn(
					'border px-1.5 normal-case',
					comment.check.startsWith('checked') ? 'border-livery-4 text-ink-2' : 'border-line-2'
				)}
				title={comment.check}>{comment.check.startsWith('checked') ? 'checked' : 'hunch'}</span
			>
		{/if}
	</p>
{/snippet}

{#snippet body(comment: ReviewComment)}
	<div
		class={cn(
			'prose mt-1.5 text-[14px]/[1.55] sm:text-[14px] [&_li]:mb-1 [&_p]:mb-2 [&_pre]:my-2 [&_pre]:text-[12px]',
			isResolved(comment) && 'opacity-60'
		)}
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered by the local dev server from local files -->
		{@html comment.bodyHtml}
	</div>
{/snippet}

<section
	class={cn(
		'hud bg-canvas p-3.5 transition-colors',
		active && 'bg-surface [--hud-c:var(--sev)]',
		className
	)}
	style:--sev={severity.color}
	onmouseenter={() => onactivate(true)}
	onmouseleave={() => onactivate(false)}
	onfocusin={() => onactivate(true)}
	onfocusout={() => onactivate(false)}
	aria-label="Review comment by {thread.top.handle}"
>
	<header class="flex items-center gap-2">
		<span class="chevron h-2.5 w-3.5 [--cut:35%]" style:background={severity.color}></span>
		<span class="font-display text-[13px] font-semibold font-stretch-[110%]">{severity.label}</span>
		{#if thread.top.outdated}
			<span class="eyebrow" title="The quoted text is no longer in the post">· outdated</span>
		{:else if unanchored}
			<span class="eyebrow">· not found in post</span>
		{/if}
		<span class="ml-auto flex gap-2">
			{#if onlocate}
				<button
					type="button"
					class="eyebrow hover:text-link"
					onclick={onlocate}
					aria-label="Scroll to the quoted text">Show ↗</button
				>
			{/if}
			{#if resolved}
				<button type="button" class="eyebrow hover:text-link" onclick={() => (expanded = !expanded)}
					>{expanded ? 'Hide' : 'Open'}</button
				>
			{/if}
		</span>
	</header>

	{#if collapsed}
		<p class="m-0 mt-1 truncate text-[13px] text-ink-3">
			{thread.top.handle}: {thread.top.anchor.quote}
		</p>
	{:else}
		<blockquote
			class={cn(
				'mt-2 mb-0 border-l border-line-2 pl-2.5 text-[13px]/[1.5] text-ink-3 [&_.katex]:text-[1em]',
				thread.top.outdated && 'line-through decoration-line-2'
			)}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered by the local dev server from local files -->
			{@html thread.top.quoteHtml}
		</blockquote>

		<div class="mt-3">
			{@render meta(thread.top)}
			{@render body(thread.top)}
			{@render actions(thread.top)}
		</div>

		{#each thread.replies as reply (reply.reviewer + reply.id)}
			<div class="mt-3 ml-3 border-l border-line pl-3">
				{@render meta(reply)}
				{@render body(reply)}
				{@render actions(reply)}
			</div>
		{/each}
	{/if}
</section>
