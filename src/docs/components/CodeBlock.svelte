<script lang="ts">
	let { code, label = 'svelte' }: { code: string; label?: string } = $props();
	let feedback = $state<{ code: string; message: string }>();
	const status = $derived(feedback?.code === code ? feedback.message : '');
	async function copy() {
		const requestedCode = code;
		feedback = undefined;
		try {
			if (!navigator.clipboard?.writeText)
				throw new Error('Clipboard unavailable');
			await navigator.clipboard.writeText(requestedCode);
			feedback = { code: requestedCode, message: 'Copied' };
		} catch {
			feedback = {
				code: requestedCode,
				message: 'Copy failed. Select the code and copy manually.'
			};
		}
	}
</script>

<div class="code-block">
	<div class="code-head">
		<span>{label}</span><button
			type="button"
			onclick={copy}
			aria-label={`Copy ${label}`}>Copy</button
		>
	</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (Horizontal code scrolling must be keyboard accessible.) -->
	<pre role="region" tabindex="0" aria-label={label}><code>{code}</code></pre>
	<p class="copy-status" role="status" aria-live="polite">{status}</p>
</div>

<style>
	.code-block {
		min-width: 0;
		max-width: 100%;
		margin: 1.25rem 0 1.75rem;
		overflow: hidden;
		border: 1px solid #263c33;
		border-radius: 0.62rem;
		background: #12241d;
		box-shadow: 0 10px 30px rgb(15 34 27 / 0.1);
	}
	.code-head {
		display: flex;
		padding: 0.62rem 0.85rem;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #294137;
		color: #89a397;
		font-family: var(--font-mono);
		font-size: 0.59rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	button {
		border: 1px solid #607c6d;
		border-radius: 0.3rem;
		background: transparent;
		color: #d8e6de;
		padding: 0.3rem 0.6rem;
		cursor: pointer;
	}
	button:focus-visible,
	pre:focus-visible {
		outline: 2px solid var(--acid);
		outline-offset: -3px;
	}
	.copy-status {
		margin: 0;
		padding: 0 0.85rem 0.4rem;
		color: #d8e6de;
		font-size: 0.75rem;
	}
	.copy-status:empty {
		display: none;
	}
	pre {
		margin: 0;
		padding: 1.1rem 1.2rem 1.25rem;
		overflow-x: auto;
		color: #d8e6de;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		line-height: 1.7;
		tab-size: 2;
	}
</style>
