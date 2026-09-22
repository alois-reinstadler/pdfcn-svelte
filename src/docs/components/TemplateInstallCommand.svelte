<script lang="ts">
	import { registryInstallCommand } from '../site';

	let {
		slug,
		renderer = 'takumi'
	}: { slug: string; renderer?: 'forme' | 'takumi' } = $props();
	const command = $derived(registryInstallCommand(renderer, slug));
	let feedback = $state<{ command: string; error?: string }>();
	const copied = $derived(feedback?.command === command && !feedback.error);
	const error = $derived(
		feedback?.command === command ? (feedback.error ?? '') : ''
	);

	async function copy() {
		const requestedCommand = command;
		feedback = undefined;
		try {
			if (!globalThis.navigator?.clipboard)
				throw new Error('Clipboard unavailable');
			await navigator.clipboard.writeText(requestedCommand);
			feedback = { command: requestedCommand };
		} catch {
			feedback = {
				command: requestedCommand,
				error: 'Copy failed. Select the command and copy manually.'
			};
		}
	}
</script>

<div class="command">
	<div><span>$</span><code>{command}</code></div>
	<button
		type="button"
		onclick={copy}
		aria-label="Copy registry install command"
		>{copied ? 'Copied' : 'Copy'}</button
	>
</div>
<p role="status" aria-live="polite">{error || (copied ? 'Copied' : '')}</p>

<style>
	p {
		margin: 0.4rem 0;
		font-size: 0.75rem;
	}
	p:empty {
		display: none;
	}
	button:focus-visible {
		outline: 2px solid var(--acid);
		outline-offset: 3px;
	}
	.command {
		display: flex;
		min-width: 0;
		padding: 0.7rem;
		align-items: center;
		gap: 0.75rem;
		border: 1px solid #344b40;
		border-radius: 0.55rem;
		background: #15271f;
		color: #dcebe2;
	}
	.command > div {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 0.65rem;
	}
	.command span {
		color: var(--acid);
		font-family: var(--font-mono);
	}
	code {
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		white-space: nowrap;
		scrollbar-width: thin;
	}
	button {
		margin-left: auto;
		padding: 0.42rem 0.58rem;
		border: 1px solid #456052;
		border-radius: 0.35rem;
		background: #263d32;
		color: white;
		cursor: pointer;
		font-size: 0.62rem;
		font-weight: 700;
	}
	button:hover {
		border-color: var(--acid);
	}
</style>
