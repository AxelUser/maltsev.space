<script lang="ts">
	interface Props {
		label: string;
		value: string | number | null;
		type?: 'text' | 'number';
		placeholder?: string;
		disabled?: boolean;
		min?: number;
		max?: number;
		step?: number | string;
		id?: string;
		required?: boolean;
	}

	let {
		label,
		value = $bindable(),
		type = 'text',
		placeholder,
		disabled = false,
		min,
		max,
		step,
		id,
		required = false
	}: Props = $props();

	const inputId = $derived(id || `input-${Math.random().toString(36).substr(2, 9)}`);
</script>

<div class="input-group">
	<label for={inputId}>{label}{required ? '*' : ''}</label>
	<input id={inputId} {type} bind:value {placeholder} {disabled} {min} {max} {step} {required} />
</div>

<style>
	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--gap-small);
		background: var(--surface-1);
		border-radius: var(--radius-2);
		padding: var(--gap);
		border: 1px solid var(--surface-3);
		margin-bottom: var(--gap);
		transition: all 0.2s ease;
	}

	.input-group:focus-within {
		border-color: var(--brand);
		box-shadow: 0 0 0 2px var(--brand-alpha);
	}

	.input-group label {
		font-size: var(--font-size-1);
		color: var(--text-2);
		font-weight: var(--font-weight-6);
		margin: 0;
	}

	.input-group input {
		padding: var(--gap-small);
		border: 1px solid var(--surface-3);
		border-radius: var(--radius-1);
		background: var(--surface-2);
		color: var(--text-1);
		font-size: var(--font-size-2);
		font-family: var(--font-monospace-code);
		font-weight: var(--font-weight-7);
		text-align: center;
		min-height: 1.5em;
		transition: all 0.2s ease;
	}

	.input-group input::placeholder {
		color: var(--text-2);
		opacity: 0.6;
		text-align: center;
	}

	.input-group input:focus {
		outline: none;
		border-color: var(--brand);
		background: var(--surface-1);
	}

	.input-group input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: var(--surface-3);
	}
</style>
