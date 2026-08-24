<script lang="ts">
	import { docsNavigation } from '../navigation';

	let open = $state(false);
	let { pathname = '/docs' }: { pathname?: string } = $props();
	const active = (href: string) => href === '/docs' ? pathname === href : pathname.startsWith(href);
</script>

<button class="mobile-trigger" onclick={() => (open = !open)} aria-expanded={open}>
	<span>Documentation menu</span><span aria-hidden="true">{open ? '×' : '⌄'}</span>
</button>

<aside class:open aria-label="Documentation navigation">
	<nav>
		{#each docsNavigation as group}
			<div class="group">
				<p>{group.label}</p>
				{#each group.items as item}
					<a class:active={active(item.href)} href={item.href} onclick={() => (open = false)}>{item.label}</a>
				{/each}
			</div>
		{/each}
	</nav>
	<div class="sidebar-note">
		<span class="pulse"></span>
		<div><strong>Two renderer bases</strong><small>One component vocabulary</small></div>
	</div>
</aside>

<style>
	aside { position: sticky; top: 6rem; align-self: start; }
	nav { display: grid; gap: 2rem; }
	.group { display: grid; gap: 0.2rem; }
	.group p { margin: 0 0 0.45rem; color: var(--faint); font-family: var(--font-mono); font-size: 0.61rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
	.group a { padding: 0.48rem 0.65rem; border-left: 1px solid transparent; color: var(--muted); font-size: 0.79rem; font-weight: 560; text-decoration: none; }
	.group a:hover { color: var(--ink); }
	.group a.active { border-left-color: var(--green); background: linear-gradient(90deg, var(--green-wash), transparent); color: var(--green-dark); font-weight: 720; }
	.sidebar-note { display: flex; margin-top: 2.25rem; padding: 0.85rem; align-items: flex-start; gap: 0.65rem; border: 1px solid var(--line); border-radius: 0.55rem; background: var(--paper); }
	.sidebar-note div { display: grid; gap: 0.1rem; }
	.sidebar-note strong { font-size: 0.68rem; }
	.sidebar-note small { color: var(--muted); font-size: 0.62rem; }
	.pulse { width: 0.45rem; height: 0.45rem; margin-top: 0.18rem; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 4px var(--green-wash); }
	.mobile-trigger { display: none; }
	@media (max-width: 800px) {
		.mobile-trigger { display: flex; width: 100%; padding: 0.75rem 0.85rem; align-items: center; justify-content: space-between; border: 1px solid var(--line); border-radius: 0.5rem; background: var(--paper); color: var(--ink); font: inherit; font-size: 0.8rem; font-weight: 700; }
		aside { display: none; position: static; padding: 1rem; border: 1px solid var(--line); border-top: 0; border-radius: 0 0 0.5rem 0.5rem; background: var(--paper); }
		aside.open { display: block; }
		nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.sidebar-note { display: none; }
	}
	@media (max-width: 480px) { nav { grid-template-columns: 1fr; } }
</style>
